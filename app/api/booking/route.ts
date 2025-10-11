import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { bookingFormSchema } from '@/lib/validations'

// Email function - add Resend integration later
const sendBookingConfirmation = async (booking: any, contact: any) => {
  // TODO: Add Resend email integration
  // const resend = new Resend(process.env.RESEND_API_KEY)

  // For now, just log the email that would be sent
  console.log('📧 Booking Confirmation Email:', {
    to: contact.email,
    subject: 'Your Bahrain Handyman Booking Confirmation',
    bookingNumber: booking.bookingNumber,
    service: booking.service?.name,
    date: booking.scheduledDate,
    timeSlot: booking.timeSlot
  })
}

// This endpoint creates a new booking
export async function POST(request: NextRequest) {
  try {
    // CRITICAL: Check authentication - bookings must be created by authenticated users
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in to create a booking.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate the incoming data
    const validatedData = bookingFormSchema.parse(body)

    // Get the authenticated user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        clientProfile: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'CLIENT' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Only clients can create bookings' },
        { status: 403 }
      )
    }

    // Get or create client profile
    let clientProfile = user.clientProfile
    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
        data: {
          userId: user.id,
          notificationSettings: null
        }
      })
    }

    // Start a transaction to ensure data consistency
    const booking = await prisma.$transaction(async (tx: any) => {
      // Create the address first - CRITICAL: Link to client profile
      const address = await tx.address.create({
        data: {
          clientId: clientProfile.id,
          type: validatedData.address.type,
          area: validatedData.address.area,
          block: validatedData.address.block,
          road: validatedData.address.road,
          building: validatedData.address.building,
          flat: validatedData.address.flat,
          additionalInfo: validatedData.address.additionalInfo,
        },
      })

      // Create the contact
      const contact = await tx.contact.create({
        data: {
          firstName: validatedData.contact.firstName,
          lastName: validatedData.contact.lastName,
          email: validatedData.contact.email,
          phone: validatedData.contact.phone,
        },
      })

      // Get pricing from database instead of hardcoded values
      const pricingOption = await tx.pricingOption.findUnique({
        where: { id: validatedData.pricingOptionId },
        select: { price: true }
      })

      if (!pricingOption) {
        throw new Error(`Pricing option ${validatedData.pricingOptionId} not found`)
      }

      // Generate unique booking number
      const bookingNumber = `BHD-${Date.now().toString()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

      // Create the booking - CRITICAL: Link to authenticated user
      const bookingData = await tx.booking.create({
        data: {
          bookingNumber,
          clientId: user.id,
          serviceId: validatedData.serviceId,
          pricingOptionId: validatedData.pricingOptionId,
          scheduledDate: validatedData.scheduledDate,
          timeSlot: validatedData.timeSlot,
          addressId: address.id,
          contactId: contact.id,
          notes: validatedData.details?.notes || '',
          emergency: validatedData.details?.emergency || false,
          status: 'PENDING', // Default status
          estimatedPrice: pricingOption.price,
          finalPrice: null, // Will be set after completion
        },
        include: {
          service: true,
          pricingOption: true,
          address: true,
          contact: true,
        },
      })

      return {
        ...bookingData,
        service: bookingData.service,
        pricingOption: bookingData.pricingOption,
        address: bookingData.address,
        contact: bookingData.contact,
      }
    })

    // Format response
    const response = {
      success: true,
      booking: {
        id: booking.id,
        reference: booking.bookingNumber,
        scheduledDate: booking.scheduledDate,
        timeSlot: booking.timeSlot,
        estimatedPrice: booking.estimatedPrice,
        finalPrice: booking.finalPrice,
        service: {
          name: booking.service.name,
          description: booking.service.description,
        },
        pricingOption: {
          name: booking.pricingOption.name,
          duration: booking.pricingOption.duration,
        },
        address: {
          area: booking.address.area,
          block: booking.address.block,
          building: booking.address.building,
        },
        contact: {
          firstName: booking.contact.firstName,
          lastName: booking.contact.lastName,
          email: booking.contact.email,
        },
        status: booking.status,
        emergency: booking.emergency,
      },
      message: 'Booking created successfully',
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Booking creation error:', error)

    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create booking. Please try again.' },
      { status: 500 }
    )
  }
}

// This endpoint gets all bookings (ADMIN ONLY)
export async function GET() {
  try {
    // CRITICAL: Check admin authentication for booking listing
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }, // Email is guaranteed to exist from auth check above
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        pricingOption: true,
        address: true,
        contact: true,
        client: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit for performance
    })

    return NextResponse.json({ success: true, bookings }, { status: 200 })
  } catch (error) {
    console.error('Fetching bookings error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

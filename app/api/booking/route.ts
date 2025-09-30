import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingFormSchema } from '@/lib/validations'

// This endpoint creates a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the incoming data
    const validatedData = bookingFormSchema.parse(body)

    // Start a transaction to ensure data consistency
    const booking = await prisma.$transaction(async (tx: any) => {
      // Create the address first
      const address = await tx.address.create({
        data: {
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

      // Create the booking
      const bookingData = await tx.booking.create({
        data: {
          serviceId: validatedData.serviceId,
          pricingOptionId: validatedData.pricingOptionId,
          scheduledDate: validatedData.scheduledDate,
          timeSlot: validatedData.timeSlot,
          addressId: address.id,
          contactId: contact.id,
          notes: validatedData.details?.notes || '',
          emergency: validatedData.details?.emergency || false,
          status: 'PENDING', // Default status
          totalAmount: 0, // Will be calculated based on service pricing
        },
        include: {
          service: true,
          pricingOption: true,
          address: true,
          contact: true,
        },
      })

      // Calculate total amount based on pricing option
      let totalAmount = 0
      switch (validatedData.pricingOptionId) {
        case 'ac-maintenance-basic':
          totalAmount = 5.00
          break
        case 'ac-repair-diagnosis':
          totalAmount = 10.00
          break
        case 'ac-installation-1hp':
          totalAmount = 15.00
          break
        case 'plumbing-emergency':
          totalAmount = 10.00
          break
        case 'plumbing-tap-installation':
          totalAmount = 5.00
          break
        case 'electrical-outlet-installation':
          totalAmount = 5.00
          break
        case 'electrical-wiring-inspection':
          totalAmount = 15.00
          break
        case 'carpentry-door-installation':
          totalAmount = 10.00
          break
        case 'carpentry-custom-work':
          totalAmount = 15.00
          break
        case 'painting-room-interior':
          totalAmount = 0 // Quote required
          break
        case 'painting-touch-up':
          totalAmount = 5.00
          break
        case 'appliance-washing-machine':
          totalAmount = 10.00
          break
        case 'appliance-refrigerator':
          totalAmount = 15.00
          break
        case 'outdoor-garden-care':
          totalAmount = 10.00
          break
        case 'handyman-hourly':
          totalAmount = 5.00
          break
        default:
          totalAmount = 0
      }

      // Update the booking with the calculated amount
      await tx.booking.update({
        where: { id: bookingData.id },
        data: { totalAmount },
      })

      return {
        ...bookingData,
        totalAmount,
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
        reference: `BK-${booking.id.slice(-8).toUpperCase()}`,
        scheduledDate: booking.scheduledDate,
        timeSlot: booking.timeSlot,
        totalAmount: booking.totalAmount,
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

// This endpoint gets all bookings (for admin purposes - add auth in production)
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        pricingOption: true,
        address: true,
        contact: true,
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

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Authentication required.' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required.' },
        { status: 403 }
      )
    }

    const bookingId = params.id
    const { technicianId, notes } = await request.json()

    if (!technicianId) {
      return NextResponse.json(
        { success: false, message: 'Technician ID is required' },
        { status: 400 }
      )
    }

    // Find the booking - must be in PENDING or CONFIRMED status
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        pricingOption: true,
        address: true,
        technician: {
          include: { user: true }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        { success: false, message: `Cannot assign technician to booking with status: ${booking.status}` },
        { status: 400 }
      )
    }

    // Verify technician exists and is active
    const technician = await prisma.technicianProfile.findUnique({
      where: { id: technicianId },
      include: { user: true }
    })

    if (!technician) {
      return NextResponse.json(
        { success: false, message: 'Technician not found' },
        { status: 404 }
      )
    }

    if (technician.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: `Technician is not active (status: ${technician.status})` },
        { status: 400 }
      )
    }

    // Optional: Check if technician handles this service type
    const technicianSpecialties = JSON.parse(technician.specialties || '[]')
    if (Array.isArray(technicianSpecialties) && technicianSpecialties.length > 0) {
      const serviceType = booking.service.category
      const categoryMatch = technicianSpecialties.some((specialty: string) =>
        booking.service.name.toLowerCase().includes(specialty.toLowerCase()) ||
        specialty.toLowerCase().includes(booking.service.name.toLowerCase())
      )

      if (!categoryMatch) {
        console.warn(`Assigning technician ${technician.user.name} to service ${booking.service.name} - service may not be in their specialties`)
      }
    }

    // Use transaction to assign technician and create job assignment record
    const result = await prisma.$transaction(async (tx: any) => {
      // Update booking with technician and status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          technicianId: technicianId,
          status: 'ASSIGNED'
        },
        include: {
          service: true,
          pricingOption: true,
          address: true,
          technician: {
            include: { user: true }
          },
          client: {
            select: { name: true, email: true, phone: true }
          }
        }
      })

      // Create job assignment record for tracking
      const jobAssignment = await tx.jobAssignment.create({
        data: {
          bookingId: bookingId,
          technicianId: technicianId,
          assignedById: user.id,
          notes: notes || 'Auto-assigned by system'
        }
      })

      return { booking: updatedBooking, jobAssignment }
    })

    return NextResponse.json({
      success: true,
      message: `Technician ${technician.user.name} successfully assigned to booking`,
      booking: {
        id: result.booking.id,
        bookingNumber: result.booking.bookingNumber,
        status: result.booking.status,
        scheduledDate: result.booking.scheduledDate,
        timeSlot: result.booking.timeSlot,
        service: {
          name: result.booking.service.name,
          category: result.booking.service.category
        },
        pricingOption: {
          name: result.booking.pricingOption?.name,
          price: result.booking.pricingOption?.price
        },
        address: {
          area: result.booking.address.area,
          block: result.booking.address.block
        },
        technician: result.booking.technician ? {
          name: result.booking.technician.user.name,
          phone: result.booking.technician.user.phone
        } : null,
        client: {
          name: result.booking.client.name,
          email: result.booking.client.email,
          phone: result.booking.client.phone
        }
      },
      jobAssignment: {
        id: result.jobAssignment.id,
        assignedAt: result.jobAssignment.assignedAt,
        notes: result.jobAssignment.notes
      }
    })

  } catch (error) {
    console.error('Technician assignment error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to assign technician. Please try again.' },
      { status: 500 }
    )
  }
}

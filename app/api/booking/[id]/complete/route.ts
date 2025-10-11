import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Complete booking and mark cash payment received
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

    const bookingId = params.id

    // Get the authenticated user (technician or admin)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        technicianProfile: { select: { id: true } }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const { paymentReceived = false } = await request.json()

    // Find booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        technician: { select: { id: true, user: { select: { id: true } } } },
        client: { select: { id: true } }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized (technician assigned to this booking or admin)
    const isAssignedTechnician = user.role === 'TECHNICIAN' &&
                                   booking.technicianId === user.technicianProfile?.id
    const isAdmin = user.role === 'ADMIN'

    if (!isAssignedTechnician && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to complete this booking' },
        { status: 403 }
      )
    }

    // Use transaction to update booking and create payment in one go
    const result = await prisma.$transaction(async (tx: any) => {
      // Update booking status to COMPLETED
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          finalPrice: booking.estimatedPrice, // Set final price to estimated for cash payments
        },
        include: {
          service: true,
          client: true,
          technician: {
            include: { user: true }
          }
        }
      })

      let payment = null
      if (paymentReceived) {
        // Create cash payment record
        payment = await tx.payment.create({
          data: {
            bookingId: bookingId,
            amount: booking.estimatedPrice || 0,
            method: 'CASH',
            status: 'PAID',
            paidAt: new Date()
          }
        })

        // Update technician's completed jobs count
        if (booking.technicianId) {
          await tx.technicianProfile.update({
            where: { id: booking.technicianId },
            data: {
              completedJobs: { increment: 1 }
            }
          })
        }
      }

      return { booking: updatedBooking, payment }
    })

    return NextResponse.json({
      success: true,
      message: paymentReceived
        ? 'Booking completed and cash payment recorded'
        : 'Booking marked as completed',
      booking: {
        id: result.booking.id,
        status: result.booking.status,
        completedAt: result.booking.completedAt,
        finalPrice: result.booking.finalPrice
      },
      payment: result.payment ? {
        id: result.payment.id,
        amount: result.payment.amount,
        method: result.payment.method,
        status: result.payment.status,
        paidAt: result.payment.paidAt
      } : null
    })

  } catch (error) {
    console.error('Booking completion error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to complete booking' },
      { status: 500 }
    )
  }
}

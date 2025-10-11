import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Cancel a booking
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
    const { reason } = await request.json()

    // Find booking and check ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: {
          include: { user: { select: { name: true, phone: true } } }
        },
        service: { select: { name: true } }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Get user for role checking
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check permissions: client owns booking OR admin OR assigned technician
    const isClient = user.role === 'CLIENT' && booking.clientId === user.id
    const isAdmin = user.role === 'ADMIN'
    const isTechnician = user.role === 'TECHNICIAN' && booking.technicianId === user.id

    if (!isClient && !isAdmin && !isTechnician) {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to cancel this booking' },
        { status: 403 }
      )
    }

    // Check if booking can be cancelled
    if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
      return NextResponse.json(
        { success: false, message: `Cannot cancel booking with status: ${booking.status}` },
        { status: 400 }
      )
    }

    // Check if cancellation is too close to appointment time (24 hours rule)
    const appointmentTime = new Date(booking.scheduledDate)
    const now = new Date()
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilAppointment < 24 && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bookings cannot be cancelled less than 24 hours before the appointment time. Please contact us directly.'
        },
        { status: 400 }
      )
    }

    // Use transaction to cancel booking and update related records
    const result = await prisma.$transaction(async (tx: any) => {
      // Update booking status to CANCELLED
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          internalNotes: reason ? `Cancelled: ${reason}` : 'Cancelled by user'
        },
        include: {
          service: { select: { name: true } },
          client: { select: { name: true, email: true } },
          technician: {
            include: { user: { select: { name: true, phone: true } } }
          }
        }
      })

      // If payment exists and this is a refund-eligible cancellation, could mark for refund
      // For cash payments, no action needed - customer just pays later
      const payment = await tx.payment.findUnique({
        where: { bookingId },
        select: { id: true, status: true, method: true }
      })

      return { booking: updatedBooking, payment }
    })

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        id: result.booking.id,
        bookingNumber: result.booking.bookingNumber,
        status: result.booking.status,
        scheduledDate: result.booking.scheduledDate,
        service: {
          name: result.booking.service.name
        }
      }
    })

  } catch (error) {
    console.error('Booking cancellation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to cancel booking. Please try again.' },
      { status: 500 }
    )
  }
}

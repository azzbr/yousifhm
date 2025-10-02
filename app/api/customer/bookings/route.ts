import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any)?.role !== 'CLIENT') {
      return NextResponse.json(
        { success: false, message: 'Customer access required' },
        { status: 403 }
      )
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID not found' },
        { status: 400 }
      )
    }

    // Get all customer bookings with related data
    const bookings = await prisma.booking.findMany({
      where: { clientId: userId },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        technician: {
          include: {
            user: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        },
        address: {
          select: {
            area: true,
            block: true,
            road: true,
            building: true,
            flat: true,
            additionalInfo: true
          }
        },
        review: {
          select: {
            overallRating: true,
            comment: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data for frontend consumption
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      scheduledDate: booking.scheduledDate.toISOString(),
      timeSlot: booking.timeSlot,
      finalPrice: booking.finalPrice,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      service: booking.service,
      technician: booking.technician ? {
        user: booking.technician.user
      } : undefined,
      address: booking.address,
      review: booking.review || undefined
    }))

    return NextResponse.json({
      success: true,
      bookings: transformedBookings
    })

  } catch (error) {
    console.error('Customer bookings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

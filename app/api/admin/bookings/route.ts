import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || ((session.user as any)?.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    // Fetch all bookings with related data
    const bookings = await prisma.booking.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        technician: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        pricingOption: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        },
        address: {
          select: {
            area: true,
            building: true,
            block: true
          }
        },
        contact: {
          select: {
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        payment: {
          select: {
            amount: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Get booking statistics
    const [pendingCount, assignedCount, completedCount, totalRevenue] = await Promise.all([
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'ASSIGNED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { finalPrice: true }
      })
    ])

    const stats = {
      pending: pendingCount,
      assigned: assignedCount,
      completed: completedCount,
      totalRevenue: totalRevenue._sum.finalPrice || 0,
      totalBookings: bookings.length
    }

    return NextResponse.json({
      success: true,
      bookings,
      stats,
      message: 'Bookings retrieved successfully'
    })

  } catch (error) {
    console.error('Admin bookings fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || ((session.user as any)?.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    const { bookingId, status, technicianId, notes } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, message: 'Booking ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      internalNotes: notes
    }

    // Update technician assignment if provided
    if (technicianId) {
      updateData.technicianId = technicianId
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        client: {
          select: { name: true, email: true },
        },
        technician: {
          select: {
            user: { select: { name: true } }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: `Booking status updated to ${status}`
    })

  } catch (error) {
    console.error('Admin booking update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

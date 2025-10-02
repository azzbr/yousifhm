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

    // Get booking statistics
    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      pendingBookings
    ] = await Promise.all([
      prisma.booking.count({
        where: { clientId: userId }
      }),
      prisma.booking.count({
        where: {
          clientId: userId,
          scheduledDate: {
            gte: new Date()
          },
          status: {
            in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS']
          }
        }
      }),
      prisma.booking.count({
        where: {
          clientId: userId,
          status: 'COMPLETED'
        }
      }),
      prisma.booking.count({
        where: {
          clientId: userId,
          status: 'PENDING'
        }
      })
    ])

    // Get recent bookings (last 10)
    const recentBookings = await prisma.booking.findMany({
      where: { clientId: userId },
      include: {
        service: {
          select: {
            id: true,
            name: true
          }
        },
        technician: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const summary = {
      total: totalBookings,
      upcoming: upcomingBookings,
      completed: completedBookings,
      pending: pendingBookings
    }

    return NextResponse.json({
      success: true,
      summary,
      recentBookings
    })

  } catch (error) {
    console.error('Customer dashboard API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

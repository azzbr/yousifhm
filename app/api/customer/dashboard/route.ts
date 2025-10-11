import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DEMO_MODE = process.env.DEMO_MODE === 'true'

export const dynamic = 'force-dynamic'

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

    // DEMO MODE: Return mock data
    if (DEMO_MODE && userId.startsWith('demo-')) {
      const demoSummary = {
        total: 8,
        upcoming: 2,
        completed: 5,
        pending: 1
      }

      const demoBookings = [
        {
          id: 'demo-booking-1',
          bookingNumber: 'BH-2025-001',
          service: { id: '1', name: 'Air Conditioning Repair' },
          status: 'CONFIRMED',
          scheduledDate: '2025-11-15T10:30:00.000Z',
          technician: { user: { name: 'Ahmed Al-Rashid' } }
        },
        {
          id: 'demo-booking-2',
          bookingNumber: 'BH-2025-002',
          service: { id: '2', name: 'Plumbing Service' },
          status: 'COMPLETED',
          scheduledDate: '2025-11-12T14:00:00.000Z',
          technician: { user: { name: 'Mohammed Al-Hassan' } }
        }
      ]

      return NextResponse.json({
        success: true,
        summary: demoSummary,
        recentBookings: demoBookings
      })
    }

    // NORMAL MODE: Database queries
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

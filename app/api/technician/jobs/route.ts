import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.role || (session?.user as any).role !== 'TECHNICIAN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Technician privileges required.' },
        { status: 403 }
      )
    }

    // Fetch jobs assigned to this technician
    const bookings = await prisma.booking.findMany({
      where: {
        technicianId: session.user.id,
        status: {
          in: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
        }
      },
      include: {
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
            id: true,
            area: true,
            building: true,
            block: true,
            additionalInfo: true
          }
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // ASSIGNED first, then IN_PROGRESS, then COMPLETED
        { scheduledDate: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      jobs: bookings,
      message: 'Jobs retrieved successfully'
    })

  } catch (error) {
    console.error('Technician jobs fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.role || (session.user as any).role !== 'TECHNICIAN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Technician privileges required.' },
        { status: 403 }
      )
    }

    const { jobId, status, notes } = await request.json()

    if (!jobId || !status) {
      return NextResponse.json(
        { success: false, message: 'Job ID and status are required' },
        { status: 400 }
      )
    }

    // Validate allowed status transitions for technicians
    const allowedStatuses = ['IN_PROGRESS', 'COMPLETED']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Technicians can only update status to In Progress or Completed' },
        { status: 400 }
      )
    }

    // Check if the job belongs to this technician
    const booking = await prisma.booking.findFirst({
      where: {
        id: jobId,
        technicianId: session.user.id
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Job not found or not assigned to you' },
        { status: 404 }
      )
    }

    // Prevent invalid status transitions
    if (status === 'IN_PROGRESS' && booking.status !== 'ASSIGNED') {
      return NextResponse.json(
        { success: false, message: 'Can only start jobs that are assigned to you' },
        { status: 400 }
      )
    }

    if (status === 'COMPLETED' && booking.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { success: false, message: 'Can only complete jobs that are in progress' },
        { status: 400 }
      )
    }

    // Update booking status
    const updateData: any = {
      status
    }

    if (notes) {
      updateData.internalNotes = notes
    }

    // Set completedAt timestamp when marking as completed
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: jobId },
      data: updateData,
      include: {
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
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // If completing job, update technician's job counts
    if (status === 'COMPLETED') {
      await prisma.technicianProfile.update({
        where: { userId: session.user.id },
        data: {
          assignedJobs: { decrement: 1 },
          completedJobs: { increment: 1 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      job: updatedBooking,
      message: `Job status updated to ${status.replace('_', ' ')}`
    })

  } catch (error) {
    console.error('Technician job update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update job status' },
      { status: 500 }
    )
  }
}

// GET stats for technician performance (optional)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.role || (session.user as any).role !== 'TECHNICIAN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Technician privileges required.' },
        { status: 403 }
      )
    }

    const { month, year } = await request.json()

    const startDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 1)
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0)

    // Get technician stats for the period
    const [totalJobs, completedJobs, averageRating] = await Promise.all([
      prisma.booking.count({
        where: {
          technicianId: session.user.id,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      prisma.booking.count({
        where: {
          technicianId: session.user.id,
          status: 'COMPLETED',
          completedAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      prisma.review.aggregate({
        where: {
          booking: {
            technicianId: session.user.id,
            completedAt: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        _avg: {
          overallRating: true
        }
      })
    ])

    const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0

    // Calculate earnings from completed jobs
    const earnings = await prisma.booking.aggregate({
      where: {
        technicianId: session.user.id,
        status: 'COMPLETED',
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        finalPrice: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalJobs,
        completedJobs,
        completionRate: Math.round(completionRate),
        earnings: earnings._sum.finalPrice || 0,
        averageRating: averageRating._avg.overallRating || 0
      },
      message: 'Technician stats retrieved successfully'
    })

  } catch (error) {
    console.error('Technician stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch technician stats' },
      { status: 500 }
    )
  }
}

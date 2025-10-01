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

    // Fetch all reviews with related data
    const reviews = await prisma.review.findMany({
      include: {
        booking: {
          include: {
            service: true,
            technician: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      reviews,
      message: 'Reviews retrieved successfully'
    })

  } catch (error) {
    console.error('Admin reviews fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
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

    const { reviewId, action, notes } = await request.json()

    if (!reviewId || !action) {
      return NextResponse.json(
        { success: false, message: 'Review ID and action are required' },
        { status: 400 }
      )
    }

    // Validate action
    const validActions = ['approve', 'deny']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      )
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { booking: true }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      )
    }

    // Update review based on action
    const updateData: any = {
      published: action === 'approve',
      moderationNotes: notes || (action === 'deny' ? 'Rejected by admin' : null)
    }

    if (action === 'approve') {
      updateData.moderationNotes = notes || 'Approved for publication'
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        booking: {
          include: {
            service: true,
            technician: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: `Review ${action}d successfully`
    })

  } catch (error) {
    console.error('Admin review moderation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to moderate review' },
      { status: 500 }
    )
  }
}

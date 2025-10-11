import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const {
      overallRating,
      qualityRating,
      timelinessRating,
      communicationRating,
      valueRating,
      comment,
      positives,
      improvements
    } = await request.json()

    // Validate required fields
    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return NextResponse.json(
        { success: false, message: 'Valid overall rating (1-5) is required' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        clientId: userId,
        status: 'COMPLETED' // Only allow reviews for completed bookings
      },
      select: {
        id: true,
        bookingNumber: true,
        technicianId: true,
        status: true,
        review: {
          select: { id: true } // Check if review already exists
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found or not eligible for review' },
        { status: 404 }
      )
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, message: 'Only completed bookings can be reviewed' },
        { status: 400 }
      )
    }

    if (booking.review) {
      return NextResponse.json(
        { success: false, message: 'Review already exists for this booking' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        bookingId: params.id,
        clientId: userId,
        overallRating,
        qualityRating,
        timelinessRating,
        communicationRating,
        valueRating,
        comment,
        positives,
        improvements,
        photos: '[]' as any, // Empty JSON array for photos
        published: true, // Customer reviews are published immediately
        verifiedJob: true // The job is verified as completed
      }
    })

    // Update technician rating and review count
    if (booking.technicianId) {
      // Calculate new rating based on all reviews
      const allReviews = await prisma.review.findMany({
        where: {
          booking: {
            technicianId: booking.technicianId
          }
        },
        select: { overallRating: true }
      })

      const ratingSum = allReviews.reduce((sum, review) => sum + review.overallRating, 0)
      const newRating = ratingSum / allReviews.length

      await prisma.technicianProfile.update({
        where: { userId: booking.technicianId },
        data: {
          rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
          reviewCount: { increment: 1 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      review: {
        id: review.id,
        overallRating: review.overallRating,
        qualityRating: review.qualityRating,
        timelinessRating: review.timelinessRating,
        communicationRating: review.communicationRating,
        valueRating: review.valueRating,
        comment: review.comment,
        positives: review.positives,
        improvements: review.improvements,
        createdAt: review.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit review. Please try again.' },
      { status: 500 }
    )
  }
}

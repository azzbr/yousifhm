import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.bookingId || !data.overallRating) {
      return NextResponse.json(
        { success: false, message: 'Booking ID and overall rating are required' },
        { status: 400 }
      )
    }

    // Check if booking exists and status is completed
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        client: true,
        service: true,
        technician: {
          include: {
            user: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, message: 'Review can only be submitted for completed bookings' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: data.bookingId }
    })

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review already exists for this booking' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        clientId: booking.clientId,
        overallRating: data.overallRating,
        qualityRating: data.qualityRating || null,
        timelinessRating: data.timelinessRating || null,
        communicationRating: data.communicationRating || null,
        valueRating: data.valueRating || null,
        comment: data.comment || null,
        positives: data.positives || null,
        improvements: data.improvements || null,
        photos: JSON.stringify(data.photos || []), // Required: JSON string array
        published: false, // Admin needs to approve
        verifiedJob: true,
        moderatedById: null,
        response: null,
        responseAt: null,
        responseById: null,
        helpful: 0
      },
      include: {
        booking: {
          include: {
            service: true,
            technician: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully. It will be published after admin approval.'
    })

  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    // Build where clause
    const where: any = {
      published: true
    }

    if (serviceId) {
      where.booking = {
        serviceId
      }
    }

    // Get reviews for service or general reviews
    const reviews = await prisma.review.findMany({
      where,
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
      },
      take: limit
    })

    // Get aggregated ratings
    let ratingStats = null
    if (serviceId) {
      ratingStats = await prisma.review.aggregate({
        where: {
          ...where,
          booking: { serviceId }
        },
        _avg: {
          overallRating: true,
          qualityRating: true,
          timelinessRating: true,
          communicationRating: true,
          valueRating: true
        },
        _count: {
          id: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      reviews,
      stats: ratingStats
    })

  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

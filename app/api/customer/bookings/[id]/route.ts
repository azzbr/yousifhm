import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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

    // Get the specific booking with all related data
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        clientId: userId // Ensure user can only access their own bookings
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
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
            id: true,
            area: true,
            block: true,
            road: true,
            building: true,
            flat: true,
            additionalInfo: true
          }
        },
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        review: {
          select: {
            id: true,
            overallRating: true,
            qualityRating: true,
            timelinessRating: true,
            communicationRating: true,
            valueRating: true,
            comment: true,
            positives: true,
            improvements: true,
            createdAt: true
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

    // If technician is assigned, get additional profile data for display
    let technicianWithProfile = (booking as any).technician
    if ((booking as any).technician) {
      const techProfile = await prisma.technicianProfile.findUnique({
        where: { userId: (booking as any).technician.userId },
        select: {
          rating: true,
          reviewCount: true,
          experienceYears: true,
          hasVehicle: true,
          certifications: true
        }
      })

      technicianWithProfile = {
        ...(booking as any).technician,
        ...techProfile
      }
    }

    // Transform the data for frontend consumption
    const transformedBooking = {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      scheduledDate: booking.scheduledDate.toISOString(),
      timeSlot: booking.timeSlot,
      finalPrice: booking.finalPrice,
      estimatedPrice: booking.estimatedPrice,
      notes: booking.notes,
      internalNotes: booking.internalNotes,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      completedAt: booking.completedAt?.toISOString(),
      service: booking.service,
      technician: technicianWithProfile ? {
        id: technicianWithProfile.id,
        user: technicianWithProfile.user,
        rating: technicianWithProfile.rating || 0,
        reviewCount: technicianWithProfile.reviewCount || 0,
        experienceYears: technicianWithProfile.experienceYears || 0,
        hasVehicle: technicianWithProfile.hasVehicle || false,
        certifications: technicianWithProfile.certifications || []
      } : undefined,
      address: booking.address,
      contact: booking.contact,
      review: booking.review || undefined
    }

    return NextResponse.json({
      success: true,
      booking: transformedBooking
    })

  } catch (error) {
    console.error('Individual booking API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch booking details' },
      { status: 500 }
    )
  }
}

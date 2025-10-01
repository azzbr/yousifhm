import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Extract user data and technician data
    const {
      name,
      email,
      phone,
      passwordHash,
      status,
      ...technicianData
    } = data

    // Validate required fields
    if (!name || !email || !phone || !passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Name, email, phone, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: 'User with this phone number already exists' },
        { status: 400 }
      )
    }

    // Create user and technician profile in a transaction
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: 'TECHNICIAN',
        verified: false, // Admin needs to verify
        technicianProfile: {
          create: {
            ...technicianData,
            status: (status || 'UNDER_REVIEW') as any,
            bio: technicianData.bio || '',
            experienceYears: technicianData.experienceYears || 0,
            certifications: technicianData.certifications || [],
            hasVehicle: technicianData.hasVehicle || false,
            canTravelOutsideCity: technicianData.canTravelOutsideCity || true,
            verified: false,
          } as any
        }
      },
      include: {
        technicianProfile: true
      }
    })

    // Remove sensitive data from response
    const { passwordHash: _, ...safeUser } = newUser
    const safeTechnicianProfile = (newUser as any).technicianProfile ? {
      ...(newUser as any).technicianProfile,
      // Include any additional processing if needed
    } : null

    return NextResponse.json({
      success: true,
      message: 'Technician account created successfully. Please wait for admin approval.',
      user: safeUser,
      technicianProfile: safeTechnicianProfile
    })

  } catch (error) {
    console.error('Technician registration error:', error)

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, message: 'Email or phone number already exists' },
        { status: 400 }
      )
    }

    // Handle service connection errors
    if (error instanceof Error && error.message.includes('Service') && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, message: 'Some selected services are not available. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create technician account. Please try again.' },
      { status: 500 }
    )
  }
}

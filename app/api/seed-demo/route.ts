import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if this is running in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { success: false, message: 'Demo seeding only available in development' },
        { status: 403 }
      )
    }

    const session = await auth()
    if (!session?.user?.role || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Seed demo accounts
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@bahraindemo.com',
        phone: '+97338889999',
        password: 'admin123',
        role: 'ADMIN',
        verified: true
      },
      {
        name: 'John White',
        email: 'customer@bahraindemo.com',
        phone: '+97331112222',
        password: 'customer123',
        role: 'CUSTOMER',
        verified: true
      },
      {
        name: 'Ahmed Hassan',
        email: 'tech@bahraindemo.com',
        phone: '+97335556666',
        password: 'tech123',
        role: 'TECHNICIAN',
        verified: true
      }
    ]

    const createdUsers = []

    for (const userData of demoUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            passwordHash: hashedPassword,
            role: userData.role,
            verified: userData.verified
          }
        })

        // If technician, create profile
        if (userData.role === 'TECHNICIAN') {
          await prisma.technicianProfile.create({
            data: {
              userId: newUser.id,
              bio: 'Experienced professional technician with 8 years in the field.',
              experienceYears: 8,
              certifications: ['Licensed Electrician', 'Certified Plumber'],
              serviceAreas: ['Manama', 'Seef', 'Juffair'],
              specialties: ['Electrical Work', 'Plumbing', 'Air Conditioning Repair'],
              hasVehicle: true,
              canTravelOutsideCity: true,
              status: 'ACTIVE',
              verified: true,
              completedJobs: 47,
              rating: 4.7
            }
          })
        }

        createdUsers.push({
          ...newUser,
          password: userData.password // Don't expose in real app
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo accounts created successfully',
      accounts: createdUsers.map(({ passwordHash, ...user }) => user),
      demoCredentials: demoUsers.map(({ password, role, email }) => ({
        role,
        email,
        password
      }))
    })

  } catch (error) {
    console.error('Demo seeding error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create demo accounts' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to view current demo accounts (for verification)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.role || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        technicianProfile: {
          select: {
            status: true,
            verified: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      users,
      demoCredentials: [
        { role: 'ADMIN', email: 'admin@bahraindemo.com', password: 'admin123' },
        { role: 'CUSTOMER', email: 'customer@bahraindemo.com', password: 'customer123' },
        { role: 'TECHNICIAN', email: 'tech@bahraindemo.com', password: 'tech123' }
      ]
    })

  } catch (error) {
    console.error('Demo accounts fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch demo accounts' },
      { status: 500 }
    )
  }
}

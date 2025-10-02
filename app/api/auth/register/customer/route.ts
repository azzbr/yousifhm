import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, marketingConsent } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, phone, and password are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: 'An account with this phone number already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with client profile
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        role: 'CLIENT',
        verified: true, // Customers are immediately verified (unlike technicians who need approval)
        clientProfile: {
          create: {
            // Client profile is created empty, will be filled later
          }
        }
      },
      include: {
        clientProfile: true
      }
    })

    // Remove sensitive data from response
    const { passwordHash: _, ...safeUser } = newUser

    return NextResponse.json({
      success: true,
      message: 'Customer account created successfully. Welcome to Bahrain Handyman!',
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        phone: safeUser.phone,
        role: safeUser.role,
        verified: safeUser.verified,
        createdAt: safeUser.createdAt
      }
    })

  } catch (error) {
    console.error('Customer registration error:', error)

    // Handle Prisma unique constraint errors (double check)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, message: 'Email or phone number already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

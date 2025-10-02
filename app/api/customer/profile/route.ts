import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: user
    })

  } catch (error) {
    console.error('Get profile API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const { name, email, phone, currentPassword, newPassword } = await request.json()

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Check if email is being changed and if it's already taken
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Email address is already in use' },
        { status: 400 }
      )
    }

    // Check if phone is being changed and if it's already taken
    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingPhone && existingPhone.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Phone number is already in use' },
        { status: 400 }
      )
    }

    // Handle password change
    let updateData: any = {
      name,
      email,
      phone
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is required to change password' },
          { status: 400 }
        )
      }

      // Verify current password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        )
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)
      updateData.passwordHash = hashedNewPassword
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedUser
    })

  } catch (error) {
    console.error('Update profile API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

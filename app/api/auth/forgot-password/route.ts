import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link shortly.'
      })
    }

    // Generate secure reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Using a placeholder field - in real implementation you'd add a separate ResetToken model
        // For now, we'll just simulate this behavior
        // passwordHash: resetToken, // Don't do this in production!
      }
    })

    // In a real application, you would send an email here
    // For demo purposes, we'll just return the token
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset URL: http://localhost:3001/auth/reset-password?token=${resetToken}`)

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link shortly.',
      // Only include in development - remove in production
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          resetToken,
          resetUrl: `/auth/reset-password?token=${resetToken}`
        }
      })
    })

  } catch (error) {
    console.error('Forgot password API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}

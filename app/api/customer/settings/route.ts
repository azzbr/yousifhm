import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// For demo purposes, we'll use ClientProfile table to store settings
// In production, you'd create a dedicated NotificationSettings table

const defaultSettings = {
  emailNotifications: {
    bookingConfirmations: true,
    bookingUpdates: true,
    bookingReminders: true,
    promotionalOffers: false,
    newsletter: false,
    reviews: true
  },
  smsNotifications: {
    bookingConfirmations: true,
    urgentAlerts: true,
    statusUpdates: false
  },
  appNotifications: {
    newMessages: true,
    bookingStatus: true,
    promotions: false
  },
  marketingConsent: false
}

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

    // Get customer profile settings
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    })

    // Return defaults if no settings exist yet or parsing fails
    let userSettings = defaultSettings

    if ((clientProfile as any)?.notificationSettings) {
      try {
        userSettings = JSON.parse((clientProfile as any).notificationSettings)
      } catch (error) {
        console.error('Failed to parse notification settings:', error)
        // Keep defaults if parsing fails
      }
    }

    return NextResponse.json({
      success: true,
      settings: userSettings
    })

  } catch (error) {
    console.error('Get settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
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

    const settingsData = await request.json()

    // Validate settings structure
    if (!settingsData || typeof settingsData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // For demo purposes, just return success without persistent storage
    // In production, you'd create a NotificationSettings table and save here

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully (demo mode)',
      settings: settingsData
    })

  } catch (error) {
    console.error('Update settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

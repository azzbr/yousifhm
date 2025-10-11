import { NextResponse } from 'next/server'

// Mock settings data for demonstration - would normally be stored in database
const mockSettings = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  urgentJobsAlert: true,
  dailyDigest: false,
  maxJobsPerDay: 5,
  autoAcceptJobs: false,
  weekendWork: true,
  language: 'en',
  theme: 'light',
  timezone: '+03:00'
}

export async function GET() {
  try {
    // Return mock settings data for UI demonstration
    return NextResponse.json({
      success: true,
      settings: mockSettings
    })

  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const updatedSettings = await request.json()

    // Mock save - normally would update database
    console.log('Updating technician settings:', updatedSettings)

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings
    })

  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'

// Mock profile data for demonstration
const mockProfile = {
  id: 'tech_123',
  email: 'tech@bahraindemo.com',
  name: 'Ahmed Al-Mahmood',
  phone: '+973 3888 9999',
  image: null,
  specialization: ['AC Services', 'Plumbing', 'Electrical'],
  availability: true,
  experienceYears: 5,
  rating: 4.8,
  completedJobs: 127,
  totalEarnings: 2500000 // in cents (BD 25,000)
}

export async function GET() {
  try {
    // Return mock data for UI demonstration
    return NextResponse.json({
      success: true,
      profile: mockProfile
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

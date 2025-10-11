import { NextResponse } from 'next/server'

// Mock completed job history data
const mockJobs: any[] = [
  {
    id: 'job_001',
    bookingNumber: 'BH-2025-001',
    completedAt: '2025-11-08T14:30:00Z',
    service: {
      name: 'AC Installation',
      category: 'AC_SERVICES'
    },
    pricingOption: {
      price: 25000
    },
    contact: {
      firstName: 'Fatima',
      lastName: 'Al-Khaldi',
      phone: '+973 3245 6789',
      email: 'fatima@email.com'
    },
    address: {
      area: 'Manama',
      building: 'Building 123',
      block: 'Block 456'
    },
    finalPrice: 25000,
    notes: null
  },
  {
    id: 'job_002',
    bookingNumber: 'BH-2025-002',
    completedAt: '2025-11-07T10:15:00Z',
    service: {
      name: 'Electrical Repair',
      category: 'ELECTRICAL'
    },
    pricingOption: {
      price: 15000
    },
    contact: {
      firstName: 'Mohammed',
      lastName: 'Al-Hassan',
      phone: '+973 3456 7890',
      email: 'mohammed@email.com'
    },
    address: {
      area: 'Juffair',
      building: 'Villa 789',
      block: 'Block 123'
    },
    finalPrice: 15000,
    notes: 'Fixed wiring issue in the kitchen outlet'
  },
  {
    id: 'job_003',
    bookingNumber: 'BH-2025-003',
    completedAt: '2025-11-06T16:45:00Z',
    service: {
      name: 'Plumbing Maintenance',
      category: 'PLUMBING'
    },
    pricingOption: {
      price: 30000
    },
    contact: {
      firstName: 'Sara',
      lastName: 'Al-Mansoori',
      phone: '+973 3567 8901',
      email: 'sara@email.com'
    },
    address: {
      area: 'Seef',
      building: 'Apartment 456',
      block: 'Block 789'
    },
    finalPrice: 30000,
    notes: 'Replaced leaking sink pipes'
  }
]

const mockStats = {
  totalJobs: 127,
  totalEarnings: 2500000, // BD 25,000
  averageRating: 4.8
}

export async function GET() {
  try {
    // Return mock data for UI demonstration
    return NextResponse.json({
      success: true,
      jobs: mockJobs,
      stats: mockStats
    })

  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

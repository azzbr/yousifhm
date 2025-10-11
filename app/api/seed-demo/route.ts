import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Demo service data with pricing options
const demoServices = [
  {
    name: 'Air Conditioning Services',
    slug: 'ac-services',
    description: 'Professional AC maintenance, repair, and installation services.',
    category: 'AC_SERVICES',
    icon: '⚡',
    priority: 1,
    active: true,
    pricingOptions: [
      {
        name: 'Basic AC Maintenance',
        type: 'FLAT_RATE',
        price: 5.00,
        duration: 180,
        description: 'Standard AC unit cleaning and maintenance'
      },
      {
        name: 'AC Repair - Diagnostics',
        type: 'FLAT_RATE',
        price: 10.00,
        duration: 120,
        description: 'Troubleshooting and repair diagnosis'
      },
      {
        name: 'AC Unit Installation (1HP)',
        type: 'FLAT_RATE',
        price: 15.00,
        duration: 480,
        description: 'Complete installation of 1HP AC unit'
      }
    ]
  },
  {
    name: 'Plumbing Services',
    slug: 'plumbing-services',
    description: 'Expert plumbing repairs and installations.',
    category: 'PLUMBING',
    icon: '🔧',
    priority: 2,
    active: true,
    pricingOptions: [
      {
        name: 'Emergency Plumbing Call',
        type: 'FLAT_RATE',
        price: 10.00,
        duration: 60,
        description: 'Urgent plumbing emergencies'
      },
      {
        name: 'Tap Installation/Replacement',
        type: 'FLAT_RATE',
        price: 5.00,
        duration: 90,
        description: 'Standard tap installation or replacement'
      }
    ]
  },
  {
    name: 'Electrical Services',
    slug: 'electrical-services',
    description: 'Licensed electrical work and repairs.',
    category: 'ELECTRICAL',
    icon: '⚡',
    priority: 3,
    active: true,
    pricingOptions: [
      {
        name: 'Outlet Installation',
        type: 'FLAT_RATE',
        price: 5.00,
        duration: 120,
        description: 'Standard electrical outlet installation'
      },
      {
        name: 'Electrical Inspection',
        type: 'FLAT_RATE',
        price: 15.00,
        duration: 180,
        description: 'Complete electrical system inspection'
      }
    ]
  },
  {
    name: 'General Handyman',
    slug: 'general-handyman',
    description: 'Various home repairs and maintenance.',
    category: 'GENERAL_HANDYMAN',
    icon: '🛠️',
    priority: 4,
    active: true,
    pricingOptions: [
      {
        name: 'Hourly Rate',
        type: 'HOURLY',
        price: 5.00,
        duration: 60,
        description: 'Standard hourly rate for general repairs'
      }
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    // Allow demo seeding in development mode or when explicitly enabled
    const allowSeeding = process.env.NODE_ENV === 'development' ||
                        process.env.ALLOW_DEMO_SEEDING === 'true'

    if (!allowSeeding) {
      return NextResponse.json(
        { success: false, message: 'Demo seeding is disabled for this environment' },
        { status: 403 }
      )
    }

    console.log('🌱 Starting demo data seeding...')

    // Seed services and pricing options first
    for (const serviceData of demoServices) {
      const existingService = await prisma.service.findUnique({
        where: { slug: serviceData.slug }
      })

      if (!existingService) {
        const service = await prisma.service.create({
          data: {
            name: serviceData.name,
            slug: serviceData.slug,
            description: serviceData.description,
            category: serviceData.category as any,
            icon: serviceData.icon,
            priority: serviceData.priority,
            active: serviceData.active
          }
        })

        console.log(`✅ Created service: ${service.name}`)

        // Create pricing options for this service
        for (const pricingOption of serviceData.pricingOptions) {
          await prisma.pricingOption.create({
            data: {
              serviceId: service.id,
              name: pricingOption.name,
              type: pricingOption.type as any,
              price: pricingOption.price,
              duration: pricingOption.duration,
              description: pricingOption.description
            }
          })
        }

        console.log(`✅ Created ${serviceData.pricingOptions.length} pricing options for ${service.name}`)
      }
    }

    // Seed demo accounts
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@bahraindemo.com',
        phone: '+97338889999',
        password: 'admin123',
        role: 'ADMIN' as const,
        verified: true
      },
      {
        name: 'John White',
        email: 'customer@bahraindemo.com',
        phone: '+97331112222',
        password: 'customer123',
        role: 'CLIENT' as const,
        verified: true
      },
      {
        name: 'Ahmed Hassan',
        email: 'tech@bahraindemo.com',
        phone: '+97335556666',
        password: 'tech123',
        role: 'TECHNICIAN' as const,
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

        // Create technician profile if this is a technician account
        if (userData.role === 'TECHNICIAN') {
          await prisma.technicianProfile.create({
            data: {
              userId: newUser.id,
              bio: 'Experienced handyman providing quality service in Bahrain.',
              experienceYears: 3,
              certifications: '["Certified Electrician", "Plumbing License"]',
              licenses: '[]',
              serviceAreas: '["Manama", "Saar", "Hamala"]',
              specialties: '["AC Services", "Electrical", "Plumbing"]',
              preferredServices: '["AC Services", "Electrical"]',
              preferredTimes: '["morning", "afternoon"]' as any,
              hasVehicle: true,
              canTravelOutsideCity: false,
              status: 'ACTIVE',
              verified: true,
            }
          })
          console.log(`👷 Created technician profile for ${userData.name}`)
        } else if (userData.role === 'CLIENT') {
          await prisma.clientProfile.create({
            data: {
              userId: newUser.id,
            }
          })
        }

        console.log(`👤 Created user: ${userData.email} (${userData.role})`)

        createdUsers.push({
          ...newUser,
          password: userData.password // Don't expose in real app
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully!',
      data: {
        services: demoServices.length,
        users: createdUsers.length,
        logs: [
          'Services: AC, Plumbing, Electrical, General Handyman',
          'Users: Admin, Customer, Technician',
          'Pricing options created for each service'
        ]
      },
      demoCredentials: demoUsers.map(({ password, role, email }) => ({
        role,
        email,
        password
      }))
    })

  } catch (error) {
    console.error('Demo seeding error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create demo data' },
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
    if (!session?.user || ((session.user as any)?.role !== 'ADMIN')) {
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

    const services = await prisma.service.findMany({
      include: { pricingOptions: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        users: users.length,
        services: services.length,
        technicianProfiles: users.filter(u => u.technicianProfile).length
      },
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

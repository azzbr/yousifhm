import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: {
        pricingOptions: {
          orderBy: { price: 'asc' }
        }
      },
      orderBy: { priority: 'desc' }
    })

    // Format for frontend compatibility
    const formattedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      category: service.category,
      icon: service.icon,
      priority: service.priority,
      active: service.active,
      pricingOptions: service.pricingOptions.map(option => ({
        id: option.id,
        serviceId: option.serviceId,
        name: option.name,
        type: option.type,
        price: option.price,
        duration: option.duration,
        description: option.description,
        popular: option.popular
      }))
    }))

    return NextResponse.json({
      success: true,
      services: formattedServices
    })

  } catch (error) {
    console.error('Services fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

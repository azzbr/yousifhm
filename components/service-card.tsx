import React from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { Button } from './ui/button'
import { formatBHD } from '@/lib/mock-data'

export interface ServiceCardProps {
  service: {
    id: string
    name: string
    slug: string
    category: string
    description: string
    icon: string
    priority: number
    active: boolean
    pricingOptions: Array<{
      id: string
      serviceId: string
      name: string
      type: 'FLAT_RATE' | 'HOURLY' | 'QUOTE_REQUIRED'
      price: number
      duration: number
      description: string
      popular: boolean
    }>
  }
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Get the icon dynamically from lucide-react
  const IconComponent = (LucideIcons as any)[service.icon] as React.ComponentType<{
    className?: string
  }>

  // Calculate starting price (lowest price among pricing options)
  const startingPrice = service.pricingOptions.reduce((min, option) =>
    option.price < min ? option.price : min,
    Infinity
  )

  // Display logic for pricing
  const getPricingDisplay = () => {
    if (startingPrice === 0 || startingPrice === Infinity) {
      return 'Request Quote'
    }

    const quoteRequired = service.pricingOptions.some(option => option.type === 'QUOTE_REQUIRED')
    const hasFlatRate = service.pricingOptions.some(option => option.type === 'FLAT_RATE')
    const hasHourly = service.pricingOptions.some(option => option.type === 'HOURLY')

    if (quoteRequired && (hasFlatRate || hasHourly)) {
      return `From ${formatBHD(startingPrice)}`
    } else if (quoteRequired) {
      return 'Request Quote'
    } else {
      return `From ${formatBHD(startingPrice)}`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="flex items-center mb-4">
        {IconComponent && (
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {service.name}
          </h3>
          <p className="text-blue-600 font-medium text-sm">
            {getPricingDisplay()}
          </p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
        {service.description}
      </p>

      <div className="flex gap-2 mt-auto">
        <Link href={`/services/${service.slug}`} className="flex-1">
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
        <Link href="/book/general" className="flex-1">
          <Button className="w-full">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Add to globals.css for line-clamp to work:

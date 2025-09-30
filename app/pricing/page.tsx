import React from 'react'
import { Button } from '@/components/ui/button'
import { getAllServices, formatBHD } from '@/lib/mock-data'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

const PricingPage = () => {
  const allServices = getAllServices()

  // Group services by category
  const categorizedServices = allServices.reduce((acc, service) => {
    const category = service.category
    if (!acc[category]) {
      acc[category] = {
        name: category,
        displayName: '',
        services: []
      }
    }
    acc[category].services.push(service)
    return acc
  }, {} as Record<string, { name: string; displayName: string; services: any[] }>)

  // Add display names
  Object.values(categorizedServices).forEach(cat => {
    // Simple mapping - you could make this more sophisticated
    const displayMap: Record<string, string> = {
      AC_SERVICES: 'Air Conditioning',
      PLUMBING: 'Plumbing',
      ELECTRICAL: 'Electrical',
      CARPENTRY: 'Carpentry',
      PAINTING: 'Painting',
      APPLIANCE_REPAIR: 'Appliance Repair',
      OUTDOOR_MAINTENANCE: 'Outdoor Maintenance',
      GENERAL_HANDYMAN: 'General Handyman'
    }
    cat.displayName = displayMap[cat.name] || cat.name
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            No hidden fees, no surprises. Get accurate quotes before booking with our licensed professionals.
            All prices in Bahraini Dinar (BHD) with 30-day workmanship guarantee.
          </p>
        </div>

        {/* Pricing Overview */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pricing Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LucideIcons.DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flat Rate</h3>
                <p className="text-gray-600">Fixed pricing for standard repairs and services. No hourly surprises.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LucideIcons.Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hourly Rate</h3>
                <p className="text-gray-600">Complex or large projects billed hourly. Know cost before work begins.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LucideIcons.Search className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Quotes</h3>
                <p className="text-gray-600">Custom projects receive detailed estimates with no obligation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Service Categories</h2>

          {Object.entries(categorizedServices).map(([categoryKey, category]) => (
            category.services.length > 0 && (
              <div key={categoryKey} className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                  {category.displayName}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.services.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {service.name}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        <Link href={`/services/${service.slug}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>

                      {/* Pricing Options */}
                      <div className="space-y-2">
                        {service.pricingOptions.slice(0, 3).map((option: any, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900">
                                {option.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {option.type === 'FLAT_RATE' && 'Fixed Price'}
                                {option.type === 'HOURLY' && 'Per Hour'}
                                {option.type === 'QUOTE_REQUIRED' && 'Quote Required'}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-semibold text-blue-600">
                                {option.price > 0 ? `From ${formatBHD(option.price)}` : 'Request Quote'}
                              </span>
                            </div>
                          </div>
                        ))}

                        {service.pricingOptions.length > 3 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            +{service.pricingOptions.length - 3} more options available
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            No upfront payments. Pay after service completion when you're completely satisfied.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Browse Services
              </Button>
            </Link>

            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                <LucideIcons.Phone className="w-4 h-4 mr-2" />
                Get Free Quote
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center">
              <LucideIcons.Shield className="w-4 h-4 mr-1" />
              30-Day Guarantee
            </span>
            <span className="flex items-center">
              <LucideIcons.Clock className="w-4 h-4 mr-1" />
              Response Within 2 Hours
            </span>
            <span className="flex items-center">
              <LucideIcons.CheckCircle className="w-4 h-4 mr-1" />
              Licensed Professionals
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PricingPage

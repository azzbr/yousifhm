'use client'

import React, { useState, useMemo } from 'react'
import { ServiceCard } from '@/components/service-card'
import { getAllServices, serviceCategoryDisplay } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'

const ServicesPage = () => {
  const allServices = getAllServices()
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allServices.map(service => service.category)))
    return cats.sort((a, b) =>
      (serviceCategoryDisplay[a as keyof typeof serviceCategoryDisplay] || a).localeCompare(
        serviceCategoryDisplay[b as keyof typeof serviceCategoryDisplay] || b
      )
    )
  }, [allServices])

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (selectedCategory === 'ALL') return allServices
    return allServices.filter(service => service.category === selectedCategory)
  }, [allServices, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional handyman services in Bahrain. All our technicians are licensed, insured, and background-checked.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('ALL')}
              className="rounded-full"
            >
              All Services
            </Button>

            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {serviceCategoryDisplay[category as keyof typeof serviceCategoryDisplay] || category}
              </Button>
            ))}
          </div>

          <div className="text-center text-gray-500 text-sm">
            Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
            {selectedCategory !== 'ALL' && (
              <> in {serviceCategoryDisplay[selectedCategory as keyof typeof serviceCategoryDisplay]}</>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Choose Our Handyman Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <LucideIcons.Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Licensed & Insured</h3>
              <p className="text-gray-600 text-sm">All our technicians are fully licensed and insured for your protection.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LucideIcons.Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Emergency repairs available. Most jobs completed same-day.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <LucideIcons.CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Satisfaction Guarantee</h3>
              <p className="text-gray-600 text-sm">Job-done-right guarantee on all our services or your money back.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book a Service?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get professional help for your home repairs. Book online or call us directly for appointments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <LucideIcons.Calendar className="w-4 h-4 mr-2" />
              Book Online
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <LucideIcons.Phone className="w-4 h-4 mr-2" />
              Call Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage

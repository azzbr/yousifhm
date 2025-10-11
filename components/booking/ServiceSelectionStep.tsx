'use client'

import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  category: string
  icon: string
  priority: number
  active: boolean
  pricingOptions: {
    id: string
    serviceId: string
    name: string
    type: string
    price: number
    duration: number
    description: string
    popular: boolean
  }[]
}

export function ServiceSelectionStep() {
  const { watch, setValue, register } = useFormContext()
  const selectedServiceId = watch('serviceId')
  const selectedPricingOptionId = watch('pricingOptionId')

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/services')
        const data = await response.json()

        if (!data.success) {
          throw new Error('Failed to fetch services')
        }

        setServices(data.services || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services')
        console.error('Services fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const selectedService = services.find(s => s.id === selectedServiceId)
  const selectedServicePricingOptions = selectedService?.pricingOptions || []

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Service</h2>
        <p className="text-gray-600">
          Select the service you need and choose your preferred pricing option.
        </p>
      </div>

      {/* Service Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Failed to load services. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Reload page
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const IconComponent = (LucideIcons as any)[service.icon] as React.ComponentType<{
                className?: string
              }>

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setValue('serviceId', service.id)
                    setValue('pricingOptionId', '') // Reset pricing when service changes
                  }}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedServiceId === service.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {IconComponent && (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedServiceId === service.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Pricing Options */}
      {selectedService && selectedServicePricingOptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Pricing Option</h3>
          <div className="space-y-3">
            {selectedServicePricingOptions.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPricingOptionId === option.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    value={option.id}
                    {...register('pricingOptionId')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      {option.popular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          option.type === 'FLAT_RATE' ? 'bg-green-100 text-green-700' :
                          option.type === 'HOURLY' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {option.type === 'FLAT_RATE' ? 'Fixed Price' :
                           option.type === 'HOURLY' ? 'Hourly Rate' :
                           'Quote Required'}
                        </span>
                        <span>Duration: ~{option.duration} mins</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {option.price > 0 ? `${option.price} BHD` : 'Quote Required'}
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Service Selection Summary */}
      {selectedService && selectedPricingOptionId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Service Selected</p>
              <p className="text-green-800 text-sm mt-1">
                {selectedService.name} - {
                  selectedServicePricingOptions.find(o => o.id === selectedPricingOptionId)?.name
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

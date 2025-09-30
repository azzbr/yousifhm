'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { TIME_SLOTS } from '@/lib/validations'
import { getServiceBySlug, formatBHD } from '@/lib/mock-data'
import * as LucideIcons from 'lucide-react'

export function DateTimeStep() {
  const { watch, setValue, getValues } = useFormContext()
  const [availability, setAvailability] = useState<Record<string, boolean>>({})

  const selectedDate = watch('scheduledDate')
  const selectedTimeSlot = watch('timeSlot')
  const selectedServiceId = watch('serviceId')

  // Get service info for pricing estimate
  const selectedService = selectedServiceId ? getServiceBySlug(selectedServiceId.split('/').pop() || '') : null
  const selectedPricingOption = selectedService?.pricingOptions.find(o => o.id === getValues('pricingOptionId'))

  // Generate next 30 days for booking
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip Fridays (closed, only emergency) and past dates
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 5) continue // Skip Friday

      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const availableDates = generateAvailableDates()

  // Mock availability checker - in real app, this would be an API call
  const checkAvailability = (date: string, timeSlot: string) => {
    const key = `${date}-${timeSlot}`
    if (!(key in availability)) {
      // Simulate API call - 85% of slots available
      const isAvailable = Math.random() > 0.15
      setAvailability(prev => ({ ...prev, [key]: isAvailable }))
    }
    return availability[key] || false
  }

  const handleDateSelect = (date: string) => {
    setValue('scheduledDate', date)
    setValue('timeSlot', '') // Reset time slot when date changes
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setValue('timeSlot', timeSlot)
  }

  // Bahrain business hours (Sunday-Thursday: 8AM-6PM, Friday: closed/emergency)
  const isWeekend = (date: string) => {
    const day = new Date(date).getDay()
    return day === 5 || day === 6 // Friday or Saturday
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Your Service</h2>
        <p className="text-gray-600">
          Choose your preferred date and time. We'll confirm availability before finalizing.
        </p>
      </div>

      {/* Service Summary */}
      {selectedPricingOption && selectedService && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">{selectedService.name}</h3>
              <p className="text-sm text-blue-700">{selectedPricingOption.name}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">
                {selectedPricingOption.price > 0 ? `${selectedPricingOption.price} BHD` : 'Quote Required'}
              </div>
              <div className="text-sm text-blue-700">~{selectedPricingOption.duration} min</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2">
            {availableDates.map((date) => {
              const dateObj = new Date(date)
              const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
              const dateNum = dateObj.getDate()
              const month = dateObj.toLocaleDateString('en-US', { month: 'short' })

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 border rounded-lg text-center transition-all ${
                    selectedDate === date
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500">{day}</div>
                  <div className="text-lg font-bold text-gray-900">{dateNum}</div>
                  <div className="text-xs text-gray-500">{month}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
          {selectedDate ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {TIME_SLOTS.map((slot) => {
                const isAvailable = checkAvailability(selectedDate, slot)
                const isSelected = selectedTimeSlot === slot

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => isAvailable && handleTimeSlotSelect(slot)}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      !isAvailable
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isAvailable ? (
                          <LucideIcons.Clock className="w-4 h-4 text-blue-600" />
                        ) : (
                          <LucideIcons.X className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${!isAvailable ? 'line-through' : ''}`}>
                          {slot}
                        </span>
                      </div>
                      {isAvailable && (
                        <span className="text-sm text-green-600 font-medium">Available</span>
                      )}
                    </div>
                    {!isAvailable && (
                      <p className="text-xs text-gray-500 ml-7">Not available - select another time</p>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <LucideIcons.Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Select a date first</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedDate && selectedTimeSlot && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Appointment Scheduled</p>
              <p className="text-green-800 text-sm mt-1">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} at {selectedTimeSlot}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Business Hours Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LucideIcons.Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Business Hours</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sunday - Thursday: 8:00 AM - 6:00 PM</li>
              <li>• Friday: Closed (Emergency services available)</li>
              <li>• Saturday: Emergency services only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

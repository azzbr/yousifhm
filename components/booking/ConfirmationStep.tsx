'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Link from 'next/link'
import { getServiceBySlug, formatBHD } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'

interface ConfirmationStepProps {
  onSubmit: (data: any) => Promise<void>
}

export function ConfirmationStep({ onSubmit }: ConfirmationStepProps) {
  const { watch, register, formState: { errors }, getValues } = useFormContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = getValues() // Get all form data
      await onSubmit(formData) // Call the parent's onSubmit with form data
    } finally {
      setIsSubmitting(false)
    }
  }

  // Extract form data
  const serviceId = watch('serviceId')
  const pricingOptionId = watch('pricingOptionId')
  const scheduledDate = watch('scheduledDate')
  const timeSlot = watch('timeSlot')

  const address = watch('address')
  const contact = watch('contact')
  const details = watch('details')

  // Get service and pricing info
  const service = serviceId ? getServiceBySlug(serviceId.split('/').pop() || '') : null
  const pricingOption = service?.pricingOptions.find(o => o.id === pricingOptionId)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Your Booking</h2>
        <p className="text-gray-600">
          Please review all details below. Double-check your contact information and service address.
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="flex items-center gap-2 font-semibold text-blue-900 mb-4">
          <LucideIcons.Wrench className="w-5 h-5" />
          Service Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-blue-700">Service</p>
            <p className="font-medium text-blue-900">{service?.name}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Pricing Option</p>
            <p className="font-medium text-blue-900">{pricingOption?.name}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Date & Time</p>
            <p className="font-medium text-blue-900">
              {scheduledDate && new Date(scheduledDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              <br />
              {timeSlot}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Estimated Cost</p>
            <p className="font-medium text-blue-900">
              {pricingOption?.price ? formatBHD(pricingOption.price) : 'Quote Required'}
            </p>
          </div>
        </div>
      </div>

      {/* Address Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="flex items-center gap-2 font-semibold text-green-900 mb-4">
          <LucideIcons.MapPin className="w-5 h-5" />
          Service Address
        </h3>
        <div className="text-green-800">
          <p className="font-medium">
            {address?.type?.replace('_', ' ').toLowerCase()} • {address?.area}
          </p>
          <p>
            Block {address?.block} • {address?.road} • Building {address?.building}
            {address?.flat && ` • Flat ${address?.flat}`}
          </p>
          {address?.additionalInfo && (
            <p className="mt-1 text-sm italic">"{address.additionalInfo}"</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="flex items-center gap-2 font-semibold text-orange-900 mb-4">
          <LucideIcons.User className="w-5 h-5" />
          Contact Information
        </h3>
        <div className="text-orange-800">
          <p className="font-medium">
            {contact?.firstName} {contact?.lastName}
          </p>
          <p>📧 {contact?.email}</p>
          <p>📱 {contact?.phone}</p>
        </div>
      </div>

      {/* Additional Notes */}
      {(details?.notes || details?.emergency) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Special Notes</h3>
          {details?.emergency && (
            <p className="text-red-600 font-medium mb-2">🚨 EMERGENCY REPAIR REQUESTED</p>
          )}
          {details?.notes && (
            <p className="text-yellow-800 italic">"{details.notes}"</p>
          )}
        </div>
      )}

      {/* Terms & Conditions */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>

        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="text-sm">
              <span className="font-medium">I accept the terms and conditions *</span>
              <p className="text-gray-600 mt-1">
                I understand and agree to the 30-day workmanship guarantee and standard service terms.
                I authorize the technician to perform the requested services.
              </p>
            </div>
          </label>

          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{String(errors.acceptTerms.message)}</p>
          )}

          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <p className="font-medium mb-2">What's included:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Licensed professional technicians</li>
              <li>All necessary tools and equipment</li>
              <li>30-day workmanship guarantee</li>
              <li>Cleanup after service completion</li>
              <li>Clear communication throughout the process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notices */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
          <LucideIcons.AlertCircle className="w-5 h-5" />
          Important Information
        </h3>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• Technician will call you 30 minutes before arrival (standard charges apply)</li>
          <li>• Service time is estimated - complex repairs may take longer</li>
          <li>• Payment is due at service completion only</li>
          <li>• Cancellations need 24-hour notice</li>
        </ul>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-medium text-gray-900">{service?.name}</p>
            <p className="text-gray-600">{pricingOption?.name}</p>
            <p className="font-semibold text-blue-600 mt-1">
              {pricingOption?.price ? formatBHD(pricingOption.price) : 'Quote Required'}
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Schedule</p>
            <p className="text-gray-600">
              {scheduledDate && new Date(scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-gray-600">{timeSlot}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Location</p>
            <p className="text-gray-600">{address?.area}</p>
            <p className="text-gray-600">Block {address?.block}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            By submitting this booking, you consent to the service terms above.
            No payment required until service completion.
          </p>
        </div>
      </div>
    </div>
  )
}

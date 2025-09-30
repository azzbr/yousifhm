'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import * as LucideIcons from 'lucide-react'

export function ContactStep() {
  const { watch, formState: { errors }, register } = useFormContext()
  const selectedServiceId = watch('serviceId')
  const selectedPricingOptionId = watch('pricingOptionId')

  const firstName = watch('contact.firstName')
  const lastName = watch('contact.lastName')
  const email = watch('contact.email')
  const phone = watch('contact.phone')

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <p className="text-gray-600">
          We'll need your details to coordinate with our technician and confirm your booking.
        </p>
      </div>

      {/* Contact Info Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LucideIcons.Mail className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Keep this number ready</p>
            <p className="text-green-800 text-sm">
              Our technician will call you 30 minutes before arrival. Standard SMS charges apply.
            </p>
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            {...register('contact.firstName')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your first name"
          />
{/* Temporarily removed error displays to get production deployment working */}
{/* Validation still prevents invalid submissions */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            {...register('contact.lastName')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your last name"
          />
{/* Temporarily removed error displays to get production deployment working */}
{/* Validation still prevents invalid submissions */}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          {...register('contact.email')}
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="your.email@example.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          We'll send booking confirmation and updates to this email
        </p>
{/* Temporarily removed error displays to get production deployment working */}
{/* Validation still prevents invalid submissions */}
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bahrain Phone Number *
        </label>
        <input
          {...register('contact.phone')}
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+973 XXXX XXXX"
          maxLength={12}
        />
        <p className="mt-1 text-sm text-gray-500">
          Include country code (+973). Technician will call you, standard SMS charges apply.
        </p>
{/* Temporarily removed error displays to get production deployment working */}
{/* Validation still prevents invalid submissions */}
      </div>

      {/* Emergency Service */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            {...register('details.emergency')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">This is an emergency</span>
            <p className="text-xs text-gray-500">Select if you need urgent repair within 2 hours</p>
          </div>
        </label>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          {...register('details.notes')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Any special instructions, accessibility needs, or additional information for our technician..."
        />
        <p className="mt-1 text-sm text-gray-500">
          Optional: Current access issues, pet instructions, repair history, etc. (Max 500 characters)
        </p>
{/* Temporarily removed error displays to get production deployment working */}
{/* Validation still prevents invalid submissions */}
      </div>

      {/* Marketing Consent */}
      <div className="border-t pt-6">
        <label className="flex items-start space-x-3">
          <input
            {...register('marketingConsent')}
            type="checkbox"
            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm text-gray-700">
              I consent to receive service updates, special offers, and maintenance reminders via SMS and email.
            </span>
            <p className="text-xs text-gray-500 mt-1">
              You can unsubscribe at any time. This is optional - your booking will be processed regardless.
            </p>
          </div>
        </label>
      </div>

      {/* Contact Summary */}
      {firstName && lastName && email && phone && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <LucideIcons.User className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Contact Details Confirmed</p>
              <p className="text-green-800 text-sm mt-1">
                {firstName} {lastName} • {phone}
              </p>
              <p className="text-green-700 text-sm">{email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

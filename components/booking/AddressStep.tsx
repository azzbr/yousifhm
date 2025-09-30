'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { BAHRAIN_AREAS, ADDRESS_TYPES } from '@/lib/validations'
import * as LucideIcons from 'lucide-react'

export function AddressStep() {
  const { watch, setValue, formState: { errors }, register } = useFormContext()
  const addressType = watch('address.type')
  const selectedArea = watch('address.area')

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Address</h2>
        <p className="text-gray-600">
          Where would you like our technician to provide the service?
        </p>
      </div>

      {/* Address Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <LucideIcons.MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Service Location</p>
            <p className="text-sm text-blue-700">
              Let us know where to send our licensed technician. We'll arrive fully equipped with all necessary tools.
            </p>
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ADDRESS_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setValue('address.type', type.value)}
              className={`p-3 border rounded-lg text-center transition-all ${
                addressType === type.value
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
        {errors.address?.type && (
          <p className="mt-2 text-sm text-red-600">{String((errors.address.type as any)?.message)}</p>
        )}
      </div>

      {/* Service Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Service Area *
        </label>
        <select
          {...register('address.area')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your area in Bahrain</option>
          {BAHRAIN_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {errors.address?.area && (
          <p className="mt-2 text-sm text-red-600">{errors.address.area.message}</p>
        )}
      </div>

      {/* Address Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Block *
          </label>
          <input
            {...register('address.block')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 123"
          />
          {errors.address?.block && (
            <p className="mt-1 text-sm text-red-600">{errors.address.block.message}</p>
          )}
        </div>

        {/* Road */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Road/Street *
          </label>
          <input
            {...register('address.road')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Sunny Road"
          />
          {errors.address?.road && (
            <p className="mt-1 text-sm text-red-600">{errors.address.road.message}</p>
          )}
        </div>
      </div>

      {/* Building and Flat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Building */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Number *
          </label>
          <input
            {...register('address.building')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 456"
          />
          {errors.address?.building && (
            <p className="mt-1 text-sm text-red-600">{errors.address.building.message}</p>
          )}
        </div>

        {/* Flat (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flat/Suite Number
          </label>
          <input
            {...register('address.flat')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 12A (optional)"
          />
          {errors.address?.flat && (
            <p className="mt-1 text-sm text-red-600">{errors.address.flat.message}</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information
        </label>
        <textarea
          {...register('address.additionalInfo')}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Landmarks, parking instructions, special access details, etc..."
        />
        <p className="mt-2 text-sm text-gray-500">
          Help our technician find your location easily. Mention nearby landmarks, parking restrictions, or any special instructions.
        </p>
        {errors.address?.additionalInfo && (
          <p className="mt-1 text-sm text-red-600">{errors.address.additionalInfo.message}</p>
        )}
      </div>

      {/* Address Summary */}
      {addressType && selectedArea && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Service Address Confirmed</p>
              <p className="text-green-800 text-sm mt-1">
                {watch('address.type')?.replace('_', ' ').toLowerCase()} • {selectedArea} •
                Block {watch('address.block')} • Building {watch('address.building')}
                {watch('address.flat') && ` • Flat ${watch('address.flat')}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

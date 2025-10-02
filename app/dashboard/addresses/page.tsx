'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Briefcase,
  Star,
  CheckCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const addressSchema = z.object({
  type: z.enum(['HOME', 'OFFICE', 'OTHER']),
  area: z.string().min(1, 'Area is required'),
  block: z.string().min(1, 'Block is required'),
  road: z.string().min(1, 'Road is required'),
  building: z.string().min(1, 'Building is required'),
  flat: z.string().optional(),
  additionalInfo: z.string().optional(),
  isDefault: z.boolean().optional()
})

type AddressFormData = z.infer<typeof addressSchema>

interface Address {
  id: string
  type: 'HOME' | 'OFFICE' | 'OTHER'
  area: string
  block: string
  road: string
  building: string
  flat?: string
  additionalInfo?: string
  isDefault: boolean
  createdAt: string
}

const typeIcons = {
  HOME: Home,
  OFFICE: Briefcase,
  OTHER: MapPin
}

const typeLabels = {
  HOME: 'Home',
  OFFICE: 'Office',
  OTHER: 'Other'
}

export default function CustomerAddresses() {
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'HOME',
      isDefault: false
    }
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customer/addresses')

      if (!response.ok) {
        throw new Error('Failed to fetch addresses')
      }

      const data = await response.json()
      setAddresses(data.addresses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses')
      console.error('Addresses fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitAddress = async (data: AddressFormData) => {
    setSubmitting(true)
    try {
      const method = editingAddress ? 'PUT' : 'POST'
      const url = editingAddress
        ? `/api/customer/addresses/${editingAddress.id}`
        : '/api/customer/addresses'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save address')
      }

      const result = await response.json()

      // Refresh addresses list
      await fetchAddresses()

      // Reset form
      handleCancelForm()

      alert(editingAddress ? 'Address updated successfully!' : 'Address added successfully!')

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save address')
      console.error('Address save error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setValue('type', address.type)
    setValue('area', address.area)
    setValue('block', address.block)
    setValue('road', address.road)
    setValue('building', address.building)
    setValue('flat', address.flat || '')
    setValue('additionalInfo', address.additionalInfo || '')
    setValue('isDefault', address.isDefault)
    setShowForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const response = await fetch(`/api/customer/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete address')
      }

      // Refresh addresses list
      await fetchAddresses()
      alert('Address deleted successfully!')

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete address')
      console.error('Address delete error:', err)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/customer/addresses/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDefault: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to set default address')
      }

      // Refresh addresses list
      await fetchAddresses()
      alert('Default address updated!')

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update default address')
      console.error('Default address update error:', err)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingAddress(null)
    reset({
      type: 'HOME',
      isDefault: false
    })
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-600 mt-1">Manage your saved addresses for faster bookings</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </button>
          </div>
        </div>

        {/* Address Form (when adding/editing) */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-6">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Address Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'HOME', label: 'Home', icon: Home },
                    { value: 'OFFICE', label: 'Office', icon: Briefcase },
                    { value: 'OTHER', label: 'Other', icon: MapPin }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('type', value as any)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        watch('type') === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Bahrain Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area *
                  </label>
                  <input
                    {...register('area')}
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Manama, Seef, Adliya"
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-1">
                    Block *
                  </label>
                  <input
                    {...register('block')}
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 123"
                  />
                  {errors.block && (
                    <p className="mt-1 text-sm text-red-600">{errors.block.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="road" className="block text-sm font-medium text-gray-700 mb-1">
                    Road *
                  </label>
                  <input
                    {...register('road')}
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Al Fateh Highway"
                  />
                  {errors.road && (
                    <p className="mt-1 text-sm text-red-600">{errors.road.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                    Building *
                  </label>
                  <input
                    {...register('building')}
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 456"
                  />
                  {errors.building && (
                    <p className="mt-1 text-sm text-red-600">{errors.building.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="flat" className="block text-sm font-medium text-gray-700 mb-1">
                    Flat/Suite (Optional)
                  </label>
                  <input
                    {...register('flat')}
                    type="text"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Flat 5, Office 201"
                  />
                  {errors.flat && (
                    <p className="mt-1 text-sm text-red-600">{errors.flat.message}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Set as Default
                  </label>
                  <input
                    {...register('isDefault')}
                    type="checkbox"
                    className="ml-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Use as primary address</span>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information (Optional)
                </label>
                <textarea
                  {...register('additionalInfo')}
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Landmarks, special instructions, gate codes, etc."
                />
                {errors.additionalInfo && (
                  <p className="mt-1 text-sm text-red-600">{errors.additionalInfo.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingAddress ? 'Update' : 'Add'} Address
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && !showForm && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="h-5 w-5 text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading addresses</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchAddresses}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => {
              const TypeIcon = typeIcons[address.type]
              const typeLabel = typeLabels[address.type]

              return (
                <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-lg ${
                          address.type === 'HOME' ? 'bg-green-100' :
                          address.type === 'OFFICE' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          <TypeIcon className={`w-6 h-6 ${
                            address.type === 'HOME' ? 'text-green-600' :
                            address.type === 'OFFICE' ? 'text-blue-600' : 'text-purple-600'
                          }`} />
                        </div>
                      </div>

                      {/* Address Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">
                            {typeLabel}
                          </h3>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" fill="currentColor" />
                              Default
                            </span>
                          )}
                        </div>

                        <div className="text-gray-700 space-y-1">
                          <p>Building {address.building}, {address.road}</p>
                          <p>Block {address.block}, {address.area}</p>
                          {address.flat && (
                            <p>Flat/Suite: {address.flat}</p>
                          )}
                          {address.additionalInfo && (
                            <p className="text-sm text-gray-600 italic">
                              "{address.additionalInfo}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
                          title="Set as default"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </button>
                      )}

                      <button
                        onClick={() => handleEditAddress(address)}
                        className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
                        title="Edit address"
                      >
                        <Edit className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="inline-flex items-center px-2 py-1 text-xs border border-red-300 rounded text-red-700 bg-white hover:bg-red-50"
                        title="Delete address"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Save multiple addresses for faster booking. Your saved addresses are secure and only visible to you.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </button>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        {addresses.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Address Management Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Set a default address for quick selection during booking</li>
                  <li>• Save addresses for friends/family you frequently book for</li>
                  <li>• Include landmarks and special instructions for better service</li>
                  <li>• Your addresses are encrypted and secure</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

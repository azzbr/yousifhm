'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

import { bookingFormSchema, type BookingForm } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { ServiceSelectionStep } from '@/components/booking/ServiceSelectionStep'
import { DateTimeStep } from '@/components/booking/DateTimeStep'
import { AddressStep } from '@/components/booking/AddressStep'
import { ContactStep } from '@/components/booking/ContactStep'
import { ConfirmationStep } from '@/components/booking/ConfirmationStep'

const BOOKING_STEPS = [
  { id: 'service', label: 'Service', icon: LucideIcons.Search },
  { id: 'datetime', label: 'Date & Time', icon: LucideIcons.Calendar },
  { id: 'address', label: 'Address', icon: LucideIcons.MapPin },
  { id: 'contact', label: 'Contact', icon: LucideIcons.User },
  { id: 'confirm', label: 'Confirm', icon: LucideIcons.CheckCircle }
]

export default function GeneralBookingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<BookingForm>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onChange',
    defaultValues: {
      serviceId: '',
      pricingOptionId: '',
      scheduledDate: '',
      timeSlot: '',
      address: {
        type: 'HOME',
        area: '',
        block: '',
        road: '',
        building: '',
        additionalInfo: '',
      },
      contact: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      details: {
        notes: '',
        emergency: false,
      },
      acceptTerms: false,
      marketingConsent: false,
    }
  })

  const { handleSubmit, trigger, formState: { errors, isValid } } = methods

  const handleNext = async () => {
    const { getValues } = methods
    const values = getValues()

    // Check if required fields for current step are filled
    let isStepValid = false

    switch (currentStep) {
      case 0: // Service Selection
        isStepValid = !!(values.serviceId && values.pricingOptionId)
        break
      case 1: // Date & Time
        isStepValid = !!(values.scheduledDate && values.timeSlot)
        break
      case 2: // Address
        isStepValid = !!(values.address?.type && values.address?.area &&
                        values.address?.block && values.address?.road && values.address?.building)
        break
      case 3: // Contact
        isStepValid = !!(values.contact?.firstName && values.contact?.lastName &&
                        values.contact?.email && values.contact?.phone)
        break
      default:
        isStepValid = true
    }

    if (isStepValid) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true)
    try {
      console.log('Submitting booking to API:', data)

      // Call the actual API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking')
      }

      console.log('Booking created successfully:', result.booking)
      alert(`Booking created successfully! Reference: ${result.booking.reference}`)

      // Show success state
      setCurrentStep(BOOKING_STEPS.length)

    } catch (error) {
      console.error('Booking submission error:', error)
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error // Re-throw for ConfirmationStep error handling
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    const currentStepId = BOOKING_STEPS[currentStep].id

    switch (currentStepId) {
      case 'service':
        return <ServiceSelectionStep />
      case 'datetime':
        return <DateTimeStep />
      case 'address':
        return <AddressStep />
      case 'contact':
        return <ContactStep />
      case 'confirm':
        return <ConfirmationStep onSubmit={handleSubmit(onSubmit)} />
      default:
        return <ServiceSelectionStep />
    }
  }

  // Success state
  if (currentStep >= BOOKING_STEPS.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LucideIcons.CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Your booking has been submitted successfully. Our team will contact you shortly to confirm the details.
          </p>

          <div className="space-y-4">
            <Link href="/">
              <Button size="lg" className="w-full">
                Return to Home
              </Button>
            </Link>

            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full">
                View More Services
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📧 <strong>Email confirmation:</strong> Check your inbox for booking details<br/>
              📱 <strong>SMS confirmation:</strong> You'll receive a text message shortly
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book a Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional, licensed technicians. 30-day workmanship guarantee. Transparent pricing.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {BOOKING_STEPS.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${isCompleted ? 'bg-blue-600 text-white' : isCurrent ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 text-gray-400'}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium text-center ${
                    isCompleted ? 'text-blue-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {index < BOOKING_STEPS.length - 1 && (
                    <div className={`h-0.5 w-full mt-2 px-4 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Booking Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-8">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            {currentStep < BOOKING_STEPS.length && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <LucideIcons.ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < BOOKING_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <LucideIcons.ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <LucideIcons.CheckCircle className="w-4 h-4" />
                        Complete Booking
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </form>
        </FormProvider>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <LucideIcons.Shield className="w-4 h-4 text-green-500" />
              Licensed Professionals
            </span>
            <span className="flex items-center gap-2">
              <LucideIcons.CheckCircle className="w-4 h-4 text-blue-500" />
              30-Day Guarantee
            </span>
            <span className="flex items-center gap-2">
              <LucideIcons.Clock className="w-4 h-4 text-orange-500" />
              2-Hour Response Time
            </span>
            <span className="flex items-center gap-2">
              <LucideIcons.Star className="w-4 h-4 text-yellow-500" />
              4.9★ Customer Rating
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

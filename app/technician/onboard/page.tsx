'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import {
  Wrench,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileText,
  Shield,
  Car,
  Clock,
  MapPin,
  Star,
  Save
} from 'lucide-react'

const technicianSchema = z.object({
  // Account Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  // Professional Info
  experienceYears: z.number().min(0).max(50),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),

  // Certifications & Services
  certifications: z.array(z.string()).min(1, 'At least one certification required'),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area required'),

  // Skills & Specialties
  specialties: z.array(z.string()).min(1, 'At least one specialty required'),

  // Logistics
  hasVehicle: z.boolean(),
  canTravelOutsideCity: z.boolean().default(true),

  // Professional Agreements
  termsAccepted: z.boolean().refine(v => v === true, 'You must accept terms and conditions'),
  backgroundCheckConsent: z.boolean().refine(v => v === true, 'Background check consent is required')
})

type TechnicianFormData = z.infer<typeof technicianSchema>

const serviceOptions = [
  'Air Conditioning Repair',
  'Electrical Work',
  'Plumbing',
  'Carpentry',
  'Painting',
  'Appliance Repair',
  'Home Cleaning',
  'Garden Maintenance'
]

const bahrainAreas = [
  'Manama',
  'Seef',
  'Adliya',
  'Budaiya',
  'Riffa',
  'Muharraq',
  'Amwaj Islands',
  'Saar',
  'Hamala',
  'Juffair'
]

const StepIndicator = ({ step, currentStep }: { step: number; currentStep: number }) => (
  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
    step <= currentStep
      ? 'bg-blue-600 border-blue-600 text-white'
      : 'border-gray-300 text-gray-400'
  }`}>
    {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
  </div>
)

export default function TechnicianOnboard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      certifications: [],
      serviceAreas: [],
      specialties: [],
      hasVehicle: false,
      canTravelOutsideCity: true,
      termsAccepted: false,
      backgroundCheckConsent: false
    }
  })

  const watchedValues = watch()

  const toggleArrayValue = (field: 'certifications' | 'serviceAreas' | 'specialties', value: string) => {
    const currentValues = watch(field) || []
    if (currentValues.includes(value)) {
      setValue(field, currentValues.filter(v => v !== value))
    } else {
      setValue(field, [...currentValues, value])
    }
  }

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(['name', 'email', 'phone', 'password'])
      if (isValid) setCurrentStep(2)
    } else if (currentStep === 2) {
      const isValid = await trigger(['experienceYears', 'bio', 'certifications', 'serviceAreas'])
      if (isValid) setCurrentStep(3)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const onSubmit = async (data: TechnicianFormData) => {
    setLoading(true)
    console.log('Submitting technician data:', JSON.stringify(data, null, 2))

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Create user account
      const { name, email, phone, ...technicianData } = data
      const payload = {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        ...technicianData,
        status: 'UNDER_REVIEW' // New technicians start under review
      }
      console.log('Sending to API:', JSON.stringify(payload, null, 2))

      const userResponse = await fetch('/api/auth/register/technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('API Response status:', userResponse.status)
      const responseText = await userResponse.text()
      console.log('API Response text:', responseText)

      if (!userResponse.ok) {
        throw new Error(`API Error: ${userResponse.status} - ${responseText}`)
      }

      const result = JSON.parse(responseText)
      console.log('Success result:', result)

      alert('Account created successfully! Our team will review your application and contact you within 24-48 hours.')

      router.push('/technician/onboard/success')

    } catch (error) {
      console.error('Submission error:', error)
      alert(`Failed to create your account: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const steps = [
    { name: 'Account', description: 'Your details' },
    { name: 'Professional', description: 'Skills & experience' },
    { name: 'Documents', description: 'Verification' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Join Our Team</h1>
            <p className="text-gray-600 mt-2">Become a certified technician on Bahrain Handyman</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <StepIndicator step={index + 1} currentStep={currentStep} />
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < currentStep - 1 ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Account Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">Create Your Account</h2>
                <p className="text-gray-600 text-sm mt-1">We'll use this to verify and contact you</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+973 XXXX XXXX"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum 8 characters"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">Professional Details</h2>
                <p className="text-gray-600 text-sm mt-1">Tell us about your skills and experience</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    {...register('experienceYears', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 31 }, (_, i) => i).map(year => (
                      <option key={year} value={year}>{year} {year === 1 ? 'year' : 'years'}</option>
                    ))}
                  </select>
                  {errors.experienceYears && <p className="mt-1 text-sm text-red-600">{errors.experienceYears.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your experience, specializations, and why you're great at what you do..."
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
              </div>

              {/* Service Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Areas in Bahrain *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {bahrainAreas.map(area => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={area}
                        onChange={() => toggleArrayValue('serviceAreas', area)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
                {errors.serviceAreas && <p className="mt-1 text-sm text-red-600">{errors.serviceAreas.message}</p>}
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services You Provide *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {serviceOptions.map(service => (
                    <label key={service} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        value={service}
                        onChange={() => toggleArrayValue('specialties', service)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{service}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.specialties && <p className="mt-1 text-sm text-red-600">{errors.specialties.message}</p>}
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications & Licenses *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Licensed Electrician', 'Licensed Plumber', 'AC Technician Certified', 'Safety Training', 'Others'].map(cert => (
                    <label key={cert} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={cert}
                        onChange={() => toggleArrayValue('certifications', cert)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
                {errors.certifications && <p className="mt-1 text-sm text-red-600">{errors.certifications.message}</p>}
              </div>

              {/* Logistics */}
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    {...register('hasVehicle')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I have a service vehicle</span>
                    <p className="text-xs text-gray-500">Helps with larger jobs and client travel</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    {...register('canTravelOutsideCity')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I can travel outside my listed areas</span>
                    <p className="text-xs text-gray-500">For urgent jobs or special requests</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Documents & Agreements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">Verification & Agreements</h2>
                <p className="text-gray-600 text-sm mt-1">Upload your documents and accept our terms</p>
              </div>

              {/* Document Upload */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Required Documents</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      Please have these ready for upload. They'll be verified by our team before approval:
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Professional License/Certificates</li>
                      <li>Government ID (CPR/Card)</li>
                      <li>Proof of Address</li>
                      <li>Vehicle Documents (if applicable)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Documentation
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-600 mb-2">
                      Drag & drop files here, or{' '}
                      <button type="button" className="text-blue-600 hover:text-blue-700 underline" onClick={handleBrowseClick}>
                        browse files
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                  {/* File input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setUploadedFiles(prev => [...prev, ...files])
                    }}
                  />
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    {...register('termsAccepted')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I accept the terms and conditions *</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Including service agreements, payment terms, and professional conduct requirements
                    </p>
                  </div>
                </label>
                {errors.termsAccepted && <p className="text-xs text-red-600">{errors.termsAccepted.message}</p>}

                <label className="flex items-start space-x-3">
                  <input
                    {...register('backgroundCheckConsent')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I consent to background checking *</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Criminal record verification and professional credential validation
                    </p>
                  </div>
                </label>
                {errors.backgroundCheckConsent && <p className="text-xs text-red-600">{errors.backgroundCheckConsent.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Our team will review your application within 24-48 hours.
                We'll contact you once approved to start accepting jobs.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-3 rounded-lg font-medium ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next Step
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

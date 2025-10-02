'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react'

export default function TechnicianSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for applying to become a technician with Bahrain Handyman.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  Review Process
                </h3>
                <p className="text-sm text-blue-800">
                  Our team will review your application within 24-48 hours. We'll contact you
                  via email once your application is approved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Document verification by our team</li>
              <li>Background check processing</li>
              <li>Professional licensing verification</li>
              <li>Approval notification via email</li>
              <li>Access to technician dashboard and job assignments</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Need to make changes?
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              If you need to update your application or provide additional information,
              please reply to the confirmation email we'll send you.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 border-t pt-6 space-y-4">
          <Link href="/">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Back to Bahrain Handyman
            </button>
          </Link>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Questions about your application?
          </p>
          <p className="text-sm text-gray-600">
            Email: <span className="font-medium">support@bahrainhandyman.com</span>
          </p>
          <p className="text-sm text-gray-600">
            Phone: <span className="font-medium">+973 XXXXXXXX</span>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RevenueChart from '@/components/charts/RevenueChart'
import {
  BarChart3,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Filter,
  Download
} from 'lucide-react'

interface AnalyticsOverview {
  revenueGrowth: number
  bookingsCount: number
  activeTechnicians: number
  avgRating: number
  topService: string
  bestArea: string
}

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession()
  const [selectedPeriod, setSelectedPeriod] = useState('6months')

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      redirect('/auth/signin?callbackUrl=/admin/analytics')
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null // Will redirect
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="mt-2 text-gray-600">
            Insights to grow your handyman business in Bahrain
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 text-center">
        <div className="max-w-3xl mx-auto">
          <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Advanced Analytics Coming Soon!
          </h2>
          <p className="text-gray-600 mb-6">
            We're building powerful business intelligence tools to help you:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Revenue Trends</h3>
              <p className="text-sm text-gray-600">Track growth patterns and forecast future earnings</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <MapPin className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Market Insights</h3>
              <p className="text-sm text-gray-600">Understand demand by area and optimize coverage</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Team Performance</h3>
              <p className="text-sm text-gray-600">Monitor technician productivity and customer satisfaction</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">
              Expected features: Interactive charts, PDF reports, Real-time dashboards, Predictive analytics
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Meanwhile, check your live business metrics →
            </Link>
          </div>
        </div>
      </div>

      {/* Current Data Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-500">10.2% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-500">+3 new today</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Service</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-500">AC Repair</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Demand</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-500">Seef Area</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Active Charts & Coming Soon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart - LIVE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue & Bookings Trends</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <RevenueChart period={selectedPeriod} />
        </div>

        {/* Service Popularity Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Popularity</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Performance chart coming soon</p>
              <p className="text-sm text-gray-400">See which services perform best over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Roadmap */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Phase 1 ✅</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Foundation & Charts</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Chart.js integration</li>
              <li>• Analytics page structure</li>
              <li>• Basic API endpoints</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Phase 2 🔄</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Time-Based Trends</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Revenue growth charts</li>
              <li>• Service popularity tracking</li>
              <li>• Geographic demand analysis</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-900">Phase 3 📋</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Business Intelligence</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• PDF report generation</li>
              <li>• Custom date ranges</li>
              <li>• Executive dashboards</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Reach out to begin implementing these advanced analytics features! 📊
          </p>
        </div>
      </div>
    </div>
  )
}

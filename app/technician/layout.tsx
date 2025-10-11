'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Home,
  User,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Wrench
} from 'lucide-react'

const navigation = [
  { name: 'My Jobs', href: '/technician/dashboard', icon: Wrench },
  { name: 'Profile', href: '/technician/profile', icon: User },
  { name: 'History', href: '/technician/history', icon: Calendar },
  { name: 'Settings', href: '/technician/settings', icon: Settings },
]

export default function TechnicianLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin?callbackUrl=/technician/dashboard')
  }

  // If not authenticated as TECHNICIAN, redirect
  if ((session.user as any)?.role !== 'TECHNICIAN') {
    redirect('/auth/signin?callbackUrl=/technician/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width at 256px (w-64) */}
      <div className={`flex-shrink-0 w-64 fixed lg:relative inset-y-0 left-0 z-50 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bahrain Handyman</h1>
              <p className="text-sm text-gray-500">Technician Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info and sign out - At bottom like admin */}
        <div className="mt-auto p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session.user?.name?.charAt(0)?.toUpperCase() || 'T'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user?.name || 'Technician'}
              </p>
              <p className="text-xs text-gray-500">
                Field Technician
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content - Flex-1 fills remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Simple header - Not as complex as admin */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center ml-auto lg:ml-0">
              <div className="text-left lg:text-right">
                <p className="text-lg font-semibold text-gray-900">Technician Dashboard</p>
                <p className="text-sm text-gray-600">Manage your assigned jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-6 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

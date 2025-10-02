'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  User,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user || (session.user as any)?.role !== 'CLIENT') {
    return null
  }

  const userName = (session.user as any)?.name || 'Customer'
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex w-full md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block h-full w-full border-0 py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Dashboard - View your bookings and account"
                    type="search"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">{userName}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{userInitials}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">My Dashboard</h1>
        </div>
      </div>
      <div className="mt-8 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link
            href="/api/auth/signout"
            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Sign out
          </Link>
        </div>
      </div>
    </div>
  )
}

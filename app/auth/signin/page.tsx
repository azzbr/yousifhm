'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import Link from 'next/link'
import { User, UserCheck, Shield, Eye, EyeOff } from 'lucide-react'

type UserRole = 'customer' | 'technician' | 'admin'

interface RoleConfig {
  role: UserRole
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  demoEmail: string
  demoPassword: string
}

const roleConfigs: RoleConfig[] = [
  {
    role: 'customer',
    label: 'Customer',
    description: 'Book handyman services',
    icon: User,
    demoEmail: 'customer@bahraindemo.com',
    demoPassword: 'customer123'
  },
  {
    role: 'technician',
    label: 'Technician',
    description: 'Provide handyman services',
    icon: UserCheck,
    demoEmail: 'tech@bahraindemo.com',
    demoPassword: 'tech123'
  },
  {
    role: 'admin',
    label: 'Admin',
    description: 'Manage the platform',
    icon: Shield,
    demoEmail: 'admin@bahraindemo.com',
    demoPassword: 'admin123'
  }
]

export default function SignInPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDemoLogin = async (roleConfig: RoleConfig) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: roleConfig.demoEmail,
        password: roleConfig.demoPassword,
        role: roleConfig.role,
        redirect: false,
      })

      if (result?.error) {
        setError('Demo account not available. Please contact administrator.')
      } else {
        // Check session and redirect based on role
        const session = await getSession()
        if (session?.user) {
          const userRole = (session.user as any).role

          if (userRole === 'ADMIN') {
            router.push('/admin')
          } else if (userRole === 'TECHNICIAN') {
            router.push('/technician/dashboard')
          } else {
            router.push('/')
          }
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error('Demo login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: selectedRole,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials. Please check your email and password.')
      } else {
        // Check session and redirect based on role
        const session = await getSession()
        if (session?.user) {
          const userRole = (session.user as any).role

          if (userRole === 'ADMIN') {
            router.push('/admin')
          } else if (userRole === 'TECHNICIAN') {
            router.push('/technician/dashboard')
          } else {
            router.push('/')
          }
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to BahraSpanner
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your role to access the platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 gap-3">
            {roleConfigs.map((config) => {
              const Icon = config.icon
              return (
                <button
                  key={config.role}
                  onClick={() => setSelectedRole(config.role)}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedRole === config.role
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedRole === config.role ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        selectedRole === config.role ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{config.label}</div>
                      <div className="text-sm text-gray-600">{config.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleCustomLogin}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : `Sign in as ${roleConfigs.find(r => r.role === selectedRole)?.label}`}
            </button>
          </div>
        </form>

        {/* Demo Accounts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try Demo Accounts</h3>
          <div className="space-y-3">
            {roleConfigs.map((config) => (
              <button
                key={config.role}
                onClick={() => handleDemoLogin(config)}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <config.icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{config.label} Demo</div>
                    <div className="text-xs text-gray-600">{config.demoEmail}</div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-medium">Quick Login</span>
              </button>
            ))}
          </div>
        </div>

        {/* Registration Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {selectedRole === 'technician' ? (
              <>
                New technician?{' '}
                <Link href="/technician/onboard" className="font-medium text-blue-600 hover:text-blue-500">
                  Register here
                </Link>
              </>
            ) : selectedRole === 'customer' ? (
              <>
                Need an account?{' '}
                <span className="text-gray-500">(Registration coming soon)</span>
              </>
            ) : (
              <>
                Admin access requires platform invitation
              </>
            )}
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to BahraSpanner
          </Link>
        </div>
      </div>
    </div>
  )
}

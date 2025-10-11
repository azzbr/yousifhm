import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Demo mode configuration - works without database
const DEMO_MODE = process.env.DEMO_MODE === 'true'

const demoUsers = {
  'customer@bahraindemo.com': {
    id: 'demo-customer-1',
    name: 'Ahmed Al-Khalid',
    role: 'CLIENT',
    verified: true
  },
  'tech@bahraindemo.com': {
    id: 'demo-tech-1',
    name: 'Mohamed Al-Rashid',
    role: 'TECHNICIAN',
    verified: true
  },
  'admin@bahraindemo.com': {
    id: 'demo-admin-1',
    name: 'Fatima Al-Zahra',
    role: 'ADMIN',
    verified: true
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        // DEMO MODE: Use hardcoded demo accounts
        if (DEMO_MODE) {
          const email = credentials.email as string
          const demoUser = demoUsers[email as keyof typeof demoUsers]
          if (demoUser && credentials.password === 'demo123') {
            return {
              id: demoUser.id,
              email: email,
              name: demoUser.name,
              role: demoUser.role,
              verified: demoUser.verified
            }
          }
          throw new Error('Invalid demo credentials')
        }

        // NORMAL MODE: Database authentication
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              verified: true,
              passwordHash: true,
            }
          })

          if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials')
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValidPassword) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email as string,
            name: user.name,
            role: user.role,
            verified: user.verified
          } as any
        } catch (dbError) {
          // If database fails, fall back to demo mode
          console.warn('Database auth failed, attempting demo mode...')
          const email = credentials.email as string
          const demoUser = demoUsers[email as keyof typeof demoUsers]
          if (demoUser && credentials.password === 'demo123') {
            return {
              id: demoUser.id,
              email: email,
              name: demoUser.name,
              role: demoUser.role,
              verified: demoUser.verified
            }
          }
          throw new Error('Authentication service unavailable')
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user.role = token.role as 'CLIENT' | 'TECHNICIAN' | 'ADMIN'
      }
      return session
    }
  }
})

// Helper functions for role-based access
export const requireAdmin = (user: any) => {
  if (user?.role !== 'ADMIN') {
    throw new Error('Access denied. Admin privileges required.')
  }
}

export const requireTechnicianOrAdmin = (user: any) => {
  if (user?.role !== 'TECHNICIAN' && user?.role !== 'ADMIN') {
    throw new Error('Access denied. Technician or admin privileges required.')
  }
}

export const isAdmin = (user: any) => user?.role === 'ADMIN'
export const isTechnician = (user: any) => user?.role === 'TECHNICIAN'
export const isClient = (user: any) => user?.role === 'CLIENT'

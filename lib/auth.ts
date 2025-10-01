import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            technicianProfile: true,
            clientProfile: true
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
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified
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

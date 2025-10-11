'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isProtectedRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/technician')

  return (
    <div className="min-h-screen flex flex-col">
      {!isProtectedRoute && <Navigation />}
      <main className="flex-grow">
        {children}
      </main>
      {!isProtectedRoute && <Footer />}
    </div>
  )
}

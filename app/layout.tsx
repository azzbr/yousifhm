import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import SessionWrapper from '@/components/session-wrapper'
import ConditionalLayout from '@/components/conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Bahrain Handyman Services',
    template: '%s | Bahrain Handyman Services'
  },
  description: "Bahrain's most trusted handyman service. Licensed professionals with transparent pricing and 30-day workmanship guarantee.",
  keywords: ['handyman', 'Bahrain', 'maintenance', 'repair', 'construction', 'home services'],
  authors: [{ name: 'Bahrain Handyman Services' }],
  creator: 'Bahrain Handyman Services',
  publisher: 'Bahrain Handyman Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bahrainhandyman.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bahrainhandyman.com',
    title: 'Bahrain Handyman Services',
    description: "Bahrain's most trusted handyman service. Licensed professionals with transparent pricing.",
    siteName: 'Bahrain Handyman Services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bahrain Handyman Services',
    description: "Bahrain's most trusted handyman service. Licensed professionals with transparent pricing.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SessionWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SessionWrapper>
      </body>
    </html>
  )
}

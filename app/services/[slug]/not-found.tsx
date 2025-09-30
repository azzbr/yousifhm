import Link from 'next/link'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideIcons.AlertCircle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The service you're looking for doesn't exist or may have been updated.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/services">
            <Button size="lg">
              <LucideIcons.ArrowLeft className="w-4 h-4 mr-2" />
              View All Services
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="lg">
              <LucideIcons.Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

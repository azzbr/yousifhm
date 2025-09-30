import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { getServiceBySlug, serviceCategoryDisplay, formatBHD } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  // Get the icon dynamically from lucide-react
  const IconComponent = (LucideIcons as any)[service.icon] as React.ComponentType<{
    className?: string
    size?: number
  }>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/services" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to All Services
          </Link>
        </nav>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {IconComponent && (
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-8 h-8 text-blue-600" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {serviceCategoryDisplay[service.category as keyof typeof serviceCategoryDisplay] || service.category}
                </span>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <LucideIcons.Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Licensed & Insured</h3>
                <p className="text-sm text-gray-600">Certified professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <LucideIcons.Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-600">Emergency services available</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <LucideIcons.CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Satisfaction Guarantee</h3>
                <p className="text-sm text-gray-600">Job-done-right or money back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Options</h2>

          <div className="space-y-4">
            {service.pricingOptions.map((option, index) => (
              <div
                key={option.id}
                className={`border rounded-lg p-6 transition-all duration-200 ${
                  option.popular
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {option.name}
                      </h3>
                      {option.popular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{option.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {option.type === 'FLAT_RATE' ? 'Fixed Price' : option.type === 'HOURLY' ? 'Hourly Rate' : 'Quote Required'}
                      </span>
                      <span>•</span>
                      <span>Approx. {option.duration} minutes</span>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {option.price > 0 ? formatBHD(option.price) : 'Custom Quote'}
                    </div>
                    <Link href="/book/general">
                      <Button size="sm" className="w-full">
                        {option.type === 'QUOTE_REQUIRED' ? 'Request Quote' : 'Book Now'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included & Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* What's Included */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LucideIcons.CheckCircle className="w-5 h-5 text-green-600" />
              What's Included
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Professional licensed technician</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">All necessary tools and equipment</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Cleanup after job completion</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">30-day workmanship guarantee</span>
              </li>
            </ul>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LucideIcons.Play className="w-5 h-5 text-blue-600" />
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Book your service</h3>
                  <p className="text-sm text-gray-600">Select dates and provide details online</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Professional arrives</h3>
                  <p className="text-sm text-gray-600">Your technician comes fully equipped</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Job completed perfectly</h3>
                  <p className="text-sm text-gray-600">Quality work with satisfaction guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book {service.name}?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Professional service guaranteed. Licensed technicians, transparent pricing, satisfaction guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book/general">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <LucideIcons.Calendar className="w-4 h-4 mr-2" />
                Book Online Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <LucideIcons.Phone className="w-4 h-4 mr-2" />
              Call Us: +973 XXXXXXXX
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

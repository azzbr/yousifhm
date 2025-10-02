import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { getAllServices, serviceCategoryDisplay } from "@/lib/mock-data"
import Link from "next/link"
import * as LucideIcons from "lucide-react"

export default function HomePage() {
  // Get popular services (highest priority + most popular pricing)
  const allServices = getAllServices()
  const popularServices = allServices
    .filter(service =>
      service.pricingOptions.some(option => option.popular) ||
      service.priority > 90
    )
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bahrain's Most Trusted
            <span className="text-blue-600 block">Handyman Service</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Vetted Professionals, Transparent Pricing, Job-Done-Right Guarantee
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Background-Checked Technicians</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-700">500+ Happy Customers</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book/general">
              <Button size="lg" className="px-8 py-4 text-lg">
                Book a Service Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Jobs Completed This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9☆</div>
              <div className="text-gray-600">Average Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2hrs</div>
              <div className="text-gray-600">Average Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Most Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by over 500 Bahrain homeowners. Professional, reliable, and guaranteed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View All Services
                <LucideIcons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real feedback from Bahraini homeowners who trust us with their homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <LucideIcons.Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Amazing service! The AC technician arrived on time and cleaned everything perfectly. Very professional and explained everything. Will definitely use again."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <LucideIcons.User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Fatima Al Zayed</div>
                  <div className="text-sm text-gray-600">Manama, Bahrain</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <LucideIcons.Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Needed urgent plumbing repair. Called them at 8 PM and technician arrived within an hour. Fixed the issue and cleaned up perfectly. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <LucideIcons.User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Ahmed Abdul Rahman</div>
                  <div className="text-sm text-gray-600">Riffa, Bahrain</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <LucideIcons.Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Had electrical work done in my villa. Very professional team, got background checked certificate before work. Transparent pricing, no hidden costs."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 text-blue-600">MA</div>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Maryam Abdullah</div>
                  <div className="text-sm text-gray-600">Amwaj Islands, Bahrain</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Join over 500 satisfied customers</p>
            <Link href="/book/general">
              <Button size="lg" className="px-8 py-3">
                Book Your Service Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us + Technician Recruitment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Bahrain Handyman?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join our trusted community of professionals and homeowners in Bahrain.
            </p>
          </div>

          {/* For Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LucideIcons.User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Homeowners</h3>
                <p className="text-gray-600">Need professional handyman services?</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Licensed & background-checked technicians</span>
                </div>
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Transparent pricing, no hidden fees</span>
                </div>
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Insured work with workmanship guarantee</span>
                </div>
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Average 2-hour response time</span>
                </div>
              </div>

              <Link href="/book/general">
                <Button className="w-full">
                  Book a Service Now
                </Button>
              </Link>
            </div>

            {/* For Technicians */}
            <div className="bg-white rounded-lg shadow-sm p-8 border-2 border-orange-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LucideIcons.Wrench className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Professionals</h3>
                <p className="text-gray-600">Want to join Bahrain's top handyman network?</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Consistent job requests from vetted customers</span>
                </div>
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Professional platform with built-in marketing</span>
                </div>
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Competitive rates with direct customer payments</span>
                </div>
                <div className="flex items-start">
                  <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Work on your schedule, set your availability</span>
                </div>
              </div>

              <Link href="/technician/onboard">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent process from booking to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcons.Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Choose Service</h3>
              <p className="text-gray-600">
                Browse our services or contact us to find exactly what you need.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcons.Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Book Appointment</h3>
              <p className="text-gray-600">
                Schedule at your convenience with our easy online booking system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcons.Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Professional Service</h3>
              <p className="text-gray-600">
                Licensed technicians arrive on time and complete job professionally.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcons.CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                Job-done-right guarantee. Money back if not completely satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Professional Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied Bahrain homeowners. Professional, reliable, guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <LucideIcons.Phone className="w-5 h-5 mr-2" />
              Call Now: +973 XXXXXXXX
            </Button>

            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                <LucideIcons.Search className="w-5 h-5 mr-2" />
                Browse Services
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-blue-100 text-sm">
            Emergency repairs available 24/7 • Response within 2 hours
          </p>
        </div>
      </section>
    </div>
  )
}

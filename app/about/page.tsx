import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

const AboutPage = () => {
  const currentYear = new Date().getFullYear()
  const yearsInBusiness = currentYear - 2019 // You can adjust this

  const stats = [
    { label: 'Years in Business', value: yearsInBusiness },
    { label: 'Happy Customers', value: '500+' },
    { label: 'Licensed Technicians', value: '25+' },
    { label: 'Service Areas', value: '10+' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Bahrain Handyman Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bahrain's most trusted handyman service. Licensed professionals delivering reliable, transparent home repairs
            with a focus on your complete satisfaction.
          </p>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story: Solving Bahrain's Handyman Challenge
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Bahrain Handyman Services was founded with a simple mission: to address the growing "professionalism deficit"
                  in Bahrain's home repair market. We recognized that while home maintenance needs were increasing, finding
                  reliable, licensed professionals was becoming increasingly difficult.
                </p>

                <p>
                  Our founder, a Bahrain native with over 15 years in the construction industry, experienced firsthand the
                  challenges of finding trustworthy tradespeople for their own home. This personal frustration led to the
                  creation of Bahrain's most trusted handyman service.
                </p>

                <p>
                  Today, we serve over 500 satisfied Bahraini families, from luxury villas in Saar to apartments in Manama.
                  Every technician is licensed, insured, and background-checked. We maintain transparent pricing with no
                  hidden fees and provide a 30-day workmanship guarantee on all services.
                </p>
              </div>
            </div>

            <div className="lg:text-center">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LucideIcons.Target className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become Bahrain's most trusted provider of home repair services, setting the standard for
                  professionalism, transparency, and customer satisfaction in every community we serve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Licensed & Insured</h3>
              <p className="text-gray-600">
                All our technicians are fully licensed and insured. We carry comprehensive liability insurance for your protection.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees or surprise charges. You know exactly what to expect before booking and paying.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Response</h3>
              <p className="text-gray-600">
                Most jobs completed same-day. Emergency repairs within 2 hours. We value your time as much as our own.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Community Focus</h3>
              <p className="text-gray-600">
                Born and raised in Bahrain, we understand local needs and cultural preferences. We're building Bahraini futures.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guarantee</h3>
              <p className="text-gray-600">
                30-day workmanship guarantee on all repairs. We're not happy until you're completely satisfied.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <LucideIcons.Heart className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer-Centric</h3>
              <p className="text-gray-600">
                Every decision we make prioritizes your satisfaction. You're not just a customer—you're part of our Bahrain family.
              </p>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="mb-16">
          <div className="bg-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Serving All Bahrain Communities
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
              {[
                'Manama', 'Saar', 'Hamala', 'Mina Salman',
                'Budaiya', 'Riffa', 'Muharraq', 'Juffair',
                'Seef', 'Adliya'
              ].map((area) => (
                <div key={area} className="space-y-1">
                  <div className="w-2 h-2 bg-white rounded-full mx-auto"></div>
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-blue-100 text-lg">
                From luxury villas in Saar to apartments in Manama, we serve proudly
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Experience the Difference Today
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied Bahrain homeowners who trust us with their most precious asset—their home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="px-8 py-3">
                <LucideIcons.Search className="w-4 h-4 mr-2" />
                Browse Our Services
              </Button>
            </Link>

            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-3">
                <LucideIcons.MessageSquare className="w-4 h-4 mr-2" />
                Get In Touch
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage

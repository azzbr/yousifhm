import React from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const serviceAreas = [
    'Manama',
    'Saar',
    'Hamala',
    'Mina Salman',
    'Budaiya',
    'Riffa',
    'Muharraq',
    'Juffair',
    'Seef',
    'Adliya',
  ]

  const footerLinks = {
    services: [
      { label: 'AC Services', href: '/services/ac-services' },
      { label: 'Plumbing', href: '/services/plumbing' },
      { label: 'Electrical', href: '/services/electrical' },
      { label: 'Carpentry', href: '/services/carpentry' },
      { label: 'Painting', href: '/services/painting' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Technicians', href: '/technicians' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Booking Guide', href: '/booking-guide' },
      { label: 'Payment Options', href: '/payment' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LucideIcons.Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Bahrain Handyman</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Bahrain's most trusted handyman service. Licensed professionals with transparent pricing and guaranteed satisfaction.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LucideIcons.Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Emergency Support</p>
                  <p className="text-gray-300">+973 XXXXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LucideIcons.Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-gray-300">info@bahrainhandyman.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LucideIcons.Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Business Hours</p>
                  <p className="text-gray-300">Sun-Thu: 8AM-6PM</p>
                  <p className="text-gray-300 pl-8">Fri: 2PM-8PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <div className="grid grid-cols-2 gap-1">
              {serviceAreas.map((area) => (
                <span key={area} className="text-gray-300 text-sm">
                  • {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <LucideIcons.Shield className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-medium">Licensed & Insured</div>
                <div className="text-sm text-gray-300">Full regulatory compliance</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LucideIcons.Users className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-medium">Background Checked</div>
                <div className="text-sm text-gray-300">Verified professionals</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LucideIcons.ThumbsUp className="w-6 h-6 text-orange-400" />
              <div>
                <div className="font-medium">Satisfaction Guaranteed</div>
                <div className="text-sm text-gray-300">Job done right or money back</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-sm">
              © {currentYear} Bahrain Handyman Services. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <span className="text-gray-500">•</span>

              {/* Social Media (Placeholder) */}
              <div className="flex items-center gap-3">
                <LucideIcons.Facebook className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <LucideIcons.Instagram className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <LucideIcons.Twitter className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

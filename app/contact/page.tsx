import React from 'react'
import { Button } from '@/components/ui/button'
import * as LucideIcons from 'lucide-react'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch for free estimates, emergency repairs, or general inquiries.
            We're here to help with all your home repair needs in Bahrain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LucideIcons.Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Emergency Support</h3>
                    <p className="text-gray-600">24/7 Emergency Repairs</p>
                    <p className="text-lg font-semibold text-blue-600">+973 XXXXXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LucideIcons.Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">General inquiries & quotes</p>
                    <p className="text-lg font-semibold text-blue-600">info@bahrainhandyman.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LucideIcons.MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Service Areas</h3>
                    <p className="text-gray-600">Serving all Bahrain communities</p>
                    <p className="text-sm text-gray-500">Manama • Saar • Riffa • Muharraq • Budaiya • And more</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LucideIcons.Clock className="w-5 h-5 text-blue-600" />
                Business Hours
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sunday - Thursday</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Friday</span>
                  <span className="font-medium">2:00 PM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">Emergency Only</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <LucideIcons.Zap className="w-4 h-4" />
                  <strong>Emergency repairs available 24/7</strong>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
              <h3 className="font-bold mb-4">Why Choose Us?</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <LucideIcons.Shield className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Licensed & Insured Professionals</span>
                </div>
                <div className="flex items-center gap-3">
                  <LucideIcons.CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">30-Day Workmanship Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <LucideIcons.Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Response within 2 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+973 XXXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Needed *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select a service</option>
                    <option value="ac-services">AC Services</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="appliance-repair">Appliance Repair</option>
                    <option value="outdoor-maintenance">Outdoor Maintenance</option>
                    <option value="general-handyman">General Handyman</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe your repair needs, preferred dates, and any specific details..."
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button type="submit" size="lg" className="px-8 py-3">
                    <LucideIcons.Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you provide estimates?</h3>
              <p className="text-gray-600">Yes! All services include free, detailed estimates before any work begins.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How quickly can you respond?</h3>
              <p className="text-gray-600">Most jobs scheduled within 24 hours. Emergency repairs within 2 hours.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you work weekends?</h3>
              <p className="text-gray-600">Limited weekend service available. Emergency repairs available 24/7.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods accepted?</h3>
              <p className="text-gray-600">Cash, Benefit Pay, and bank transfer. Pay only after service completion.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ContactPage

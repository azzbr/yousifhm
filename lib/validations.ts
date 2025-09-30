import { z } from 'zod'

// Service selection validation
export const serviceSelectionSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  pricingOptionId: z.string().min(1, 'Please select a pricing option'),
})

// Date and time selection validation
export const dateTimeSchema = z.object({
  scheduledDate: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
})

// Address information validation
export const addressSchema = z.object({
  type: z.enum(['HOME', 'VILLA', 'OFFICE', 'APARTMENT'], {
    errorMap: () => ({ message: 'Please select address type' })
  }),
  area: z.string().min(1, 'Please select a service area'),
  block: z.string().min(1, 'Block number is required'),
  road: z.string().min(1, 'Road name/number is required'),
  building: z.string().min(1, 'Building name/number is required'),
  flat: z.string().optional(),
  additionalInfo: z.string().optional(),
  useExistingAddress: z.boolean().optional(),
  existingAddressId: z.string().optional(),
})

// Contact information validation
export const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+973)?[0-9]{8}$/, 'Please enter a valid Bahrain phone number (+973 XXXX XXXX)'),
})

// Additional booking details
export const bookingDetailsSchema = z.object({
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  emergency: z.boolean().optional(),
})

// Complete booking form validation
export const bookingFormSchema = z.object({
  // Step 1: Service & Pricing
  serviceId: z.string().min(1, 'Service selection is required'),
  pricingOptionId: z.string().min(1, 'Pricing option selection is required'),

  // Step 2: Date & Time
  scheduledDate: z.string().min(1, 'Date selection is required'),
  timeSlot: z.string().min(1, 'Time slot selection is required'),

  // Step 3: Address
  address: addressSchema,

  // Step 4: Contact Info
  contact: contactSchema,

  // Additional details
  details: bookingDetailsSchema.optional(),

  // Terms acceptance
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),

  // Marketing consent (optional)
  marketingConsent: z.boolean().optional(),
})

// Type exports
export type ServiceSelectionForm = z.infer<typeof serviceSelectionSchema>
export type DateTimeForm = z.infer<typeof dateTimeSchema>
export type AddressForm = z.infer<typeof addressSchema>
export type ContactForm = z.infer<typeof contactSchema>
export type BookingDetailsForm = z.infer<typeof bookingDetailsSchema>
export type BookingForm = z.infer<typeof bookingFormSchema>

// Bahrain service area options
export const BAHRAIN_AREAS = [
  'Manama',
  'Saar',
  'Hamala',
  'Mina Salman',
  'Budaiya',
  'Riffa',
  'Muharraq',
  'Juffair',
  'Seef',
  'Adliya'
] as const

// Address type options
export const ADDRESS_TYPES = [
  { value: 'HOME', label: 'Home' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'APARTMENT', label: 'Apartment' }
] as const

// Time slot options (based on Bahrain working hours)
export const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00 (Fri)',
  '15:00 - 16:00 (Fri)',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00 (Fri)',
  '19:00 - 20:00 (Fri)'
] as const

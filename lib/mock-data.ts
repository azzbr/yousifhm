// Mock data for services - to be replaced with real database data
export const mockServices = [
  {
    id: 'ac-services',
    name: 'Air Conditioning Services',
    slug: 'ac-services',
    category: 'AC_SERVICES',
    description: 'Complete AC repair, maintenance, and installation services for all major brands. Professional technicians with certified repairs.',
    icon: 'Snowflake',
    priority: 100,
    active: true,
    pricingOptions: [
      {
        id: 'ac-maintenance-basic',
        serviceId: 'ac-services',
        name: 'Standard AC Cleaning',
        type: 'FLAT_RATE' as const,
        price: 5.00,
        duration: 120,
        description: 'Complete cleaning of filters, coils, and drain pan. Performance check.',
        popular: true
      },
      {
        id: 'ac-repair-diagnosis',
        serviceId: 'ac-services',
        name: 'AC Diagnosis & Repair',
        type: 'FLAT_RATE' as const,
        price: 10.00,
        duration: 60,
        description: 'Diagnostic inspection and repair services',
        popular: false
      },
      {
        id: 'ac-installation-1hp',
        serviceId: 'ac-services',
        name: 'AC Unit Installation (1HP)',
        type: 'FLAT_RATE' as const,
        price: 15.00,
        duration: 180,
        description: 'Complete installation of new 1HP air conditioning unit',
        popular: false
      }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    slug: 'plumbing',
    category: 'PLUMBING',
    description: 'Emergency plumbing repairs, installations, and maintenance. Water heater repairs, pipe replacements, and much more.',
    icon: 'Droplets',
    priority: 95,
    active: true,
    pricingOptions: [
      {
        id: 'plumbing-emergency',
        serviceId: 'plumbing',
        name: 'Emergency Plumbing Call',
        type: 'FLAT_RATE' as const,
        price: 10.00,
        duration: 60,
        description: 'Emergency repairs for leaks, clogs, and water damage',
        popular: true
      },
      {
        id: 'plumbing-tap-installation',
        serviceId: 'plumbing',
        name: 'Tap Installation/Repair',
        type: 'FLAT_RATE' as const,
        price: 5.00,
        duration: 45,
        description: 'Installation or repair of kitchen/bathroom taps',
        popular: false
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    slug: 'electrical',
    category: 'ELECTRICAL',
    description: 'Licensed electricians for all residential and commercial electrical needs. Safety certified and insured.',
    icon: 'Zap',
    priority: 98,
    active: true,
    pricingOptions: [
      {
        id: 'electrical-outlet-installation',
        serviceId: 'electrical',
        name: 'Outlet Installation',
        type: 'FLAT_RATE' as const,
        price: 5.00,
        duration: 60,
        description: 'New electrical outlet installation',
        popular: false
      },
      {
        id: 'electrical-wiring-inspection',
        serviceId: 'electrical',
        name: 'Electrical Wiring Inspection',
        type: 'FLAT_RATE' as const,
        price: 15.00,
        duration: 90,
        description: 'Complete home electrical safety inspection',
        popular: true
      }
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry Services',
    slug: 'carpentry',
    category: 'CARPENTRY',
    description: 'Custom furniture, cabinetry installation, door repairs, and general woodwork.',
    icon: 'Hammer',
    priority: 85,
    active: true,
    pricingOptions: [
      {
        id: 'carpentry-door-installation',
        serviceId: 'carpentry',
        name: 'Door Installation/Repair',
        type: 'FLAT_RATE' as const,
        price: 10.00,
        duration: 120,
        description: 'Complete door installation or repair',
        popular: false
      },
      {
        id: 'carpentry-custom-work',
        serviceId: 'carpentry',
        name: 'Custom Carpentry Work',
        type: 'FLAT_RATE' as const,
        price: 15.00,
        duration: 60,
        description: 'Custom woodworking and installation services',
        popular: false
      }
    ]
  },
  {
    id: 'painting',
    name: 'Painting Services',
    slug: 'painting',
    category: 'PAINTING',
    description: 'Professional painting services for interior and exterior. Premium paints and expert application.',
    icon: 'PaintBucket',
    priority: 80,
    active: true,
    pricingOptions: [
      {
        id: 'painting-room-interior',
        serviceId: 'painting',
        name: 'Interior Room Painting',
        type: 'QUOTE_REQUIRED' as const,
        price: 0,
        duration: 240,
        description: 'Complete room painting with premium paint materials',
        popular: true
      },
      {
        id: 'painting-touch-up',
        serviceId: 'painting',
        name: 'Paint Touch-up',
        type: 'FLAT_RATE' as const,
        price: 5.00,
        duration: 30,
        description: 'Small touch-up and repair work',
        popular: false
      }
    ]
  },
  {
    id: 'appliance-repair',
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    category: 'APPLIANCE_REPAIR',
    description: 'Expert repair services for all major home appliances. Factory-trained technicians.',
    icon: 'Wrench',
    priority: 70,
    active: true,
    pricingOptions: [
      {
        id: 'appliance-washing-machine',
        serviceId: 'appliance-repair',
        name: 'Washing Machine Repair',
        type: 'FLAT_RATE' as const,
        price: 10.00,
        duration: 90,
        description: 'Diagnosis and repair service',
        popular: false
      },
      {
        id: 'appliance-refrigerator',
        serviceId: 'appliance-repair',
        name: 'Refrigerator Repair',
        type: 'FLAT_RATE' as const,
        price: 15.00,
        duration: 120,
        description: 'Fridge/freezer diagnosis and repair',
        popular: false
      }
    ]
  },
  {
    id: 'outdoor-maintenance',
    name: 'Outdoor Maintenance',
    slug: 'outdoor-maintenance',
    category: 'OUTDOOR_MAINTENANCE',
    description: 'Garden care, landscaping, fencing, and outdoor space maintenance services.',
    icon: 'Trees',
    priority: 60,
    active: true,
    pricingOptions: [
      {
        id: 'outdoor-garden-care',
        serviceId: 'outdoor-maintenance',
        name: 'Garden Maintenance Package',
        type: 'FLAT_RATE' as const,
        price: 10.00,
        duration: 180,
        description: 'Complete garden pruning, cleanup, and maintenance',
        popular: true
      }
    ]
  },
  {
    id: 'general-handyman',
    name: 'General Handyman',
    slug: 'general-handyman',
    category: 'GENERAL_HANDYMAN',
    description: 'General repairs and maintenance around your home. Our experienced technicians handle everything.',
    icon: 'Settings',
    priority: 50,
    active: true,
    pricingOptions: [
      {
        id: 'handyman-hourly',
        serviceId: 'general-handyman',
        name: 'General Handyman Services',
        type: 'HOURLY' as const,
        price: 5.00,
        duration: 60,
        description: 'General repairs, assembly, and maintenance work',
        popular: true
      }
    ]
  }
]

// Helper functions for working with mock data
export const getAllServices = () => mockServices.filter(service => service.active)

export const getServiceBySlug = (slug: string) =>
  mockServices.find(service => service.slug === slug)

export const getServicesByCategory = (category: string) =>
  mockServices.filter(service => service.category === category && service.active)

export const formatBHD = (amount: number): string => {
  return `BHD ${amount.toFixed(3)}`
}

// Service category display names
export const serviceCategoryDisplay = {
  AC_SERVICES: 'Air Conditioning',
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  CARPENTRY: 'Carpentry',
  PAINTING: 'Painting',
  APPLIANCE_REPAIR: 'Appliance Repair',
  OUTDOOR_MAINTENANCE: 'Outdoor Maintenance',
  GENERAL_HANDYMAN: 'General Handyman'
}

Complete Website Development Plan & Technical Blueprint
Bahrain Handyman Services Platform
Since you're a full-stack developer, I'll provide you with a comprehensive technical specification, architecture decisions, implementation timeline, and development prompts you can use immediately.

1. TECHNICAL STACK RECOMMENDATION
Frontend

Framework: React 18+ with TypeScript
Styling: Tailwind CSS (critical for fast development & mobile-first)
State Management: React Query + Zustand
Form Handling: React Hook Form + Zod validation
UI Components: shadcn/ui (customizable, accessible)
Maps: Google Maps API (for service area selection)
Calendar: react-big-calendar or FullCalendar
Image Optimization: Next.js Image component

Backend

Framework: Node.js with Express OR Next.js API routes (recommended for full-stack simplicity)
Database: PostgreSQL (production-ready, supports complex queries)
ORM: Prisma (type-safe, excellent DX)
Authentication: NextAuth.js or Clerk
File Storage: AWS S3 or Cloudflare R2
Email: SendGrid or Resend
SMS: Twilio (for appointment confirmations in Bahrain)

Infrastructure

Hosting: Vercel (Next.js) or Railway/Render (Node.js)
Database: Railway PostgreSQL or Supabase
CDN: Cloudflare
Monitoring: Sentry for error tracking
Analytics: Plausible or Google Analytics 4

Payment Gateway

Primary: Benefit Pay (Bahrain standard) or Credimax
Alternative: Stripe (international cards)


2. DATABASE SCHEMA DESIGN
prisma// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String    @unique
  name          String
  role          UserRole  @default(CLIENT)
  passwordHash  String
  verified      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  clientProfile    ClientProfile?
  technicianProfile TechnicianProfile?
  bookings         Booking[]
  reviews          Review[]
}

enum UserRole {
  CLIENT
  TECHNICIAN
  ADMIN
}

model ClientProfile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  
  addresses Address[]
  favoriteServices Service[]
}

model TechnicianProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  bio             String
  photo           String
  experienceYears Int
  certifications  String[]
  backgroundCheck Boolean  @default(false)
  rating          Float    @default(0)
  completedJobs   Int      @default(0)
  verified        Boolean  @default(false)
  
  specialties     Service[]
  bookings        Booking[]
  availability    TechnicianAvailability[]
}

model Service {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  category    ServiceCategory
  description String
  icon        String
  priority    Int      @default(0)
  active      Boolean  @default(true)
  
  pricingOptions PricingOption[]
  bookings       Booking[]
}

enum ServiceCategory {
  AC_SERVICES
  PLUMBING
  ELECTRICAL
  CARPENTRY
  PAINTING
  APPLIANCE_REPAIR
  OUTDOOR_MAINTENANCE
  GENERAL_HANDYMAN
}

model PricingOption {
  id          String      @id @default(cuid())
  serviceId   String
  service     Service     @relation(fields: [serviceId], references: [id])
  
  name        String      // e.g., "Standard AC Cleaning"
  type        PricingType
  price       Float       // in BHD
  duration    Int         // estimated minutes
  description String
  popular     Boolean     @default(false)
}

enum PricingType {
  FLAT_RATE
  HOURLY
  QUOTE_REQUIRED
}

model Booking {
  id              String        @id @default(cuid())
  bookingNumber   String        @unique
  
  clientId        String
  client          User          @relation(fields: [clientId], references: [id])
  
  technicianId    String?
  technician      TechnicianProfile? @relation(fields: [technicianId], references: [id])
  
  serviceId       String
  service         Service       @relation(fields: [serviceId], references: [id])
  
  pricingOptionId String?
  
  status          BookingStatus @default(PENDING)
  scheduledDate   DateTime
  timeSlot        String        // e.g., "09:00-11:00"
  
  addressId       String
  address         Address       @relation(fields: [addressId], references: [id])
  
  estimatedPrice  Float?
  finalPrice      Float?
  
  notes           String?
  internalNotes   String?       // Admin/technician only
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  completedAt     DateTime?
  
  payment         Payment?
  review          Review?
}

enum BookingStatus {
  PENDING
  CONFIRMED
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  REFUNDED
}

model Address {
  id          String   @id @default(cuid())
  clientId    String
  client      ClientProfile @relation(fields: [clientId], references: [id])
  
  type        String   // Home, Villa, Office
  area        String   // Saar, Hamala, Amwaj, etc.
  block       String
  road        String
  building    String
  flat        String?
  additionalInfo String?
  
  lat         Float?
  lng         Float?
  
  isDefault   Boolean  @default(false)
  
  bookings    Booking[]
}

model Payment {
  id          String        @id @default(cuid())
  bookingId   String        @unique
  booking     Booking       @relation(fields: [bookingId], references: [id])
  
  amount      Float
  method      PaymentMethod
  status      PaymentStatus
  
  transactionId String?
  paidAt        DateTime?
  
  createdAt   DateTime      @default(now())
}

enum PaymentMethod {
  CASH
  BENEFIT_PAY
  CARD
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model Review {
  id          String   @id @default(cuid())
  bookingId   String   @unique
  booking     Booking  @relation(fields: [bookingId], references: [id])
  
  clientId    String
  client      User     @relation(fields: [clientId], references: [id])
  
  rating      Int      // 1-5
  comment     String?
  photos      String[]
  
  published   Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model TechnicianAvailability {
  id            String   @id @default(cuid())
  technicianId  String
  technician    TechnicianProfile @relation(fields: [technicianId], references: [id])
  
  date          DateTime @db.Date
  timeSlots     String[] // ["09:00-11:00", "11:00-13:00", etc.]
  isAvailable   Boolean  @default(true)
}

model AMCContract {
  id          String   @id @default(cuid())
  clientId    String
  
  tier        AMCTier
  startDate   DateTime
  endDate     DateTime
  
  price       Float
  services    String[] // Array of service IDs included
  
  status      ContractStatus
  
  createdAt   DateTime @default(now())
}

enum AMCTier {
  SILVER
  GOLD
  PLATINUM
}

enum ContractStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

3. SITE ARCHITECTURE & PAGE STRUCTURE
/
├── (public)
│   ├── / (homepage)
│   ├── /services
│   │   ├── /ac-repair
│   │   ├── /plumbing
│   │   ├── /electrical
│   │   ├── /carpentry
│   │   └── /[service-slug]
│   ├── /pricing
│   ├── /our-technicians
│   ├── /about-us
│   ├── /blog
│   │   └── /[blog-slug]
│   ├── /contact
│   └── /book-now
│
├── /auth
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /verify-email
│
├── /dashboard (client portal)
│   ├── /bookings
│   ├── /bookings/[id]
│   ├── /addresses
│   ├── /amc
│   └── /profile
│
├── /technician (technician portal)
│   ├── /jobs
│   ├── /jobs/[id]
│   ├── /schedule
│   └── /profile
│
└── /admin
    ├── /bookings
    ├── /technicians
    ├── /clients
    ├── /services
    ├── /reviews
    └── /analytics

4. FEATURE IMPLEMENTATION CHECKLIST
Phase 1: MVP (Weeks 1-8)
Week 1-2: Foundation

 Set up Next.js project with TypeScript
 Configure Tailwind CSS + shadcn/ui
 Set up PostgreSQL database + Prisma
 Implement authentication system
 Create responsive navigation and footer
 Design system and component library

Week 3-4: Core Pages

 Homepage with hero, trust signals, CTA
 Service listing page with filters
 Individual service detail pages (8 core services)
 Pricing page with transparent pricing table
 Our Technicians page with profiles
 About Us page
 Contact page with form

Week 5-6: Booking System

 Multi-step booking flow:

Select service
Choose pricing option
Select date/time
Enter/select address
Add notes
Review and confirm


 Real-time technician availability checking
 Booking confirmation emails/SMS
 Admin booking management interface

Week 7-8: User Portals

 Client dashboard (view bookings, manage addresses)
 Technician portal (view assigned jobs, update status)
 Basic admin panel (manage bookings, assign technicians)
 Review submission after job completion

Phase 2: Enhancement (Weeks 9-12)

 Payment gateway integration (Benefit Pay)
 Advanced admin analytics dashboard
 AMC contract management system
 Blog/CMS integration
 WhatsApp Business API integration
 Email automation (booking reminders, follow-ups)
 SMS notifications
 Google Reviews integration widget
 Before/after photo upload system

Phase 3: Optimization (Weeks 13-16)

 SEO optimization (meta tags, structured data, sitemaps)
 Performance optimization (image optimization, lazy loading)
 A/B testing setup
 Advanced search and filtering
 Referral program system
 Mobile app consideration (React Native)


5. DEVELOPMENT PROMPTS FOR AI ASSISTANCE
Prompt 1: Homepage Hero Section
Create a Next.js component for a handyman services homepage hero section with the following requirements:

- Headline: "Bahrain's Most Trusted Handyman Service"
- Subheadline: "Vetted Professionals, Transparent Pricing, Job-Done-Right Guarantee"
- Two prominent CTAs: "Book a Service Now" (primary) and "View Pricing" (secondary)
- Background: Modern gradient or image of a professional technician
- Trust badges: "Licensed & Insured", "Background-Checked Technicians", "500+ Happy Customers"
- Must be fully responsive (mobile-first)
- Use Tailwind CSS for styling
- Include proper TypeScript types
- Smooth scroll to booking section on CTA click
Prompt 2: Service Card Component
Create a reusable React component for displaying service cards with:

- Service icon (use lucide-react icons)
- Service name
- Brief description (2-3 lines)
- Starting price display ("From BHD X")
- "View Details" button
- Hover effects with smooth transitions
- Responsive grid layout (1 col mobile, 2 col tablet, 3-4 col desktop)
- TypeScript interface for service props
- Tailwind CSS styling
Prompt 3: Multi-Step Booking Form
Create a multi-step booking form in React with the following steps:

Step 1: Service Selection
- Display all available services as cards
- Filter by category
- Show pricing type indicator (Flat Rate, Hourly, Quote Required)

Step 2: Pricing Options
- Show available pricing tiers for selected service
- Display price, duration, and description
- Mark popular options with badge

Step 3: Date & Time Selection
- Calendar component (disable past dates)
- Show available time slots for selected date
- Fetch from API: /api/availability?date=YYYY-MM-DD
- Handle slot selection

Step 4: Address
- Show saved addresses if logged in
- Option to add new address
- Fields: Area (dropdown), Block, Road, Building, Flat, Additional Info
- Google Maps integration for location pin

Step 5: Review & Confirm
- Summary of all selections
- Estimated total price
- Terms acceptance checkbox
- Submit button

Requirements:
- Use React Hook Form for form management
- Zod for validation
- Progress indicator at top
- "Back" and "Next" navigation
- Save progress in state/localStorage
- Responsive design
- TypeScript
Prompt 4: Technician Profile Card
Create a technician profile component displaying:

- Professional headshot (circular, 150px)
- Full name
- Years of experience badge
- Star rating (out of 5)
- Number of completed jobs
- Specialties (tags/chips)
- Brief bio (collapsible if long)
- Certifications with icons
- "Background Checked" badge
- Responsive layout (card on mobile, horizontal on desktop)
- Use shadcn/ui components where applicable
- TypeScript interface for technician data
Prompt 5: Admin Booking Management Table
Create an admin dashboard booking management table with:

- Columns: Booking #, Client Name, Service, Date/Time, Technician, Status, Amount, Actions
- Status badges with colors (Pending=yellow, Confirmed=blue, Completed=green, Cancelled=red)
- Filters: Status, Date Range, Service Type, Technician
- Search by booking number or client name
- Pagination (20 per page)
- Actions dropdown: View Details, Assign Technician, Cancel, Mark Complete
- Export to CSV button
- Responsive (horizontal scroll on mobile)
- Use React Query for data fetching
- Server-side pagination and filtering
Prompt 6: Pricing Table Component
Create a transparent pricing display page with three sections:

1. Flat-Rate Services Table
- Service name, description, price
- "Book Now" button per row
- Sortable by service category

2. Hourly Rate Section
- Clear hourly rate display
- Minimum call-out fee explanation
- Estimate calculator (input hours → shows total)

3. Quote-Required Services
- List of complex services
- "Request Free Quote" button
- Brief explanation of quote process

Styling:
- Clean, professional table design
- Mobile-responsive (stack on mobile)
- Highlighted popular services
- Tailwind CSS
- TypeScript
Prompt 7: Review Submission Form
Create a post-booking review submission form:

- 5-star rating selector (interactive stars)
- Text area for comment (optional, 500 char max)
- Photo upload (up to 3 before/after photos)
- Checkboxes: "Arrived on time", "Professional service", "Clean workspace", "Fair pricing"
- Submit button
- Thank you message after submission
- Validation: Must have at least rating
- Use React Hook Form
- Upload to S3/R2 with presigned URLs
- TypeScript
Prompt 8: Real-Time Availability Checker
Create an API endpoint and frontend component for checking technician availability:

Backend: /api/availability
- Input: date (YYYY-MM-DD), serviceId
- Query database for technicians with matching specialty
- Check existing bookings for that date
- Return available time slots (2-hour windows)
- Response format: { date, slots: [{start, end, available: boolean}] }

Frontend Component:
- Calendar date picker
- Time slot grid display
- Disabled slots shown grayed out
- Available slots clickable
- Real-time updates (poll every 30 seconds)
- Loading states
- Error handling

6. API ENDPOINT STRUCTURE
typescript// Core API Routes

// Public
GET    /api/services              // List all services
GET    /api/services/[slug]       // Service details
GET    /api/pricing/[serviceId]   // Pricing options
GET    /api/technicians           // List technicians (public profiles)
GET    /api/reviews               // Public reviews
GET    /api/availability          // Check available slots

// Authentication
POST   /api/auth/register         // User registration
POST   /api/auth/login            // Login
POST   /api/auth/logout           // Logout
POST   /api/auth/forgot-password  // Password reset request
POST   /api/auth/verify-email     // Email verification

// Bookings (Authenticated)
POST   /api/bookings              // Create booking
GET    /api/bookings              // List user's bookings
GET    /api/bookings/[id]         // Booking details
PATCH  /api/bookings/[id]         // Update booking
DELETE /api/bookings/[id]         // Cancel booking

// Reviews (Authenticated)
POST   /api/reviews               // Submit review
GET    /api/reviews/my-reviews    // User's reviews

// Payments
POST   /api/payments/initiate     // Start payment process
POST   /api/payments/webhook      // Payment gateway webhook

// Technician Portal (Technician role)
GET    /api/technician/jobs       // Assigned jobs
PATCH  /api/technician/jobs/[id]  // Update job status
POST   /api/technician/availability // Set availability

// Admin (Admin role)
GET    /api/admin/bookings        // All bookings
PATCH  /api/admin/bookings/[id]/assign // Assign technician
GET    /api/admin/analytics       // Dashboard metrics
POST   /api/admin/technicians     // Add technician
PATCH  /api/admin/services        // Manage services

7. IMPLEMENTATION TIMELINE
Month 1: Foundation & Core Features

Week 1: Project setup, authentication, database schema
Week 2: Homepage, service pages, pricing page
Week 3: Booking system (frontend flow)
Week 4: Booking system (backend integration)

Month 2: Portals & Enhancement

Week 5: Client dashboard
Week 6: Technician portal
Week 7: Admin panel basics
Week 8: Review system, email notifications

Month 3: Polish & Launch Prep

Week 9: Payment integration
Week 10: SEO optimization, content population
Week 11: Testing, bug fixes
Week 12: Deployment, monitoring setup


8. CRITICAL SUCCESS FEATURES
Must-Have for Launch:

Trust Signals Everywhere

Technician profiles with photos
Customer review widgets on every page
"Licensed & Insured" badges
Booking counter ("500+ jobs completed this month")


Transparent Pricing Display

Pricing page with exact BHD amounts
No hidden fees messaging
Flat-rate pricing for standard jobs prominently displayed


Frictionless Booking

Maximum 5 minutes from landing to booking confirmation
Guest booking option (no forced registration)
WhatsApp booking alternative
Instant booking confirmation via SMS


Mobile Optimization

80% of traffic will be mobile
One-tap phone call button
WhatsApp chat button
Fast loading (< 2 seconds)


Local SEO Foundation

Schema markup for LocalBusiness
Service-specific pages with location keywords
Google Business Profile integration
Arabic language support (optional for Phase 2)




9. DEPLOYMENT CHECKLIST
Pre-Launch:

 Domain registration (.bh or .com)
 SSL certificate setup
 Database backups configured
 Environment variables secured
 Error monitoring (Sentry) active
 Analytics tracking installed
 SEO meta tags on all pages
 Sitemap.xml generated
 Robots.txt configured
 Google Search Console verified
 Social media og:image tags
 Performance testing (Lighthouse score > 90)
 Cross-browser testing
 Mobile responsiveness verified
 Load testing (handle 100 concurrent users)

Launch Day:

 Deploy to production
 DNS propagation check
 Payment gateway live mode activated
 Email/SMS providers live
 Monitoring dashboards active
 Customer support channels ready


10. RECOMMENDED FOLDER STRUCTURE
your-project/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── (public)/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── technician/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── booking/
│   │   └── shared/
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── hooks/
│   ├── types/
│   └── config/
├── tests/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json

11. ENVIRONMENT VARIABLES TEMPLATE
env# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-random-secret"

# Email
SENDGRID_API_KEY="your-key"
FROM_EMAIL="noreply@yourdomain.com"

# SMS
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+97312345678"

# File Storage
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="me-south-1"

# Payment
BENEFIT_PAY_MERCHANT_ID="your-id"
BENEFIT_PAY_SECRET="your-secret"

# Maps
GOOGLE_MAPS_API_KEY="your-key"

# Monitoring
SENTRY_DSN="your-dsn"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
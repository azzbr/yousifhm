# Things To Do - Bahrain Handyman Services Platform
**Engineering Review & Implementation Roadmap**

Last Updated: October 2, 2025
Project Status: **MVP Foundation (40% Complete)**

---

## 📊 Executive Summary

### Current State
- ✅ Core architecture and tech stack established
- ✅ Homepage and public pages completed
- ✅ Database schema designed (not initialized)
- ✅ Basic booking flow (frontend only)
- ⚠️ Critical security gaps
- ⚠️ Authentication incomplete
- ⚠️ Payment integration missing
- ⚠️ Notifications not implemented

### Priority Levels
- 🔴 **CRITICAL** - Security/blocking issues, must fix before ANY deployment
- 🟠 **HIGH** - Core MVP features needed for launch
- 🟡 **MEDIUM** - Enhanced UX and nice-to-have features
- 🟢 **LOW** - Future improvements and optimizations

---

## 🔴 CRITICAL PRIORITY (Must Fix Immediately)

### Security & Authentication

- [ ] **Fix Booking API Security Vulnerability** 🔴
  - **Issue**: `/api/booking/route.ts` creates bookings without authentication
  - **Risk**: Anyone can create bookings, no user tracking
  - **Action**: Add `getServerSession()` check at route start
  - **Files**: `app/api/booking/route.ts`
  - **Estimate**: 30 minutes

- [ ] **Implement Role-Based Access Control (RBAC)** 🔴
  - **Issue**: Admin/Technician routes not protected
  - **Files**: 
    - `app/api/admin/**` - All admin routes need protection
    - `app/api/technician/**` - Technician routes need protection
  - **Action**: Use `requireAdmin()` and `requireTechnicianOrAdmin()` helpers
  - **Estimate**: 2 hours

- [ ] **Fix Booking-Client Relationship** 🔴
  - **Issue**: Bookings created without `clientId` link
  - **Risk**: Orphaned bookings, no user tracking
  - **Action**: 
    1. Get session user ID
    2. Create/link ClientProfile if not exists
    3. Associate booking with authenticated user
  - **Files**: `app/api/booking/route.ts`
  - **Estimate**: 1 hour

- [ ] **Remove Hardcoded Pricing Logic** 🔴
  - **Issue**: Prices in switch statement instead of database
  - **Risk**: Price inconsistency, hard to maintain
  - **Action**: Query `PricingOption` table for actual price
  - **Files**: `app/api/booking/route.ts`
  - **Estimate**: 45 minutes

- [ ] **Add Input Validation to All API Routes** 🔴
  - **Missing on**:
    - `/api/admin/bookings/route.ts`
    - `/api/admin/technicians/route.ts`
    - `/api/reviews/route.ts`
  - **Action**: Use Zod schemas for all request bodies
  - **Estimate**: 2 hours

---

## 🟠 HIGH PRIORITY (Core MVP Features)

### Database & Backend

- [ ] **Initialize Database** 🟠
  - **Action**: 
    ```bash
    npx prisma generate
    npx prisma db push
    ```
  - **Estimate**: 15 minutes
  - **Note**: Requires valid DATABASE_URL in `.env.local`

- [ ] **Create Database Seed Script** 🟠
  - **Current**: `/api/seed-demo` exists but may be incomplete
  - **Needs**:
    - Sample services with pricing
    - Demo technicians with profiles
    - Test client accounts
    - Sample bookings
  - **Files**: `prisma/seed.ts` or enhance `app/api/seed-demo/route.ts`
  - **Estimate**: 3 hours

- [ ] **Implement User Registration Flow** 🟠
  - **Missing**: Client registration API
  - **Files to Create**: `app/api/auth/register/client/route.ts`
  - **Must Handle**:
    - Email uniqueness check
    - Password hashing (bcryptjs)
    - Create User + ClientProfile
    - Send verification email (if email service ready)
  - **Estimate**: 2 hours

- [ ] **Complete Technician Onboarding** 🟠
  - **Current**: Page exists but no backend
  - **Files**:
    - `app/api/auth/register/technician/route.ts` (exists, needs review)
    - `app/technician/onboard/page.tsx` (needs API integration)
  - **Must Collect**:
    - Professional details (experience, certifications)
    - Service areas
    - Specialties
    - Availability preferences
    - Photo upload
  - **Estimate**: 4 hours

- [ ] **Technician Assignment System** 🟠
  - **Issue**: No way to assign technicians to bookings
  - **Files to Create**: 
    - `app/api/admin/bookings/[id]/assign/route.ts`
  - **Features**:
    - Auto-suggest based on specialty, area, availability
    - Manual assignment override
    - Update booking status to ASSIGNED
    - Create JobAssignment record
    - Notify technician (SMS/email)
  - **Estimate**: 3 hours

- [ ] **Real Technician Availability System** 🟠
  - **Current**: No availability checking
  - **Files to Create**:
    - `app/api/availability/route.ts` (check available slots)
    - `app/api/technician/availability/route.ts` (set availability)
  - **Logic**:
    - Query TechnicianAvailability table
    - Check existing bookings for conflicts
    - Return available time slots
    - Consider technician max jobs per day
  - **Estimate**: 4 hours

- [ ] **Fix Address-ClientProfile Relationship** 🟠
  - **Issue**: Addresses created without clientId in booking flow
  - **Action**: 
    - Booking should link to existing client addresses
    - Allow selecting saved addresses or creating new
    - Ensure clientId foreign key set
  - **Files**: 
    - `app/api/booking/route.ts`
    - `components/booking/AddressStep.tsx`
  - **Estimate**: 2 hours

### Authentication & User Management

- [ ] **Add Email Verification Flow** 🟠
  - **Files to Create**:
    - `app/api/auth/verify-email/route.ts`
    - `app/auth/verify/page.tsx`
  - **Action**:
    - Generate verification token
    - Send email with link
    - Verify token and update user.verified
  - **Estimate**: 3 hours
  - **Requires**: Email service (Resend) configured

- [ ] **Implement Password Reset** 🟠
  - **Files to Create**:
    - `app/api/auth/forgot-password/route.ts`
    - `app/api/auth/reset-password/route.ts`
    - `app/auth/forgot-password/page.tsx`
    - `app/auth/reset-password/page.tsx`
  - **Action**:
    - Generate reset token with expiry
    - Send email with link
    - Validate token and update password
  - **Estimate**: 3 hours

- [ ] **Create Client Dashboard** 🟠
  - **Files to Create**: 
    - `app/dashboard/layout.tsx` (protected route)
    - `app/dashboard/page.tsx` (booking overview)
    - `app/dashboard/bookings/page.tsx` (all bookings)
    - `app/dashboard/bookings/[id]/page.tsx` (booking detail)
    - `app/dashboard/profile/page.tsx` (edit profile)
    - `app/dashboard/addresses/page.tsx` (manage addresses)
  - **Features**:
    - View upcoming/past bookings
    - Cancel bookings
    - Submit reviews after completion
    - Manage saved addresses
    - Update profile info
  - **Estimate**: 6 hours

- [ ] **Complete Technician Portal** 🟠
  - **Current**: Basic structure exists, needs enhancement
  - **Files to Enhance**:
    - `app/technician/dashboard/page.tsx`
    - `app/technician/jobs/page.tsx` (new)
    - `app/technician/jobs/[id]/page.tsx` (new)
    - `app/technician/availability/page.tsx` (new)
  - **Features**:
    - View assigned jobs
    - Update job status (EN_ROUTE, IN_PROGRESS, COMPLETED)
    - Set weekly availability
    - View earnings
    - Update profile
  - **Estimate**: 5 hours

### Payment Integration

- [ ] **Integrate Payment Gateway** 🟠
  - **Options**: Benefit Pay (Bahrain) or Stripe
  - **Files to Create**:
    - `app/api/payments/initiate/route.ts`
    - `app/api/payments/webhook/route.ts`
    - `app/api/payments/status/[bookingId]/route.ts`
    - `lib/payment.ts` (helper functions)
  - **Features**:
    - Initiate payment after booking
    - Handle payment confirmation
    - Update booking status
    - Store transaction details
  - **Estimate**: 8 hours
  - **Note**: Requires merchant account setup

- [ ] **Add Payment Status Tracking** 🟠
  - **Files to Create**:
    - `components/payment/PaymentButton.tsx`
    - `components/payment/PaymentStatus.tsx`
  - **Features**:
    - Show payment pending/paid/failed status
    - Retry payment option
    - Payment receipt display
  - **Estimate**: 3 hours

### Notifications

- [ ] **Implement Email Notifications** 🟠
  - **Service**: Resend (already in package.json)
  - **Files to Create**:
    - `lib/email.ts` (email helper)
    - `emails/booking-confirmation.tsx` (React Email template)
    - `emails/booking-reminder.tsx`
    - `emails/booking-completed.tsx`
    - `emails/technician-assignment.tsx`
  - **Triggers**:
    - Booking created → Client confirmation
    - Booking assigned → Technician notification
    - 24h before → Reminder to both
    - Booking completed → Request review
  - **Estimate**: 6 hours
  - **Requires**: RESEND_API_KEY in env

- [ ] **Implement SMS Notifications** 🟠
  - **Service**: Twilio
  - **Files to Create**: `lib/sms.ts`
  - **Messages**:
    - Booking confirmation with reference number
    - Technician assignment notification
    - Appointment reminder (24h before)
    - Technician en route notification
  - **Estimate**: 4 hours
  - **Requires**: Twilio credentials in env

### Reviews & Ratings

- [ ] **Complete Review Submission Flow** 🟠
  - **Current**: ReviewModal component exists
  - **Action**:
    - Connect to `/api/reviews/route.ts`
    - Add validation
    - Show success/error states
    - Update technician ratings after review
  - **Files**: 
    - `components/review/ReviewModal.tsx`
    - `app/api/reviews/route.ts`
  - **Estimate**: 3 hours

- [ ] **Implement Review Moderation** 🟠
  - **Files to Create**:
    - `app/admin/reviews/[id]/page.tsx` (review detail with moderation)
    - `app/api/admin/reviews/[id]/route.ts` (approve/reject reviews)
  - **Features**:
    - Approve/reject reviews
    - Add moderation notes
    - Flag inappropriate content
    - Respond to reviews on behalf of business
  - **Estimate**: 2 hours

- [ ] **Calculate Technician Ratings** 🟠
  - **Action**: After each review submission, recalculate:
    - Overall rating (average of all reviews)
    - Review count
    - Individual metric ratings (quality, timeliness, etc.)
  - **Files**: `app/api/reviews/route.ts`
  - **Estimate**: 1 hour

---

## 🟡 MEDIUM PRIORITY (Enhanced UX)

### File Upload & Media

- [ ] **Implement Photo Upload System** 🟡
  - **Service**: AWS S3 or Cloudflare R2
  - **Files to Create**:
    - `app/api/upload/route.ts` (generate presigned URLs)
    - `lib/storage.ts` (S3/R2 helper)
    - `components/ui/image-upload.tsx` (reusable component)
  - **Use Cases**:
    - Technician profile photos
    - Review before/after photos
    - Service completion photos
  - **Estimate**: 4 hours
  - **Requires**: AWS/R2 credentials in env

- [ ] **Add Image Optimization** 🟡
  - **Action**: 
    - Convert uploads to WebP
    - Generate thumbnails
    - Use Next.js Image component everywhere
  - **Files**: Multiple components
  - **Estimate**: 2 hours

### Google Maps Integration

- [ ] **Integrate Google Maps API** 🟡
  - **Files to Create**:
    - `components/maps/LocationPicker.tsx`
    - `lib/maps.ts` (helper functions)
  - **Features**:
    - Visual area selection during booking
    - Service area visualization
    - Auto-complete for addresses
    - Distance calculation
  - **Estimate**: 5 hours
  - **Requires**: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

### Enhanced Booking Flow

- [ ] **Add Real-Time Slot Availability** 🟡
  - **Current**: Static time slots
  - **Enhancement**: 
    - Fetch availability from API as user selects date
    - Disable fully booked slots
    - Show technician count per slot
  - **Files**: `components/booking/DateTimeStep.tsx`
  - **Estimate**: 3 hours

- [ ] **Implement Booking Estimates** 🟡
  - **Feature**: Calculate price estimate before final submission
  - **Factors**: 
    - Base service price
    - Distance fee (if applicable)
    - Emergency surcharge
    - Time of day pricing
  - **Files**: `app/api/booking/estimate/route.ts`
  - **Estimate**: 2 hours

- [ ] **Add Booking Cancellation Policy** 🟡
  - **Features**:
    - Show cancellation policy during booking
    - Allow cancellation with time limits
    - Refund calculation based on timing
    - Update booking status to CANCELLED
  - **Files**: 
    - `app/api/booking/[id]/cancel/route.ts`
    - `components/booking/CancellationPolicy.tsx`
  - **Estimate**: 3 hours

### Search & Filtering

- [ ] **Implement Service Search** 🟡
  - **Files to Create**: `app/api/services/search/route.ts`
  - **Features**:
    - Search by service name/description
    - Filter by category
    - Filter by price range
    - Sort by popularity/price
  - **Estimate**: 3 hours

- [ ] **Add Technician Filtering** 🟡
  - **Page**: `/our-technicians` (needs to be created)
  - **Filters**:
    - By specialty
    - By rating
    - By experience
    - By service area
  - **Estimate**: 4 hours

### Admin Enhancements

- [ ] **Create Admin Analytics Dashboard** 🟡
  - **Current**: Basic revenue chart exists
  - **Add**:
    - Booking trends (daily/weekly/monthly)
    - Top services
    - Technician performance
    - Customer acquisition metrics
    - Revenue breakdown
    - Cancellation rate
  - **Files**: Enhance `app/admin/analytics/page.tsx`
  - **Estimate**: 6 hours

- [ ] **Add Bulk Operations** 🟡
  - **Features**:
    - Bulk assign technicians
    - Bulk status updates
    - Export reports
    - Bulk email to clients
  - **Files**: `app/admin/bookings/page.tsx`
  - **Estimate**: 4 hours

### Customer Experience

- [ ] **Add Live Chat Support** 🟡
  - **Options**: Tawk.to, Intercom, or custom
  - **Integration**: Widget in layout
  - **Estimate**: 2 hours

- [ ] **Implement Referral Program** 🟡
  - **Files to Create**:
    - `app/dashboard/referrals/page.tsx`
    - `app/api/referrals/route.ts`
    - `prisma/schema.prisma` (add Referral model)
  - **Features**:
    - Generate unique referral codes
    - Track referrals
    - Reward system (discount/credit)
  - **Estimate**: 6 hours

- [ ] **Create FAQ Page** 🟡
  - **File**: `app/faq/page.tsx`
  - **Content**:
    - Service questions
    - Booking process
    - Payment options
    - Cancellation policy
    - Emergency services
  - **Estimate**: 2 hours

---

## 🟢 LOW PRIORITY (Future Improvements)

### AMC (Annual Maintenance Contract) System

- [ ] **Implement AMC Contract Management** 🟢
  - **Files to Create**:
    - `app/amc/page.tsx` (pricing tiers)
    - `app/dashboard/amc/page.tsx` (client view)
    - `app/api/amc/route.ts` (CRUD operations)
  - **Features**:
    - Silver/Gold/Platinum tiers
    - Recurring service scheduling
    - Priority booking for contract holders
    - Contract renewal reminders
  - **Estimate**: 8 hours

### Mobile App

- [ ] **Consider React Native App** 🟢
  - **Rationale**: 80% mobile traffic expected
  - **Benefits**:
    - Push notifications
    - Better performance
    - Camera integration for photos
    - Location services
  - **Decision**: Post-MVP based on web adoption
  - **Estimate**: 200+ hours (separate project)

### Advanced Features

- [ ] **Multi-Language Support (Arabic)** 🟢
  - **Library**: next-intl or react-i18next
  - **Files**: All pages/components
  - **Estimate**: 20 hours

- [ ] **WhatsApp Business API Integration** 🟢
  - **Use Cases**:
    - Booking via WhatsApp
    - Status updates
    - Quick replies
  - **Estimate**: 8 hours
  - **Requires**: WhatsApp Business account

- [ ] **Smart Scheduling Algorithm** 🟢
  - **Features**:
    - Auto-assign based on location proximity
    - Route optimization for technicians
    - Load balancing
  - **Estimate**: 12 hours

- [ ] **Loyalty Program** 🟢
  - **Features**:
    - Points per booking
    - Tier system (Bronze/Silver/Gold customer)
    - Exclusive discounts
    - Birthday offers
  - **Estimate**: 10 hours

### Performance & Optimization

- [ ] **Implement Redis Caching** 🟢
  - **Cache**:
    - Service listings
    - Technician profiles
    - Popular searches
    - Availability queries
  - **Estimate**: 6 hours

- [ ] **Add Rate Limiting** 🟢
  - **Library**: @upstash/ratelimit
  - **Apply to**: All API routes
  - **Estimate**: 3 hours

- [ ] **Set Up CDN** 🟢
  - **Service**: Cloudflare
  - **Action**: Configure for static assets
  - **Estimate**: 2 hours

### Testing & Quality

- [ ] **Add Unit Tests** 🟢
  - **Framework**: Jest + React Testing Library
  - **Priority Files**:
    - API routes
    - Validation schemas
    - Booking logic
  - **Estimate**: 15 hours

- [ ] **Add E2E Tests** 🟢
  - **Framework**: Playwright
  - **Test Flows**:
    - Complete booking flow
    - User registration
    - Technician assignment
    - Review submission
  - **Estimate**: 10 hours

- [ ] **Implement Error Monitoring** 🟢
  - **Service**: Sentry
  - **Setup**: Already in env vars
  - **Action**: Configure and test
  - **Estimate**: 2 hours

---

## 📋 Pre-Launch Checklist

### Configuration

- [ ] **Set Up Production Environment**
  - [ ] Production database (Railway/Supabase)
  - [ ] Domain registration (.bh or .com)
  - [ ] SSL certificate
  - [ ] CDN configuration
  - [ ] Environment variables

- [ ] **Configure External Services**
  - [ ] Resend/SendGrid for emails
  - [ ] Twilio for SMS
  - [ ] Payment gateway (Benefit Pay)
  - [ ] AWS S3/R2 for storage
  - [ ] Google Maps API
  - [ ] Sentry for monitoring

### Security Audit

- [ ] **Run Security Checks**
  - [ ] All API routes have authentication
  - [ ] RBAC implemented correctly
  - [ ] Input validation on all forms
  - [ ] SQL injection prevention (Prisma handles)
  - [ ] XSS prevention
  - [ ] CSRF protection (Next.js handles)
  - [ ] Rate limiting enabled
  - [ ] Sensitive data encrypted

### SEO & Analytics

- [ ] **SEO Optimization**
  - [ ] Meta tags on all pages
  - [ ] Open Graph tags
  - [ ] Schema.org structured data (LocalBusiness)
  - [ ] Sitemap.xml
  - [ ] Robots.txt
  - [ ] Google Search Console verified
  - [ ] Bing Webmaster Tools

- [ ] **Analytics Setup**
  - [ ] Google Analytics 4
  - [ ] Conversion tracking
  - [ ] Event tracking (bookings, clicks)
  - [ ] Heatmap tool (Hotjar/Microsoft Clarity)

### Performance

- [ ] **Run Performance Tests**
  - [ ] Lighthouse score > 90
  - [ ] Core Web Vitals passing
  - [ ] Mobile performance optimized
  - [ ] Images optimized
  - [ ] Lazy loading implemented
  - [ ] Code splitting effective

### Legal & Compliance

- [ ] **Legal Documents**
  - [ ] Terms of Service
  - [ ] Privacy Policy
  - [ ] Cookie Policy
  - [ ] Refund Policy
  - [ ] Service Agreement

### Testing

- [ ] **Cross-Browser Testing**
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Edge
  - [ ] Mobile browsers

- [ ] **User Acceptance Testing**
  - [ ] Complete booking flow (client perspective)
  - [ ] Technician workflow
  - [ ] Admin operations
  - [ ] Payment processing
  - [ ] Email/SMS delivery

### Content

- [ ] **Content Population**
  - [ ] All 8 core services with descriptions
  - [ ] 5-10 technician profiles
  - [ ] 10+ authentic reviews
  - [ ] Blog posts (if applicable)
  - [ ] FAQ content
  - [ ] Contact information
  - [ ] About Us page

### Launch Day

- [ ] **Deployment**
  - [ ] Deploy to production
  - [ ] Database migration
  - [ ] Seed production data
  - [ ] Verify all environment variables
  - [ ] Test payment gateway in live mode
  - [ ] Monitor error logs

- [ ] **Marketing**
  - [ ] Social media announcement
  - [ ] Press release (if applicable)
  - [ ] Google Business Profile setup
  - [ ] Local SEO optimization

---

## 📊 Development Time Estimates

### By Priority
- 🔴 **Critical**: ~6 hours
- 🟠 **High**: ~60 hours
- 🟡 **Medium**: ~50 hours
- 🟢 **Low**: ~300+ hours

### MVP Launch Timeline (Critical + High Priority Only)
- **Total Development**: ~66 hours
- **Estimated Calendar Time**: 2-3 weeks (with 1 developer)
- **With Testing & Iteration**: 3-4 weeks

### Full Feature Set (All Priorities)
- **Total Development**: ~416+ hours
- **Estimated Calendar Time**: 10-12 weeks (with 1 developer)

---

## 🎯 Recommended Development Order

1. **Week 1: Critical Security Fixes**
   - Fix authentication issues
   - Secure all API routes
   - Initialize database
   - Create seed data

2. **Week 2: Core Booking Flow**
   - Complete user registration
   - Fix booking-client relationship
   - Implement real availability checking
   - Create client dashboard basics

3. **Week 3: Technician System**
   - Complete technician onboarding
   - Build assignment system
   - Enhance technician portal
   - Implement job status updates

4. **Week 4: Payments & Notifications**
   - Integrate payment gateway
   - Set up email notifications
   - Add SMS alerts
   - Complete review system

5. **Week 5+: Enhanced Features & Polish**
   - Add photo uploads
   - Integrate Google Maps
   - Implement analytics
   - Pre-launch testing

---

## 📝 Notes & Recommendations

### Architecture Decisions

1. **Authentication Strategy**: NextAuth v5 is good, but consider Clerk for easier setup
2. **Database**: PostgreSQL is excellent choice for this use case
3. **State Management**: React Query + Zustand is perfect for this app
4. **Payment**: Start with Stripe (easier), add Benefit Pay later for local market

### Performance Tips

1. Use React Query for all API calls (automatic caching)
2. Implement pagination on all list views
3. Use database indexes on frequently queried fields
4. Consider Redis for session storage and caching

### Security Best Practices

1. Never trust client-side validation alone
2. Always validate user permissions on API routes
3. Use Prisma transactions for multi-step operations
4. Log all sensitive operations for audit trail
5. Implement rate limiting on public endpoints

### Bahrain Market Specific

1. **Phone Format**: +973 XXXX XXXX
2. **Currency**: BHD (3 decimal places)
3. **Business Hours**: Consider Friday prayer times
4. **Service Areas**: Focus on Manama, Saar, Hamala, Amwaj first
5. **Payment**: Benefit Pay is standard, but many use Visa/Mastercard

---

## 🔄 Maintenance Schedule (Post-Launch)

### Daily
- Monitor error logs (Sentry)
- Check booking flow for issues
- Respond to urgent support tickets

### Weekly
- Review new reviews
- Check technician performance metrics
- Analyze booking patterns
- Database backup verification

### Monthly
- Security audit
- Performance review
- Feature prioritization meeting
- Content updates (blog, FAQ)

### Quarterly
- Major feature releases
- Tech stack updates
- User feedback analysis
- Marketing campaign review

---

**Last Updated**: October 2, 2025
**Document Owner**: Development Team
**Next Review**: After critical fixes completed

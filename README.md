# Dokumentasi ERP Multi-Channel SaaS Platform

## 📋 Daftar Isi
- [Business Model & User Journey](#business-model--user-journey)
- [Tech Stack](#tech-stack)
- [Platform Architecture](#platform-architecture)
- [Database Schema](#database-schema)
- [Struktur Project](#struktur-project)
- [Multi-Tenant Strategy](#multi-tenant-strategy)
- [API Integration](#api-integration)
- [Security & Authentication](#security--authentication)
- [Deployment Strategy](#deployment-strategy)

## 🎯 Business Model & User Journey

### Complete User Journey Flow

#### 1. **Discovery Phase (Company Profile Website)**
```
Landing Page → About Us → Services → Portfolio → Testimonials → Contact/Demo
```

**Target Visitor:** Owner UMKM yang butuh solusi manajemen bisnis

**Key Pages:**
- **Homepage:** Hero section dengan value proposition yang kuat
- **Features:** Showcase fitur ERP dengan screenshots & videos
- **Pricing:** Transparent pricing tiers (Basic, Pro, Enterprise)
- **Case Studies:** Success stories dari client existing
- **Demo Request:** Form untuk request demo/trial

#### 2. **Acquisition & Onboarding Phase**

**Step 1: Interest & Demo Request**
```
Owner UMKM → Lihat website → Request Demo → Sales call/presentation
```

**Step 2: Trial Registration**
```
Owner convinced → Sign up trial → Email verification → Welcome email sequence
```

**Step 3: Onboarding Wizard**
```
Login first time → Business setup wizard:
├── Business Information (nama, jenis usaha, alamat)
├── Industry Selection (fashion, F&B, electronics, dll)
├── E-commerce Account Connections (TikTok, Shopee, dll)
├── Initial Product Import/Setup
└── Team Invitation (optional)
```

**Step 4: Automatic Tenant Creation**
```
Business setup complete → Database tenant auto-created:
├── Unique subdomain: toko-andi.yourerp.com
├── Isolated database schema
├── Default categories based on industry
├── Sample data untuk demo purposes
└── Owner role assigned automatically
```

#### 3. **Team Expansion Phase**

**Owner creates team accounts:**
```
Owner → Settings → Team Management → Add Team Member:
├── Input: Email, Name, Role (Manager/Staff/Accountant)
├── System sends invitation email with temporary password
├── Team member accepts → Sets new password → Access granted
└── Role-based permissions automatically applied
```

#### 4. **Operational Phase**
- Daily operations via ERP dashboard
- Multi-channel order management
- Real-time inventory sync
- Analytics & reporting
- Continuous onboarding of new features

### Revenue Model
- **Freemium:** 14-day full access trial
- **Basic Plan:** Rp 299K/bulan - 1 store, 2 users, basic features
- **Pro Plan:** Rp 599K/bulan - 3 stores, 5 users, advanced analytics
- **Enterprise:** Custom pricing - unlimited stores/users, white-label

## 🔧 Tech Stack

### Frontend Stack
- **Main Framework:** Vue 3
- **UI Components:** Shadcn Vue + Nuxt UI
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Data Fetching:** TanStack Query (Vue Query)
- **Form Handling:** VeeValidate + Zod
- **Charts:** ApexCharts
- **Animations:** Lottie/CSS animations
- **Icons:** Lucide Vue

### Backend & Database
- **Authentication:** Firebase Auth
- **Database:** 
  - **Primary:** Firebase Firestore (NoSQL)
  - **Analytics:** Firebase Analytics
  - **Storage:** Firebase Storage
  - **Functions:** Firebase Cloud Functions
- **Caching:** Redis Cloud
- **Search:** Algolia (untuk product search)

### Integration & APIs
- **HTTP Client:** Ofetch (Nuxt native)
- **Validation:** Zod schemas
- **Background Jobs:** Firebase Cloud Functions + Pub/Sub
- **Email Service:** Firebase Extensions (SendGrid/Mailgun)
- **File Processing:** Firebase Storage + Cloud Functions

### DevOps & Tools
- **Hosting:** 
  - Company Profile: Vercel/Netlify
  - ERP App: Firebase Hosting
- **CI/CD:** GitHub Actions
- **Monitoring:** Firebase Crashlytics + Google Analytics
- **Error Tracking:** Sentry
- **Domain Management:** Cloudflare

## 🏗️ Platform Architecture

### Dual-Site Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLETE ECOSYSTEM                       │
├─────────────────────┬───────────────────────────────────────┤
│   COMPANY PROFILE   │           ERP APPLICATION             │
│   (yourdomain.com)  │     (app.yourdomain.com)              │
├─────────────────────┼───────────────────────────────────────┤
│ • Landing Page      │ • Multi-tenant Dashboard              │
│ • About Us          │ • Product Management                  │
│ • Services          │ • Order Processing                    │
│ • Portfolio         │ • E-commerce Integration              │
│ • Testimonials      │ • Analytics & Reports                 │
│ • Contact/Demo      │ • Team Management                     │
│ • Blog/Resources    │ • Billing & Subscriptions             │
└─────────────────────┴───────────────────────────────────────┘
```

### Multi-Tenant Database Design (Firebase)

```
Firestore Database Structure:
├── /organizations/{orgId}/
│   ├── info: { name, slug, plan, industry, etc }
│   ├── members: { userId → role, permissions, status }
│   ├── products: { productId → product data }
│   ├── orders: { orderId → order data }
│   ├── customers: { customerId → customer data }
│   ├── inventory: { variantId → stock data }
│   ├── integrations: { platform → credentials, config }
│   └── analytics: { date → metrics }
├── /users/{userId}/
│   ├── profile: { name, email, avatar, etc }
│   └── organizations: { orgId → { role, joinedAt, status } }
└── /global/
    ├── industries: { industry configs & templates }
    ├── features: { feature flags & pricing }
    └── system: { maintenance, announcements }
```

## 🗄️ Database Schema (Firestore)

### Core Collections Structure

#### Organizations Collection
```typescript
// /organizations/{orgId}
interface Organization {
  id: string
  name: string
  slug: string // for subdomain: slug.yourerp.com
  industry: 'fashion' | 'food' | 'electronics' | 'general'
  plan: 'trial' | 'basic' | 'pro' | 'enterprise'
  planStatus: 'active' | 'expired' | 'cancelled'
  subscriptionExpiry: Timestamp
  
  // Business Info
  businessInfo: {
    address: string
    phone: string
    email: string
    taxId?: string
    logo?: string
  }
  
  // Onboarding Status
  onboardingCompleted: boolean
  setupSteps: {
    businessInfo: boolean
    firstProduct: boolean
    storeConnection: boolean
    teamInvite: boolean
  }
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string // owner userId
}
```

#### Users & Team Management
```typescript
// /users/{userId}
interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  phoneNumber?: string
  
  // Profile
  profile: {
    fullName: string
    position?: string
    whatsapp?: string
  }
  
  // Organizations membership
  organizations: {
    [orgId: string]: {
      role: 'owner' | 'admin' | 'manager' | 'staff' | 'accountant' | 'viewer'
      joinedAt: Timestamp
      status: 'active' | 'invited' | 'suspended'
      invitedBy?: string
    }
  }
  
  createdAt: Timestamp
  lastLoginAt: Timestamp
}

// /organizations/{orgId}/members/{userId}
interface OrganizationMember {
  userId: string
  role: UserRole
  permissions: string[]
  status: 'active' | 'invited' | 'suspended'
  invitedBy?: string
  inviteToken?: string // for pending invitations
  joinedAt: Timestamp
  lastActiveAt: Timestamp
}
```

#### Products & Inventory
```typescript
// /organizations/{orgId}/products/{productId}
interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  
  // Variants
  hasVariants: boolean
  variants: ProductVariant[]
  
  // Pricing
  basePrice: number
  costPrice: number
  
  // Media
  images: string[]
  
  // Physical attributes
  weight?: number
  dimensions?: { length: number, width: number, height: number }
  
  // E-commerce sync
  platformMappings: {
    [platform: string]: {
      productId: string
      lastSyncAt: Timestamp
      syncStatus: 'synced' | 'pending' | 'error'
    }
  }
  
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}

interface ProductVariant {
  id: string
  sku: string
  name: string
  attributes: { [key: string]: string } // color: red, size: L
  price: number
  stockQuantity: number
  reservedQuantity: number
  lowStockThreshold: number
  image?: string
}
```

#### Orders Management
```typescript
// /organizations/{orgId}/Sales/{orderId}
interface Order {
  id: string
  orderNumber: string
  externalOrderId?: string // from e-commerce platform
  platform: 'tiktok' | 'shopee' | 'tokopedia' | 'manual'
  
  // Customer
  customerId?: string
  customerInfo: {
    name: string
    email?: string
    phone?: string
  }
  
  // Order Details
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingStatus: 'pending' | 'ready' | 'shipped' | 'delivered'
  
  // Financial
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  
  // Addresses
  shippingAddress: Address
  billingAddress?: Address
  
  // Metadata
  notes?: string
  internalNotes?: string
  platformData?: any // raw data from platform
  
  orderDate: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface OrderItem {
  productId: string
  variantId: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
```

#### E-commerce Integrations
```typescript
// /organizations/{orgId}/integrations/{platform}
interface Integration {
  platform: 'tiktok' | 'shopee' | 'tokopedia'
  isActive: boolean
  
  // Store Info
  storeInfo: {
    storeId: string
    storeName: string
    storeUrl?: string
  }
  
  // API Credentials (encrypted)
  credentials: {
    appKey?: string
    appSecret?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: Timestamp
  }
  
  // Sync Settings
  syncSettings: {
    autoSyncOrders: boolean
    autoSyncProducts: boolean
    autoSyncInventory: boolean
    syncInterval: number // minutes
  }
  
  // Sync Status
  lastSyncAt?: Timestamp
  syncStatus: 'connected' | 'error' | 'disconnected'
  syncErrors: SyncError[]
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface SyncError {
  timestamp: Timestamp
  operation: 'Sales' | 'products' | 'inventory'
  error: string
  details?: any
}
```

## 📁 Struktur Project

### Complete Project Structure
```
erp-saas-platform/
├── 📁 company-profile/              # Landing & marketing site
│   ├── 📁 assets/
│   ├── 📁 components/
│   │   ├── 📁 sections/            # Homepage sections
│   │   │   ├── HeroSection.vue
│   │   │   ├── FeaturesSection.vue
│   │   │   ├── PricingSection.vue
│   │   │   ├── TestimonialsSection.vue
│   │   │   └── CTASection.vue
│   │   ├── 📁 forms/
│   │   │   ├── ContactForm.vue
│   │   │   ├── DemoRequestForm.vue
│   │   │   └── NewsletterForm.vue
│   │   └── 📁 ui/                  # Shared UI components
│   ├── 📁 pages/
│   │   ├── index.vue               # Homepage
│   │   ├── about.vue               # About us
│   │   ├── features.vue            # Feature details
│   │   ├── pricing.vue             # Pricing plans
│   │   ├── case-studies.vue        # Success stories
│   │   ├── contact.vue             # Contact page
│   │   ├── demo.vue                # Demo request
│   │   └── 📁 blog/                # Content marketing
│   ├── 📁 content/                 # Nuxt Content for blog
│   └── nuxt.config.ts
│
├── 📁 erp-app/                     # Main ERP application
│   ├── 📁 components/
│   │   ├── 📁 ui/                  # Shadcn Vue components
│   │   ├── 📁 layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── TenantSwitcher.vue  # Multi-org switcher
│   │   │   └── UserMenu.vue
│   │   ├── 📁 onboarding/          # Onboarding wizard
│   │   │   ├── WelcomeStep.vue
│   │   │   ├── BusinessInfoStep.vue
│   │   │   ├── IndustrySelectionStep.vue
│   │   │   ├── StoreConnectionStep.vue
│   │   │   └── TeamInviteStep.vue
│   │   ├── 📁 products/
│   │   ├── 📁 orders/
│   │   ├── 📁 inventory/
│   │   ├── 📁 customers/
│   │   ├── 📁 integrations/
│   │   ├── 📁 analytics/
│   │   └── 📁 team/                # Team management
│   │       ├── MemberList.vue
│   │       ├── InviteMember.vue
│   │       ├── RoleSelector.vue
│   │       └── PermissionMatrix.vue
│   │
│   ├── 📁 composables/
│   │   ├── useAuth.ts              # Firebase Auth wrapper
│   │   ├── useFirestore.ts         # Firestore helpers
│   │   ├── useCurrentOrg.ts        # Current organization context
│   │   ├── usePermissions.ts       # Role-based permissions
│   │   ├── useOnboarding.ts        # Onboarding flow
│   │   ├── useTeamManagement.ts    # Team CRUD operations
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   ├── useIntegrations.ts
│   │   └── useSubscription.ts      # Billing & subscription
│   │
│   ├── 📁 middleware/
│   │   ├── auth.ts                 # Authentication check
│   │   ├── onboarding.ts           # Redirect if not onboarded
│   │   ├── subscription.ts         # Check active subscription
│   │   └── permissions.ts          # Role-based route protection
│   │
│   ├── 📁 pages/
│   │   ├── index.vue               # Dashboard home
│   │   ├── login.vue
│   │   ├── register.vue
│   │   ├── 📁 onboarding/          # Onboarding wizard pages
│   │   │   ├── index.vue           # Welcome
│   │   │   ├── business.vue        # Business info
│   │   │   ├── industry.vue        # Industry selection
│   │   │   ├── stores.vue          # Connect stores
│   │   │   ├── team.vue            # Invite team
│   │   │   └── complete.vue        # Completion
│   │   ├── 📁 [orgSlug]/           # Dynamic org routes
│   │   │   ├── index.vue           # Org dashboard
│   │   │   ├── 📁 products/
│   │   │   ├── 📁 orders/
│   │   │   ├── 📁 inventory/
│   │   │   ├── 📁 customers/
│   │   │   ├── 📁 integrations/
│   │   │   ├── 📁 analytics/
│   │   │   ├── 📁 team/            # Team management
│   │   │   │   ├── index.vue       # Team overview
│   │   │   │   ├── invite.vue      # Send invitations
│   │   │   │   ├── roles.vue       # Manage roles
│   │   │   │   └── [memberId].vue  # Member details
│   │   │   └── 📁 settings/
│   │   │       ├── general.vue     # Org settings
│   │   │       ├── billing.vue     # Subscription management
│   │   │       ├── notifications.vue
│   │   │       └── security.vue
│   │   └── 📁 account/             # User account pages
│   │       ├── profile.vue
│   │       ├── organizations.vue   # Org switcher
│   │       └── preferences.vue
│   │
│   ├── 📁 stores/                  # Pinia stores
│   │   ├── auth.ts
│   │   ├── organizations.ts        # Multi-org state
│   │   ├── currentOrg.ts          # Active organization
│   │   ├── onboarding.ts          # Onboarding progress
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── ui.ts
│   │
│   ├── 📁 utils/
│   │   ├── firebase.ts             # Firebase config
│   │   ├── firestore-helpers.ts    # Firestore utilities
│   │   ├── permissions.ts          # Permission checking
│   │   ├── tenant-utils.ts         # Multi-tenant helpers
│   │   ├── onboarding-utils.ts     # Onboarding logic
│   │   └── validation.ts           # Zod schemas
│   │
│   └── 📁 server/                  # Server API routes
│       ├── 📁 api/
│       │   ├── 📁 auth/
│       │   ├── 📁 onboarding/      # Onboarding endpoints
│       │   ├── 📁 organizations/   # Org management
│       │   ├── 📁 team/            # Team management
│       │   ├── 📁 sync/            # E-commerce sync
│       │   └── 📁 webhooks/
│       └── 📁 utils/
│
├── 📁 firebase-functions/          # Firebase Cloud Functions
│   ├── 📁 src/
│   │   ├── 📁 triggers/            # Firestore triggers
│   │   ├── 📁 scheduled/           # Cron jobs
│   │   ├── 📁 sync/                # E-commerce sync functions
│   │   ├── 📁 notifications/       # Email/push notifications
│   │   └── 📁 onboarding/          # Automated onboarding
│   ├── package.json
│   └── firebase.json
│
├── 📁 shared/                      # Shared code between apps
│   ├── 📁 types/
│   ├── 📁 utils/
│   ├── 📁 constants/
│   └── 📁 validation/
│
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 firebase.json                # Firebase configuration
├── 📄 firestore.rules             # Firestore security rules
├── 📄 package.json                # Root package.json
└── 📄 README.md
```

## 🏢 Multi-Tenant Strategy

### Tenant Isolation Model

#### 1. **Organization-Based Tenancy**
```typescript
// Every organization gets isolated data
const getUserOrganizations = async (userId: string) => {
  const userDoc = await db.collection('users').doc(userId).get()
  return userDoc.data()?.organizations || {}
}

// Auto-filter queries by organization
const getProducts = async (orgId: string) => {
  return db
    .collection('organizations')
    .doc(orgId)
    .collection('products')
    .where('isActive', '==', true)
    .get()
}
```

#### 2. **Subdomain-Based Access**
```typescript
// middleware/tenant.ts
export default defineNuxtRouteMiddleware((to) => {
  const subdomain = getSubdomain(to.fullPath)
  
  if (subdomain && subdomain !== 'app') {
    // Redirect to org-specific route
    return navigateTo(`/app/${subdomain}${to.path}`)
  }
})

// utils/tenant-utils.ts
export const getSubdomain = (url: string) => {
  const hostname = new URL(url).hostname
  return hostname.split('.')[0]
}
```

#### 3. **Automatic Tenant Creation Flow**
```typescript
// composables/useOnboarding.ts
export const useOnboarding = () => {
  const createTenant = async (businessData: BusinessInfo) => {
    const batch = db.batch()
    const orgId = generateId()
    const slug = generateSlug(businessData.name)
    
    // 1. Create organization
    const orgRef = db.collection('organizations').doc(orgId)
    batch.set(orgRef, {
      id: orgId,
      name: businessData.name,
      slug,
      industry: businessData.industry,
      plan: 'trial',
      createdAt: serverTimestamp(),
      createdBy: user.uid
    })
    
    // 2. Add owner to organization
    const memberRef = db
      .collection('organizations')
      .doc(orgId)
      .collection('members')
      .doc(user.uid)
    
    batch.set(memberRef, {
      userId: user.uid,
      role: 'owner',
      status: 'active',
      joinedAt: serverTimestamp()
    })
    
    // 3. Update user organizations
    const userRef = db.collection('users').doc(user.uid)
    batch.update(userRef, {
      [`organizations.${orgId}`]: {
        role: 'owner',
        joinedAt: serverTimestamp(),
        status: 'active'
      }
    })
    
    // 4. Create default categories based on industry
    const categories = getDefaultCategories(businessData.industry)
    categories.forEach(category => {
      const catRef = orgRef.collection('categories').doc()
      batch.set(catRef, category)
    })
    
    await batch.commit()
    return { orgId, slug }
  }
  
  return { createTenant }
}
```

### Team Management System

#### 1. **Invitation Flow**
```typescript
// composables/useTeamManagement.ts
export const useTeamManagement = () => {
  const inviteMember = async (email: string, role: UserRole) => {
    const inviteToken = generateSecureToken()
    
    // 1. Create pending invitation
    await db
      .collection('organizations')
      .doc(currentOrg.id)
      .collection('invitations')
      .add({
        email,
        role,
        inviteToken,
        invitedBy: user.uid,
        status: 'pending',
        expiresAt: addDays(new Date(), 7),
        createdAt: serverTimestamp()
      })
    
    // 2. Send invitation email
    await sendInvitationEmail({
      to: email,
      orgName: currentOrg.name,
      inviteUrl: `${baseUrl}/join/${inviteToken}`,
      inviterName: user.displayName,
      role
    })
  }
  
  const acceptInvitation = async (inviteToken: string) => {
    const inviteQuery = await db
      .collectionGroup('invitations')
      .where('inviteToken', '==', inviteToken)
      .where('status', '==', 'pending')
      .limit(1)
      .get()
    
    if (inviteQuery.empty) {
      throw new Error('Invalid or expired invitation')
    }
    
    const invitation = inviteQuery.docs[0]
    const inviteData = invitation.data()
    const orgId = invitation.ref.parent.parent.id
    
    // Add user to organization
    const batch = db.batch()
    
    // Update invitation status
    batch.update(invitation.ref, { 
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      acceptedBy: user.uid
    })
    
    // Add to organization members
    const memberRef = db
      .collection('organizations')
      .doc(orgId)
      .collection('members')
      .doc(user.uid)
    
    batch.set(memberRef, {
      userId: user.uid,
      role: inviteData.role,
      status: 'active',
      invitedBy: inviteData.invitedBy,
      joinedAt: serverTimestamp()
    })
    
    // Update user organizations
    batch.update(db.collection('users').doc(user.uid), {
      [`organizations.${orgId}`]: {
        role: inviteData.role,
        joinedAt: serverTimestamp(),
        status: 'active'
      }
    })
    
    await batch.commit()
  }
  
  return { inviteMember, acceptInvitation }
}
```

## 🔐 Security & Firestore Rules

### Comprehensive Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organization-level security
    match /organizations/{orgId} {
      // Only organization members can read organization
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.members.keys();
      
      // Only owners can update organization
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role == 'owner';
      
      // Organization subcollections
      match /{collection}/{docId} {
        // Members can read all organization data
        allow read: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/organizations/$(orgId)).data.members.keys();
        
        // Write permissions based on role and collection
        allow write: if request.auth != null && 
          hasWritePermission(orgId, collection);
      }
      
      // Team members subcollection
      match /members/{memberId} {
        allow read: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/organizations/$(orgId)).data.members.keys();
        
        allow write: if request.auth != null && 
          (request.auth.uid == memberId || 
           get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role in ['owner', 'admin']);
      }
    }
    
    // Helper function for write permissions
    function hasWritePermission(orgId, collection) {
      let userRole = get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role;
      
      return userRole == 'owner' || userRole == 'admin' ||
        (userRole == 'manager' && collection in ['products', 'Sales', 'customers']) ||
        (userRole == 'staff' && collection in ['Sales']) ||
        (userRole == 'accountant' && collection in ['Sales']);
    }
  }
}
```

## 🚀 Complete Development Roadmap

### Phase 1: Foundation & Company Profile (Month 1-2)
- [ ] **Company Profile Website**
  - [ ] Landing page with compelling value proposition
  - [ ] Feature showcase with screenshots/videos
  - [ ] Pricing page with clear tiers
  - [ ] Case studies & testimonials
  - [ ] Demo request form with lead capture
  - [ ] Blog for content marketing

- [ ] **Basic ERP Setup**
  - [ ] Firebase project setup
  - [ ] Authentication system
  - [ ] Basic dashboard structure
  - [ ] Onboarding wizard UI

### Phase 2: Core MVP & Onboarding (Month 2-3)
- [ ] **Automated Tenant Creation**
  - [ ] Business info collection
  - [ ] Industry-based templates
  - [ ] Database schema auto-creation
  - [ ] Subdomain/slug generation

- [ ] **Team Management**
  - [ ] Invitation system
  - [ ] Role-based permissions
  - [ ] Member management UI

- [ ] **Basic ERP Features**
  - [ ] Product management
  - [ ] Simple order processing
  - [ ] Customer database
  - [ ] Basic inventory tracking

### Phase 3: E-commerce Integration (Month 3-4)
- [ ] **TikTok Shop Integration**
  - [ ] OAuth connection flow
  - [ ] Order sync functionality
  - [ ] Product sync capabilities
  - [ ] Inventory sync

- [ ] **Shopee Integration**
  - [ ] Similar integration pattern
  - [ ] Multi-channel order dashboard

### Phase 4: Advanced Features (Month 4-6)
- [ ] **Analytics & Reporting**
  - [ ] Sales performance dashboard
  - [ ] Channel comparison
  - [ ] Profit/loss tracking
  - [ ] Custom reports

- [ ] **Automation & Optimization**
  - [ ] Automated stock alerts
  - [ ] Auto-sync scheduling
  - [ ] Bulk operations
  - [ ] Advanced filtering & search

- [ ] **Mobile Responsiveness**
  - [ ] Mobile-optimized dashboard
  - [ ] Touch-friendly order processing
  - [ ] Mobile notifications

### Phase 5: Scale & Business Growth (Month 6+)
- [ ] **Additional Integrations**
  - [ ] Tokopedia API
  - [ ] Lazada integration
  - [ ] Instagram Shopping
  - [ ] WhatsApp Business API

- [ ] **Advanced Business Features**
  - [ ] Multi-warehouse management
  - [ ] Advanced pricing rules
  - [ ] Customer loyalty programs
  - [ ] Automated marketing campaigns

- [ ] **Enterprise Features**
  - [ ] White-label options
  - [ ] Custom branding
  - [ ] Advanced analytics
  - [ ] API for third-party integrations

## 💰 Revenue Strategy & Monetization

### Pricing Tiers
```typescript
interface PricingPlan {
  name: string
  price: number // in IDR
  billing: 'monthly' | 'yearly'
  features: string[]
  limits: {
    stores: number
    users: number
    orders: number
    storage: string
  }
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Trial',
    price: 0,
    billing: 'monthly',
    features: ['All features access', 'Email support'],
    limits: { stores: 1, users: 2, orders: 100, storage: '100MB' }
  },
  {
    name: 'Basic',
    price: 299000,
    billing: 'monthly',
    features: [
      'Multi-channel sync',
      'Basic analytics', 
      'Email support',
      'Mobile access'
    ],
    limits: { stores: 2, users: 3, orders: 1000, storage: '1GB' }
  },
  {
    name: 'Pro',
    price: 599000,
    billing: 'monthly',
    features: [
      'Advanced analytics',
      'Automated workflows',
      'Priority support',
      'Custom reports',
      'API access'
    ],
    limits: { stores: 5, users: 10, orders: 10000, storage: '5GB' }
  },
  {
    name: 'Enterprise',
    price: 1299000,
    billing: 'monthly',
    features: [
      'White-label options',
      'Custom integrations',
      'Dedicated support',
      'Advanced security',
      'Multi-warehouse'
    ],
    limits: { stores: -1, users: -1, orders: -1, storage: 'Unlimited' }
  }
]
```

### Lead Generation Strategy
1. **SEO-Optimized Content**
   - Blog posts tentang tips bisnis UMKM
   - Tutorial e-commerce management
   - Industry-specific guides

2. **Social Proof & Case Studies**
   - Success stories dari client
   - Before/after business transformations
   - ROI testimonials

3. **Free Resources & Tools**
   - Free inventory calculator
   - Profit margin calculator
   - Business planning templates

4. **Webinar & Educational Content**
   - Monthly webinar "Tips Jualan Online"
   - YouTube channel dengan tutorial
   - Instagram tips & tricks

## 🔧 Technical Implementation Details

### Firebase Configuration
```typescript
// firebase.config.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)
```

### Multi-Tenant Firestore Helpers
```typescript
// utils/firestore-helpers.ts
export class TenantFirestore {
  constructor(private orgId: string) {}
  
  // Get organization-scoped collection reference
  collection(path: string) {
    return db
      .collection('organizations')
      .doc(this.orgId)
      .collection(path)
  }
  
  // Batch operations with organization context
  async batchWrite(operations: BatchOperation[]) {
    const batch = db.batch()
    
    operations.forEach(op => {
      const ref = this.collection(op.collection).doc(op.id)
      switch (op.type) {
        case 'set':
          batch.set(ref, { ...op.data, orgId: this.orgId })
          break
        case 'update':
          batch.update(ref, op.data)
          break
        case 'delete':
          batch.delete(ref)
          break
      }
    })
    
    return batch.commit()
  }
  
  // Query with automatic organization filtering
  async query(collection: string, constraints: QueryConstraint[] = []) {
    const ref = this.collection(collection)
    return query(ref, ...constraints)
  }
}

// Usage in composables
export const useFirestore = () => {
  const { currentOrg } = useCurrentOrg()
  
  const tenantDb = computed(() => 
    new TenantFirestore(currentOrg.value?.id!)
  )
  
  return { db: tenantDb }
}
```

### Onboarding Wizard Implementation
```vue
<!-- pages/onboarding/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="flex items-center"
          >
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
                currentStep >= index ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div 
              v-if="index < steps.length - 1"
              :class="[
                'w-16 h-1 mx-4',
                currentStep > index ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            />
          </div>
        </div>
        <div class="text-center mt-4">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ steps[currentStep].title }}
          </h2>
          <p class="text-gray-600 mt-2">
            {{ steps[currentStep].description }}
          </p>
        </div>
      </div>

      <!-- Step Content -->
      <div class="max-w-2xl mx-auto">
        <component 
          :is="steps[currentStep].component"
          :data="onboardingData"
          @next="handleNext"
          @back="handleBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WelcomeStep from '~/components/onboarding/WelcomeStep.vue'
import BusinessInfoStep from '~/components/onboarding/BusinessInfoStep.vue'
import IndustrySelectionStep from '~/components/onboarding/IndustrySelectionStep.vue'
import StoreConnectionStep from '~/components/onboarding/StoreConnectionStep.vue'
import TeamInviteStep from '~/components/onboarding/TeamInviteStep.vue'
import CompletionStep from '~/components/onboarding/CompletionStep.vue'

const { createTenant, updateOnboardingProgress } = useOnboarding()

const currentStep = ref(0)
const onboardingData = ref({})

const steps = [
  {
    id: 'welcome',
    title: 'Selamat Datang!',
    description: 'Mari mulai setup bisnis Anda',
    component: WelcomeStep
  },
  {
    id: 'business-info',
    title: 'Info Bisnis',
    description: 'Ceritakan tentang bisnis Anda',
    component: BusinessInfoStep
  },
  {
    id: 'industry',
    title: 'Jenis Industri',
    description: 'Pilih kategori bisnis Anda',
    component: IndustrySelectionStep
  },
  {
    id: 'stores',
    title: 'Hubungkan Toko',
    description: 'Koneksikan akun e-commerce Anda',
    component: StoreConnectionStep
  },
  {
    id: 'team',
    title: 'Undang Tim',
    description: 'Tambahkan anggota tim (opsional)',
    component: TeamInviteStep
  },
  {
    id: 'complete',
    title: 'Selesai!',
    description: 'Bisnis Anda siap untuk dikelola',
    component: CompletionStep
  }
]

const handleNext = async (stepData: any) => {
  onboardingData.value = { ...onboardingData.value, ...stepData }
  
  if (currentStep.value === steps.length - 1) {
    // Complete onboarding
    await completeOnboarding()
  } else {
    currentStep.value++
    await updateOnboardingProgress(steps[currentStep.value].id)
  }
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const completeOnboarding = async () => {
  try {
    const { orgId, slug } = await createTenant(onboardingData.value)
    await navigateTo(`/app/${slug}`)
  } catch (error) {
    // Handle error
    console.error('Onboarding failed:', error)
  }
}
</script>
```

### E-commerce Integration Service
```typescript
// services/IntegrationService.ts
export class IntegrationService {
  constructor(private orgId: string) {}
  
  async connectTiktokStore(credentials: TiktokCredentials) {
    try {
      // 1. Validate credentials with TikTok API
      const storeInfo = await this.validateTiktokCredentials(credentials)
      
      // 2. Save encrypted credentials
      const integration = {
        platform: 'tiktok',
        isActive: true,
        storeInfo,
        credentials: await this.encryptCredentials(credentials),
        syncSettings: {
          autoSyncOrders: true,
          autoSyncProducts: false,
          autoSyncInventory: true,
          syncInterval: 15 // minutes
        },
        createdAt: serverTimestamp()
      }
      
      await db
        .collection('organizations')
        .doc(this.orgId)
        .collection('integrations')
        .doc('tiktok')
        .set(integration)
      
      // 3. Trigger initial sync
      await this.triggerInitialSync('tiktok')
      
      return { success: true, storeInfo }
    } catch (error) {
      throw new Error(`TikTok connection failed: ${error.message}`)
    }
  }
  
  async syncOrders(platform: string) {
    const integration = await this.getIntegration(platform)
    if (!integration?.isActive) {
      throw new Error(`${platform} integration not active`)
    }
    
    const credentials = await this.decryptCredentials(integration.credentials)
    
    switch (platform) {
      case 'tiktok':
        return this.syncTiktokOrders(credentials)
      case 'shopee':
        return this.syncShopeeOrders(credentials)
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }
  
  private async syncTiktokOrders(credentials: any) {
    const orders = await this.fetchTiktokOrders(credentials)
    const batch = db.batch()
    
    for (const orderData of orders) {
      const orderId = `tiktok_${orderData.id}`
      const orderRef = db
        .collection('organizations')
        .doc(this.orgId)
        .collection('Sales')
        .doc(orderId)
      
      const transformedOrder = this.transformTiktokOrder(orderData)
      batch.set(orderRef, transformedOrder, { merge: true })
      
      // Update inventory
      for (const item of transformedOrder.items) {
        const inventoryRef = db
          .collection('organizations')
          .doc(this.orgId)
          .collection('inventory')
          .doc(item.variantId)
        
        batch.update(inventoryRef, {
          reservedQuantity: FieldValue.increment(item.quantity)
        })
      }
    }
    
    await batch.commit()
    
    // Update sync status
    await this.updateSyncStatus('tiktok', {
      lastSyncAt: serverTimestamp(),
      syncStatus: 'connected',
      recordsSynced: orders.length
    })
    
    return { synced: orders.length }
  }
}
```

### Permission System Implementation
```typescript
// utils/permissions.ts
export enum Permission {
  // Products
  PRODUCTS_READ = 'products:read',
  PRODUCTS_WRITE = 'products:write',
  PRODUCTS_DELETE = 'products:delete',
  
  // Orders
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  ORDERS_DELETE = 'orders:delete',
  
  // Customers
  CUSTOMERS_READ = 'customers:read',
  CUSTOMERS_WRITE = 'customers:write',
  
  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',
  
  // Team Management
  TEAM_READ = 'team:read',
  TEAM_INVITE = 'team:invite',
  TEAM_MANAGE = 'team:manage',
  
  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_WRITE = 'settings:write',
  
  // Integrations
  INTEGRATIONS_READ = 'integrations:read',
  INTEGRATIONS_WRITE = 'integrations:write'
}

export const ROLE_PERMISSIONS = {
  owner: Object.values(Permission), // All permissions
  admin: [
    Permission.PRODUCTS_READ, Permission.PRODUCTS_WRITE, Permission.PRODUCTS_DELETE,
    Permission.ORDERS_READ, Permission.ORDERS_WRITE, Permission.ORDERS_DELETE,
    Permission.CUSTOMERS_READ, Permission.CUSTOMERS_WRITE,
    Permission.ANALYTICS_READ, Permission.ANALYTICS_EXPORT,
    Permission.TEAM_READ, Permission.TEAM_INVITE,
    Permission.SETTINGS_READ, Permission.SETTINGS_WRITE,
    Permission.INTEGRATIONS_READ, Permission.INTEGRATIONS_WRITE
  ],
  manager: [
    Permission.PRODUCTS_READ, Permission.PRODUCTS_WRITE,
    Permission.ORDERS_READ, Permission.ORDERS_WRITE,
    Permission.CUSTOMERS_READ, Permission.CUSTOMERS_WRITE,
    Permission.ANALYTICS_READ,
    Permission.TEAM_READ,
    Permission.SETTINGS_READ,
    Permission.INTEGRATIONS_READ
  ],
  staff: [
    Permission.PRODUCTS_READ,
    Permission.ORDERS_READ, Permission.ORDERS_WRITE,
    Permission.CUSTOMERS_READ, Permission.CUSTOMERS_WRITE,
    Permission.TEAM_READ
  ],
  accountant: [
    Permission.ORDERS_READ,
    Permission.CUSTOMERS_READ,
    Permission.ANALYTICS_READ, Permission.ANALYTICS_EXPORT,
    Permission.TEAM_READ
  ],
  viewer: [
    Permission.PRODUCTS_READ,
    Permission.ORDERS_READ,
    Permission.CUSTOMERS_READ,
    Permission.ANALYTICS_READ,
    Permission.TEAM_READ
  ]
} as const

// Permission checking composable
export const usePermissions = () => {
  const { currentMember } = useCurrentOrg()
  
  const hasPermission = (permission: Permission): boolean => {
    if (!currentMember.value) return false
    
    const userRole = currentMember.value.role
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    
    return rolePermissions.includes(permission)
  }
  
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }
  
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}
```

### Deployment Configuration

#### Firebase Hosting Configuration
```json
{
  "hosting": [
    {
      "target": "company-profile",
      "public": "company-profile/.output/public",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "erp-app",
      "public": "erp-app/.output/public",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "**/*.@(js|css)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=31536000, immutable"
            }
          ]
        }
      ]
    }
  ],
  "functions": {
    "source": "firebase-functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

#### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd company-profile && npm ci
        cd ../erp-app && npm ci
        cd ../firebase-functions && npm ci
    
    - name: Build Company Profile
      run: |
        cd company-profile
        npm run build
    
    - name: Build ERP App
      run: |
        cd erp-app
        npm run build
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: your-project-id
```

## 🎯 Success Metrics & KPIs

### Business Metrics
- **Customer Acquisition Cost (CAC)**
- **Monthly Recurring Revenue (MRR)**
- **Customer Lifetime Value (CLV)**
- **Churn Rate**
- **Trial to Paid Conversion Rate**
- **Net Promoter Score (NPS)**

### Product Metrics
- **Daily/Monthly Active Users**
- **Feature Adoption Rates**
- **Time to First Value (onboarding completion)**
- **Support Ticket Volume**
- **System Uptime & Performance**

### Technical Metrics
- **Page Load Times**
- **API Response Times**
- **Error Rates**
- **Database Query Performance**
- **Firebase Usage & Costs**

---

## 🎉 Conclusion

This comprehensive ERP SaaS platform combines the power of modern web technologies with a solid business strategy. The architecture supports scalable multi-tenancy, seamless e-commerce integrations, and provides a complete user journey from discovery to daily operations.

Key success factors:
- **Strong value proposition** through the company profile website
- **Frictionless onboarding** with automated tenant creation
- **Robust multi-tenant architecture** ensuring data isolation
- **Comprehensive team management** with role-based permissions
- **Scalable technology stack** using Firebase ecosystem
- **Clear monetization strategy** with tiered pricing

The phased development approach ensures you can start generating revenue early while continuously improving the product based on user feedback.

---

*Ready to revolutionize UMKM management in Indonesia! 🚀*
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
- **Main Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **UI Components:** Shadcn Vue
- **Styling:** Tailwind CSS
- **Router:** Vue Router 4
- **State Management:** Pinia
- **Form Handling:** VeeValidate + Zod
- **Charts:** Recharts / ApexCharts
- **Icons:** Lucide Vue
- **HTTP Client:** Axios / Ofetch

### Backend & Database
- **Authentication:** Firebase Auth
- **Database:**
    - **Primary:** Firebase Firestore (NoSQL)
    - **Analytics:** Firebase Analytics
    - **Storage:** Firebase Storage
    - **Functions:** Firebase Cloud Functions
- **Caching:** Redis Cloud (optional)
- **Search:** Algolia (untuk product search)

### Integration & APIs
- **Validation:** Zod schemas
- **Background Jobs:** Firebase Cloud Functions + Pub/Sub
- **Email Service:** Firebase Extensions (SendGrid/Mailgun)
- **File Processing:** Firebase Storage + Cloud Functions

### DevOps & Tools
- **Hosting:**
    - Company Profile: Vercel/Netlify
    - ERP App: Firebase Hosting / Vercel
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
// /organizations/{orgId}/sales/{orderId}
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

## 📁 Struktur Project (Vue.js 3)

### Complete Project Structure
```
erp-saas-platform/
├── 📁 company-profile/              # Landing & marketing site (Vue 3)
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   ├── 📁 components/
│   │   │   ├── 📁 sections/
│   │   │   │   ├── HeroSection.vue
│   │   │   │   ├── FeaturesSection.vue
│   │   │   │   ├── PricingSection.vue
│   │   │   │   ├── TestimonialsSection.vue
│   │   │   │   └── CTASection.vue
│   │   │   ├── 📁 forms/
│   │   │   │   ├── ContactForm.vue
│   │   │   │   ├── DemoRequestForm.vue
│   │   │   │   └── NewsletterForm.vue
│   │   │   └── 📁 ui/              # Shadcn Vue components
│   │   ├── 📁 views/
│   │   │   ├── HomeView.vue
│   │   │   ├── AboutView.vue
│   │   │   ├── FeaturesView.vue
│   │   │   ├── PricingView.vue
│   │   │   ├── CaseStudiesView.vue
│   │   │   └── ContactView.vue
│   │   ├── 📁 router/
│   │   │   └── index.ts
│   │   ├── 📁 stores/              # Pinia stores
│   │   │   └── form.ts
│   │   ├── App.vue
│   │   └── main.ts
│   ├── vite.config.ts
│   └── package.json
│
├── 📁 erp-app/                      # Main ERP application (Vue 3)
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 ui/              # Shadcn Vue components
│   │   │   ├── 📁 layout/
│   │   │   │   ├── AppHeader.vue
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   ├── TenantSwitcher.vue
│   │   │   │   └── UserMenu.vue
│   │   │   ├── 📁 onboarding/
│   │   │   │   ├── WelcomeStep.vue
│   │   │   │   ├── BusinessInfoStep.vue
│   │   │   │   ├── IndustrySelectionStep.vue
│   │   │   │   ├── StoreConnectionStep.vue
│   │   │   │   └── TeamInviteStep.vue
│   │   │   ├── 📁 finance/
│   │   │   ├── 📁 humanresources/
│   │   │   ├── 📁 inventory/
│   │   │   ├── 📁 purchasing/
│   │   │   ├── 📁 reports/
│   │   │   ├── 📁 sales/
│   │   │   ├── 📁 settings/
│   │   │   └── 📁 team/
│   │   │       ├── MemberList.vue
│   │   │       ├── InviteMember.vue
│   │   │       ├── RoleSelector.vue
│   │   │       └── PermissionMatrix.vue
│   │   │
│   │   ├── 📁 composables/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFirestore.ts
│   │   │   ├── useCurrentOrg.ts
│   │   │   ├── usePermissions.ts
│   │   │   ├── useOnboarding.ts
│   │   │   ├── useTeamManagement.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useOrders.ts
│   │   │   ├── useIntegrations.ts
│   │   │   └── useSubscription.ts
│   │   │
│   │   ├── 📁 router/
│   │   │   ├── index.ts
│   │   │   └── guards.ts           # Route guards
│   │   │
│   │   ├── 📁 views/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── 📁 onboarding/
│   │   │   ├── 📁 home/
│   │   │   │   └── HomeDashboard.vue
│   │   │   ├── 📁 finance/
│   │   │   │   ├── FinanceDashboard.vue
│   │   │   │   ├── CashFlow.vue
│   │   │   │   ├── FinancialReports.vue
│   │   │   │   └── GeneralLedger.vue
│   │   │   ├── 📁 humanresources/
│   │   │   │   ├── HRDashboard.vue
│   │   │   │   ├── Employees.vue
│   │   │   │   ├── Attendance.vue
│   │   │   │   └── Payroll.vue
│   │   │   ├── 📁 inventory/
│   │   │   ├── 📁 purchasing/
│   │   │   ├── 📁 reports/
│   │   │   ├── 📁 sales/
│   │   │   └── 📁 settings/
│   │   │
│   │   ├── 📁 stores/              # Pinia stores
│   │   │   ├── auth.ts
│   │   │   ├── organizations.ts
│   │   │   ├── currentOrg.ts
│   │   │   ├── onboarding.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   └── ui.ts
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── firebase.ts
│   │   │   ├── firestore-helpers.ts
│   │   │   ├── permissions.ts
│   │   │   ├── tenant-utils.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── 📁 layouts/
│   │   │   └── MainLayout.vue
│   │   │
│   │   ├── App.vue
│   │   └── main.ts
│   │
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── components.json              # Shadcn Vue config
│   └── package.json
│
├── 📁 firebase-functions/           # Firebase Cloud Functions
│   ├── 📁 src/
│   │   ├── 📁 triggers/
│   │   ├── 📁 scheduled/
│   │   ├── 📁 sync/
│   │   ├── 📁 notifications/
│   │   └── 📁 onboarding/
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 shared/                       # Shared TypeScript types
│   ├── 📁 types/
│   ├── 📁 utils/
│   ├── 📁 constants/
│   └── 📁 validation/
│
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 firebase.json
├── 📄 firestore.rules
├── 📄 package.json
└── 📄 README.md
```

## 🏢 Multi-Tenant Strategy

### Tenant Isolation Model

#### 1. **Organization-Based Tenancy**
```typescript
// composables/useFirestore.ts
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/utils/firebase'

export const useFirestore = () => {
  const { currentOrg } = useCurrentOrg()

  // Auto-filter queries by organization
  const getProducts = async () => {
    const productsRef = collection(
      db,
      'organizations',
      currentOrg.value.id,
      'products'
    )
    
    const q = query(productsRef, where('isActive', '==', true))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  return { getProducts }
}
```

#### 2. **Route-Based Organization Context**
```typescript
// router/guards.ts
import { useCurrentOrg } from '@/composables/useCurrentOrg'

export const organizationGuard = (to, from, next) => {
  const { setCurrentOrg, hasAccess } = useCurrentOrg()
  const orgSlug = to.params.orgSlug
  
  if (orgSlug) {
    if (hasAccess(orgSlug)) {
      setCurrentOrg(orgSlug)
      next()
    } else {
      next('/unauthorized')
    }
  } else {
    next()
  }
}
```

#### 3. **Automatic Tenant Creation Flow**
```typescript
// composables/useOnboarding.ts
import { doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { useAuthStore } from '@/stores/auth'

export const useOnboarding = () => {
  const authStore = useAuthStore()
  
  const createTenant = async (businessData) => {
    const batch = writeBatch(db)
    const orgId = crypto.randomUUID()
    const slug = generateSlug(businessData.name)
    
    // 1. Create organization
    const orgRef = doc(db, 'organizations', orgId)
    batch.set(orgRef, {
      id: orgId,
      name: businessData.name,
      slug,
      industry: businessData.industry,
      plan: 'trial',
      createdAt: serverTimestamp(),
      createdBy: authStore.user.uid
    })
    
    // 2. Add owner to organization
    const memberRef = doc(db, 'organizations', orgId, 'members', authStore.user.uid)
    batch.set(memberRef, {
      userId: authStore.user.uid,
      role: 'owner',
      status: 'active',
      joinedAt: serverTimestamp()
    })
    
    // 3. Update user organizations
    const userRef = doc(db, 'users', authStore.user.uid)
    batch.update(userRef, {
      [`organizations.${orgId}`]: {
        role: 'owner',
        joinedAt: serverTimestamp(),
        status: 'active'
      }
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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/utils/firebase'

export const useTeamManagement = () => {
  const { currentOrg } = useCurrentOrg()
  const { user } = useAuthStore()
  
  const inviteMember = async (email: string, role: string) => {
    const inviteToken = crypto.randomUUID()
    
    // Create pending invitation
    await addDoc(
      collection(db, 'organizations', currentOrg.value.id, 'invitations'),
      {
        email,
        role,
        inviteToken,
        invitedBy: user.uid,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp()
      }
    )
    
    // Send invitation email (via Firebase Function)
    await sendInvitationEmail({
      to: email,
      orgName: currentOrg.value.name,
      inviteUrl: `${window.location.origin}/join/${inviteToken}`,
      inviterName: user.displayName,
      role
    })
  }
  
  return { inviteMember }
}
```

## 🔐 Security & Firestore Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(orgId) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role == 'owner';
    }
    
    function isMember(orgId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Organizations
    match /organizations/{orgId} {
      allow read: if isMember(orgId);
      allow update: if isOwner(orgId);
      
      // Organization subcollections
      match /{collection}/{docId} {
        allow read: if isMember(orgId);
        allow write: if isMember(orgId);
      }
      
      // Members subcollection
      match /members/{memberId} {
        allow read: if isMember(orgId);
        allow write: if isOwner(orgId);
      }
    }
  }
}
```

## 🚀 Development Setup

### Prerequisites
```bash
- Node.js 18+
- npm atau pnpm
- Firebase CLI
- Git
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd erp-saas-platform

# Install dependencies
npm install

# Setup Firebase
firebase login
firebase init

# Setup environment variables
cp .env.example .env
# Edit .env dengan Firebase credentials Anda

# Install ERP App dependencies
cd erp-app
npm install

# Run development server
npm run dev
```

### Build untuk Production

```bash
# Build ERP App
cd erp-app
npm run build

# Deploy ke Firebase
firebase deploy --only hosting:erp-app
```

## 📊 Complete Development Roadmap

### Phase 1: Foundation (Month 1-2)
- [x] Setup Vue 3 + Vite project
- [x] Install Shadcn Vue components
- [x] Setup Firebase configuration
- [x] Implement authentication system
- [x] Create basic dashboard layout
- [ ] Design onboarding wizard

### Phase 2: Core MVP (Month 2-3)
- [ ] Automated tenant creation
- [ ] Team management system
- [ ] Product management module
- [ ] Basic order processing
- [ ] Customer database
- [ ] Inventory tracking

### Phase 3: E-commerce Integration (Month 3-4)
- [ ] TikTok Shop integration
- [ ] Shopee integration
- [ ] Multi-channel order dashboard
- [ ] Product sync functionality
- [ ] Inventory sync

### Phase 4: Advanced Features (Month 4-6)
- [ ] Analytics & reporting dashboard
- [ ] Sales performance metrics
- [ ] Automated stock alerts
- [ ] Bulk operations
- [ ] Advanced filtering

### Phase 5: Scale & Growth (Month 6+)
- [ ] Tokopedia integration
- [ ] Lazada integration
- [ ] Multi-warehouse management
- [ ] Customer loyalty programs
- [ ] API for third-party integrations

---

## 🎉 Conclusion

Platform ERP SaaS ini dibangun dengan Vue.js 3, Vite, dan Firebase untuk memberikan solusi manajemen bisnis yang scalable dan modern untuk UMKM Indonesia. Dengan arsitektur multi-tenant yang solid dan integrasi e-commerce yang komprehensif, platform ini siap untuk mendukung pertumbuhan bisnis Anda.

**Key Technologies:**
- Vue 3 Composition API untuk reactive & maintainable code
- Shadcn Vue untuk beautiful & accessible UI components
- Firebase untuk backend-as-a-service yang scalable
- Pinia untuk state management yang powerful
- Vue Router 4 untuk routing yang flexible

---

*Ready to revolutionize UMKM management in Indonesia!*
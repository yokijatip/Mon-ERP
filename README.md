# Dokumentasi ERP Multi-Channel SaaS Platform

## 📋 Daftar Isi

* [Business Model & User Journey](#business-model--user-journey)
* [Tech Stack](#tech-stack)
* [Platform Architecture](#platform-architecture)
* [Database Schema](#database-schema)
* [Struktur Project](#struktur-project)
* [Multi-Tenant Strategy](#multi-tenant-strategy)
* [API Integration](#api-integration)
* [Security & Authentication](#security--authentication)
* [Deployment Strategy](#deployment-strategy)

## 🎯 Business Model & User Journey

### Complete User Journey Flow

#### 1. **Discovery Phase (Company Profile Website)**

```
Landing Page → About Us → Services → Portfolio → Testimonials → Contact/Demo
```

**Target Visitor:** Owner UMKM yang butuh solusi manajemen bisnis

**Key Pages:**

* **Homepage:** Hero section dengan value proposition yang kuat
* **Features:** Showcase fitur ERP dengan screenshots & videos
* **Pricing:** Transparent pricing tiers (Basic, Pro, Enterprise)
* **Case Studies:** Success stories dari client existing
* **Demo Request:** Form untuk request demo/trial

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
Business setup complete → Tenant auto-created di Firestore:
├── Unique slug: pt-maju-mundur (untuk URL)
├── Data terisolasi dengan orgId
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

* Daily operations via ERP dashboard
* Multi-channel order management
* Real-time inventory sync
* Analytics & reporting
* Continuous onboarding of new features

### Revenue Model

* **Freemium:** 14-day full access trial
* **Basic Plan:** Rp 299K/bulan - 1 store, 2 users, basic features
* **Pro Plan:** Rp 599K/bulan - 3 stores, 5 users, advanced analytics
* **Enterprise:** Custom pricing - unlimited stores/users, white-label

---

## 🔧 Tech Stack

### Frontend Stack

* **Main Framework:** Vue 3 (Composition API)
* **Build Tool:** Vite
* **UI Components:** Shadcn Vue
* **Styling:** Tailwind CSS 4
* **Router:** Vue Router 4
* **State Management:** Pinia
* **Form Handling:** VeeValidate + Zod
* **Charts:** ApexCharts
* **Icons:** Lucide Vue
* **Data Fetching:** TanStack Query
* **HTTP Client:** Axios / Ofetch

### Backend & Database

* **Authentication:** Firebase Auth
* **Database: Firebase Firestore (NoSQL)**
* **Analytics:** Firebase Analytics
* **Storage:** Firebase Storage / Cloudinary
* **Functions:** Firebase Cloud Functions
* **Caching/Queue (optional):** Redis Cloud / RabbitMQ

### Integration & APIs

* **Validation:** Zod schemas
* **Background Jobs:** Firebase Cloud Functions + Pub/Sub
* **Email Service:** Firebase Extensions (SendGrid/Mailgun)
* **File Processing:** Firebase Storage + Cloud Functions

### DevOps & Tools

* **Hosting:**

  * Company Profile: Vercel/Netlify
  * ERP App: Firebase Hosting / Vercel
* **CI/CD:** GitHub Actions
* **Monitoring:** Firebase Crashlytics + Google Analytics
* **Error Tracking:** Sentry (optional)
* **Domain Management:** Cloudflare

---

## 🏗️ Platform Architecture

### Dual-Site Architecture

```
COMPANY PROFILE (yourdomain.com)
  • Landing Page
  • About Us
  • Services
  • Portfolio
  • Testimonials
  • Contact/Demo

ERP APPLICATION (app.yourdomain.com)
  • Multi-tenant Dashboard
  • Product Management
  • Order Processing
  • E-commerce Integration
  • Analytics & Reports
  • Team Management
  • Billing & Subscriptions
```

### Multi-Tenant Database Design (Firestore)

```
Firestore Database Structure:
├── /organizations/{orgId}/
│   ├── info
│   ├── members
│   ├── products
│   ├── orders
│   ├── customers
│   ├── inventory
│   ├── integrations
│   └── analytics
├── /users/{userId}/
│   ├── profile
│   └── organizations
└── /global/
    ├── industries
    ├── features
    └── system
```

---

## 🗄️ Database Schema (Firestore)

### Organizations Collection

```typescript
interface Organization {
  id: string
  name: string
  slug: string
  industry: string
  plan: 'trial' | 'basic' | 'pro' | 'enterprise'
  planStatus: 'active' | 'expired' | 'cancelled'
  subscriptionExpiry: Timestamp
  businessInfo: {
    address: string
    phone: string
    email: string
    taxId?: string
    logo?: string
  }
  onboardingCompleted: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
}
```

### Users Collection

```typescript
interface User {
  id: string
  email: string
  profile: {
    fullName: string
    position?: string
  }
  organizations: {
    [orgId: string]: {
      role: 'owner' | 'admin' | 'staff'
      joinedAt: Timestamp
      status: 'active' | 'invited'
    }
  }
}
```

---

## 📁 Struktur Project (Vue.js 3)

Berbasis folder yang kamu kirim:

```
src/
├── assets/
├── components/
├── composables/
├── layouts/
├── lib/
│   ├── firebase.ts
│   └── utils.ts
├── router/
│   ├── index.ts
│   └── guards.ts
├── stores/
│   ├── auth.ts
│   ├── orgs.ts
│   ├── ui.ts
│   └── products.ts
├── types/
├── views/
│   ├── auth/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── ForgotPasswordView.vue
│   │   └── OnboardingView.vue
│   ├── home/
│   ├── finance/
│   ├── humanresources/
│   ├── inventory/
│   ├── purchasing/
│   ├── reports/
│   ├── sales/
│   └── settings/
├── App.vue
├── main.ts
└── style.css
```

---

## 🏢 Multi-Tenant Strategy

### Organization-Based Tenancy (Firestore)

* Setiap tenant = 1 dokumen `organizations/{orgId}`.
* Data tenant (produk, order, member) disimpan di subcollection.
* User bisa punya banyak org di `/users/{userId}/organizations`.

### Automatic Tenant Creation

* Saat onboarding selesai → buat orgId + slug otomatis.
* Tambahkan owner sebagai member di org tersebut.
* Update user untuk mapping ke org baru.

---

## 🔐 Security & Firestore Rules

```javascript
match /organizations/{orgId} {
  allow read: if isMember(orgId);
  allow update: if isOwner(orgId);
  match /{collection}/{docId} {
    allow read, write: if isMember(orgId);
  }
}
```

---

## 🚀 Development Setup

```bash
npm install
firebase login
firebase init
npm run dev
```

---

## 🎉 Conclusion

Platform ERP SaaS ini menggunakan Vue.js 3 + Firebase dengan arsitektur multi-tenant berbasis Firestore. Struktur project mengikuti best practice Vue 3, dengan dukungan Shadcn Vue, Tailwind CSS, Pinia, TanStack Query, Cloudinary, Redis/RabbitMQ (opsional), dan ApexCharts.

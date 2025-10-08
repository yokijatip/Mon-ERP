# MON-ERP - Multi-Tenant ERP SaaS Platform

## Overview
This is a Vue 3 + Firebase ERP (Enterprise Resource Planning) SaaS platform designed for SMEs (Small and Medium Enterprises). The platform provides multi-tenant architecture allowing multiple organizations to manage their business operations including inventory, sales, purchasing, finance, HR, and more.

## Tech Stack
- **Frontend Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite 7
- **UI Components:** Shadcn Vue with Reka UI
- **Styling:** Tailwind CSS 4
- **State Management:** Pinia
- **Router:** Vue Router 4
- **Data Fetching:** TanStack Vue Query
- **Charts:** ApexCharts (vue3-apexcharts)
- **Icons:** Lucide Vue Next
- **Backend Services:** Firebase (Auth, Firestore, Storage)

## Project Structure
```
src/
├── assets/          # Static assets
├── components/      # Reusable Vue components
├── composables/     # Vue composables for business logic
├── layouts/         # Layout components
├── lib/            # Core libraries (Firebase, utilities)
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
├── types/          # TypeScript type definitions
└── views/          # Page components organized by module
    ├── auth/       # Authentication views
    ├── finance/    # Financial management
    ├── home/       # Dashboard
    ├── humanresources/  # HR management
    ├── inventory/  # Inventory management
    ├── products/   # Product management
    ├── purchasing/ # Purchasing & suppliers
    ├── sales/      # Sales & customers
    └── settings/   # System settings
```

## Setup & Configuration

### Development Server
- **Port:** 5000
- **Host:** 0.0.0.0 (configured for Replit proxy)
- **HMR:** WebSocket over port 443
- **Command:** `npm run dev`

### Required Environment Variables
The following Firebase configuration variables are required:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

See `.env.example` for the template.

## Features
- **Multi-Tenant Architecture:** Organization-based data isolation using Firestore
- **Authentication:** Firebase Auth with role-based access control
- **Modules:**
  - Dashboard & Analytics
  - Product Management
  - Inventory & Warehouse Management
  - Sales & Customer Management
  - Purchase Orders & Supplier Management
  - Financial Management & Accounting
  - Human Resources & Payroll
  - Reporting & Exports
  - System Settings & Integrations

## Recent Changes (October 8, 2025)
- ✅ Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- ✅ Set up HMR over WebSocket for proper hot-reload in Replit
- ✅ Created `.env.example` template for Firebase configuration
- ✅ Installed all npm dependencies
- ✅ Configured Frontend Server workflow

## Deployment
The project uses Vite for building. To deploy:
1. Set environment variables in production
2. Run `npm run build` to create production bundle
3. Serve the `dist` folder using a static file server

## Firebase Setup
This application requires a Firebase project with:
- **Authentication:** Email/Password provider enabled
- **Firestore Database:** Multi-tenant structure with organization-based collections
- **Storage:** For file uploads (logos, documents, etc.)

## Notes
- The application uses a multi-tenant strategy where each organization has isolated data
- Users can belong to multiple organizations with different roles
- The platform follows Vue 3 Composition API best practices
- TypeScript is used throughout the project for type safety

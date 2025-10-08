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
  - **Product Management** ✅ (Sudah Berfungsi)
  - **Inventory & Warehouse Management** ✅ (Sudah Berfungsi)
    - Real-time Inventory Dashboard dengan statistik dan visualisasi
    - Stock Overview dengan multi-warehouse support
    - Stock Adjustments (In/Out/Transfer/Adjustment)
    - Comprehensive Stock Reports (Valuation, Movement, Low Stock Alert, Aging Analysis)
  - Sales & Customer Management
  - Purchase Orders & Supplier Management
  - Financial Management & Accounting
  - Human Resources & Payroll
  - Reporting & Exports
  - System Settings & Integrations

## Inventory Module - Fitur yang Sudah Berfungsi

### 1. Inventory Dashboard
- **Statistik Real-time:**
  - Total Products & Active SKUs
  - Low Stock Items Alert
  - Out of Stock Items
  - Total Inventory Value
- **Visualisasi:**
  - Stock Movement Trend (Bar Chart)
  - Category Distribution dengan persentase
  - Top Products by Value
  - Recent Stock Movements

### 2. Stock Overview
- Monitoring stok di semua warehouse
- Filter berdasarkan:
  - Search (Product/SKU)
  - Warehouse
  - Low Stock Only
- Detail informasi:
  - Quantity, Reserved, Available
  - Average Cost & Total Value
  - Status (In Stock/Low Stock/Out of Stock)

### 3. Stock Adjustments
- **Tipe Movement:**
  - Stock In - Penambahan stok
  - Stock Out - Pengurangan stok
  - Transfer - Transfer antar warehouse
  - Adjustment - Koreksi stok
- **Features:**
  - Auto-generate Movement Number
  - Product & Warehouse Selection
  - Cost Calculation
  - Reference Number & Notes
  - History tracking

### 4. Stock Reports
- **Valuation Report:**
  - Total Stock Value
  - Value per Category
  - Percentage distribution
- **Movement Report:**
  - Stock In/Out summary
  - Net Change calculation
  - Date range filter
- **Low Stock Alert:**
  - Items below threshold
  - Urgent reorder list
- **Aging Report:**
  - Fast Moving (< 30 days)
  - Normal Moving (30-90 days)
  - Slow Moving (90-180 days)
  - Dead Stock (> 180 days)

## Recent Changes (October 8, 2025)
- ✅ Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- ✅ Set up HMR over WebSocket for proper hot-reload in Replit
- ✅ Created `.env.example` template for Firebase configuration
- ✅ Installed all npm dependencies
- ✅ Configured Frontend Server workflow
- ✅ Configured deployment settings (autoscale)
- ✅ **Memfungsikan semua fitur Inventory Module:**
  - ✅ **InventoryDashboard** - Dashboard real-time dengan data dari Firebase (statistik, grafik, top products, recent movements)
  - ✅ **StockOverview** - Monitoring level stok di semua warehouse dengan filter
  - ✅ **Adjustments** - Manajemen stock movements (Stock In, Stock Out, Transfer, Adjustment)
  - ✅ **StockReports** - Laporan lengkap (Valuation, Movement, Low Stock, Aging)

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

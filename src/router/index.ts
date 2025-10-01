// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { authGuard, onboardingGuard } from './guards'

const routes: RouteRecordRaw[] = [
    // Auth Routes (Public - no authentication required)
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPasswordView.vue'),
        meta: { requiresGuest: true }
    },

    // Onboarding (Authenticated but not yet onboarded)
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: () => import('@/views/auth/OnboardingView.vue'),
        meta: { requiresAuth: true }
    },

    // Add Organization (Authenticated users can add more orgs)
    {
        path: '/orgranization/add',
        name: 'AddOrganization',
        component: () => import('@/views/organization/AddOrganization.vue'),
        meta: { requiresAuth: true }
    },

    // Main Application Routes (Requires authentication)
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/home/dashboard'
            },
            // Home Routes
            {
                path: 'home/dashboard',
                name: 'HomeDashboard',
                component: () => import('@/views/home/HomeDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Home', path: '/home/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            // Finance Routes
            {
                path: 'finance/cash-flow',
                name: 'CashFlow',
                component: () => import('@/views/finance/CashFlow.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Finance', path: '/finance/dashboard' },
                        { label: 'Cash Flow' }
                    ]
                }
            },
            {
                path: 'finance/dashboard',
                name: 'FinanceDashboard',
                component: () => import('@/views/finance/FinanceDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Finance', path: '/finance/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            {
                path: 'finance/financial-reports',
                name: 'FinancialReports',
                component: () => import('@/views/finance/FinancialReports.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Finance', path: '/finance/dashboard' },
                        { label: 'Financial Reports' }
                    ]
                }
            },
            {
                path: 'finance/general-ledger',
                name: 'GeneralLedger',
                component: () => import('@/views/finance/GeneralLedger.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Finance', path: '/finance/dashboard' },
                        { label: 'General Ledger' }
                    ]
                }
            },
            // Human Resources Routes
            {
                path: 'human-resources/attendance',
                name: 'Attendance',
                component: () => import('@/views/humanresources/Attendance.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Human Resources', path: '/human-resources/dashboard' },
                        { label: 'Attendance' }
                    ]
                }
            },
            {
                path: 'human-resources/employees',
                name: 'Employees',
                component: () => import('@/views/humanresources/Employees.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Human Resources', path: '/human-resources/dashboard' },
                        { label: 'Employees' }
                    ]
                }
            },
            {
                path: 'human-resources/dashboard',
                name: 'HRDashboard',
                component: () => import('@/views/humanresources/HRDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Human Resources', path: '/human-resources/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            {
                path: 'human-resources/payroll',
                name: 'Payroll',
                component: () => import('@/views/humanresources/Payroll.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Human Resources', path: '/human-resources/dashboard' },
                        { label: 'Payroll' }
                    ]
                }
            },
            // Inventory Routes
            {
                path: 'inventory/adjustments',
                name: 'Adjustments',
                component: () => import('@/views/inventory/Adjustments.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Inventory', path: '/inventory/dashboard' },
                        { label: 'Adjustments' }
                    ]
                }
            },
            {
                path: 'inventory/dashboard',
                name: 'InventoryDashboard',
                component: () => import('@/views/inventory/InventoryDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Inventory', path: '/inventory/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            {
                path: 'inventory/stock-overview',
                name: 'StockOverview',
                component: () => import('@/views/inventory/StockOverview.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Inventory', path: '/inventory/dashboard' },
                        { label: 'Stock Overview' }
                    ]
                }
            },
            {
                path: 'inventory/stock-reports',
                name: 'StockReports',
                component: () => import('@/views/inventory/StockReports.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Inventory', path: '/inventory/dashboard' },
                        { label: 'Stock Reports' }
                    ]
                }
            },
            // Purchasing Routes
            {
                path: 'purchasing/purchase-order-history',
                name: 'PurchaseOrderHistory',
                component: () => import('@/views/purchasing/PurchaseOrderHistory.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Purchasing', path: '/purchasing/dashboard' },
                        { label: 'Purchase Order History' }
                    ]
                }
            },
            {
                path: 'purchasing/purchase-requests',
                name: 'PurchaseRequests',
                component: () => import('@/views/purchasing/PurchaseRequests.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Purchasing', path: '/purchasing/dashboard' },
                        { label: 'Purchase Requests' }
                    ]
                }
            },
            {
                path: 'purchasing/dashboard',
                name: 'PurchasingDashboard',
                component: () => import('@/views/purchasing/PurchasingDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Purchasing', path: '/purchasing/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            {
                path: 'purchasing/suppliers',
                name: 'Suppliers',
                component: () => import('@/views/purchasing/Suppliers.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Purchasing', path: '/purchasing/dashboard' },
                        { label: 'Suppliers' }
                    ]
                }
            },
            // Reports Routes
            {
                path: 'reports/consolidated-reports',
                name: 'ConsolidatedReports',
                component: () => import('@/views/reports/ConsolidatedReports.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Reports', path: '/reports/consolidated-reports' },
                        { label: 'Consolidated Reports' }
                    ]
                }
            },
            {
                path: 'reports/exports',
                name: 'Exports',
                component: () => import('@/views/reports/Exports.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Reports', path: '/reports/consolidated-reports' },
                        { label: 'Exports' }
                    ]
                }
            },
            // Sales Routes
            {
                path: 'sales/customers',
                name: 'Customers',
                component: () => import('@/views/sales/Customers.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Sales', path: '/sales/dashboard' },
                        { label: 'Customers' }
                    ]
                }
            },
            {
                path: 'sales/invoices',
                name: 'Invoices',
                component: () => import('@/views/sales/Invoices.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Sales', path: '/sales/dashboard' },
                        { label: 'Invoices' }
                    ]
                }
            },
            {
                path: 'sales/orders',
                name: 'Orders',
                component: () => import('@/views/sales/Orders.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Sales', path: '/sales/dashboard' },
                        { label: 'Orders' }
                    ]
                }
            },
            {
                path: 'sales/dashboard',
                name: 'SalesDashboard',
                component: () => import('@/views/sales/SalesDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Sales', path: '/sales/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            // Settings Routes
            {
                path: 'settings/integrations',
                name: 'Integrations',
                component: () => import('@/views/settings/Integrations.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Settings', path: '/settings/integrations' },
                        { label: 'Integrations' }
                    ]
                }
            },
            {
                path: 'settings/roles-permission',
                name: 'RolesPermission',
                component: () => import('@/views/settings/Roles&Permission.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Settings', path: '/settings/integrations' },
                        { label: 'Roles & Permission' }
                    ]
                }
            },
            {
                path: 'settings/system-preferences',
                name: 'SystemPreferences',
                component: () => import('@/views/settings/SystemPreferences.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Settings', path: '/settings/integrations' },
                        { label: 'System Preferences' }
                    ]
                }
            }
        ]
    },

    // 404 Not Found
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/NotFoundView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Apply global navigation guards
router.beforeEach(authGuard)
router.beforeEach(onboardingGuard)

export default router
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                redirect: '/Home/dashboard'
            },
            // Home Routes
            {
                path: 'Home/dashboard',
                name: 'HomeDashboard',
                component: () => import('@/views/Home/HomeDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Home', path: '/Home/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            // Products Routes
            {
                path: 'products/dashboard',
                name: 'ProductsDashboard',
                component: () => import('@/views/products/ProductDashboard.vue'),
                meta: {
                    breadcrumb: [
                        { label: 'Products', path: '/products/dashboard' },
                        { label: 'Dashboard' }
                    ]
                }
            },
            // Documentation Routes
            // {
            //     path: 'documentation/introduction',
            //     name: 'Introduction',
            //     component: () => import('@/views/Documentation/Introduction.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Documentation', path: '/documentation/introduction' },
            //             { label: 'Introduction' }
            //         ]
            //     }
            // },
            // {
            //     path: 'documentation/get-started',
            //     name: 'GetStarted',
            //     component: () => import('@/views/Documentation/GetStarted.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Documentation', path: '/documentation/introduction' },
            //             { label: 'Get Started' }
            //         ]
            //     }
            // },
            // {
            //     path: 'documentation/tutorials',
            //     name: 'Tutorials',
            //     component: () => import('@/views/Documentation/Tutorials.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Documentation', path: '/documentation/introduction' },
            //             { label: 'Tutorials' }
            //         ]
            //     }
            // },
            // {
            //     path: 'documentation/changelog',
            //     name: 'Changelog',
            //     component: () => import('@/views/Documentation/Changelog.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Documentation', path: '/documentation/introduction' },
            //             { label: 'Changelog' }
            //         ]
            //     }
            // },
            // // Settings Routes
            // {
            //     path: 'settings/general',
            //     name: 'General',
            //     component: () => import('@/views/Settings/General.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Settings', path: '/settings/general' },
            //             { label: 'General' }
            //         ]
            //     }
            // },
            // {
            //     path: 'settings/team',
            //     name: 'Team',
            //     component: () => import('@/views/Settings/Team.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Settings', path: '/settings/general' },
            //             { label: 'Team' }
            //         ]
            //     }
            // },
            // {
            //     path: 'settings/billing',
            //     name: 'Billing',
            //     component: () => import('@/views/Settings/Billing.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Settings', path: '/settings/general' },
            //             { label: 'Billing' }
            //         ]
            //     }
            // },
            // {
            //     path: 'settings/limits',
            //     name: 'Limits',
            //     component: () => import('@/views/Settings/Limits.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { label: 'Settings', path: '/settings/general' },
            //             { label: 'Limits' }
            //         ]
            //     }
            // }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
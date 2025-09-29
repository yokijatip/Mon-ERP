// src/router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()

    // Wait for auth to initialize
    if (authStore.loading) {
        await authStore.initAuth()
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({
            name: 'Login',
            query: { redirect: to.fullPath }
        })
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        // Redirect authenticated users away from guest pages (login, register)
        next({ name: 'HomeDashboard' })
    } else {
        next()
    }
}

export const onboardingGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
        next()
        return
    }

    // Check if user has completed onboarding
    const hasOrganizations = authStore.userProfile?.organizations &&
        Object.keys(authStore.userProfile.organizations).length > 0

    if (!hasOrganizations && to.name !== 'Onboarding') {
        next({ name: 'Onboarding' })
    } else if (hasOrganizations && to.name === 'Onboarding') {
        next({ name: 'HomeDashboard' })
    } else {
        next()
    }
}
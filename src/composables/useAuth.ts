// src/composables/useAuth.ts
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export const useAuth = () => {
    const authStore = useAuthStore()
    const router = useRouter()

    // Computed properties
    const user = computed(() => authStore.user)
    const userProfile = computed(() => authStore.userProfile)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const loading = computed(() => authStore.loading)
    const error = computed(() => authStore.error)

    // Login method
    const login = async (email: string, password: string) => {
        await authStore.login(email, password)
    }

    // Register method
    const register = async (email: string, password: string, displayName: string) => {
        await authStore.register(email, password, displayName)
    }

    // Logout method
    const logout = async () => {
        await authStore.logout()
        router.push('/login')
    }

    // Reset password method
    const resetPassword = async (email: string) => {
        await authStore.resetPassword(email)
    }

    // Check if user has permission for organization
    const hasOrganizationAccess = (orgId: string): boolean => {
        if (!userProfile.value) return false
        return orgId in userProfile.value.organizations
    }

    // Get user role in organization
    const getOrgRole = (orgId: string) => {
        if (!userProfile.value || !userProfile.value.organizations[orgId]) {
            return null
        }
        return userProfile.value.organizations[orgId].role
    }

    // Check if user is owner of organization
    const isOrgOwner = (orgId: string): boolean => {
        return getOrgRole(orgId) === 'owner'
    }

    // Check if user is admin or owner
    const isOrgAdmin = (orgId: string): boolean => {
        const role = getOrgRole(orgId)
        return role === 'owner' || role === 'admin'
    }

    return {
        // State
        user,
        userProfile,
        isAuthenticated,
        loading,
        error,
        // Methods
        login,
        register,
        logout,
        resetPassword,
        // Organization checks
        hasOrganizationAccess,
        getOrgRole,
        isOrgOwner,
        isOrgAdmin
    }
}
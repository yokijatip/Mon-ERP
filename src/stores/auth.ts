// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    type User
} from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { UserProfile, Organization } from '@/types/auth.ts'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const userProfile = ref<UserProfile | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    // NEW: Active Organization
    const activeOrganizationId = ref<string | null>(null)
    const organizations = ref<Record<string, Organization>>({})

    // Getters
    const isAuthenticated = computed(() => !!user.value)
    const currentUser = computed(() => user.value)
    const userId = computed(() => user.value?.uid)
    const activeOrganization = computed(() => {
        if (!activeOrganizationId.value) return null
        return organizations.value[activeOrganizationId.value] || null
    })
    const userOrganizations = computed(() => {
        if (!userProfile.value?.organizations) return {}
        return userProfile.value.organizations
    })

    // Actions
    const initAuth = () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                user.value = firebaseUser

                if (firebaseUser) {
                    // Load user profile from Firestore
                    await loadUserProfile(firebaseUser.uid)
                    // Load organizations
                    await loadOrganizations()
                    // Set active organization
                    await loadActiveOrganization()
                } else {
                    userProfile.value = null
                    activeOrganizationId.value = null
                    organizations.value = {}
                }

                loading.value = false
                resolve(firebaseUser)
            })
        })
    }

    const loadUserProfile = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid))
            if (userDoc.exists()) {
                userProfile.value = userDoc.data() as UserProfile
            }
        } catch (err: any) {
            console.error('Error loading user profile:', err)
        }
    }

    const loadOrganizations = async () => {
        if (!userProfile.value?.organizations) return

        try {
            const orgIds = Object.keys(userProfile.value.organizations)

            if (orgIds.length === 0) return

            // Load all organizations user has access to
            const orgsPromises = orgIds.map(async (orgId) => {
                const orgDoc = await getDoc(doc(db, 'organizations', orgId))
                if (orgDoc.exists()) {
                    return { id: orgId, data: orgDoc.data() as Organization }
                }
                return null
            })

            const orgsResults = await Promise.all(orgsPromises)

            organizations.value = {}
            orgsResults.forEach((result) => {
                if (result) {
                    organizations.value[result.id] = result.data
                }
            })
        } catch (err: any) {
            console.error('Error loading organizations:', err)
        }
    }

    const loadActiveOrganization = async () => {
        // Try to load from localStorage
        const storedOrgId = localStorage.getItem('activeOrganizationId')

        if (storedOrgId && hasOrganizationAccess(storedOrgId)) {
            activeOrganizationId.value = storedOrgId
            return
        }

        // If not found or no access, set to first organization
        const orgIds = Object.keys(userProfile.value?.organizations || {})
        // After:
        if (orgIds.length > 0 && orgIds[0]) {  // ✅ Check both length and first element
            const firstOrgId = orgIds[0]  // ✅ Store in variable (TypeScript knows it's string now)
            activeOrganizationId.value = firstOrgId
            localStorage.setItem('activeOrganizationId', firstOrgId)
        }
    }

    const setActiveOrganization = (orgId: string) => {
        if (!hasOrganizationAccess(orgId)) {
            throw new Error('No access to this organization')
        }

        activeOrganizationId.value = orgId
        localStorage.setItem('activeOrganizationId', orgId)
    }

    const hasOrganizationAccess = (orgId: string): boolean => {
        if (!userProfile.value?.organizations) return false
        return orgId in userProfile.value.organizations
    }

    const getOrgRole = (orgId: string) => {
        if (!userProfile.value?.organizations || !userProfile.value.organizations[orgId]) {
            return null
        }
        return userProfile.value.organizations[orgId].role
    }

    const isOrgOwner = (orgId: string): boolean => {
        return getOrgRole(orgId) === 'owner'
    }

    const isOrgAdmin = (orgId: string): boolean => {
        const role = getOrgRole(orgId)
        return role === 'owner' || role === 'admin'
    }

    const register = async (email: string, password: string, displayName: string) => {
        try {
            loading.value = true
            error.value = null

            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            // Update profile
            await updateProfile(userCredential.user, { displayName })

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                id: userCredential.user.uid,
                email: userCredential.user.email || '',
                displayName,
                photoURL: null,
                phoneNumber: null,
                profile: {
                    fullName: displayName,
                    position: null,
                    whatsapp: null
                },
                organizations: {},
                createdAt: new Date(),
                lastLoginAt: new Date()
            })

            user.value = userCredential.user
            await loadUserProfile(userCredential.user.uid)

            return userCredential.user
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const login = async (email: string, password: string) => {
        try {
            loading.value = true
            error.value = null

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            user.value = userCredential.user

            await loadUserProfile(userCredential.user.uid)
            await loadOrganizations()
            await loadActiveOrganization()

            return userCredential.user
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        try {
            loading.value = true
            error.value = null

            await signOut(auth)
            user.value = null
            userProfile.value = null
            activeOrganizationId.value = null
            organizations.value = {}

            // Clear localStorage
            localStorage.removeItem('activeOrganizationId')
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const resetPassword = async (email: string) => {
        try {
            loading.value = true
            error.value = null

            await sendPasswordResetEmail(auth, email)
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!user.value) throw new Error('No user logged in')

        try {
            loading.value = true
            error.value = null

            const userRef = doc(db, 'users', user.value.uid)
            await setDoc(userRef, data, { merge: true })

            await loadUserProfile(user.value.uid)
            await loadOrganizations()
            await loadActiveOrganization()
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    return {
        // State
        user,
        userProfile,
        loading,
        error,
        activeOrganizationId,
        organizations,
        // Getters
        isAuthenticated,
        currentUser,
        userId,
        activeOrganization,
        userOrganizations,
        // Actions
        initAuth,
        register,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        loadUserProfile,
        loadOrganizations,
        setActiveOrganization,
        hasOrganizationAccess,
        getOrgRole,
        isOrgOwner,
        isOrgAdmin,
        clearError
    }
})
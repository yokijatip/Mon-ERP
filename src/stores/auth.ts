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
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { UserProfile } from '@/types/auth.ts'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const userProfile = ref<UserProfile | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!user.value)
    const currentUser = computed(() => user.value)
    const userId = computed(() => user.value?.uid)

    // Actions
    const initAuth = () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                user.value = firebaseUser

                if (firebaseUser) {
                    // Load user profile from Firestore
                    await loadUserProfile(firebaseUser.uid)
                } else {
                    userProfile.value = null
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
                email: userCredential.user.email,
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
        // Getters
        isAuthenticated,
        currentUser,
        userId,
        // Actions
        initAuth,
        register,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        loadUserProfile,
        clearError
    }
})
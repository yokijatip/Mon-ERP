// src/composables/useDocument.ts
import { ref, computed, onUnmounted, watch } from 'vue'
import {
    doc,
    onSnapshot,
    type DocumentData,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

/**
 * Real-time Document Listener Composable
 * Automatically syncs single document with Firestore in real-time
 */
export const useDocument = <T extends DocumentData>(
    collectionName: string,
    documentId: string | (() => string | null)
) => {
    const authStore = useAuthStore()
    const data = ref<T | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)
    const exists = ref(false)
    let unsubscribe: Unsubscribe | null = null

    // Get document reference
    const getDocRef = (docId: string) => {
        const orgId = authStore.activeOrganizationId
        if (!orgId) {
            throw new Error('No active organization selected')
        }
        return doc(db, 'organizations', orgId, collectionName, docId)
    }

    // Get current document ID (handle both string and function)
    const getCurrentDocId = (): string | null => {
        return typeof documentId === 'function' ? documentId() : documentId
    }

    /**
     * Start listening to document changes
     */
    const startListening = () => {
        const docId = getCurrentDocId()

        if (!docId) {
            loading.value = false
            data.value = null
            exists.value = false
            return
        }

        try {
            const docRef = getDocRef(docId)

            unsubscribe = onSnapshot(
                docRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        data.value = { id: snapshot.id, ...snapshot.data() } as unknown as T
                        exists.value = true
                    } else {
                        data.value = null
                        exists.value = false
                    }
                    loading.value = false
                    error.value = null
                },
                (err) => {
                    error.value = err.message
                    loading.value = false
                    exists.value = false
                    toast.error(`Failed to sync document: ${err.message}`)
                }
            )
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            toast.error(`Failed to start listener: ${err.message}`)
        }
    }

    /**
     * Stop listening to document changes
     */
    const stopListening = () => {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    /**
     * Reload document
     */
    const reload = () => {
        stopListening()
        loading.value = true
        startListening()
    }

    // Auto-start listening
    startListening()

    // Watch for document ID changes (if function is provided)
    if (typeof documentId === 'function') {
        watch(
            () => documentId(),
            () => {
                stopListening()
                loading.value = true
                startListening()
            }
        )
    }

    // Auto-cleanup on unmount
    onUnmounted(() => {
        stopListening()
    })

    return {
        // State
        data: computed(() => data.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        exists: computed(() => exists.value),

        // Methods
        reload,
        stopListening,
        clearError: () => { error.value = null }
    }
}
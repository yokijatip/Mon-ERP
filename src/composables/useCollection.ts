// src/composables/useCollection.ts
import { ref, computed, onUnmounted } from 'vue'
import {
    collection,
    query,
    onSnapshot,
    type QueryConstraint,
    type DocumentData,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

/**
 * Real-time Collection Listener Composable
 * Automatically syncs data with Firestore in real-time
 */
export const useCollection = <T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {
    const authStore = useAuthStore()
    const data = ref<T[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)
    let unsubscribe: Unsubscribe | null = null

    // Get organization-scoped collection reference
    const getCollectionRef = () => {
        const orgId = authStore.activeOrganizationId
        if (!orgId) {
            throw new Error('No active organization selected')
        }
        return collection(db, 'organizations', orgId, collectionName)
    }

    /**
     * Start listening to collection changes
     */
    const startListening = () => {
        try {
            const collectionRef = getCollectionRef()
            const q = query(collectionRef, ...constraints)

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const documents: T[] = []

                    snapshot.forEach((doc) => {
                        documents.push({ id: doc.id, ...doc.data() } as unknown as T)
                    })

                    data.value = documents
                    loading.value = false
                    error.value = null
                },
                (err) => {
                    error.value = err.message
                    loading.value = false
                    toast.error(`Failed to sync data: ${err.message}`)
                }
            )
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            toast.error(`Failed to start listener: ${err.message}`)
        }
    }

    /**
     * Stop listening to collection changes
     */
    const stopListening = () => {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    /**
     * Restart listener with new constraints
     */
    const restartWithConstraints = (newConstraints: QueryConstraint[]) => {
        stopListening()
        constraints = newConstraints
        startListening()
    }

    // Auto-start listening
    startListening()

    // Auto-cleanup on unmount
    onUnmounted(() => {
        stopListening()
    })

    return {
        // State
        data: computed(() => data.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),

        // Computed helpers
        isEmpty: computed(() => data.value.length === 0),
        count: computed(() => data.value.length),

        // Methods
        stopListening,
        restartWithConstraints,
        clearError: () => { error.value = null }
    }
}
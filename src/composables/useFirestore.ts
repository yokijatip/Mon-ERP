// src/composables/useFirestore.ts
import { ref, computed } from 'vue'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    type QueryConstraint,
    type DocumentData,
    type WhereFilterOp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

/**
 * Generic Firestore CRUD Composable
 * Provides reusable database operations for all collections
 */
export const useFirestore = <T extends DocumentData>(collectionName: string) => {
    const authStore = useAuthStore()
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Get organization-scoped collection reference
    const getCollectionRef = () => {
        const orgId = authStore.activeOrganizationId
        if (!orgId) {
            throw new Error('No active organization selected')
        }
        return collection(db, 'organizations', orgId, collectionName)
    }

    // Get document reference
    const getDocRef = (docId: string) => {
        const orgId = authStore.activeOrganizationId
        if (!orgId) {
            throw new Error('No active organization selected')
        }
        return doc(db, 'organizations', orgId, collectionName, docId)
    }

    /**
     * CREATE - Add new document
     */
    const create = async (data: Omit<T, 'id'>): Promise<string> => {
        loading.value = true
        error.value = null

        try {
            const userId = authStore.userId
            if (!userId) throw new Error('User not authenticated')

            const collectionRef = getCollectionRef()

            const docData = {
                ...data,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                createdBy: userId,
                updatedBy: userId
            }

            const docRef = await addDoc(collectionRef, docData)

            toast.success('Data created successfully')
            return docRef.id
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to create: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * CREATE with custom ID
     */
    const createWithId = async (docId: string, data: Omit<T, 'id'>): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const userId = authStore.userId
            if (!userId) throw new Error('User not authenticated')

            const docRef = getDocRef(docId)

            const docData = {
                ...data,
                id: docId,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                createdBy: userId,
                updatedBy: userId
            }

            await setDoc(docRef, docData)

            toast.success('Data created successfully')
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to create: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * READ - Get single document by ID
     */
    const getById = async (docId: string): Promise<T | null> => {
        loading.value = true
        error.value = null

        try {
            const docRef = getDocRef(docId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as unknown as T
            }

            return null
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to fetch: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * READ - Get all documents
     */
    const getAll = async (constraints: QueryConstraint[] = []): Promise<T[]> => {
        loading.value = true
        error.value = null

        try {
            const collectionRef = getCollectionRef()
            const q = query(collectionRef, ...constraints)
            const querySnapshot = await getDocs(q)

            const documents: T[] = []
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() } as unknown as T)
            })

            return documents
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to fetch: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * READ - Get with filters
     */
    const getWhere = async (
        field: string,
        operator: WhereFilterOp,
        value: any
    ): Promise<T[]> => {
        return getAll([where(field, operator, value)])
    }

    /**
     * READ - Get with multiple filters
     */
    const getWithFilters = async (
        filters: Array<{ field: string; operator: WhereFilterOp; value: any }>,
        options?: {
            orderByField?: string
            orderDirection?: 'asc' | 'desc'
            limitCount?: number
        }
    ): Promise<T[]> => {
        const constraints: QueryConstraint[] = filters.map(f =>
            where(f.field, f.operator, f.value)
        )

        if (options?.orderByField) {
            constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'))
        }

        if (options?.limitCount) {
            constraints.push(limit(options.limitCount))
        }

        return getAll(constraints)
    }

    /**
     * READ - Paginated query
     */
    const getPaginated = async (
        pageSize: number,
        lastDoc?: any,
        constraints: QueryConstraint[] = []
    ): Promise<{ data: T[]; lastDoc: any }> => {
        loading.value = true
        error.value = null

        try {
            const collectionRef = getCollectionRef()
            const queryConstraints = [...constraints, limit(pageSize)]

            if (lastDoc) {
                queryConstraints.push(startAfter(lastDoc))
            }

            const q = query(collectionRef, ...queryConstraints)
            const querySnapshot = await getDocs(q)

            const documents: T[] = []
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() } as unknown as T)
            })

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]

            return {
                data: documents,
                lastDoc: lastVisible
            }
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to fetch: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * UPDATE - Update document
     */
    const update = async (docId: string, data: Partial<T>): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const userId = authStore.userId
            if (!userId) throw new Error('User not authenticated')

            const docRef = getDocRef(docId)

            const updateData = {
                ...data,
                updatedAt: Timestamp.now(),
                updatedBy: userId
            }

            await updateDoc(docRef, updateData)

            toast.success('Data updated successfully')
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to update: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * DELETE - Delete document
     */
    const remove = async (docId: string): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const docRef = getDocRef(docId)
            await deleteDoc(docRef)

            toast.success('Data deleted successfully')
        } catch (err: any) {
            error.value = err.message
            toast.error(`Failed to delete: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * SOFT DELETE - Mark as inactive instead of deleting
     */
    const softDelete = async (docId: string): Promise<void> => {
        return update(docId, { isActive: false } as Partial<unknown>)
    }

    /**
     * BULK CREATE
     */
    const bulkCreate = async (items: Omit<T, 'id'>[]): Promise<string[]> => {
        loading.value = true
        error.value = null

        try {
            const ids: string[] = []

            for (const item of items) {
                const id = await create(item)
                ids.push(id)
            }

            toast.success(`${items.length} items created successfully`)
            return ids
        } catch (err: any) {
            error.value = err.message
            toast.error(`Bulk create failed: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * BULK UPDATE
     */
    const bulkUpdate = async (
        updates: Array<{ id: string; data: Partial<T> }>
    ): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            for (const { id, data } of updates) {
                await update(id, data)
            }

            toast.success(`${updates.length} items updated successfully`)
        } catch (err: any) {
            error.value = err.message
            toast.error(`Bulk update failed: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * COUNT documents
     */
    const count = async (constraints: QueryConstraint[] = []): Promise<number> => {
        try {
            const docs = await getAll(constraints)
            return docs.length
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    /**
     * CHECK if document exists
     */
    const exists = async (docId: string): Promise<boolean> => {
        try {
            const docRef = getDocRef(docId)
            const docSnap = await getDoc(docRef)
            return docSnap.exists()
        } catch (err: any) {
            error.value = err.message
            return false
        }
    }

    return {
        // State
        loading: computed(() => loading.value),
        error: computed(() => error.value),

        // CRUD Operations
        create,
        createWithId,
        getById,
        getAll,
        getWhere,
        getWithFilters,
        getPaginated,
        update,
        remove,
        softDelete,

        // Bulk Operations
        bulkCreate,
        bulkUpdate,

        // Utilities
        count,
        exists,

        // Error handling
        clearError: () => { error.value = null }
    }
}
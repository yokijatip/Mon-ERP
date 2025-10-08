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
        console.log(`📦 [useFirestore/${collectionName}] Getting collection ref for org:`, orgId)
        if (!orgId) {
            throw new Error('No active organization selected')
        }
        return collection(db, 'organizations', orgId, collectionName)
    }

    // Get document reference
    const getDocRef = (docId: string) => {
        const orgId = authStore.activeOrganizationId
        console.log(`📦 [useFirestore/${collectionName}] Getting document ref for:`, { orgId, docId })
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

            console.log(`🔄 [useFirestore/${collectionName}] CREATE - Starting...`, data)
            const collectionRef = getCollectionRef()

            const docData = {
                ...data,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                createdBy: userId,
                updatedBy: userId
            }

            const docRef = await addDoc(collectionRef, docData)
            console.log(`✅ [useFirestore/${collectionName}] CREATE - Success! Doc ID:`, docRef.id)

            toast.success('Data created successfully')
            return docRef.id
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] CREATE - Failed:`, err)
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

            console.log(`🔄 [useFirestore/${collectionName}] CREATE WITH ID - Starting...`, { docId, data })
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
            console.log(`✅ [useFirestore/${collectionName}] CREATE WITH ID - Success!`, docId)

            toast.success('Data created successfully')
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] CREATE WITH ID - Failed:`, err)
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
            console.log(`🔄 [useFirestore/${collectionName}] GET BY ID - Starting...`, docId)
            const docRef = getDocRef(docId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const result = { id: docSnap.id, ...docSnap.data() } as unknown as T
                console.log(`✅ [useFirestore/${collectionName}] GET BY ID - Found:`, result)
                return result
            }

            console.log(`⚠️ [useFirestore/${collectionName}] GET BY ID - Not found:`, docId)
            return null
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] GET BY ID - Failed:`, err)
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
            console.log(`🔄 [useFirestore/${collectionName}] GET ALL - Starting with constraints:`, constraints.length)
            const collectionRef = getCollectionRef()
            const q = query(collectionRef, ...constraints)
            const querySnapshot = await getDocs(q)

            const documents: T[] = []
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() } as unknown as T)
            })

            console.log(`✅ [useFirestore/${collectionName}] GET ALL - Success! Found ${documents.length} documents`, documents)
            return documents
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] GET ALL - Failed:`, err)
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
        console.log(`🔄 [useFirestore/${collectionName}] GET WHERE - Filter:`, { field, operator, value })
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
        console.log(`🔄 [useFirestore/${collectionName}] GET WITH FILTERS - Filters:`, filters, 'Options:', options)
        
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
            console.log(`🔄 [useFirestore/${collectionName}] GET PAGINATED - PageSize:`, pageSize, 'Constraints:', constraints.length)
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

            console.log(`✅ [useFirestore/${collectionName}] GET PAGINATED - Success! Found ${documents.length} documents`)
            return {
                data: documents,
                lastDoc: lastVisible
            }
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] GET PAGINATED - Failed:`, err)
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

            console.log(`🔄 [useFirestore/${collectionName}] UPDATE - Starting...`, { docId, data })
            const docRef = getDocRef(docId)

            const updateData = {
                ...data,
                updatedAt: Timestamp.now(),
                updatedBy: userId
            }

            await updateDoc(docRef, updateData)
            console.log(`✅ [useFirestore/${collectionName}] UPDATE - Success!`, docId)

            toast.success('Data updated successfully')
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] UPDATE - Failed:`, err)
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
            console.log(`🔄 [useFirestore/${collectionName}] DELETE - Starting...`, docId)
            const docRef = getDocRef(docId)
            await deleteDoc(docRef)
            console.log(`✅ [useFirestore/${collectionName}] DELETE - Success!`, docId)

            toast.success('Data deleted successfully')
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] DELETE - Failed:`, err)
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
        console.log(`🔄 [useFirestore/${collectionName}] SOFT DELETE - Starting...`, docId)
        return update(docId, { isActive: false } as Partial<unknown>)
    }

    /**
     * BULK CREATE
     */
    const bulkCreate = async (items: Omit<T, 'id'>[]): Promise<string[]> => {
        loading.value = true
        error.value = null

        try {
            console.log(`🔄 [useFirestore/${collectionName}] BULK CREATE - Starting... ${items.length} items`)
            const ids: string[] = []

            for (const item of items) {
                const id = await create(item)
                ids.push(id)
            }

            console.log(`✅ [useFirestore/${collectionName}] BULK CREATE - Success! Created ${ids.length} items`)
            toast.success(`${items.length} items created successfully`)
            return ids
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] BULK CREATE - Failed:`, err)
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
            console.log(`🔄 [useFirestore/${collectionName}] BULK UPDATE - Starting... ${updates.length} items`)
            for (const { id, data } of updates) {
                await update(id, data)
            }

            console.log(`✅ [useFirestore/${collectionName}] BULK UPDATE - Success! Updated ${updates.length} items`)
            toast.success(`${updates.length} items updated successfully`)
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] BULK UPDATE - Failed:`, err)
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
            console.log(`🔄 [useFirestore/${collectionName}] COUNT - Starting...`)
            const docs = await getAll(constraints)
            console.log(`✅ [useFirestore/${collectionName}] COUNT - Result:`, docs.length)
            return docs.length
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] COUNT - Failed:`, err)
            throw err
        }
    }

    /**
     * CHECK if document exists
     */
    const exists = async (docId: string): Promise<boolean> => {
        try {
            console.log(`🔄 [useFirestore/${collectionName}] EXISTS - Checking...`, docId)
            const docRef = getDocRef(docId)
            const docSnap = await getDoc(docRef)
            const result = docSnap.exists()
            console.log(`✅ [useFirestore/${collectionName}] EXISTS - Result:`, result)
            return result
        } catch (err: any) {
            error.value = err.message
            console.error(`❌ [useFirestore/${collectionName}] EXISTS - Failed:`, err)
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

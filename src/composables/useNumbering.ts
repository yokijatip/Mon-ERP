// src/composables/useNumbering.ts
import { ref } from 'vue'
import { doc, getDoc, updateDoc, setDoc, runTransaction, Timestamp, DocumentReference } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth'

type DocumentType =
    | 'salesOrder'
    | 'invoice'
    | 'purchaseOrder'
    | 'journal'
    | 'payment'
    | 'product'
    | 'customer'
    | 'supplier'
    | 'employee'
    | 'stockMovement'
    | 'warehouse'

/**
 * Upsert helper: create if not exists, update if exists
 */
const upsertDoc = async (
    ref: DocumentReference,
    data: Record<string, any>
) => {
    const snap = await getDoc(ref)
    if (snap.exists()) {
        await updateDoc(ref, data)
    } else {
        await setDoc(ref, data)
    }
}

/**
 * Auto-numbering Composable
 * Generates unique document numbers like: INV-2025-0001
 */
export const useNumbering = () => {
    const authStore = useAuthStore()
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Get settings document reference
    const getSettingsRef = () => {
        const orgId = authStore.activeOrganizationId
        if (!orgId) {
            throw new Error('No active organization selected')
        }
        return doc(db, 'organizations', orgId, 'settings', 'general')
    }

    /**
     * Default number formats
     */
    const defaultFormats: Record<DocumentType, string> = {
        salesOrder: 'SO-{YYYY}-{0000}',
        invoice: 'INV-{YYYY}-{0000}',
        purchaseOrder: 'PO-{YYYY}-{0000}',
        journal: 'JRN-{YYYY}-{0000}',
        payment: 'PAY-{YYYY}-{0000}',
        product: 'PRD-{0000}',
        customer: 'CUST-{0000}',
        supplier: 'SUPP-{0000}',
        employee: 'EMP-{0000}',
        stockMovement: 'STM-{YYYY}{MM}-{####}',
        warehouse: 'WH-{###}'
    }

    /**
     * Initialize settings if not exists
     */
    const initializeSettings = async () => {
        try {
            const settingsRef = getSettingsRef()
            const settingsSnap = await getDoc(settingsRef)

            if (!settingsSnap.exists()) {
                const userId = authStore.userId
                if (!userId) throw new Error('User not authenticated')

                const initialSettings = {
                    numberFormats: defaultFormats,
                    nextNumbers: {
                        salesOrder: 1,
                        invoice: 1,
                        purchaseOrder: 1,
                        journal: 1,
                        payment: 1,
                        product: 1,
                        customer: 1,
                        supplier: 1,
                        employee: 1
                    },
                    updatedAt: Timestamp.now(),
                    updatedBy: userId
                }

                await upsertDoc(settingsRef, initialSettings)
            }
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    /**
     * Format number based on format string
     */
    const formatNumber = (format: string, number: number): string => {
        const year = new Date().getFullYear()
        const month = String(new Date().getMonth() + 1).padStart(2, '0')
        const day = String(new Date().getDate()).padStart(2, '0')

        let formatted = format
            .replace('{YYYY}', String(year))
            .replace('{YY}', String(year).slice(-2))
            .replace('{MM}', month)
            .replace('{DD}', day)

        // Handle number padding
        const match = formatted.match(/\{0+\}/)
        if (match) {
            const padding = match[0].length - 2 // -2 for the {}
            const paddedNumber = String(number).padStart(padding, '0')
            formatted = formatted.replace(match[0], paddedNumber)
        }

        return formatted
    }

    /**
     * Generate next number for document type
     * Uses transaction to ensure uniqueness
     */
    const generateNumber = async (type: DocumentType): Promise<string> => {
        loading.value = true
        error.value = null

        try {
            // Ensure settings exist
            await initializeSettings()

            const settingsRef = getSettingsRef()

            // Use transaction to prevent race conditions
            const result = await runTransaction(db, async (transaction) => {
                const settingsDoc = await transaction.get(settingsRef)

                if (!settingsDoc.exists()) {
                    throw new Error('Settings document not found')
                }

                const settings = settingsDoc.data()
                const currentNumber = settings.nextNumbers[type] || 1
                const format = settings.numberFormats[type] || defaultFormats[type]

                // Generate formatted number
                const generatedNumber = formatNumber(format, currentNumber)

                // Increment next number
                transaction.update(settingsRef, {
                    [`nextNumbers.${type}`]: currentNumber + 1,
                    updatedAt: Timestamp.now(),
                    updatedBy: authStore.userId
                })

                return generatedNumber
            })

            return result
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Get next number without incrementing (preview)
     */
    const previewNextNumber = async (type: DocumentType): Promise<string> => {
        try {
            const settingsRef = getSettingsRef()
            const settingsDoc = await getDoc(settingsRef)

            if (!settingsDoc.exists()) {
                await initializeSettings()
                return previewNextNumber(type)
            }

            const settings = settingsDoc.data()
            const currentNumber = settings.nextNumbers[type] || 1
            const format = settings.numberFormats[type] || defaultFormats[type]

            return formatNumber(format, currentNumber)
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    /**
     * Update number format
     */
    const updateFormat = async (type: DocumentType, format: string): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const userId = authStore.userId
            if (!userId) throw new Error('User not authenticated')

            const settingsRef = getSettingsRef()

            await updateDoc(settingsRef, {
                [`numberFormats.${type}`]: format,
                updatedAt: Timestamp.now(),
                updatedBy: userId
            })
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Reset counter (use with caution!)
     */
    const resetCounter = async (type: DocumentType, startFrom: number = 1): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const userId = authStore.userId
            if (!userId) throw new Error('User not authenticated')

            const settingsRef = getSettingsRef()

            await updateDoc(settingsRef, {
                [`nextNumbers.${type}`]: startFrom,
                updatedAt: Timestamp.now(),
                updatedBy: userId
            })
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Get all number formats and next numbers
     */
    const getSettings = async () => {
        try {
            const settingsRef = getSettingsRef()
            const settingsDoc = await getDoc(settingsRef)

            if (!settingsDoc.exists()) {
                await initializeSettings()
                return getSettings()
            }

            return settingsDoc.data()
        } catch (err: any) {
            error.value = err.message
            throw err
        }
    }

    return {
        // State
        loading,
        error,

        // Methods
        generateNumber,
        previewNextNumber,
        updateFormat,
        resetCounter,
        getSettings,
        initializeSettings,

        // Utilities
        formatNumber,
        clearError: () => { error.value = null }
    }
}
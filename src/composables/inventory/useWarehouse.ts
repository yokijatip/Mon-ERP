// src/composables/useWarehouse.ts
import { ref, computed } from 'vue'
import { useFirestore } from '@/composables/useFirestore'
import type { Warehouse } from '@/types/firestore'
import { Timestamp } from 'firebase/firestore'

export const useWarehouse = () => {
    const firestore = useFirestore<Warehouse>('warehouses')

    const warehouses = ref<Warehouse[]>([])
    const currentWarehouse = ref<Warehouse | null>(null)
    const searchTerm = ref('')
    const showInactive = ref(false)

    const filteredWarehouses = computed(() => {
        let filtered = warehouses.value

        if (!showInactive.value) {
            filtered = filtered.filter(w => w.isActive)
        }

        if (searchTerm.value) {
            const term = searchTerm.value.toLowerCase()
            filtered = filtered.filter(w =>
                w.name.toLowerCase().includes(term) ||
                w.code.toLowerCase().includes(term) ||
                w.address.toLowerCase().includes(term)
            )
        }

        return filtered
    })

    const activeWarehouses = computed(() => {
        return warehouses.value.filter(w => w.isActive)
    })

    const defaultWarehouse = computed(() => {
        return warehouses.value.find(w => w.isDefault && w.isActive)
    })

    const loadWarehouses = async () => {
        try {
            console.log('🔄 [useWarehouse] Loading warehouses from Firestore...')
            warehouses.value = await firestore.getAll()
            console.log('✅ [useWarehouse] Warehouses loaded successfully:', warehouses.value.length, 'items', warehouses.value)
            return warehouses.value
        } catch (error) {
            console.error('❌ [useWarehouse] Error loading warehouses:', error)
            throw error
        }
    }

    const loadWarehouse = async (id: string) => {
        try {
            console.log('🔄 [useWarehouse] Loading warehouse by ID:', id)
            currentWarehouse.value = await firestore.getById(id)
            console.log('✅ [useWarehouse] Warehouse loaded:', currentWarehouse.value)
            return currentWarehouse.value
        } catch (error) {
            console.error('❌ [useWarehouse] Error loading warehouse:', error)
            throw error
        }
    }

    const createWarehouse = async (
        warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            console.log('🔄 [useWarehouse] Creating warehouse...', warehouseData)
            
            // Check if code already exists
            const existing = await firestore.getWhere('code', '==', warehouseData.code)
            if (existing.length > 0) {
                throw new Error('Warehouse code already exists')
            }

            // If this is set as default, unset other defaults
            if (warehouseData.isDefault) {
                const defaultWarehouses = await firestore.getWhere('isDefault', '==', true)
                for (const warehouse of defaultWarehouses) {
                    await firestore.update(warehouse.id, { isDefault: false })
                }
            }

            // Add timestamps before creating
            const warehouseWithTimestamps: Omit<Warehouse, 'id'> = {
                ...warehouseData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            }

            const id = await firestore.create(warehouseWithTimestamps)
            console.log('✅ [useWarehouse] Warehouse created successfully, ID:', id)
            await loadWarehouses()
            return id
        } catch (error) {
            console.error('❌ [useWarehouse] Error creating warehouse:', error)
            throw error
        }
    }

    const updateWarehouse = async (id: string, warehouseData: Partial<Warehouse>) => {
        try {
            console.log('🔄 [useWarehouse] Updating warehouse:', { id, data: warehouseData })
            
            // If setting as default, unset other defaults
            if (warehouseData.isDefault) {
                const defaultWarehouses = await firestore.getWhere('isDefault', '==', true)
                for (const warehouse of defaultWarehouses) {
                    if (warehouse.id !== id) {
                        await firestore.update(warehouse.id, { isDefault: false })
                    }
                }
            }

            await firestore.update(id, warehouseData)
            console.log('✅ [useWarehouse] Warehouse updated successfully')
            await loadWarehouses()

            if (currentWarehouse.value?.id === id) {
                await loadWarehouse(id)
            }
        } catch (error) {
            console.error('❌ [useWarehouse] Error updating warehouse:', error)
            throw error
        }
    }

    const deleteWarehouse = async (id: string) => {
        try {
            console.log('🔄 [useWarehouse] Deleting warehouse (soft delete):', id)
            await firestore.softDelete(id)
            console.log('✅ [useWarehouse] Warehouse deleted successfully')
            await loadWarehouses()
        } catch (error) {
            console.error('❌ [useWarehouse] Error deleting warehouse:', error)
            throw error
        }
    }

    const setDefaultWarehouse = async (id: string) => {
        try {
            console.log('🔄 [useWarehouse] Setting default warehouse:', id)
            
            // Unset all defaults first
            const allWarehouses = await firestore.getAll()
            for (const warehouse of allWarehouses) {
                if (warehouse.isDefault && warehouse.id !== id) {
                    await firestore.update(warehouse.id, { isDefault: false })
                }
            }

            // Set new default
            await firestore.update(id, { isDefault: true })
            console.log('✅ [useWarehouse] Default warehouse set successfully')
            await loadWarehouses()
        } catch (error) {
            console.error('❌ [useWarehouse] Error setting default warehouse:', error)
            throw error
        }
    }

    const checkCodeExists = async (code: string, excludeId?: string): Promise<boolean> => {
        try {
            console.log('🔄 [useWarehouse] Checking if code exists:', code)
            const existing = await firestore.getWhere('code', '==', code)
            if (excludeId) {
                return existing.some(w => w.id !== excludeId)
            }
            return existing.length > 0
        } catch (error) {
            console.error('❌ [useWarehouse] Error checking code:', error)
            return false
        }
    }

    return {
        warehouses,
        currentWarehouse,
        searchTerm,
        showInactive,
        filteredWarehouses,
        activeWarehouses,
        defaultWarehouse,
        loading: firestore.loading,
        error: firestore.error,

        loadWarehouses,
        loadWarehouse,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
        setDefaultWarehouse,
        checkCodeExists,

        clearError: firestore.clearError
    }
}

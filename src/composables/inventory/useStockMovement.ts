// src/composables/useStockMovement.ts
import { ref, computed } from 'vue'
import { useFirestore } from '@/composables/useFirestore'
import { useNumbering } from '@/composables/useNumbering'
import { useAuth } from '@/composables/useAuth'
import type { StockMovement, StockMovementType } from '@/types/firestore'
import { Timestamp } from 'firebase/firestore'

export const useStockMovement = () => {
    const firestore = useFirestore<StockMovement>('stock_movements')
    const { generateNumber } = useNumbering()
    const { user } = useAuth()

    const movements = ref<StockMovement[]>([])
    const currentMovement = ref<StockMovement | null>(null)
    const searchTerm = ref('')
    const selectedType = ref<StockMovementType | 'all'>('all')
    const selectedWarehouse = ref<string>('all')
    const dateRange = ref<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    })

    const filteredMovements = computed(() => {
        let filtered = movements.value

        // Filter by type
        if (selectedType.value && selectedType.value !== 'all') {
            filtered = filtered.filter(m => m.type === selectedType.value)
        }

        // Filter by warehouse
        if (selectedWarehouse.value && selectedWarehouse.value !== 'all') {
            filtered = filtered.filter(m =>
                m.fromWarehouseId === selectedWarehouse.value ||
                m.toWarehouseId === selectedWarehouse.value
            )
        }

        // Filter by search term
        if (searchTerm.value) {
            const term = searchTerm.value.toLowerCase()
            filtered = filtered.filter(m =>
                m.productName.toLowerCase().includes(term) ||
                m.productSku.toLowerCase().includes(term) ||
                m.movementNumber.toLowerCase().includes(term) ||
                m.referenceNumber?.toLowerCase().includes(term)
            )
        }

        // Filter by date range
        if (dateRange.value.start && dateRange.value.end) {
            const startTime = Timestamp.fromDate(dateRange.value.start)
            const endTime = Timestamp.fromDate(dateRange.value.end)
            filtered = filtered.filter(m =>
                m.date >= startTime && m.date <= endTime
            )
        }

        return filtered.sort((a, b) => b.date.seconds - a.date.seconds)
    })

    const totalMovements = computed(() => filteredMovements.value.length)

    const movementsByType = computed(() => {
        return {
            in: movements.value.filter(m => m.type === 'in').length,
            out: movements.value.filter(m => m.type === 'out').length,
            transfer: movements.value.filter(m => m.type === 'transfer').length,
            adjustment: movements.value.filter(m => m.type === 'adjustment').length
        }
    })

    const loadMovements = async () => {
        try {
            console.log('🔄 [useStockMovement] Loading movements from Firestore...')
            movements.value = await firestore.getAll()
            console.log('✅ [useStockMovement] Movements loaded successfully:', movements.value.length, 'items', movements.value)
            return movements.value
        } catch (error) {
            console.error('❌ [useStockMovement] Error loading movements:', error)
            throw error
        }
    }

    const loadMovement = async (id: string) => {
        try {
            console.log('🔄 [useStockMovement] Loading movement by ID:', id)
            currentMovement.value = await firestore.getById(id)
            console.log('✅ [useStockMovement] Movement loaded:', currentMovement.value)
            return currentMovement.value
        } catch (error) {
            console.error('❌ [useStockMovement] Error loading movement:', error)
            throw error
        }
    }

    const createMovement = async (
        movementData: Omit<StockMovement, 'id' | 'movementNumber' | 'createdAt' | 'createdBy'>
    ) => {
        try {
            console.log('🔄 [useStockMovement] Creating movement...', movementData)
            const movementNumber = await generateNumber('stockMovement')
            console.log('📝 [useStockMovement] Generated movement number:', movementNumber)

            // Remove undefined fields to prevent Firestore errors
            const cleanedData: any = {
                ...movementData,
                movementNumber,
                createdAt: Timestamp.now(),
                createdBy: user.value?.uid || 'anonymous'
            }

            // Remove undefined fields
            Object.keys(cleanedData).forEach(key => {
                if (cleanedData[key] === undefined) {
                    delete cleanedData[key]
                }
            })

            console.log('🔄 [useStockMovement] Cleaned movement data:', cleanedData)
            console.log('👤 [useStockMovement] Created by user:', {
                uid: user.value?.uid || 'anonymous',
                email: user.value?.email || 'unknown',
                displayName: user.value?.displayName || 'unknown'
            })

            const id = await firestore.create(cleanedData)
            console.log('✅ [useStockMovement] Movement created successfully, ID:', id)
            await loadMovements()
            return id
        } catch (error) {
            console.error('❌ [useStockMovement] Error creating movement:', error)
            throw error
        }
    }

    const getMovementsByProduct = async (productId: string) => {
        try {
            console.log('🔄 [useStockMovement] Getting movements by product:', productId)
            const result = await firestore.getWhere('productId', '==', productId)
            console.log('✅ [useStockMovement] Movements by product found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStockMovement] Error getting movements by product:', error)
            throw error
        }
    }

    const getMovementsByWarehouse = async (warehouseId: string) => {
        try {
            console.log('🔄 [useStockMovement] Getting movements by warehouse:', warehouseId)
            const result = await firestore.getWithFilters([
                { field: 'fromWarehouseId', operator: '==', value: warehouseId }
            ])
            console.log('✅ [useStockMovement] Movements by warehouse found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStockMovement] Error getting movements by warehouse:', error)
            throw error
        }
    }

    const getMovementsByType = async (type: StockMovementType) => {
        try {
            console.log('🔄 [useStockMovement] Getting movements by type:', type)
            const result = await firestore.getWhere('type', '==', type)
            console.log('✅ [useStockMovement] Movements by type found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStockMovement] Error getting movements by type:', error)
            throw error
        }
    }

    const getMovementsByDateRange = async (startDate: Date, endDate: Date) => {
        try {
            console.log('🔄 [useStockMovement] Getting movements by date range:', { startDate, endDate })
            const start = Timestamp.fromDate(startDate)
            const end = Timestamp.fromDate(endDate)

            const allMovements = await firestore.getAll()
            const result = allMovements.filter(m => m.date >= start && m.date <= end)
            console.log('✅ [useStockMovement] Movements by date range found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStockMovement] Error getting movements by date range:', error)
            throw error
        }
    }

    const getRecentMovements = async (limit: number = 10) => {
        try {
            console.log('🔄 [useStockMovement] Getting recent movements, limit:', limit)
            const allMovements = await firestore.getAll()
            const result = allMovements
                .sort((a, b) => b.date.seconds - a.date.seconds)
                .slice(0, limit)
            console.log('✅ [useStockMovement] Recent movements found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStockMovement] Error getting recent movements:', error)
            throw error
        }
    }

    return {
        movements,
        currentMovement,
        searchTerm,
        selectedType,
        selectedWarehouse,
        dateRange,
        filteredMovements,
        totalMovements,
        movementsByType,
        loading: firestore.loading,
        error: firestore.error,

        loadMovements,
        loadMovement,
        createMovement,
        getMovementsByProduct,
        getMovementsByWarehouse,
        getMovementsByType,
        getMovementsByDateRange,
        getRecentMovements,

        clearError: firestore.clearError
    }
}

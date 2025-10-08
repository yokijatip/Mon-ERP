// src/composables/useStockMovement.ts
import { ref, computed } from 'vue'
import { useFirestore } from '@/composables/useFirestore'
import { useNumbering } from '@/composables/useNumbering'
import type { StockMovement, StockMovementType } from '@/types/firestore'
import { Timestamp } from 'firebase/firestore'

export const useStockMovement = () => {
    const firestore = useFirestore<StockMovement>('stock_movements')
    const { generateNumber } = useNumbering()

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
            movements.value = await firestore.getAll()
            return movements.value
        } catch (error) {
            console.error('Error loading movements:', error)
            throw error
        }
    }

    const loadMovement = async (id: string) => {
        try {
            currentMovement.value = await firestore.getById(id)
            return currentMovement.value
        } catch (error) {
            console.error('Error loading movement:', error)
            throw error
        }
    }

    const createMovement = async (
        movementData: Omit<StockMovement, 'id' | 'movementNumber' | 'createdAt' | 'createdBy'>
    ) => {
        try {
            const movementNumber = await generateNumber('stockMovement')

            const newMovement: Omit<StockMovement, 'id'> = {
                ...movementData,
                movementNumber,
                createdAt: undefined as any,
                createdBy: undefined as any
            }

            const id = await firestore.create(newMovement)
            await loadMovements()
            return id
        } catch (error) {
            console.error('Error creating movement:', error)
            throw error
        }
    }

    const getMovementsByProduct = async (productId: string) => {
        try {
            return await firestore.getWhere('productId', '==', productId)
        } catch (error) {
            console.error('Error getting movements by product:', error)
            throw error
        }
    }

    const getMovementsByWarehouse = async (warehouseId: string) => {
        try {
            return await firestore.getWithFilters([
                { field: 'fromWarehouseId', operator: '==', value: warehouseId }
            ])
        } catch (error) {
            console.error('Error getting movements by warehouse:', error)
            throw error
        }
    }

    const getMovementsByType = async (type: StockMovementType) => {
        try {
            return await firestore.getWhere('type', '==', type)
        } catch (error) {
            console.error('Error getting movements by type:', error)
            throw error
        }
    }

    const getMovementsByDateRange = async (startDate: Date, endDate: Date) => {
        try {
            const start = Timestamp.fromDate(startDate)
            const end = Timestamp.fromDate(endDate)

            const allMovements = await firestore.getAll()
            return allMovements.filter(m => m.date >= start && m.date <= end)
        } catch (error) {
            console.error('Error getting movements by date range:', error)
            throw error
        }
    }

    const getRecentMovements = async (limit: number = 10) => {
        try {
            const allMovements = await firestore.getAll()
            return allMovements
                .sort((a, b) => b.date.seconds - a.date.seconds)
                .slice(0, limit)
        } catch (error) {
            console.error('Error getting recent movements:', error)
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
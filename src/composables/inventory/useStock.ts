// src/composables/useStock.ts
import { ref, computed } from 'vue'
import { useFirestore } from '@/composables/useFirestore'
import type { Stock, Warehouse } from '@/types/firestore'
import { Timestamp } from 'firebase/firestore'

export const useStock = () => {
    const stockFirestore = useFirestore<Stock>('stock')
    const warehouseFirestore = useFirestore<Warehouse>('warehouses')

    const stocks = ref<Stock[]>([])
    const warehouses = ref<Warehouse[]>([])
    const currentStock = ref<Stock | null>(null)
    const searchTerm = ref('')
    const selectedWarehouse = ref<string>('all')
    const lowStockOnly = ref(false)

    const filteredStocks = computed(() => {
        let filtered = stocks.value

        // Filter by warehouse
        if (selectedWarehouse.value && selectedWarehouse.value !== 'all') {
            filtered = filtered.filter(s => s.warehouseId === selectedWarehouse.value)
        }

        // Filter by search term
        if (searchTerm.value) {
            const term = searchTerm.value.toLowerCase()
            filtered = filtered.filter(s =>
                s.productName.toLowerCase().includes(term) ||
                s.productSku.toLowerCase().includes(term) ||
                s.warehouseName.toLowerCase().includes(term)
            )
        }

        // Filter low stock (available < 10 or custom threshold)
        if (lowStockOnly.value) {
            filtered = filtered.filter(s => s.availableQuantity < 10)
        }

        return filtered
    })

    const totalStockValue = computed(() => {
        return filteredStocks.value.reduce((sum, stock) => sum + stock.totalValue, 0)
    })

    const totalItems = computed(() => filteredStocks.value.length)

    const lowStockItems = computed(() => {
        return stocks.value.filter(s => s.availableQuantity < 10).length
    })

    const outOfStockItems = computed(() => {
        return stocks.value.filter(s => s.availableQuantity === 0).length
    })

    const loadStocks = async () => {
        try {
            stocks.value = await stockFirestore.getAll()
            return stocks.value
        } catch (error) {
            console.error('Error loading stocks:', error)
            throw error
        }
    }

    const loadWarehouses = async () => {
        try {
            warehouses.value = await warehouseFirestore.getWhere('isActive', '==', true)
            return warehouses.value
        } catch (error) {
            console.error('Error loading warehouses:', error)
            throw error
        }
    }

    const loadStock = async (id: string) => {
        try {
            currentStock.value = await stockFirestore.getById(id)
            return currentStock.value
        } catch (error) {
            console.error('Error loading stock:', error)
            throw error
        }
    }

    const getStockByProduct = async (productId: string, warehouseId?: string) => {
        try {
            if (warehouseId) {
                return await stockFirestore.getWithFilters([
                    { field: 'productId', operator: '==', value: productId },
                    { field: 'warehouseId', operator: '==', value: warehouseId }
                ])
            }
            return await stockFirestore.getWhere('productId', '==', productId)
        } catch (error) {
            console.error('Error getting stock by product:', error)
            throw error
        }
    }

    const getStockByWarehouse = async (warehouseId: string) => {
        try {
            return await stockFirestore.getWhere('warehouseId', '==', warehouseId)
        } catch (error) {
            console.error('Error getting stock by warehouse:', error)
            throw error
        }
    }

    const getLowStockItems = async (threshold: number = 10) => {
        try {
            const allStocks = await stockFirestore.getAll()
            return allStocks.filter(s => s.availableQuantity < threshold && s.availableQuantity > 0)
        } catch (error) {
            console.error('Error getting low stock items:', error)
            throw error
        }
    }

    const getOutOfStockItems = async () => {
        try {
            return await stockFirestore.getWhere('availableQuantity', '==', 0)
        } catch (error) {
            console.error('Error getting out of stock items:', error)
            throw error
        }
    }

    const updateStock = async (id: string, data: Partial<Stock>) => {
        try {
            await stockFirestore.update(id, data)
            await loadStocks()
        } catch (error) {
            console.error('Error updating stock:', error)
            throw error
        }
    }

    const adjustStock = async (
        productId: string,
        warehouseId: string,
        quantityChange: number,
        reason?: string
    ) => {
        try {
            const stockItems = await getStockByProduct(productId, warehouseId)

            if (stockItems.length === 0) {
                throw new Error('Stock item not found')
            }

            const stock = stockItems[0]
            const newQuantity = stock.quantity + quantityChange
            const newAvailableQuantity = stock.availableQuantity + quantityChange

            if (newQuantity < 0 || newAvailableQuantity < 0) {
                throw new Error('Insufficient stock')
            }

            await stockFirestore.update(stock.id, {
                quantity: newQuantity,
                availableQuantity: newAvailableQuantity,
                totalValue: newQuantity * stock.averageCost,
                lastMovementAt: Timestamp.now()
            })

            await loadStocks()
        } catch (error) {
            console.error('Error adjusting stock:', error)
            throw error
        }
    }

    const reserveStock = async (
        productId: string,
        warehouseId: string,
        quantity: number
    ) => {
        try {
            const stockItems = await getStockByProduct(productId, warehouseId)

            if (stockItems.length === 0) {
                throw new Error('Stock item not found')
            }

            const stock = stockItems[0]

            if (stock.availableQuantity < quantity) {
                throw new Error('Insufficient available stock')
            }

            await stockFirestore.update(stock.id, {
                reservedQuantity: stock.reservedQuantity + quantity,
                availableQuantity: stock.availableQuantity - quantity,
                lastMovementAt: Timestamp.now()
            })

            await loadStocks()
        } catch (error) {
            console.error('Error reserving stock:', error)
            throw error
        }
    }

    const releaseReservedStock = async (
        productId: string,
        warehouseId: string,
        quantity: number
    ) => {
        try {
            const stockItems = await getStockByProduct(productId, warehouseId)

            if (stockItems.length === 0) {
                throw new Error('Stock item not found')
            }

            const stock = stockItems[0]

            if (stock.reservedQuantity < quantity) {
                throw new Error('Cannot release more than reserved')
            }

            await stockFirestore.update(stock.id, {
                reservedQuantity: stock.reservedQuantity - quantity,
                availableQuantity: stock.availableQuantity + quantity,
                lastMovementAt: Timestamp.now()
            })

            await loadStocks()
        } catch (error) {
            console.error('Error releasing reserved stock:', error)
            throw error
        }
    }

    return {
        stocks,
        warehouses,
        currentStock,
        searchTerm,
        selectedWarehouse,
        lowStockOnly,
        filteredStocks,
        totalStockValue,
        totalItems,
        lowStockItems,
        outOfStockItems,
        loading: computed(() => stockFirestore.loading.value || warehouseFirestore.loading.value),
        error: computed(() => stockFirestore.error.value || warehouseFirestore.error.value),

        loadStocks,
        loadWarehouses,
        loadStock,
        getStockByProduct,
        getStockByWarehouse,
        getLowStockItems,
        getOutOfStockItems,
        updateStock,
        adjustStock,
        reserveStock,
        releaseReservedStock,

        clearError: () => {
            stockFirestore.clearError()
            warehouseFirestore.clearError()
        }
    }
}
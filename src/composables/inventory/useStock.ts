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
            console.log('🔄 [useStock] Loading stocks from Firestore...')
            stocks.value = await stockFirestore.getAll()
            console.log('✅ [useStock] Stocks loaded successfully:', stocks.value.length, 'items', stocks.value)
            return stocks.value
        } catch (error) {
            console.error('❌ [useStock] Error loading stocks:', error)
            throw error
        }
    }

    const loadWarehouses = async () => {
        try {
            console.log('🔄 [useStock] Loading warehouses from Firestore...')
            warehouses.value = await warehouseFirestore.getWhere('isActive', '==', true)
            console.log('✅ [useStock] Warehouses loaded successfully:', warehouses.value.length, 'items', warehouses.value)
            return warehouses.value
        } catch (error) {
            console.error('❌ [useStock] Error loading warehouses:', error)
            throw error
        }
    }

    const loadStock = async (id: string) => {
        try {
            console.log('🔄 [useStock] Loading stock by ID:', id)
            currentStock.value = await stockFirestore.getById(id)
            console.log('✅ [useStock] Stock loaded:', currentStock.value)
            return currentStock.value
        } catch (error) {
            console.error('❌ [useStock] Error loading stock:', error)
            throw error
        }
    }

    const getStockByProduct = async (productId: string, warehouseId?: string) => {
        try {
            console.log('🔄 [useStock] Getting stock by product:', { productId, warehouseId })
            let result
            if (warehouseId) {
                result = await stockFirestore.getWithFilters([
                    { field: 'productId', operator: '==', value: productId },
                    { field: 'warehouseId', operator: '==', value: warehouseId }
                ])
            } else {
                result = await stockFirestore.getWhere('productId', '==', productId)
            }
            console.log('✅ [useStock] Stock by product found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStock] Error getting stock by product:', error)
            throw error
        }
    }

    const getStockByWarehouse = async (warehouseId: string) => {
        try {
            console.log('🔄 [useStock] Getting stock by warehouse:', warehouseId)
            const result = await stockFirestore.getWhere('warehouseId', '==', warehouseId)
            console.log('✅ [useStock] Stock by warehouse found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStock] Error getting stock by warehouse:', error)
            throw error
        }
    }

    const getLowStockItems = async (threshold: number = 10) => {
        try {
            console.log('🔄 [useStock] Getting low stock items, threshold:', threshold)
            const allStocks = await stockFirestore.getAll()
            const result = allStocks.filter(s => s.availableQuantity < threshold && s.availableQuantity > 0)
            console.log('✅ [useStock] Low stock items found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStock] Error getting low stock items:', error)
            throw error
        }
    }

    const getOutOfStockItems = async () => {
        try {
            console.log('🔄 [useStock] Getting out of stock items...')
            const result = await stockFirestore.getWhere('availableQuantity', '==', 0)
            console.log('✅ [useStock] Out of stock items found:', result.length, 'items', result)
            return result
        } catch (error) {
            console.error('❌ [useStock] Error getting out of stock items:', error)
            throw error
        }
    }

    const updateStock = async (id: string, data: Partial<Stock>) => {
        try {
            console.log('🔄 [useStock] Updating stock:', { id, data })
            await stockFirestore.update(id, data)
            console.log('✅ [useStock] Stock updated successfully')
            await loadStocks()
        } catch (error) {
            console.error('❌ [useStock] Error updating stock:', error)
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
            console.log('🔄 [useStock] Adjusting stock:', { productId, warehouseId, quantityChange, reason })
            const stockItems = await getStockByProduct(productId, warehouseId)

            if (stockItems.length === 0) {
                throw new Error('Stock item not found')
            }

            const stock = stockItems[0]
            if (!stock) {
                throw new Error('Stock item not found')
            }

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

            console.log('✅ [useStock] Stock adjusted successfully')
            await loadStocks()
        } catch (error) {
            console.error('❌ [useStock] Error adjusting stock:', error)
            throw error
        }
    }

    const reserveStock = async (
        productId: string,
        warehouseId: string,
        quantity: number
    ) => {
        try {
            console.log('🔄 [useStock] Reserving stock:', { productId, warehouseId, quantity })
            const stockItems = await getStockByProduct(productId, warehouseId)

            if (stockItems.length === 0) {
                throw new Error('Stock item not found')
            }

            const stock = stockItems[0]
            if (!stock) {
                throw new Error('Stock item not found')
            }

            if (stock.availableQuantity < quantity) {
                throw new Error('Insufficient available stock')
            }

            await stockFirestore.update(stock.id, {
                reservedQuantity: stock.reservedQuantity + quantity,
                availableQuantity: stock.availableQuantity - quantity,
                lastMovementAt: Timestamp.now()
            })

            console.log('✅ [useStock] Stock reserved successfully')
            await loadStocks()
        } catch (error) {
            console.error('❌ [useStock] Error reserving stock:', error)
            throw error
        }
    }

    const releaseReservedStock = async (
        productId: string,
        warehouseId: string,
        quantity: number
    ) => {
        try {
            console.log('🔄 [useStock] Releasing reserved stock:', { productId, warehouseId, quantity })
            const stockItems = await getStockByProduct(productId, warehouseId)

            if (stockItems.length === 0) {
                throw new Error('Stock item not found')
            }

            const stock = stockItems[0]
            if (!stock) {
                throw new Error('Stock item not found')
            }

            if (stock.reservedQuantity < quantity) {
                throw new Error('Cannot release more than reserved')
            }

            await stockFirestore.update(stock.id, {
                reservedQuantity: stock.reservedQuantity - quantity,
                availableQuantity: stock.availableQuantity + quantity,
                lastMovementAt: Timestamp.now()
            })

            console.log('✅ [useStock] Reserved stock released successfully')
            await loadStocks()
        } catch (error) {
            console.error('❌ [useStock] Error releasing reserved stock:', error)
            throw error
        }
    }

    const createWarehouse = async (warehouseData: { name: string; location?: string; description?: string; isActive: boolean }) => {
        try {
            console.log('🔄 [useStock] Creating warehouse:', warehouseData)
            
            // Generate warehouse code based on name
            const code = warehouseData.name.toUpperCase().replace(/\s+/g, '_').substring(0, 10)
            
            const newWarehouse: Omit<Warehouse, 'id'> = {
                code,
                name: warehouseData.name,
                address: warehouseData.location || '',
                phone: '',
                isActive: warehouseData.isActive,
                isDefault: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            }
            
            const result = await warehouseFirestore.create(newWarehouse)
            console.log('✅ [useStock] Warehouse created successfully:', result)
            
            // Reload warehouses to update the list
            await loadWarehouses()
            return result
        } catch (error) {
            console.error('❌ [useStock] Error creating warehouse:', error)
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
        createWarehouse,

        clearError: () => {
            stockFirestore.clearError()
            warehouseFirestore.clearError()
        }
    }
}

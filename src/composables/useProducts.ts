import { ref, computed } from 'vue'
import { useFirestore } from './useFirestore'
import type { Product } from '@/types/firestore'
import { useNumbering } from './useNumbering'

export const useProducts = () => {
    const firestore = useFirestore<Product>('products')
    const { generateNumber } = useNumbering()

    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    const searchTerm = ref('')
    const selectedCategory = ref<string>('all')
    const showInactive = ref(false)

    const categories = ref<string[]>([
        'Electronics',
        'Fashion',
        'Food & Beverage',
        'Health & Beauty',
        'Home & Living',
        'Sports & Outdoors',
        'Toys & Hobbies',
        'Books & Media',
        'Automotive',
        'Other'
    ])

    const filteredProducts = computed(() => {
        let filtered = products.value

        if (!showInactive.value) {
            filtered = filtered.filter(p => p.isActive)
        }

        if (searchTerm.value) {
            const term = searchTerm.value.toLowerCase()
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.sku.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            )
        }

        if (selectedCategory.value && selectedCategory.value !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory.value)
        }

        return filtered
    })

    const loadProducts = async () => {
        try {
            products.value = await firestore.getAll()
            return products.value
        } catch (error) {
            console.error('Error loading products:', error)
            throw error
        }
    }

    const loadProduct = async (id: string) => {
        try {
            currentProduct.value = await firestore.getById(id)
            return currentProduct.value
        } catch (error) {
            console.error('Error loading product:', error)
            throw error
        }
    }

    const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
        try {
            let sku = productData.sku

            if (!sku || sku.trim() === '') {
                sku = await generateNumber('product')
            }

            const newProduct: Omit<Product, 'id'> = {
                ...productData,
                sku,
                isActive: productData.isActive ?? true,
                isSellable: productData.isSellable ?? true,
                isPurchasable: productData.isPurchasable ?? true,
                trackInventory: productData.trackInventory ?? true,
                hasVariants: productData.hasVariants ?? false,
                images: productData.images || [],
                unit: productData.unit || 'pcs',
                createdAt: undefined as any,
                updatedAt: undefined as any,
                createdBy: undefined as any
            }

            const id = await firestore.create(newProduct)
            await loadProducts()
            return id
        } catch (error) {
            console.error('Error creating product:', error)
            throw error
        }
    }

    const updateProduct = async (id: string, productData: Partial<Product>) => {
        try {
            await firestore.update(id, productData)
            await loadProducts()

            if (currentProduct.value?.id === id) {
                await loadProduct(id)
            }
        } catch (error) {
            console.error('Error updating product:', error)
            throw error
        }
    }

    const deleteProduct = async (id: string, hardDelete: boolean = false) => {
        try {
            if (hardDelete) {
                await firestore.remove(id)
            } else {
                await firestore.softDelete(id)
            }
            await loadProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
            throw error
        }
    }

    const duplicateProduct = async (id: string) => {
        try {
            const product = await firestore.getById(id)
            if (!product) throw new Error('Product not found')

            const newSku = await generateNumber('product')

            const duplicatedProduct = {
                ...product,
                sku: newSku,
                name: `${product.name} (Copy)`
            }

            delete (duplicatedProduct as any).id
            delete (duplicatedProduct as any).createdAt
            delete (duplicatedProduct as any).updatedAt
            delete (duplicatedProduct as any).createdBy

            const newId = await firestore.create(duplicatedProduct)
            await loadProducts()
            return newId
        } catch (error) {
            console.error('Error duplicating product:', error)
            throw error
        }
    }

    const getProductsBySku = async (sku: string) => {
        try {
            return await firestore.getWhere('sku', '==', sku)
        } catch (error) {
            console.error('Error getting products by SKU:', error)
            throw error
        }
    }

    const getProductsByCategory = async (category: string) => {
        try {
            return await firestore.getWhere('category', '==', category)
        } catch (error) {
            console.error('Error getting products by category:', error)
            throw error
        }
    }

    const getActiveProducts = async () => {
        try {
            return await firestore.getWhere('isActive', '==', true)
        } catch (error) {
            console.error('Error getting active products:', error)
            throw error
        }
    }

    const getSellableProducts = async () => {
        try {
            return await firestore.getWithFilters([
                { field: 'isActive', operator: '==', value: true },
                { field: 'isSellable', operator: '==', value: true }
            ])
        } catch (error) {
            console.error('Error getting sellable products:', error)
            throw error
        }
    }

    const getPurchasableProducts = async () => {
        try {
            return await firestore.getWithFilters([
                { field: 'isActive', operator: '==', value: true },
                { field: 'isPurchasable', operator: '==', value: true }
            ])
        } catch (error) {
            console.error('Error getting purchasable products:', error)
            throw error
        }
    }

    const checkSkuExists = async (sku: string, excludeId?: string): Promise<boolean> => {
        try {
            const existing = await getProductsBySku(sku)
            if (excludeId) {
                return existing.some(p => p.id !== excludeId)
            }
            return existing.length > 0
        } catch (error) {
            console.error('Error checking SKU:', error)
            return false
        }
    }

    return {
        products,
        currentProduct,
        searchTerm,
        selectedCategory,
        showInactive,
        categories,
        filteredProducts,
        loading: firestore.loading,
        error: firestore.error,

        loadProducts,
        loadProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        getProductsBySku,
        getProductsByCategory,
        getActiveProducts,
        getSellableProducts,
        getPurchasableProducts,
        checkSkuExists,

        clearError: firestore.clearError
    }
}

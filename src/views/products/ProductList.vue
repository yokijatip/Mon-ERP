<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Plus, Search, MoveVertical as MoreVertical, CreditCard as Edit, Trash2, Copy, Eye, Package } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const {
  products,
  filteredProducts,
  searchTerm,
  selectedCategory,
  showInactive,
  categories,
  loading,
  loadProducts,
  deleteProduct,
  duplicateProduct
} = useProducts()

const deleteDialogOpen = ref(false)
const productToDelete = ref<string | null>(null)

onMounted(async () => {
  await loadProducts()
})

const handleCreateProduct = () => {
  router.push({ name: 'ProductCreate' })
}

const handleEditProduct = (id: string) => {
  router.push({ name: 'ProductEdit', params: { id } })
}

const handleViewProduct = (id: string) => {
  router.push({ name: 'ProductDetail', params: { id } })
}

const confirmDelete = (id: string) => {
  productToDelete.value = id
  deleteDialogOpen.value = true
}

const handleDelete = async () => {
  if (!productToDelete.value) return

  try {
    await deleteProduct(productToDelete.value)
    toast.success('Product deleted successfully')
    deleteDialogOpen.value = false
    productToDelete.value = null
  } catch (error: any) {
    toast.error(`Failed to delete product: ${error.message}`)
  }
}

const handleDuplicate = async (id: string) => {
  try {
    await duplicateProduct(id)
    toast.success('Product duplicated successfully')
  } catch (error: any) {
    toast.error(`Failed to duplicate product: ${error.message}`)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Products</h1>
        <p class="text-muted-foreground">Manage your product catalog</p>
      </div>
      <Button @click="handleCreateProduct" class="gap-2">
        <Plus class="h-4 w-4" />
        Add Product
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Product List</CardTitle>
          <div class="flex flex-col gap-2 md:flex-row md:items-center">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="searchTerm"
                placeholder="Search products..."
                class="pl-10 w-full md:w-[300px]"
              />
            </div>
            <select
              v-model="selectedCategory"
              class="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="showInactive" class="rounded" />
              Show Inactive
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center gap-4">
            <Skeleton class="h-16 w-16 rounded" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-[250px]" />
              <Skeleton class="h-4 w-[200px]" />
            </div>
          </div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="py-12 text-center">
          <Package class="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 class="mt-4 text-lg font-semibold">No products found</h3>
          <p class="text-sm text-muted-foreground">
            {{ searchTerm ? 'Try adjusting your search' : 'Get started by creating your first product' }}
          </p>
          <Button @click="handleCreateProduct" class="mt-4 gap-2" v-if="!searchTerm">
            <Plus class="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="pb-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                <th class="pb-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                <th class="pb-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th class="pb-3 text-right text-sm font-medium text-muted-foreground">Price</th>
                <th class="pb-3 text-right text-sm font-medium text-muted-foreground">Cost</th>
                <th class="pb-3 text-center text-sm font-medium text-muted-foreground">Status</th>
                <th class="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        v-if="product.images && product.images[0]"
                        :src="product.images[0]"
                        :alt="product.name"
                        class="h-full w-full object-cover"
                      />
                      <Package v-else class="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p class="font-medium">{{ product.name }}</p>
                      <p v-if="product.description" class="text-sm text-muted-foreground line-clamp-1">
                        {{ product.description }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <code class="text-sm bg-muted px-2 py-1 rounded">{{ product.sku }}</code>
                </td>
                <td class="py-4">
                  <Badge variant="outline">{{ product.category }}</Badge>
                </td>
                <td class="py-4 text-right font-medium">
                  {{ formatCurrency(product.price) }}
                </td>
                <td class="py-4 text-right text-muted-foreground">
                  {{ formatCurrency(product.cost) }}
                </td>
                <td class="py-4 text-center">
                  <Badge :variant="product.isActive ? 'default' : 'secondary'">
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </Badge>
                </td>
                <td class="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleViewProduct(product.id)" class="gap-2">
                        <Eye class="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleEditProduct(product.id)" class="gap-2">
                        <Edit class="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleDuplicate(product.id)" class="gap-2">
                        <Copy class="h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        @click="confirmDelete(product.id)"
                        class="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 class="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!loading && filteredProducts.length > 0" class="mt-4 flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            Showing {{ filteredProducts.length }} of {{ products.length }} products
          </p>
        </div>
      </CardContent>
    </Card>

    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will deactivate the product. You can reactivate it later from settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

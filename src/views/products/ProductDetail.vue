<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, CreditCard as Edit, Copy, Trash2, Package, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const {
  currentProduct,
  loading,
  loadProduct,
  duplicateProduct,
  deleteProduct
} = useProducts()

onMounted(async () => {
  if (route.params.id) {
    await loadProduct(route.params.id as string)
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const profitMargin = computed(() => {
  if (!currentProduct.value || currentProduct.value.price === 0) return 0
  return ((currentProduct.value.price - currentProduct.value.cost) / currentProduct.value.price * 100).toFixed(2)
})

const profitAmount = computed(() => {
  if (!currentProduct.value) return 0
  return currentProduct.value.price - currentProduct.value.cost
})

const handleEdit = () => {
  router.push({ name: 'ProductEdit', params: { id: route.params.id } })
}

const handleDuplicate = async () => {
  try {
    await duplicateProduct(route.params.id as string)
    toast.success('Product duplicated successfully')
    router.push({ name: 'ProductList' })
  } catch (error: any) {
    toast.error(`Failed to duplicate: ${error.message}`)
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await deleteProduct(route.params.id as string)
    toast.success('Product deleted successfully')
    router.push({ name: 'ProductList' })
  } catch (error: any) {
    toast.error(`Failed to delete: ${error.message}`)
  }
}

const handleBack = () => {
  router.push({ name: 'ProductList' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="sm" @click="handleBack" class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Product Details</h1>
          <p class="text-muted-foreground">View product information</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="handleDuplicate" class="gap-2">
          <Copy class="h-4 w-4" />
          Duplicate
        </Button>
        <Button variant="outline" size="sm" @click="handleEdit" class="gap-2">
          <Edit class="h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" @click="handleDelete" class="gap-2">
          <Trash2 class="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>

    <div v-if="loading" class="space-y-6">
      <Card>
        <CardContent class="pt-6">
          <div class="space-y-4">
            <Skeleton class="h-8 w-[300px]" />
            <Skeleton class="h-4 w-[200px]" />
            <Skeleton class="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="!currentProduct" class="py-12 text-center">
      <Package class="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 class="mt-4 text-lg font-semibold">Product not found</h3>
      <Button @click="handleBack" class="mt-4">Go Back</Button>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <CardTitle class="text-2xl">{{ currentProduct.name }}</CardTitle>
                  <Badge :variant="currentProduct.isActive ? 'default' : 'secondary'">
                    {{ currentProduct.isActive ? 'Active' : 'Inactive' }}
                  </Badge>
                </div>
                <code class="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">{{ currentProduct.sku }}</code>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div v-if="currentProduct.images && currentProduct.images.length > 0" class="grid gap-4 grid-cols-4">
              <div v-for="(image, index) in currentProduct.images" :key="index" class="aspect-square rounded-lg overflow-hidden border">
                <img :src="image" :alt="`${currentProduct.name} ${index + 1}`" class="h-full w-full object-cover" />
              </div>
            </div>
            <div v-else class="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <Package class="h-12 w-12 text-muted-foreground" />
            </div>

            <div v-if="currentProduct.description">
              <h3 class="font-semibold mb-2">Description</h3>
              <p class="text-muted-foreground">{{ currentProduct.description }}</p>
            </div>

            <Separator />

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <p class="text-sm text-muted-foreground">Category</p>
                <Badge variant="outline" class="mt-1">{{ currentProduct.category }}</Badge>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Unit</p>
                <p class="font-medium mt-1">{{ currentProduct.unit }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <p class="text-sm text-muted-foreground">Cost Price</p>
                <p class="text-2xl font-bold mt-1">{{ formatCurrency(currentProduct.cost) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Selling Price</p>
                <p class="text-2xl font-bold mt-1">{{ formatCurrency(currentProduct.price) }}</p>
              </div>
            </div>

            <Separator class="my-4" />

            <div class="grid gap-4 md:grid-cols-2">
              <div class="p-4 rounded-lg bg-green-50 border border-green-200">
                <p class="text-sm text-green-800">Profit Margin</p>
                <p class="text-xl font-bold text-green-900 mt-1">{{ profitMargin }}%</p>
              </div>
              <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p class="text-sm text-blue-800">Profit per Unit</p>
                <p class="text-xl font-bold text-blue-900 mt-1">{{ formatCurrency(profitAmount) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card v-if="currentProduct.trackInventory">
          <CardHeader>
            <CardTitle>Inventory Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <p class="text-sm text-muted-foreground">Minimum Stock</p>
                <p class="font-medium mt-1">{{ currentProduct.minStock || 0 }} {{ currentProduct.unit }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Maximum Stock</p>
                <p class="font-medium mt-1">{{ currentProduct.maxStock || 0 }} {{ currentProduct.unit }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm">Active Status</span>
              <div class="flex items-center gap-2">
                <CheckCircle v-if="currentProduct.isActive" class="h-5 w-5 text-green-600" />
                <XCircle v-else class="h-5 w-5 text-gray-400" />
                <span class="font-medium">{{ currentProduct.isActive ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>

            <Separator />

            <div class="flex items-center justify-between">
              <span class="text-sm">Can be Sold</span>
              <div class="flex items-center gap-2">
                <CheckCircle v-if="currentProduct.isSellable" class="h-5 w-5 text-green-600" />
                <XCircle v-else class="h-5 w-5 text-gray-400" />
                <span class="font-medium">{{ currentProduct.isSellable ? 'Yes' : 'No' }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm">Can be Purchased</span>
              <div class="flex items-center gap-2">
                <CheckCircle v-if="currentProduct.isPurchasable" class="h-5 w-5 text-green-600" />
                <XCircle v-else class="h-5 w-5 text-gray-400" />
                <span class="font-medium">{{ currentProduct.isPurchasable ? 'Yes' : 'No' }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm">Track Inventory</span>
              <div class="flex items-center gap-2">
                <CheckCircle v-if="currentProduct.trackInventory" class="h-5 w-5 text-green-600" />
                <XCircle v-else class="h-5 w-5 text-gray-400" />
                <span class="font-medium">{{ currentProduct.trackInventory ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div>
              <p class="text-muted-foreground">Created</p>
              <p class="font-medium">{{ formatDate(currentProduct.createdAt) }}</p>
            </div>
            <Separator />
            <div>
              <p class="text-muted-foreground">Last Updated</p>
              <p class="font-medium">{{ formatDate(currentProduct.updatedAt) }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

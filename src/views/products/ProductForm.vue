<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Loader as Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Product } from '@/types/firestore'

const router = useRouter()
const route = useRoute()
const {
  currentProduct,
  categories,
  loading,
  loadProduct,
  createProduct,
  updateProduct,
  checkSkuExists
} = useProducts()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => isEditMode.value ? 'Edit Product' : 'Create Product')

const formData = ref({
  sku: '',
  name: '',
  description: '',
  category: 'Other',
  cost: 0,
  price: 0,
  unit: 'pcs',
  minStock: 0,
  maxStock: 0,
  trackInventory: true,
  isActive: true,
  isSellable: true,
  isPurchasable: true,
  hasVariants: false,
  images: [] as string[]
})

const formErrors = ref<Record<string, string>>({})
const saving = ref(false)

const units = ['pcs', 'box', 'pack', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'set', 'unit']

onMounted(async () => {
  if (isEditMode.value && route.params.id) {
    await loadProduct(route.params.id as string)
    if (currentProduct.value) {
      formData.value = {
        sku: currentProduct.value.sku,
        name: currentProduct.value.name,
        description: currentProduct.value.description || '',
        category: currentProduct.value.category,
        cost: currentProduct.value.cost,
        price: currentProduct.value.price,
        unit: currentProduct.value.unit,
        minStock: currentProduct.value.minStock || 0,
        maxStock: currentProduct.value.maxStock || 0,
        trackInventory: currentProduct.value.trackInventory,
        isActive: currentProduct.value.isActive,
        isSellable: currentProduct.value.isSellable,
        isPurchasable: currentProduct.value.isPurchasable,
        hasVariants: currentProduct.value.hasVariants,
        images: currentProduct.value.images || []
      }
    }
  }
})

const validateForm = async (): Promise<boolean> => {
  formErrors.value = {}

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'Product name is required'
  }

  if (formData.value.sku.trim()) {
    const skuExists = await checkSkuExists(
      formData.value.sku,
      isEditMode.value ? route.params.id as string : undefined
    )
    if (skuExists) {
      formErrors.value.sku = 'SKU already exists'
    }
  }

  if (formData.value.price < 0) {
    formErrors.value.price = 'Price must be positive'
  }

  if (formData.value.cost < 0) {
    formErrors.value.cost = 'Cost must be positive'
  }

  if (formData.value.price < formData.value.cost) {
    formErrors.value.price = 'Price should be higher than cost'
  }

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  if (saving.value) return

  const isValid = await validateForm()
  if (!isValid) {
    toast.error('Please fix the form errors')
    return
  }

  saving.value = true

  try {
    if (isEditMode.value && route.params.id) {
      await updateProduct(route.params.id as string, formData.value as Partial<Product>)
      toast.success('Product updated successfully')
    } else {
      await createProduct(formData.value as any)
      toast.success('Product created successfully')
    }

    router.push({ name: 'ProductList' })
  } catch (error: any) {
    toast.error(`Failed to save product: ${error.message}`)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const calculateMargin = computed(() => {
  if (formData.value.price === 0) return 0
  return ((formData.value.price - formData.value.cost) / formData.value.price * 100).toFixed(2)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" @click="handleCancel" class="gap-2">
        <ArrowLeft class="h-4 w-4" />
        Back
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ pageTitle }}</h1>
        <p class="text-muted-foreground">{{ isEditMode ? 'Update product information' : 'Add a new product to your catalog' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Product name, description, and identification</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="sku">SKU</Label>
                  <Input
                    id="sku"
                    v-model="formData.sku"
                    placeholder="Auto-generated if empty"
                    :class="{ 'border-destructive': formErrors.sku }"
                  />
                  <p v-if="formErrors.sku" class="text-sm text-destructive">{{ formErrors.sku }}</p>
                  <p class="text-sm text-muted-foreground">Leave empty for auto-generation</p>
                </div>

                <div class="space-y-2">
                  <Label for="name">Product Name *</Label>
                  <Input
                    id="name"
                    v-model="formData.name"
                    placeholder="Enter product name"
                    :class="{ 'border-destructive': formErrors.name }"
                    required
                  />
                  <p v-if="formErrors.name" class="text-sm text-destructive">{{ formErrors.name }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="description">Description</Label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Enter product description"
                  class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="category">Category</Label>
                  <select
                    id="category"
                    v-model="formData.category"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <Label for="unit">Unit</Label>
                  <select
                    id="unit"
                    v-model="formData.unit"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set cost and selling price</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="cost">Cost Price</Label>
                  <Input
                    id="cost"
                    v-model.number="formData.cost"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    :class="{ 'border-destructive': formErrors.cost }"
                  />
                  <p v-if="formErrors.cost" class="text-sm text-destructive">{{ formErrors.cost }}</p>
                </div>

                <div class="space-y-2">
                  <Label for="price">Selling Price *</Label>
                  <Input
                    id="price"
                    v-model.number="formData.price"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    :class="{ 'border-destructive': formErrors.price }"
                    required
                  />
                  <p v-if="formErrors.price" class="text-sm text-destructive">{{ formErrors.price }}</p>
                </div>
              </div>

              <Alert v-if="formData.cost > 0 && formData.price > 0">
                <AlertDescription>
                  Profit Margin: <strong>{{ calculateMargin }}%</strong>
                  ({{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(formData.price - formData.cost) }})
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Stock tracking and limits</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trackInventory"
                  v-model="formData.trackInventory"
                  class="rounded"
                />
                <Label for="trackInventory" class="cursor-pointer">Track inventory for this product</Label>
              </div>

              <div v-if="formData.trackInventory" class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    v-model.number="formData.minStock"
                    type="number"
                    placeholder="0"
                  />
                  <p class="text-sm text-muted-foreground">Alert when stock falls below this</p>
                </div>

                <div class="space-y-2">
                  <Label for="maxStock">Maximum Stock</Label>
                  <Input
                    id="maxStock"
                    v-model.number="formData.maxStock"
                    type="number"
                    placeholder="0"
                  />
                  <p class="text-sm text-muted-foreground">Maximum stock to maintain</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  v-model="formData.isActive"
                  class="rounded"
                />
                <Label for="isActive" class="cursor-pointer">Active</Label>
              </div>

              <Separator />

              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSellable"
                  v-model="formData.isSellable"
                  class="rounded"
                />
                <Label for="isSellable" class="cursor-pointer">Can be sold</Label>
              </div>

              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPurchasable"
                  v-model="formData.isPurchasable"
                  class="rounded"
                />
                <Label for="isPurchasable" class="cursor-pointer">Can be purchased</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Button
                type="submit"
                class="w-full gap-2"
                :disabled="saving || loading"
              >
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                <Save v-else class="h-4 w-4" />
                {{ saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product' }}
              </Button>
              <Button
                type="button"
                variant="outline"
                class="w-full"
                @click="handleCancel"
                :disabled="saving"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  </div>
</template>

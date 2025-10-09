<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Stock Adjustments</h1>
        <p class="text-muted-foreground mt-1">Manage inventory adjustments and corrections</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="openWarehouseDialog">
          <Plus class="mr-2 h-4 w-4" />
          Add Warehouse
        </Button>
        <Button @click="openAdjustmentDialog">
          <Plus class="mr-2 h-4 w-4" />
          New Adjustment
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="space-y-2">
            <Label>Search</Label>
            <div class="relative">
              <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchTerm"
                  placeholder="Search adjustments..."
                  class="pl-8"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Type</Label>
            <Select v-model="selectedType" class="w-fit">
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in">Stock In</SelectItem>
                <SelectItem value="out">Stock Out</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Warehouse</Label>
            <Select v-model="selectedWarehouse">
              <SelectTrigger>
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2 flex items-end">
            <Button variant="outline" @click="clearFilters" class="w-full">
              <X class="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Adjustments Table -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Adjustments</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="filteredMovements.length === 0" class="text-center py-12">
          <FileText class="mx-auto h-12 w-12 text-muted-foreground" />
          <p class="mt-4 text-lg font-medium">No adjustments found</p>
          <p class="text-sm text-muted-foreground">Create your first adjustment</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-medium">Movement #</th>
              <th class="text-left py-3 px-4 font-medium">Date</th>
              <th class="text-left py-3 px-4 font-medium">Type</th>
              <th class="text-left py-3 px-4 font-medium">Product</th>
              <th class="text-left py-3 px-4 font-medium">Warehouse</th>
              <th class="text-right py-3 px-4 font-medium">Quantity</th>
              <th class="text-right py-3 px-4 font-medium">Cost</th>
              <th class="text-left py-3 px-4 font-medium">Notes</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="movement in filteredMovements"
                :key="movement.id"
                class="border-b hover:bg-muted/50"
            >
              <td class="py-3 px-4">
                <Badge variant="outline">{{ movement.movementNumber }}</Badge>
              </td>
              <td class="py-3 px-4">{{ formatDate(movement.date) }}</td>
              <td class="py-3 px-4">
                <Badge :variant="getTypeVariant(movement.type)">
                  {{ formatType(movement.type) }}
                </Badge>
              </td>
              <td class="py-3 px-4">
                <div class="font-medium">{{ movement.productName }}</div>
                <div class="text-sm text-muted-foreground">{{ movement.productSku }}</div>
              </td>
              <td class="py-3 px-4">
                <div v-if="movement.type === 'transfer'">
                  <div class="text-sm">
                    <ArrowRight class="inline h-3 w-3" />
                    {{ getWarehouseName(movement.toWarehouseId) }}
                  </div>
                </div>
                <div v-else>
                  {{ getWarehouseName(movement.fromWarehouseId || movement.toWarehouseId) }}
                </div>
              </td>
              <td class="text-right py-3 px-4">
                  <span :class="movement.type === 'in' ? 'text-green-600' : movement.type === 'out' ? 'text-red-600' : ''">
                    {{ movement.type === 'out' ? '-' : '+' }}{{ movement.quantity }} {{ movement.unit }}
                  </span>
              </td>
              <td class="text-right py-3 px-4">{{ formatCurrency(movement.totalCost) }}</td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ movement.notes || '-' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Adjustment Dialog -->
    <AlertDialog v-model:open="showAdjustmentDialog">
      <AlertDialogContent class="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Stock Adjustment</AlertDialogTitle>
          <AlertDialogDescription>
            Record a stock adjustment for inventory correction
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div class="space-y-4 py-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label>Adjustment Type *</Label>
              <Select v-model="adjustmentForm.type">
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Date *</Label>
              <Input
                  v-model="adjustmentForm.date"
                  type="date"
                  required
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Product *</Label>
            <Select v-model="adjustmentForm.productId" @update:model-value="onProductChange">
              <SelectTrigger>
                <SelectValue placeholder="Select product..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }} ({{ product.sku }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label>{{ adjustmentForm.type === 'transfer' ? 'From Warehouse *' : 'Warehouse *' }}</Label>
              <Select v-model="adjustmentForm.fromWarehouseId">
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div v-if="adjustmentForm.type === 'transfer'" class="space-y-2">
              <Label>To Warehouse *</Label>
              <Select v-model="adjustmentForm.toWarehouseId">
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <div class="space-y-2">
              <Label>Quantity *</Label>
              <Input
                  v-model.number="adjustmentForm.quantity"
                  type="number"
                  min="0"
                  step="1"
                  required
              />
            </div>

            <div class="space-y-2">
              <Label>Unit Cost *</Label>
              <Input
                  v-model.number="adjustmentForm.unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  required
              />
            </div>

            <div class="space-y-2">
              <Label>Total Cost</Label>
              <Input
                  :value="formatCurrency(totalCost)"
                  disabled
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Reference Number</Label>
            <Input
                v-model="adjustmentForm.referenceNumber"
                placeholder="Optional reference number"
            />
          </div>

          <div class="space-y-2">
            <Label>Notes</Label>
            <textarea
                v-model="adjustmentForm.notes"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Additional notes..."
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel @click="closeAdjustmentDialog">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="submitAdjustment" :disabled="!isFormValid || submitting">
            {{ submitting ? 'Submitting...' : 'Create Adjustment' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Add Warehouse Dialog -->
    <AlertDialog v-model:open="showWarehouseDialog">
      <AlertDialogContent class="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Warehouse</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new warehouse location for inventory management
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label>Warehouse Name *</Label>
            <Input
                v-model="warehouseForm.name"
                placeholder="Enter warehouse name"
                required
            />
          </div>

          <div class="space-y-2">
            <Label>Location</Label>
            <Input
                v-model="warehouseForm.location"
                placeholder="Enter warehouse location"
            />
          </div>

          <div class="space-y-2">
            <Label>Description</Label>
            <textarea
                v-model="warehouseForm.description"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Optional description..."
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel @click="closeWarehouseDialog">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="submitWarehouse" :disabled="!warehouseForm.name.trim() || submittingWarehouse">
            {{ submittingWarehouse ? 'Creating...' : 'Create Warehouse' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStockMovement } from '@/composables/inventory/useStockMovement'
import { useStock } from '@/composables/inventory/useStock'
import { useProducts } from '@/composables/useProducts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Plus,
  Search,
  X,
  FileText,
  ArrowRight
} from 'lucide-vue-next'
import { Timestamp } from 'firebase/firestore'
import type { StockMovementType } from '@/types/firestore'
import { toast } from 'vue-sonner'

const {
  searchTerm,
  selectedType,
  selectedWarehouse,
  filteredMovements,
  loading,
  loadMovements,
  createMovement
} = useStockMovement()

const { warehouses, loadWarehouses, createWarehouse } = useStock()
const { products, loadProducts } = useProducts()

const showAdjustmentDialog = ref(false)
const showWarehouseDialog = ref(false)
const submitting = ref(false)
const submittingWarehouse = ref(false)

const adjustmentForm = ref({
  type: '' as StockMovementType | '',
  date: new Date().toISOString().split('T')[0],
  productId: '',
  productSku: '',
  productName: '',
  fromWarehouseId: '',
  toWarehouseId: '',
  quantity: 0,
  unit: 'pcs',
  unitCost: 0,
  referenceNumber: '',
  notes: ''
})

const warehouseForm = ref({
  name: '',
  location: '',
  description: ''
})

const totalCost = computed(() => {
  return adjustmentForm.value.quantity * adjustmentForm.value.unitCost
})

const isFormValid = computed(() => {
  const form = adjustmentForm.value
  const baseValid = form.type && form.productId && form.quantity > 0 && form.unitCost >= 0

  if (form.type === 'transfer') {
    return baseValid && form.fromWarehouseId && form.toWarehouseId && form.fromWarehouseId !== form.toWarehouseId
  }

  return baseValid && (form.fromWarehouseId || form.toWarehouseId)
})

onMounted(async () => {
  await Promise.all([
    loadMovements(),
    loadWarehouses(),
    loadProducts()
  ])
})

const clearFilters = () => {
  searchTerm.value = ''
  selectedType.value = 'all'
  selectedWarehouse.value = 'all'
}

const formatDate = (timestamp: any) => {
  return new Date(timestamp.seconds * 1000).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatType = (type: string) => {
  const types: Record<string, string> = {
    in: 'Stock In',
    out: 'Stock Out',
    transfer: 'Transfer',
    adjustment: 'Adjustment'
  }
  return types[type] || type
}

const getTypeVariant = (type: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
  const variants: Record<string, any> = {
    in: 'default',
    out: 'destructive',
    transfer: 'secondary',
    adjustment: 'outline'
  }
  return variants[type] || 'outline'
}

const getWarehouseName = (warehouseId?: string) => {
  if (!warehouseId) return '-'
  const warehouse = warehouses.value.find(w => w.id === warehouseId)
  return warehouse?.name || 'Unknown'
}

const onProductChange = () => {
  const product = products.value.find(p => p.id === adjustmentForm.value.productId)
  if (product) {
    adjustmentForm.value.productSku = product.sku
    adjustmentForm.value.productName = product.name
    adjustmentForm.value.unit = product.unit
    adjustmentForm.value.unitCost = product.cost
  }
}

const openAdjustmentDialog = () => {
  showAdjustmentDialog.value = true
}

const closeAdjustmentDialog = () => {
  showAdjustmentDialog.value = false
  resetForm()
}

const openWarehouseDialog = () => {
  showWarehouseDialog.value = true
}

const closeWarehouseDialog = () => {
  showWarehouseDialog.value = false
  resetWarehouseForm()
}

const resetForm = () => {
  adjustmentForm.value = {
    type: '',
    date: new Date().toISOString().split('T')[0],
    productId: '',
    productSku: '',
    productName: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: 0,
    unit: 'pcs',
    unitCost: 0,
    referenceNumber: '',
    notes: ''
  }
}

const resetWarehouseForm = () => {
  warehouseForm.value = {
    name: '',
    location: '',
    description: ''
  }
}

const submitAdjustment = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill all required fields')
    return
  }

  submitting.value = true

  try {
    const form = adjustmentForm.value
    const date = Timestamp.fromDate(new Date(form.date?.toString() || new Date().toISOString()))

    // Prepare movement data without undefined fields
    const movementData: any = {
      date,
      type: form.type as StockMovementType,
      productId: form.productId,
      productSku: form.productSku,
      productName: form.productName,
      quantity: form.quantity,
      unit: form.unit,
      unitCost: form.unitCost,
      totalCost: totalCost.value
    }

    // Add warehouse IDs based on movement type
    if (form.type !== 'in' && form.fromWarehouseId) {
      movementData.fromWarehouseId = form.fromWarehouseId
    }
    if (form.type !== 'out') {
      if (form.type === 'transfer' && form.toWarehouseId) {
        movementData.toWarehouseId = form.toWarehouseId
      } else if (form.type === 'in' && form.fromWarehouseId) {
        movementData.toWarehouseId = form.fromWarehouseId
      }
    }

    // Add optional fields only if they have values
    if (form.referenceNumber) {
      movementData.referenceNumber = form.referenceNumber
    }
    if (form.notes) {
      movementData.notes = form.notes
    }

    await createMovement(movementData)

    toast.success('Stock adjustment created successfully')
    closeAdjustmentDialog()
  } catch (error: any) {
    toast.error(`Failed to create adjustment: ${error.message}`)
  } finally {
    submitting.value = false
  }
}

const submitWarehouse = async () => {
  if (!warehouseForm.value.name.trim()) {
    console.error('❌ [Adjustments] Warehouse name is required')
    return
  }

  submittingWarehouse.value = true

  try {
    const result = await createWarehouse({
      name: warehouseForm.value.name.trim(),
      location: warehouseForm.value.location.trim() || undefined,
      description: warehouseForm.value.description.trim() || undefined,
      isActive: true
    })

    console.log('✅ [Adjustments] Warehouse created successfully:', {
      id: result,
      name: warehouseForm.value.name.trim(),
      location: warehouseForm.value.location.trim() || 'No location',
      description: warehouseForm.value.description.trim() || 'No description'
    })
    
    closeWarehouseDialog()
    // Reload warehouses to update the list
    await loadWarehouses()
  } catch (error: any) {
    console.error('❌ [Adjustments] Failed to create warehouse:', error.message)
  } finally {
    submittingWarehouse.value = false
  }
}
</script>

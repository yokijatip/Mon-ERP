<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Stock Overview</h1>
        <p class="text-muted-foreground mt-1">Monitor and manage your inventory levels</p>
      </div>
      <Button @click="refreshData">
        <RefreshCw :class="{ 'animate-spin': loading }" class="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Items</CardTitle>
          <Package class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalItems }}</div>
          <p class="text-xs text-muted-foreground">Across all warehouses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Stock Value</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(totalStockValue) }}</div>
          <p class="text-xs text-muted-foreground">Current inventory value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle class="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-yellow-600">{{ lowStockItems }}</div>
          <p class="text-xs text-muted-foreground">Need attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Out of Stock</CardTitle>
          <AlertCircle class="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">{{ outOfStockItems }}</div>
          <p class="text-xs text-muted-foreground">Urgent action required</p>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="space-y-2">
            <Label>Search</Label>
            <div class="relative">
              <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchTerm"
                  placeholder="Search by product or SKU..."
                  class="pl-8"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Warehouse</Label>
            <select
                v-model="selectedWarehouse"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Warehouses</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <Label>Filter</Label>
            <div class="flex items-center space-x-2">
              <input
                  type="checkbox"
                  v-model="lowStockOnly"
                  id="lowStock"
                  class="h-4 w-4 rounded border-gray-300"
              />
              <label for="lowStock" class="text-sm">Low Stock Only</label>
            </div>
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

    <!-- Stock Table -->
    <Card>
      <CardHeader>
        <CardTitle>Stock Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="filteredStocks.length === 0" class="text-center py-12">
          <Package class="mx-auto h-12 w-12 text-muted-foreground" />
          <p class="mt-4 text-lg font-medium">No stock items found</p>
          <p class="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-medium">Product</th>
              <th class="text-left py-3 px-4 font-medium">SKU</th>
              <th class="text-left py-3 px-4 font-medium">Warehouse</th>
              <th class="text-right py-3 px-4 font-medium">Quantity</th>
              <th class="text-right py-3 px-4 font-medium">Reserved</th>
              <th class="text-right py-3 px-4 font-medium">Available</th>
              <th class="text-right py-3 px-4 font-medium">Avg Cost</th>
              <th class="text-right py-3 px-4 font-medium">Total Value</th>
              <th class="text-center py-3 px-4 font-medium">Status</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="stock in filteredStocks"
                :key="stock.id"
                class="border-b hover:bg-muted/50 cursor-pointer"
                @click="viewStockDetail(stock)"
            >
              <td class="py-3 px-4">
                <div class="font-medium">{{ stock.productName }}</div>
              </td>
              <td class="py-3 px-4">
                <Badge variant="outline">{{ stock.productSku }}</Badge>
              </td>
              <td class="py-3 px-4">{{ stock.warehouseName }}</td>
              <td class="text-right py-3 px-4">{{ stock.quantity }}</td>
              <td class="text-right py-3 px-4">{{ stock.reservedQuantity }}</td>
              <td class="text-right py-3 px-4">{{ stock.availableQuantity }}</td>
              <td class="text-right py-3 px-4">{{ formatCurrency(stock.averageCost) }}</td>
              <td class="text-right py-3 px-4 font-medium">
                {{ formatCurrency(stock.totalValue) }}
              </td>
              <td class="text-center py-3 px-4">
                <Badge :variant="getStockStatusVariant(stock)">
                  {{ getStockStatus(stock) }}
                </Badge>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStock } from '@/composables/inventory/useStock'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  Search,
  X,
  RefreshCw
} from 'lucide-vue-next'
import type { Stock } from '@/types/firestore'

const {
  stocks,
  warehouses,
  searchTerm,
  selectedWarehouse,
  lowStockOnly,
  filteredStocks,
  totalStockValue,
  totalItems,
  lowStockItems,
  outOfStockItems,
  loading,
  loadStocks,
  loadWarehouses
} = useStock()

onMounted(async () => {
  await refreshData()
})

const refreshData = async () => {
  await Promise.all([
    loadStocks(),
    loadWarehouses()
  ])
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedWarehouse.value = 'all'
  lowStockOnly.value = false
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const getStockStatus = (stock: Stock) => {
  if (stock.availableQuantity === 0) return 'Out of Stock'
  if (stock.availableQuantity < 10) return 'Low Stock'
  return 'In Stock'
}

const getStockStatusVariant = (stock: Stock): 'default' | 'destructive' | 'outline' | 'secondary' => {
  if (stock.availableQuantity === 0) return 'destructive'
  if (stock.availableQuantity < 10) return 'secondary'
  return 'default'
}

const viewStockDetail = (stock: Stock) => {
  // Navigate to stock detail or open modal
  console.log('View stock detail:', stock)
}
</script>
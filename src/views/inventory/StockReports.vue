<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Stock Reports</h1>
        <p class="text-muted-foreground mt-1">Comprehensive inventory reports and analytics</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="exportReport">
          <Download class="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button @click="refreshData">
          <RefreshCw :class="{ 'animate-spin': loading }" class="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card
          v-for="report in reportTypes"
          :key="report.id"
          :class="[
          'cursor-pointer transition-all hover:shadow-md',
          selectedReport === report.id ? 'ring-2 ring-primary' : ''
        ]"
          @click="selectedReport = report.id"
      >
        <CardContent class="">
          <div class="flex items-center space-x-2">
            <div class="p-2 rounded-lg bg-primary/10">
              <component :is="report.icon" class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold">{{ report.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ report.description }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Date Range Filter -->
    <Card>
      <CardContent class="">
        <div class="grid gap-4 md:grid-cols-5">
          <div class="space-y-2">
            <Label>Start Date</Label>
            <Input
                v-model="dateRange.start"
                type="date"
            />
          </div>

          <div class="space-y-2">
            <Label>End Date</Label>
            <Input
                v-model="dateRange.end"
                type="date"
            />
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
            <Label>Product Category</Label>
            <select
                v-model="selectedCategory"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="space-y-2 flex items-end">
            <Button @click="generateReport" class="w-full">
              <FileText class="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stock Valuation Report -->
    <Card v-if="selectedReport === 'valuation'">
      <CardHeader>
        <CardTitle>Stock Valuation Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <!-- Summary Cards -->
          <div class="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Total Stock Value</div>
                <div class="text-2xl font-bold">{{ formatCurrency(reportData.totalValue) }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Total Items</div>
                <div class="text-2xl font-bold">{{ reportData.totalItems }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Average Cost</div>
                <div class="text-2xl font-bold">{{ formatCurrency(reportData.avgCost) }}</div>
              </CardContent>
            </Card>
          </div>

          <!-- Detailed Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Product</th>
                <th class="text-left py-3 px-4 font-medium">SKU</th>
                <th class="text-left py-3 px-4 font-medium">Category</th>
                <th class="text-right py-3 px-4 font-medium">Quantity</th>
                <th class="text-right py-3 px-4 font-medium">Avg Cost</th>
                <th class="text-right py-3 px-4 font-medium">Total Value</th>
                <th class="text-right py-3 px-4 font-medium">% of Total</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in reportData.items"
                  :key="item.id"
                  class="border-b hover:bg-muted/50"
              >
                <td class="py-3 px-4 font-medium">{{ item.productName }}</td>
                <td class="py-3 px-4">
                  <Badge variant="outline">{{ item.productSku }}</Badge>
                </td>
                <td class="py-3 px-4">{{ item.category }}</td>
                <td class="text-right py-3 px-4">{{ item.quantity }}</td>
                <td class="text-right py-3 px-4">{{ formatCurrency(item.avgCost) }}</td>
                <td class="text-right py-3 px-4 font-medium">{{ formatCurrency(item.totalValue) }}</td>
                <td class="text-right py-3 px-4">{{ item.percentage }}%</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stock Movement Report -->
    <Card v-if="selectedReport === 'movement'">
      <CardHeader>
        <CardTitle>Stock Movement Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <!-- Summary Cards -->
          <div class="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Total Movements</div>
                <div class="text-2xl font-bold">{{ movementReport.totalMovements }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Stock In</div>
                <div class="text-2xl font-bold text-green-600">+{{ movementReport.stockIn }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Stock Out</div>
                <div class="text-2xl font-bold text-red-600">-{{ movementReport.stockOut }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Net Change</div>
                <div class="text-2xl font-bold" :class="movementReport.netChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ movementReport.netChange >= 0 ? '+' : '' }}{{ movementReport.netChange }}
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Movement Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Date</th>
                <th class="text-left py-3 px-4 font-medium">Movement #</th>
                <th class="text-left py-3 px-4 font-medium">Type</th>
                <th class="text-left py-3 px-4 font-medium">Product</th>
                <th class="text-right py-3 px-4 font-medium">Quantity</th>
                <th class="text-right py-3 px-4 font-medium">Cost</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="movement in movementReport.movements"
                  :key="movement.id"
                  class="border-b hover:bg-muted/50"
              >
                <td class="py-3 px-4">{{ formatDate(movement.date) }}</td>
                <td class="py-3 px-4">
                  <Badge variant="outline">{{ movement.movementNumber }}</Badge>
                </td>
                <td class="py-3 px-4">
                  <Badge :variant="getTypeVariant(movement.type)">
                    {{ formatType(movement.type) }}
                  </Badge>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium">{{ movement.productName }}</div>
                  <div class="text-sm text-muted-foreground">{{ movement.productSku }}</div>
                </td>
                <td class="text-right py-3 px-4">
                    <span :class="movement.type === 'in' ? 'text-green-600' : movement.type === 'out' ? 'text-red-600' : ''">
                      {{ movement.type === 'out' ? '-' : '+' }}{{ movement.quantity }}
                    </span>
                </td>
                <td class="text-right py-3 px-4">{{ formatCurrency(movement.totalCost) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Low Stock Report -->
    <Card v-if="selectedReport === 'lowstock'">
      <CardHeader>
        <CardTitle>Low Stock Alert Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <div v-if="lowStockReport.length === 0" class="text-center py-12">
            <Package class="mx-auto h-12 w-12 text-green-600" />
            <p class="mt-4 text-lg font-medium text-green-600">All items are well stocked!</p>
            <p class="text-sm text-muted-foreground">No low stock items found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Product</th>
                <th class="text-left py-3 px-4 font-medium">SKU</th>
                <th class="text-left py-3 px-4 font-medium">Warehouse</th>
                <th class="text-right py-3 px-4 font-medium">Current Stock</th>
                <th class="text-right py-3 px-4 font-medium">Min Stock</th>
                <th class="text-center py-3 px-4 font-medium">Status</th>
                <th class="text-center py-3 px-4 font-medium">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in lowStockReport"
                  :key="item.id"
                  class="border-b hover:bg-muted/50"
              >
                <td class="py-3 px-4 font-medium">{{ item.productName }}</td>
                <td class="py-3 px-4">
                  <Badge variant="outline">{{ item.productSku }}</Badge>
                </td>
                <td class="py-3 px-4">{{ item.warehouseName }}</td>
                <td class="text-right py-3 px-4">
                    <span :class="item.availableQuantity === 0 ? 'text-red-600 font-bold' : 'text-yellow-600'">
                      {{ item.availableQuantity }}
                    </span>
                </td>
                <td class="text-right py-3 px-4">{{ item.minStock || 10 }}</td>
                <td class="text-center py-3 px-4">
                  <Badge :variant="item.availableQuantity === 0 ? 'destructive' : 'secondary'">
                    {{ item.availableQuantity === 0 ? 'Out of Stock' : 'Low Stock' }}
                  </Badge>
                </td>
                <td class="text-center py-3 px-4">
                  <Button size="sm" variant="outline">
                    <Plus class="h-4 w-4" />
                  </Button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stock Aging Report -->
    <Card v-if="selectedReport === 'aging'">
      <CardHeader>
        <CardTitle>Stock Aging Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <!-- Summary Cards -->
          <div class="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Fast Moving</div>
                <div class="text-2xl font-bold text-green-600">{{ agingReport.fastMoving }}</div>
                <div class="text-xs text-muted-foreground">{'<'} 30 days</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Normal Moving</div>
                <div class="text-2xl font-bold text-blue-600">{{ agingReport.normalMoving }}</div>
                <div class="text-xs text-muted-foreground">30-90 days</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Slow Moving</div>
                <div class="text-2xl font-bold text-yellow-600">{{ agingReport.slowMoving }}</div>
                <div class="text-xs text-muted-foreground">90-180 days</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="pt-6">
                <div class="text-sm text-muted-foreground">Dead Stock</div>
                <div class="text-2xl font-bold text-red-600">{{ agingReport.deadStock }}</div>
                <div class="text-xs text-muted-foreground">> 180 days</div>
              </CardContent>
            </Card>
          </div>

          <!-- Aging Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Product</th>
                <th class="text-left py-3 px-4 font-medium">SKU</th>
                <th class="text-left py-3 px-4 font-medium">Warehouse</th>
                <th class="text-right py-3 px-4 font-medium">Quantity</th>
                <th class="text-left py-3 px-4 font-medium">Last Movement</th>
                <th class="text-right py-3 px-4 font-medium">Days</th>
                <th class="text-center py-3 px-4 font-medium">Category</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="item in agingReport.items"
                  :key="item.id"
                  class="border-b hover:bg-muted/50"
              >
                <td class="py-3 px-4 font-medium">{{ item.productName }}</td>
                <td class="py-3 px-4">
                  <Badge variant="outline">{{ item.productSku }}</Badge>
                </td>
                <td class="py-3 px-4">{{ item.warehouseName }}</td>
                <td class="text-right py-3 px-4">{{ item.quantity }}</td>
                <td class="py-3 px-4">{{ formatDate(item.lastMovementAt) }}</td>
                <td class="text-right py-3 px-4">{{ item.daysIdle }}</td>
                <td class="text-center py-3 px-4">
                  <Badge :variant="getAgingVariant(item.daysIdle)">
                    {{ getAgingCategory(item.daysIdle) }}
                  </Badge>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useStock} from '@/composables/inventory/useStock'
import {useStockMovement} from '@/composables/inventory/useStockMovement'
import {useProducts} from '@/composables/useProducts'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Badge} from '@/components/ui/badge'
import {AlertTriangle, Clock, Download, FileText, Package, Plus, RefreshCw, TrendingUp} from 'lucide-vue-next'
import type {Stock, StockMovement} from '@/types/firestore'

const {
  stocks,
  warehouses,
  loading: stockLoading,
  loadStocks,
  loadWarehouses,
  getLowStockItems
} = useStock()

const {
  movements,
  loading: movementLoading,
  loadMovements,
  getMovementsByDateRange
} = useStockMovement()

const { products, categories, loadProducts } = useProducts()

const loading = computed(() => stockLoading.value || movementLoading.value)

const selectedReport = ref('valuation')
const selectedWarehouse = ref('all')
const selectedCategory = ref('all')
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const reportTypes = [
  {
    id: 'valuation',
    title: 'Stock Valuation',
    description: 'Current stock value',
    icon: TrendingUp
  },
  {
    id: 'movement',
    title: 'Stock Movement',
    description: 'In/Out transactions',
    icon: Package
  },
  {
    id: 'lowstock',
    title: 'Low Stock Alert',
    description: 'Items need restock',
    icon: AlertTriangle
  },
  {
    id: 'aging',
    title: 'Stock Aging',
    description: 'Slow moving items',
    icon: Clock
  }
]

const reportData = ref({
  totalValue: 0,
  totalItems: 0,
  avgCost: 0,
  items: [] as any[]
})

const movementReport = ref({
  totalMovements: 0,
  stockIn: 0,
  stockOut: 0,
  netChange: 0,
  movements: [] as StockMovement[]
})

const lowStockReport = ref<Stock[]>([])

const agingReport = ref({
  fastMoving: 0,
  normalMoving: 0,
  slowMoving: 0,
  deadStock: 0,
  items: [] as any[]
})

onMounted(async () => {
  await refreshData()
  await generateReport()
})

const refreshData = async () => {
  await Promise.all([
    loadStocks(),
    loadWarehouses(),
    loadProducts(),
    loadMovements()
  ])
}

const generateReport = async () => {
  switch (selectedReport.value) {
    case 'valuation':
      await generateValuationReport()
      break
    case 'movement':
      await generateMovementReport()
      break
    case 'lowstock':
      await generateLowStockReport()
      break
    case 'aging':
      await generateAgingReport()
      break
  }
}

const generateValuationReport = async () => {
  let filteredStocks = stocks.value

  // Apply filters
  if (selectedWarehouse.value !== 'all') {
    filteredStocks = filteredStocks.filter(s => s.warehouseId === selectedWarehouse.value)
  }

  if (selectedCategory.value !== 'all') {
    const categoryProducts = products.value
        .filter(p => p.category === selectedCategory.value)
        .map(p => p.id)
    filteredStocks = filteredStocks.filter(s => categoryProducts.includes(s.productId))
  }

  const totalValue = filteredStocks.reduce((sum, s) => sum + s.totalValue, 0)
  const totalItems = filteredStocks.length
  const avgCost = totalItems > 0 ? totalValue / totalItems : 0

  const items = filteredStocks.map(stock => {
    const product = products.value.find(p => p.id === stock.productId)
    return {
      id: stock.id,
      productName: stock.productName,
      productSku: stock.productSku,
      category: product?.category || 'Unknown',
      quantity: stock.quantity,
      avgCost: stock.averageCost,
      totalValue: stock.totalValue,
      percentage: totalValue > 0 ? ((stock.totalValue / totalValue) * 100).toFixed(2) : '0'
    }
  }).sort((a, b) => b.totalValue - a.totalValue)

  reportData.value = {
    totalValue,
    totalItems,
    avgCost,
    items
  }
}

const generateMovementReport = async () => {
  const startDate = new Date(dateRange.value.start)
  const endDate = new Date(dateRange.value.end)

  let filteredMovements = await getMovementsByDateRange(startDate, endDate)

  if (selectedWarehouse.value !== 'all') {
    filteredMovements = filteredMovements.filter(m =>
        m.fromWarehouseId === selectedWarehouse.value ||
        m.toWarehouseId === selectedWarehouse.value
    )
  }

  const stockIn = filteredMovements
      .filter(m => m.type === 'in')
      .reduce((sum, m) => sum + m.quantity, 0)

  const stockOut = filteredMovements
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.quantity, 0)

  movementReport.value = {
    totalMovements: filteredMovements.length,
    stockIn,
    stockOut,
    netChange: stockIn - stockOut,
    movements: filteredMovements
  }
}

const generateLowStockReport = async () => {
  let lowStock = await getLowStockItems(10)

  if (selectedWarehouse.value !== 'all') {
    lowStock = lowStock.filter(s => s.warehouseId === selectedWarehouse.value)
  }

  lowStockReport.value = lowStock.sort((a, b) => a.availableQuantity - b.availableQuantity)
}

const generateAgingReport = async () => {
  let filteredStocks = stocks.value

  if (selectedWarehouse.value !== 'all') {
    filteredStocks = filteredStocks.filter(s => s.warehouseId === selectedWarehouse.value)
  }

  const now = new Date()
  const items = filteredStocks.map(stock => {
    const lastMovement = new Date(stock.lastMovementAt.seconds * 1000)
    const daysIdle = Math.floor((now.getTime() - lastMovement.getTime()) / (1000 * 60 * 60 * 24))

    return {
      id: stock.id,
      productName: stock.productName,
      productSku: stock.productSku,
      warehouseName: stock.warehouseName,
      quantity: stock.quantity,
      lastMovementAt: stock.lastMovementAt,
      daysIdle
    }
  }).sort((a, b) => b.daysIdle - a.daysIdle)

  agingReport.value = {
    fastMoving: items.filter(i => i.daysIdle < 30).length,
    normalMoving: items.filter(i => i.daysIdle >= 30 && i.daysIdle < 90).length,
    slowMoving: items.filter(i => i.daysIdle >= 90 && i.daysIdle < 180).length,
    deadStock: items.filter(i => i.daysIdle >= 180).length,
    items
  }
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

const getAgingCategory = (days: number) => {
  if (days < 30) return 'Fast Moving'
  if (days < 90) return 'Normal'
  if (days < 180) return 'Slow Moving'
  return 'Dead Stock'
}

const getAgingVariant = (days: number): 'default' | 'destructive' | 'outline' | 'secondary' => {
  if (days < 30) return 'default'
  if (days < 90) return 'secondary'
  if (days < 180) return 'outline'
  return 'destructive'
}

const exportReport = () => {
  // Implement export functionality (CSV, PDF, Excel)
  console.log('Exporting report...')
  // You can use libraries like xlsx or jspdf for this
}
</script>
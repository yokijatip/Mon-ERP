<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import VueApexCharts from 'vue3-apexcharts'
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  ShoppingCart,
  MoreVertical,
  Search,
  Download,
  RefreshCw,
  Activity,
  DollarSign,
  BarChart3,
  PieChart,
  Clock
} from 'lucide-vue-next'
import { useStock } from '@/composables/inventory/useStock'
import { useStockMovement } from '@/composables/inventory/useStockMovement'
import { useProducts } from '@/composables/useProducts'
import { useRouter } from 'vue-router'
import type { Stock, StockMovement } from '@/types/firestore'

const { 
  stocks, 
  warehouses,
  totalStockValue, 
  lowStockItems, 
  outOfStockItems,
  loadStocks,
  loadWarehouses 
} = useStock()

const { 
  filteredMovements, 
  loadMovements,
  getRecentMovements 
} = useStockMovement()

const { products, loadProducts } = useProducts()

const router = useRouter()
const loading = ref(false)
const recentMovements = ref<StockMovement[]>([])
const error = ref<string | null>(null)
const lastUpdated = ref<Date | null>(null)

const inventoryStats = computed(() => {
  const totalProducts = stocks.value.length
  const lowStock = lowStockItems.value
  const outOfStock = outOfStockItems.value
  const totalValue = totalStockValue.value
  
  return [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: totalProducts > 0 ? `${totalProducts} items` : 'No items',
      isPositive: totalProducts > 0,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      description: 'Active SKUs'
    },
    {
      title: 'Low Stock Items',
      value: lowStock.toString(),
      change: lowStock > 0 ? 'Needs attention' : 'All good',
      isPositive: lowStock === 0,
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Needs reorder'
    },
    {
      title: 'Out of Stock',
      value: outOfStock.toString(),
      change: outOfStock > 0 ? 'Urgent action' : 'All stocked',
      isPositive: outOfStock === 0,
      icon: Package,
      color: 'bg-red-100 text-red-600',
      description: 'Critical items'
    },
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      change: `${warehouses.value.length} gudang`,
      isPositive: totalValue > 0,
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600',
      description: 'Tabungan'
    }
  ]
})

const stockMovementSeries = computed(() => {
  const monthlyData: { [key: string]: { in: number; out: number } } = {}
  
  // Use filteredMovements instead of movements
  if (filteredMovements.value && filteredMovements.value.length > 0) {
    filteredMovements.value.forEach(movement => {
      try {
        const date = new Date(movement.date.seconds * 1000)
        const monthKey = date.toLocaleString('default', { month: 'short' })
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { in: 0, out: 0 }
        }
        
        if (movement.type === 'in') {
          monthlyData[monthKey].in += movement.quantity
        } else if (movement.type === 'out') {
          monthlyData[monthKey].out += movement.quantity
        }
      } catch (error) {
        console.warn('Error processing movement for chart:', error, movement)
      }
    })
  }
  
  // Get last 6 months for better visualization
  const months = Object.keys(monthlyData).slice(-6)
  
  // If no data, return empty arrays
  if (months.length === 0) {
    return [
      {
        name: 'Stock In',
        data: [0, 0, 0, 0, 0, 0]
      },
      {
        name: 'Stock Out',
        data: [0, 0, 0, 0, 0, 0]
      }
    ]
  }
  
  return [
    {
      name: 'Stock In',
      data: months.map(m => monthlyData[m]?.in || 0)
    },
    {
      name: 'Stock Out',
      data: months.map(m => monthlyData[m]?.out || 0)
    }
  ]
})

const stockMovementOptions = ref({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  colors: ['#22c55e', '#3b82f6'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  },
  yaxis: {
    title: {
      text: 'Quantity'
    }
  }
})

const categoryDistribution = computed(() => {
  const distribution: { [key: string]: { value: number; count: number } } = {}
  
  if (stocks.value && stocks.value.length > 0 && products.value && products.value.length > 0) {
    stocks.value.forEach(stock => {
      try {
        const product = products.value.find(p => p.id === stock.productId)
        const category = product?.category || 'Uncategorized'
        
        if (!distribution[category]) {
          distribution[category] = { value: 0, count: 0 }
        }
        
        distribution[category].value += stock.totalValue || 0
        distribution[category].count += 1
      } catch (error) {
        console.warn('Error processing stock for category distribution:', error, stock)
      }
    })
  }
  
  const total = Object.values(distribution).reduce((sum, d) => sum + d.value, 0)
  
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-red-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600']
  
  return Object.entries(distribution)
    .map(([name, data], index) => ({
      name,
      percentage: total > 0 ? Math.round((data.value / total) * 100) : 0,
      value: formatCurrency(data.value),
      count: data.count,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6)
})

const topProducts = computed(() => {
  if (!stocks.value || stocks.value.length === 0) {
    return []
  }
  
  return stocks.value
    .map(stock => {
      try {
        const product = products.value?.find(p => p.id === stock.productId)
        return {
          name: stock.productName || 'Unknown Product',
          sku: stock.productSku || 'N/A',
          stock: stock.quantity || 0,
          available: stock.availableQuantity || 0,
          reserved: stock.reservedQuantity || 0,
          value: formatCurrency(stock.totalValue || 0),
          rawValue: stock.totalValue || 0,
          status: getStockStatus(stock),
          category: product?.category || 'Uncategorized',
          warehouse: stock.warehouseName || 'Unknown Warehouse',
          averageCost: formatCurrency(stock.averageCost || 0)
        }
      } catch (error) {
        console.warn('Error processing stock for top products:', error, stock)
        return null
      }
    })
    .filter(item => item !== null)
    .sort((a, b) => (b?.rawValue || 0) - (a?.rawValue || 0))
    .slice(0, 8)
})

onMounted(async () => {
  console.log('🚀 [InventoryDashboard] Component mounted, starting data load...')
  await refreshData()
})

const refreshData = async () => {
  loading.value = true
  error.value = null
  console.log('🔄 [InventoryDashboard] Refresh data started...')
  
  try {
    console.log('📊 [InventoryDashboard] Loading data in sequence for better debugging...')
    
    // Load data sequentially for better error tracking
    console.log('🏢 [InventoryDashboard] Loading warehouses...')
    const warehousesResult = await loadWarehouses()
    console.log('✅ [InventoryDashboard] Warehouses loaded:', warehousesResult?.length || 0)
    
    console.log('📦 [InventoryDashboard] Loading products...')
    const productsResult = await loadProducts()
    console.log('✅ [InventoryDashboard] Products loaded:', productsResult?.length || 0)
    console.log('📦 [InventoryDashboard] Products data sample:', productsResult?.slice(0, 2))
    
    console.log('📊 [InventoryDashboard] Loading stocks...')
    const stocksResult = await loadStocks()
    console.log('✅ [InventoryDashboard] Stocks loaded:', stocksResult?.length || 0)
    console.log('📊 [InventoryDashboard] Stocks data sample:', stocksResult?.slice(0, 2))
    
    console.log('🔄 [InventoryDashboard] Loading movements...')
    const movementsResult = await loadMovements()
    console.log('✅ [InventoryDashboard] Movements loaded:', movementsResult?.length || 0)
    
    console.log('🔄 [InventoryDashboard] Loading recent movements...')
    recentMovements.value = await getRecentMovements(8)
    console.log('✅ [InventoryDashboard] Recent movements loaded:', recentMovements.value.length)
    
    // Log computed values for debugging
    console.log('🧮 [InventoryDashboard] Computed values:', {
      totalProducts: stocks.value.length,
      lowStock: lowStockItems.value,
      outOfStock: outOfStockItems.value,
      totalValue: totalStockValue.value,
      categoriesCount: categoryDistribution.value.length,
      topProductsCount: topProducts.value.length
    })
    
    lastUpdated.value = new Date()
    console.log('✅ [InventoryDashboard] All data loaded successfully!')
  } catch (err: any) {
    error.value = err.message || 'Failed to load dashboard data'
    console.error('❌ [InventoryDashboard] Error loading data:', err)
    console.error('❌ [InventoryDashboard] Error details:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    })
  } finally {
    loading.value = false
    console.log('🏁 [InventoryDashboard] Refresh data completed, loading:', loading.value)
  }
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

function getStatusColor(status: string) {
  switch (status) {
    case 'In Stock': return 'bg-green-100 text-green-700'
    case 'Low Stock': return 'bg-yellow-100 text-yellow-700'
    case 'Out of Stock': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getMovementColor(type: string) {
  switch (type) {
    case 'in': return 'bg-green-100 text-green-700'
    case 'out': return 'bg-blue-100 text-blue-700'
    case 'adjustment': return 'bg-yellow-100 text-yellow-700'
    case 'transfer': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatDate = (timestamp: any) => {
  // Handle both Firestore Timestamp and regular Date objects
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  return 'Unknown date'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p class="text-muted-foreground mt-1">Monitor and manage your inventory in real-time</p>
        <div v-if="lastUpdated" class="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock class="h-3 w-3" />
          Last updated: {{ formatDate(lastUpdated) }}
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="refreshData" :disabled="loading">
          <RefreshCw :class="{ 'animate-spin': loading }" class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" @click="router.push('/inventory/adjustments')">
          <Activity class="h-4 w-4 mr-2" />
          Adjustments
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in inventoryStats" :key="stat.title" class="hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm font-medium text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center justify-between mt-2 w-full border-2">
            <div class="flex items-center justify-between border-2 border-amber-600">
              <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                         :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
              <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-xs font-medium']">
                {{ stat.change }}
              </span>
            </div>
            <div class="flex items-center justify-between border-2 border-sky-600">
              <span class="text-xs text-muted-foreground text-right">{{ stat.description }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 space-y-4">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      <div class="text-center">
        <p class="text-lg font-medium text-muted-foreground">Loading inventory data...</p>
        <p class="text-sm text-muted-foreground mt-1">Please wait while we fetch your data</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="stocks.length === 0 && !loading" class="flex flex-col items-center justify-center py-16 space-y-6">
      <div class="bg-gray-100 rounded-full p-6">
        <Package class="h-16 w-16 text-muted-foreground" />
      </div>
      <div class="text-center max-w-md">
        <h3 class="text-xl font-semibold mb-2">No Inventory Data Found</h3>
        <p class="text-muted-foreground mb-4">
          Get started by creating warehouses and adding stock items to your inventory.
        </p>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <p class="text-sm font-medium text-yellow-800 mb-2">Quick Setup Checklist:</p>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>✓ Create at least one warehouse</li>
            <li>✓ Add products to your catalog</li>
            <li>✓ Create stock movements to populate inventory</li>
            <li>✓ Ensure Firestore collections are properly configured</li>
          </ul>
        </div>
      </div>
      <div class="flex gap-3">
        <Button @click="refreshData" variant="outline">
          <RefreshCw class="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button @click="router.push('/inventory/adjustments')">
          <Activity class="h-4 w-4 mr-2" />
          Create Stock Movement
        </Button>
      </div>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Stock Movement Trend</CardTitle>
              <CardDescription>Monthly stock in vs stock out comparison</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="bar"
              height="300"
              :options="stockMovementOptions"
              :series="stockMovementSeries"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <PieChart class="h-5 w-5" />
                Category Distribution
              </CardTitle>
              <CardDescription>Inventory value by category</CardDescription>
            </div>
            <Badge variant="outline">{{ categoryDistribution.length }} categories</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="categoryDistribution.length === 0" class="text-center py-8 text-muted-foreground">
            <PieChart class="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No categories found</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="category in categoryDistribution" :key="category.name" class="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div :class="[category.color, 'w-3 h-3 rounded-full']"></div>
                  <span class="text-sm font-medium">{{ category.name }}</span>
                  <Badge variant="secondary" class="text-xs">{{ category.count }} items</Badge>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">{{ category.value }}</span>
                  <span class="text-sm font-semibold">{{ category.percentage }}%</span>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="[category.color, 'h-2 rounded-full transition-all duration-300']"
                     :style="{ width: `${category.percentage}%` }">
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-blue-900 mb-1">Total Inventory Value</div>
                <div class="text-2xl font-bold text-blue-900">{{ formatCurrency(totalStockValue) }}</div>
              </div>
              <div class="bg-blue-100 p-2 rounded-lg">
                <DollarSign class="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center text-green-600">
                <TrendingUp class="h-4 w-4 mr-1" />
                <span class="text-sm font-medium">{{ warehouses.length }} warehouses</span>
              </div>
              <span class="text-xs text-blue-700">{{ stocks.length }} total items</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <BarChart3 class="h-5 w-5" />
                Top Products by Value
              </CardTitle>
              <CardDescription>Highest value items in inventory</CardDescription>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="outline">Top {{ topProducts.length }}</Badge>
              <Button variant="ghost" size="icon" @click="router.push('/inventory/adjustments')">
                <Search class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="topProducts.length === 0" class="text-center py-12 text-muted-foreground">
            <BarChart3 class="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p class="text-lg font-medium">No products found</p>
            <p class="text-sm mt-1">Add some products to see them here</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(product, index) in topProducts" :key="product.sku"
                 class="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group">
              <div class="flex items-center gap-4">
                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-muted-foreground mt-1">
                    SKU: {{ product.sku }} • {{ product.category }} • {{ product.warehouse }}
                  </div>
                  <div class="text-xs text-muted-foreground mt-1">
                    Avg Cost: {{ product.averageCost }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-right">
                  <div class="text-xs text-muted-foreground">Available</div>
                  <div class="font-semibold text-green-600">{{ product.available }}</div>
                </div>
                <div class="text-right" v-if="product.reserved > 0">
                  <div class="text-xs text-muted-foreground">Reserved</div>
                  <div class="font-semibold text-orange-600">{{ product.reserved }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-muted-foreground">Total Stock</div>
                  <div class="font-semibold">{{ product.stock }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-muted-foreground">Value</div>
                  <div class="font-semibold text-lg">{{ product.value }}</div>
                </div>
                <Badge :class="getStatusColor(product.status)" class="border-0 min-w-[80px] justify-center">
                  {{ product.status }}
                </Badge>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t">
            <Button variant="outline" class="w-full" @click="router.push('/inventory/adjustments')">
              <Package class="h-4 w-4 mr-2" />
              View All Products
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <Activity class="h-5 w-5" />
                Recent Movements
              </CardTitle>
              <CardDescription>Latest inventory transactions</CardDescription>
            </div>
            <Badge variant="outline">{{ recentMovements.length }} recent</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="recentMovements.length === 0" class="text-center py-12 text-muted-foreground">
            <Activity class="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p class="text-lg font-medium">No recent movements</p>
            <p class="text-sm mt-1">Stock movements will appear here</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="movement in recentMovements" :key="movement.id"
                 class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div class="flex flex-col items-center gap-1">
                <Badge :class="getMovementColor(movement.type)" class="border-0 text-xs px-2 py-1">
                  {{ movement.type.toUpperCase() }}
                </Badge>
                <div class="text-xs text-muted-foreground">
                  {{ formatDate(movement.date) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{{ movement.productName }}</div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ movement.movementNumber }}
                </div>
                <div v-if="movement.notes" class="text-xs text-muted-foreground mt-1 italic">
                  "{{ movement.notes }}"
                </div>
              </div>
              <div class="text-right flex flex-col items-end gap-1">
                <div class="font-semibold text-sm"
                     :class="movement.type === 'in' ? 'text-green-600' : movement.type === 'out' ? 'text-red-600' : 'text-blue-600'">
                  {{ movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±' }}{{ movement.quantity }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatCurrency(movement.totalCost) }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t space-y-2">
            <Button variant="outline" class="w-full" @click="router.push('/inventory/adjustments')">
              <Activity class="h-4 w-4 mr-2" />
              View All Movements
            </Button>
            <Button class="w-full" @click="router.push('/inventory/adjustments')">
              <Package class="h-4 w-4 mr-2" />
              Create New Movement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

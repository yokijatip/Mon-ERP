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
  Filter,
  RefreshCw
} from 'lucide-vue-next'
import { useStock } from '@/composables/inventory/useStock'
import { useStockMovement } from '@/composables/inventory/useStockMovement'
import { useProducts } from '@/composables/useProducts'
import type { Stock, StockMovement } from '@/types/firestore'

const { 
  stocks, 
  totalStockValue, 
  lowStockItems, 
  outOfStockItems,
  loadStocks 
} = useStock()

const { 
  movements, 
  loadMovements,
  getRecentMovements 
} = useStockMovement()

const { products, categories, loadProducts } = useProducts()

const loading = ref(false)
const recentMovements = ref<StockMovement[]>([])

const inventoryStats = computed(() => [
  {
    title: 'Total Products',
    value: stocks.value.length.toString(),
    change: '+12.5%',
    isPositive: true,
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
    description: 'Active SKUs'
  },
  {
    title: 'Low Stock Items',
    value: lowStockItems.value.toString(),
    change: '+8.2%',
    isPositive: false,
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Needs reorder'
  },
  {
    title: 'Out of Stock',
    value: outOfStockItems.value.toString(),
    change: '-15.3%',
    isPositive: true,
    icon: Package,
    color: 'bg-red-100 text-red-600',
    description: 'Urgent action'
  },
  {
    title: 'Total Value',
    value: formatCurrency(totalStockValue.value),
    change: '+23.1%',
    isPositive: true,
    icon: ShoppingCart,
    color: 'bg-green-100 text-green-600',
    description: 'Inventory worth'
  }
])

const stockMovementSeries = computed(() => {
  const monthlyData: { [key: string]: { in: number; out: number } } = {}
  
  movements.value.forEach(movement => {
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
  })
  
  const months = Object.keys(monthlyData).slice(-10)
  
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
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
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
  
  stocks.value.forEach(stock => {
    const product = products.value.find(p => p.id === stock.productId)
    const category = product?.category || 'Other'
    
    if (!distribution[category]) {
      distribution[category] = { value: 0, count: 0 }
    }
    
    distribution[category].value += stock.totalValue
    distribution[category].count += 1
  })
  
  const total = Object.values(distribution).reduce((sum, d) => sum + d.value, 0)
  
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-red-600', 'bg-gray-600']
  
  return Object.entries(distribution)
    .map(([name, data], index) => ({
      name,
      percentage: total > 0 ? Math.round((data.value / total) * 100) : 0,
      value: formatCurrency(data.value),
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
})

const topProducts = computed(() => {
  return stocks.value
    .map(stock => {
      const product = products.value.find(p => p.id === stock.productId)
      return {
        name: stock.productName,
        sku: stock.productSku,
        stock: stock.quantity,
        value: formatCurrency(stock.totalValue),
        status: getStockStatus(stock),
        category: product?.category || 'Unknown'
      }
    })
    .sort((a, b) => {
      const aValue = parseFloat(a.value.replace(/[^0-9.-]+/g, ''))
      const bValue = parseFloat(b.value.replace(/[^0-9.-]+/g, ''))
      return bValue - aValue
    })
    .slice(0, 5)
})

onMounted(async () => {
  await refreshData()
})

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStocks(),
      loadMovements(),
      loadProducts()
    ])
    
    recentMovements.value = await getRecentMovements(5)
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
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
  return new Date(timestamp.seconds * 1000).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p class="text-muted-foreground mt-1">Monitor and manage your inventory in real-time</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="refreshData">
          <RefreshCw :class="{ 'animate-spin': loading }" class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Filter class="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in inventoryStats" :key="stat.title">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <div :class="[stat.color, 'p-2 rounded-lg']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div class="text-2xl font-bold mt-1">{{ stat.value }}</div>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center">
              <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                         :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
              <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-sm font-medium']">
                {{ stat.change }}
              </span>
            </div>
            <span class="text-xs text-muted-foreground">{{ stat.description }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Inventory value by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="category in categoryDistribution" :key="category.name">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">{{ category.name }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">{{ category.value }}</span>
                  <span class="text-sm font-semibold">{{ category.percentage }}%</span>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="[category.color, 'h-2 rounded-full']"
                     :style="{ width: `${category.percentage}%` }">
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="text-sm font-medium mb-1">Total Inventory Value</div>
            <div class="text-2xl font-bold">{{ formatCurrency(totalStockValue) }}</div>
            <div class="flex items-center mt-2 text-green-600">
              <TrendingUp class="h-4 w-4 mr-1" />
              <span class="text-sm font-medium">+23.1% from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Top Products by Value</CardTitle>
              <CardDescription>Highest value items in inventory</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Search class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="topProducts.length === 0" class="text-center py-8 text-muted-foreground">
            No products found
          </div>
          <div v-else class="space-y-3">
            <div v-for="product in topProducts" :key="product.sku"
                 class="flex items-center justify-between p-3 rounded-lg border">
              <div class="flex-1">
                <div class="font-medium">{{ product.name }}</div>
                <div class="text-sm text-muted-foreground">SKU: {{ product.sku }} • {{ product.category }}</div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <div class="text-sm text-muted-foreground">Stock</div>
                  <div class="font-semibold">{{ product.stock }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-muted-foreground">Value</div>
                  <div class="font-semibold">{{ product.value }}</div>
                </div>
                <Badge :class="getStatusColor(product.status)" class="border-0">
                  {{ product.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Movements</CardTitle>
          <CardDescription>Latest inventory transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="recentMovements.length === 0" class="text-center py-8 text-muted-foreground">
            No recent movements
          </div>
          <div v-else class="space-y-3">
            <div v-for="movement in recentMovements" :key="movement.id"
                 class="flex items-start gap-3 pb-3 border-b last:border-0">
              <Badge :class="getMovementColor(movement.type)" class="border-0 mt-1">
                {{ movement.type.toUpperCase() }}
              </Badge>
              <div class="flex-1">
                <div class="font-medium text-sm">{{ movement.productName }}</div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ movement.movementNumber }} • {{ formatDate(movement.date) }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-sm"
                     :class="movement.type === 'in' ? 'text-green-600' : movement.type === 'out' ? 'text-red-600' : ''">
                  {{ movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '' }}{{ movement.quantity }}
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" class="w-full mt-4" size="sm" @click="$router.push('/inventory/adjustments')">
            View All Movements
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

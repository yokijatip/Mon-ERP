<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  ShoppingCart,
  MoreVertical,
  Search,
  Download,
  Filter
} from 'lucide-vue-next'

const inventoryStats = ref([
  {
    title: 'Total Products',
    value: '2,845',
    change: '+12.5%',
    isPositive: true,
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
    description: 'Active SKUs'
  },
  {
    title: 'Low Stock Items',
    value: '127',
    change: '+8.2%',
    isPositive: false,
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Needs reorder'
  },
  {
    title: 'Out of Stock',
    value: '43',
    change: '-15.3%',
    isPositive: true,
    icon: Package,
    color: 'bg-red-100 text-red-600',
    description: 'Urgent action'
  },
  {
    title: 'Total Value',
    value: '$1.2M',
    change: '+23.1%',
    isPositive: true,
    icon: ShoppingCart,
    color: 'bg-green-100 text-green-600',
    description: 'Inventory worth'
  }
])

const topProducts = ref([
  {
    name: 'Wireless Headphones Pro',
    sku: 'WHP-001',
    stock: 245,
    value: '$24,500',
    status: 'In Stock',
    category: 'Electronics'
  },
  {
    name: 'Smart Watch Series 5',
    sku: 'SWS-005',
    stock: 89,
    value: '$35,600',
    status: 'Low Stock',
    category: 'Electronics'
  },
  {
    name: 'Laptop Stand Aluminum',
    sku: 'LSA-102',
    stock: 0,
    value: '$0',
    status: 'Out of Stock',
    category: 'Accessories'
  },
  {
    name: 'USB-C Hub 7-in-1',
    sku: 'UCH-701',
    stock: 567,
    value: '$17,010',
    status: 'In Stock',
    category: 'Accessories'
  },
  {
    name: 'Mechanical Keyboard RGB',
    sku: 'MKR-203',
    stock: 34,
    value: '$5,100',
    status: 'Low Stock',
    category: 'Peripherals'
  }
])

const recentMovements = ref([
  {
    type: 'IN',
    product: 'Wireless Mouse',
    quantity: 150,
    date: '2025-10-08',
    reference: 'PO-2845'
  },
  {
    type: 'OUT',
    product: 'HDMI Cable 2m',
    quantity: 75,
    date: '2025-10-08',
    reference: 'SO-9234'
  },
  {
    type: 'IN',
    product: 'Phone Case Clear',
    quantity: 200,
    date: '2025-10-07',
    reference: 'PO-2843'
  },
  {
    type: 'OUT',
    product: 'Laptop Charger 65W',
    quantity: 45,
    date: '2025-10-07',
    reference: 'SO-9232'
  },
  {
    type: 'ADJ',
    product: 'Screen Protector',
    quantity: -12,
    date: '2025-10-06',
    reference: 'ADJ-456'
  }
])

const categoryDistribution = ref([
  { name: 'Electronics', percentage: 42, value: '$504K', color: 'bg-blue-600' },
  { name: 'Accessories', percentage: 28, value: '$336K', color: 'bg-green-600' },
  { name: 'Peripherals', percentage: 18, value: '$216K', color: 'bg-yellow-600' },
  { name: 'Others', percentage: 12, value: '$144K', color: 'bg-gray-600' }
])

const monthlyTrend = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  stockIn: [120, 150, 180, 140, 200, 170, 190, 210, 180, 220],
  stockOut: [100, 130, 150, 120, 170, 150, 160, 180, 160, 190]
})

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
    case 'IN': return 'bg-green-100 text-green-700'
    case 'OUT': return 'bg-blue-100 text-blue-700'
    case 'ADJ': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p class="text-muted-foreground mt-1">Monitor and manage your inventory in real-time</p>
      </div>
      <div class="flex gap-2">
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

    <div class="grid gap-6 lg:grid-cols-3">
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
          <div class="flex items-center gap-4 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-600"></div>
              <span class="text-sm">Stock In</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-600"></div>
              <span class="text-sm">Stock Out</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-end justify-around gap-2">
            <div v-for="(label, index) in monthlyTrend.labels" :key="label"
              class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full flex justify-center gap-1">
                <div class="w-4 bg-green-600 rounded-t"
                  :style="{ height: `${(monthlyTrend.stockIn[index] || 0) * 1.2}px` }">
                </div>
                <div class="w-4 bg-blue-600 rounded-t"
                  :style="{ height: `${(monthlyTrend.stockOut[index] || 0) * 1.2}px` }">
                </div>
              </div>
              <span class="text-xs text-muted-foreground mt-2">{{ label }}</span>
            </div>
          </div>
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
            <div class="text-2xl font-bold">$1,200,000</div>
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
          <div class="space-y-3">
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
          <div class="space-y-3">
            <div v-for="movement in recentMovements" :key="movement.reference"
              class="flex items-start gap-3 pb-3 border-b last:border-0">
              <Badge :class="getMovementColor(movement.type)" class="border-0 mt-1">
                {{ movement.type }}
              </Badge>
              <div class="flex-1">
                <div class="font-medium text-sm">{{ movement.product }}</div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ movement.reference }} • {{ movement.date }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-sm"
                  :class="movement.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" class="w-full mt-4" size="sm">
            View All Movements
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

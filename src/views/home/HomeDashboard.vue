<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'

const authStore = useAuthStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})

const userName = computed(() => {
  return authStore.userProfile?.displayName || authStore.user?.displayName || 'User'
})

const kpiData = ref([
  {
    title: 'Total Revenue',
    value: 'Rp 45,231,890',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    description: 'from last month'
  },
  {
    title: 'Total Orders',
    value: '2,345',
    change: '+15.3%',
    trend: 'up',
    icon: ShoppingCart,
    description: 'from last month'
  },
  {
    title: 'Total Products',
    value: '156',
    change: '+5.2%',
    trend: 'up',
    icon: Package,
    description: 'from last month'
  },
  {
    title: 'Total Customers',
    value: '892',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
    description: 'from last month'
  }
])

const salesChartOptions = ref({
  chart: {
    type: 'area',
    height: 350,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#3b82f6', '#10b981'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
    }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    labels: {
      formatter: (value: number) => {
        return 'Rp ' + (value / 1000000).toFixed(1) + 'M'
      }
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => {
        return 'Rp ' + value.toLocaleString('id-ID')
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  }
})

const salesChartSeries = ref([
  {
    name: 'Revenue',
    data: [12500000, 15200000, 13800000, 18900000, 22100000, 25600000, 23400000, 28900000, 31200000, 29800000, 34500000, 38200000]
  },
  {
    name: 'Profit',
    data: [3200000, 4100000, 3800000, 5200000, 6800000, 8200000, 7500000, 9800000, 11200000, 10500000, 12800000, 14500000]
  }
])

const revenueChartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    labels: {
      formatter: (value: number) => {
        return 'Rp ' + (value / 1000000).toFixed(1) + 'M'
      }
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: (value: number) => {
        return 'Rp ' + value.toLocaleString('id-ID')
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  }
})

const revenueChartSeries = ref([
  {
    name: 'Sales',
    data: [8500000, 9200000, 8800000, 11900000, 13100000, 15600000, 13400000, 16900000, 18200000, 17800000, 20500000, 23200000]
  },
  {
    name: 'Purchases',
    data: [5200000, 6100000, 5800000, 7200000, 8800000, 10200000, 9500000, 11800000, 13200000, 12500000, 14800000, 16500000]
  },
  {
    name: 'Expenses',
    data: [3800000, 4200000, 3900000, 4800000, 5400000, 6200000, 5800000, 7100000, 7900000, 7600000, 8700000, 9800000]
  }
])

const productChartOptions = ref({
  chart: {
    type: 'donut',
    height: 350
  },
  labels: ['Electronics', 'Fashion', 'Food & Beverage', 'Health & Beauty', 'Home & Living', 'Others'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'],
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => {
      return val.toFixed(1) + '%'
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Sales',
            formatter: () => {
              return 'Rp 45.2M'
            }
          }
        }
      }
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => {
        return 'Rp ' + (value / 1000000).toFixed(2) + 'M'
      }
    }
  }
})

const productChartSeries = ref([15200000, 12800000, 8900000, 4500000, 2800000, 1000000])

const recentOrders = ref([
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: 1250000,
    status: 'completed',
    date: '2025-10-03'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: 890000,
    status: 'processing',
    date: '2025-10-03'
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    amount: 2100000,
    status: 'completed',
    date: '2025-10-02'
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    amount: 560000,
    status: 'pending',
    date: '2025-10-02'
  },
  {
    id: 'ORD-005',
    customer: 'Charlie Wilson',
    amount: 1780000,
    status: 'completed',
    date: '2025-10-01'
  }
])

const topProducts = ref([
  { name: 'Product A', sold: 245, revenue: 12250000 },
  { name: 'Product B', sold: 189, revenue: 9450000 },
  { name: 'Product C', sold: 156, revenue: 7800000 },
  { name: 'Product D', sold: 134, revenue: 6700000 },
  { name: 'Product E', sold: 98, revenue: 4900000 }
])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (status: string): 'default' | 'outline' | 'destructive' | 'secondary' | null | undefined => {
  const colors: Record<string, 'default' | 'outline' | 'destructive' | 'secondary'> = {
    completed: 'default',
    processing: 'secondary',
    pending: 'outline'
  }
  return colors[status] || 'outline'
}

onMounted(() => {
  console.log('Dashboard mounted')
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ greeting }}, {{ userName }}!</h1>
      <p class="text-muted-foreground">Here's what's happening with your business today.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="kpi in kpiData" :key="kpi.title">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ kpi.title }}
          </CardTitle>
          <component :is="kpi.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ kpi.value }}</div>
          <div class="flex items-center gap-1 text-xs mt-1">
            <component
              :is="kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight"
              class="h-4 w-4"
              :class="kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'"
            />
            <span :class="kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'">
              {{ kpi.change }}
            </span>
            <span class="text-muted-foreground">{{ kpi.description }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Revenue and profit trends for the year</CardDescription>
        </CardHeader>
        <CardContent>
          <VueApexCharts
            type="area"
            height="350"
            :options="salesChartOptions"
            :series="salesChartSeries"
          />
        </CardContent>
      </Card>

      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Sales distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <VueApexCharts
            type="donut"
            height="350"
            :options="productChartOptions"
            :series="productChartSeries"
          />
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Monthly comparison of sales, purchases, and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <VueApexCharts
          type="bar"
          height="350"
          :options="revenueChartOptions"
          :series="revenueChartSeries"
        />
      </CardContent>
    </Card>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium">{{ order.customer }}</p>
                <div class="flex items-center gap-2">
                  <code class="text-xs bg-muted px-2 py-1 rounded">{{ order.id }}</code>
                  <Badge :variant="getStatusColor(order.status)" class="text-xs">
                    {{ order.status }}
                  </Badge>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold">{{ formatCurrency(order.amount) }}</p>
                <p class="text-xs text-muted-foreground">{{ order.date }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best selling products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(product, index) in topProducts"
              :key="product.name"
              class="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="text-sm font-medium">{{ product.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ product.sold }} units sold</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold">{{ formatCurrency(product.revenue) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

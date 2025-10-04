<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import Header from "@/components/kakangCustom/Header.vue"
import { useAuthStore } from "@/stores/auth.ts"
import type { DateRange } from "reka-ui"
import type { Ref } from "vue"
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date"
import { CalendarIcon } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
import {toast} from "vue-sonner";

// Date Picker Setup
const df = new DateFormatter("en-US", {
  dateStyle: "medium",
})

const value = ref({
  start: new CalendarDate(2024, 10, 1),
  end: new CalendarDate(2024, 10, 3),
}) as Ref<DateRange>

// Auth Store
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

// Format Currency Helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Download Report Function
const handleDownloadReport = () => {
  const start = value.value?.start
  const end = value.value?.end ?? start

  if (!start) {
    toast.error('Please pick a start date first.')
    return
  }

  // Opsional: tampilkan notifikasi loading
  const toastId = toast.loading('Preparing your report...')

  // Simulasi proses download (ganti dengan API call asli nanti)
  setTimeout(() => {
    // Ganti loading jadi sukses
    toast.success('Report downloaded successfully!', {
      id: toastId,
      duration: 3000
    })

    console.log('Downloading report for:', {
      start: start.toString(),
      end: end?.toString(),
    })
    // TODO: implement actual download logic (e.g., fetch blob & trigger download)
  }, 1500)
}

// KPI Data
const kpiData = ref([
  {
    title: 'Total Revenue',
    value: 245890000,
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Total Orders',
    value: 1234,
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    isCount: true
  },
  {
    title: 'Products in Stock',
    value: 8456,
    change: '-3.1%',
    trend: 'down',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    isCount: true
  },
  {
    title: 'Active Customers',
    value: 3289,
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    isCount: true
  }
])

// Revenue Chart
const revenueChartOptions = ref({
  chart: {
    id: 'revenue-chart',
    type: 'area',
    height: 350,
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
  legend: { position: 'top', horizontalAlign: 'right' },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)}M`
        if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)}jt`
        return `Rp ${(val / 1000).toFixed(0)}rb`
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => formatCurrency(val)
    }
  }
})

const revenueChartSeries = ref([
  {
    name: 'Revenue',
    data: [45000000, 52000000, 48000000, 61000000, 58000000, 65000000, 72000000, 68000000, 75000000, 82000000, 79000000, 88000000]
  },
  {
    name: 'Profit',
    data: [15000000, 18000000, 16000000, 22000000, 20000000, 24000000, 28000000, 25000000, 30000000, 35000000, 32000000, 38000000]
  }
])

// Sales by Category Chart
const salesCategoryOptions = ref({
  chart: {
    type: 'donut',
    height: 320,
    fontFamily: 'inherit'
  },
  labels: ['Electronics', 'Fashion', 'Food & Beverage', 'Home & Living', 'Others'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Sales',
            formatter: () => 'Rp 245,8jt'
          }
        }
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => formatCurrency(val)
    }
  }
})

const salesCategorySeries = ref([85000000, 65000000, 45000000, 35000000, 15890000])

// Top Products
const topProducts = ref([
  { name: 'Samsung Galaxy S23', category: 'Electronics', sold: 245, revenue: 122500000, trend: 'up' },
  { name: 'Nike Air Max', category: 'Fashion', sold: 189, revenue: 45360000, trend: 'up' },
  { name: 'Coffee Beans Premium', category: 'Food & Beverage', sold: 567, revenue: 28350000, trend: 'down' },
  { name: 'IKEA Desk Lamp', category: 'Home & Living', sold: 123, revenue: 12300000, trend: 'up' },
  { name: 'MacBook Pro M3', category: 'Electronics', sold: 45, revenue: 135000000, trend: 'up' }
])

// Recent Orders
const recentOrders = ref([
  { id: 'ORD-2024-001', customer: 'PT Maju Jaya', amount: 15500000, status: 'completed', date: '2024-10-03' },
  { id: 'ORD-2024-002', customer: 'CV Sukses Mandiri', amount: 8750000, status: 'processing', date: '2024-10-03' },
  { id: 'ORD-2024-003', customer: 'Toko Berkah', amount: 3250000, status: 'pending', date: '2024-10-02' },
  { id: 'ORD-2024-004', customer: 'UD Sejahtera', amount: 12890000, status: 'completed', date: '2024-10-02' },
  { id: 'ORD-2024-005', customer: 'PT Global Tech', amount: 25000000, status: 'processing', date: '2024-10-01' }
])

// Inventory Alerts
const inventoryAlerts = ref([
  { product: 'Samsung Galaxy S23', stock: 5, reorder: 20, priority: 'high' },
  { product: 'Coffee Beans Premium', stock: 12, reorder: 50, priority: 'medium' },
  { product: 'Nike Air Max Size 42', stock: 8, reorder: 15, priority: 'medium' },
  { product: 'IKEA Desk Lamp White', stock: 3, reorder: 10, priority: 'high' }
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    high: 'text-red-600',
    medium: 'text-orange-600',
    low: 'text-yellow-600'
  }
  return colors[priority] || 'text-gray-600'
}

// Monthly Comparison Chart
const monthlyComparisonOptions = ref({
  chart: {
    type: 'bar',
    height: 320,
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: ['Sales', 'Purchases', 'Expenses', 'Cash Flow']
  },
  colors: ['#3b82f6', '#10b981'],
  fill: { opacity: 1 },
  legend: { position: 'top', horizontalAlign: 'right' },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}M`
        if (val >= 1000000) return `${(val / 1000000).toFixed(0)}jt`
        return `${(val / 1000).toFixed(0)}rb`
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => formatCurrency(val)
    }
  }
})

const monthlyComparisonSeries = ref([
  {
    name: 'Current Month',
    data: [88000000, 45000000, 32000000, 56000000]
  },
  {
    name: 'Previous Month',
    data: [79000000, 42000000, 35000000, 44000000]
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Date Picker -->
    <div class="flex items-center justify-between">
      <Header
          :title="`Welcome back`"
          :subtitle="`${greeting}, ${userName}!`"
          align="left"/>

      <!-- Date Picker & Button -->
      <div class="flex items-center gap-2">
        <Popover>
          <PopoverTrigger as-child>
            <Button
                variant="outline"
                :class="cn(
                  'w-[230px] justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                )"
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              <template v-if="value.start">
                <template v-if="value.end">
                  {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
                </template>
                <template v-else>
                  {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                </template>
              </template>
              <template v-else>
                Pick a date
              </template>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <RangeCalendar
                v-model="value"
                initial-focus
                :number-of-months="2"
                @update:start-value="(startDate) => value.start = startDate"
            />
          </PopoverContent>
        </Popover>

        <!-- Download Report -->
        <Button @click="handleDownloadReport">
          <Download class="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="kpi in kpiData" :key="kpi.title">
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <CardTitle class="text-sm font-medium">{{ kpi.title }}</CardTitle>
          <div :class="[kpi.bgColor, 'p-2 rounded-lg']">
            <component :is="kpi.icon" :class="[kpi.color, 'w-4 h-4']" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">
            {{ kpi.isCount ? kpi.value.toLocaleString('id-ID') : formatCurrency(kpi.value) }}
          </div>
          <div class="flex items-center text-sm">
            <component
                :is="kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight"
                :class="[kpi.trend === 'up' ? 'text-green-600' : 'text-red-600', 'w-4 h-4 mr-1']"
            />
            <span :class="kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'">
              {{ kpi.change }}
            </span>
            <span class="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Charts Row -->
    <div class="grid gap-4 md:grid-cols-7">
      <!-- Revenue Chart -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Revenue & Profit Overview</CardTitle>
          <CardDescription>Monthly revenue and profit trends for 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="area"
              height="350"
              :options="revenueChartOptions"
              :series="revenueChartSeries"
          />
        </CardContent>
      </Card>

      <!-- Sales by Category -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Distribution of sales across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="donut"
              height="320"
              :options="salesCategoryOptions"
              :series="salesCategorySeries"
          />
        </CardContent>
      </Card>
    </div>

    <!-- Secondary Row -->
    <div class="grid gap-4 md:grid-cols-7">
      <!-- Monthly Comparison -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
          <CardDescription>Current vs previous month performance</CardDescription>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="bar"
              height="320"
              :options="monthlyComparisonOptions"
              :series="monthlyComparisonSeries"
          />
        </CardContent>
      </Card>

      <!-- Top Products -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
                v-for="(product, index) in topProducts"
                :key="product.name"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium">{{ product.name }}</p>
                  <p class="text-sm text-muted-foreground">{{ product.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ formatCurrency(product.revenue) }}</p>
                <div class="flex items-center justify-end gap-1 text-sm">
                  <component
                      :is="product.trend === 'up' ? TrendingUp : TrendingDown"
                      :class="[product.trend === 'up' ? 'text-green-600' : 'text-red-600', 'w-3 h-3']"
                  />
                  <span class="text-muted-foreground">{{ product.sold }} sold</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Bottom Row -->
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Recent Orders -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
                v-for="order in recentOrders"
                :key="order.id"
                class="flex items-center justify-between p-3 rounded-lg border"
            >
              <div class="space-y-1">
                <p class="font-medium">{{ order.id }}</p>
                <p class="text-sm text-muted-foreground">{{ order.customer }}</p>
                <p class="text-xs text-muted-foreground">{{ order.date }}</p>
              </div>
              <div class="text-right space-y-2">
                <p class="font-semibold">{{ formatCurrency(order.amount) }}</p>
                <Badge :class="getStatusColor(order.status)" class="capitalize">
                  {{ order.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Inventory Alerts -->
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
                v-for="alert in inventoryAlerts"
                :key="alert.product"
                class="flex items-start justify-between p-3 rounded-lg border border-orange-200 bg-orange-50/50"
            >
              <div class="flex items-start gap-2">
                <AlertCircle :class="[getPriorityColor(alert.priority), 'w-5 h-5 mt-0.5']" />
                <div>
                  <p class="font-medium">{{ alert.product }}</p>
                  <p class="text-sm text-muted-foreground mt-1">
                    Current stock: <span class="font-semibold">{{ alert.stock }}</span> units
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Reorder level: {{ alert.reorder }} units
                  </p>
                </div>
              </div>
              <Badge
                  :class="alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'"
                  class="capitalize"
              >
                {{ alert.priority }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
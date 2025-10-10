<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import VueApexCharts from 'vue3-apexcharts'
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Users,
  Target,
  Calendar,
  Download,
  MoreVertical,
  Award,
  ShoppingCart,
  Package,
  Clock,
  MapPin,
  Star
} from 'lucide-vue-next'

const salesStats = ref([
  {
    title: 'Total Revenue',
    value: '$2,456,890',
    change: '+24.5%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    description: 'vs last month'
  },
  {
    title: 'Total Orders',
    value: '3,842',
    change: '+18.2%',
    isPositive: true,
    icon: ShoppingBag,
    color: 'bg-blue-100 text-blue-600',
    description: 'vs last month'
  },
  {
    title: 'New Customers',
    value: '486',
    change: '+12.8%',
    isPositive: true,
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
    description: 'vs last month'
  },
  {
    title: 'Avg. Order Value',
    value: '$639',
    change: '+5.3%',
    isPositive: true,
    icon: Target,
    color: 'bg-orange-100 text-orange-600',
    description: 'vs last month'
  }
])

// Sales Trend
const salesTrendSeries = ref([
  {
    name: 'Revenue',
    data: [1850, 1920, 2050, 2180, 2100, 2250, 2380, 2280, 2420, 2350, 2480, 2560]
  },
  {
    name: 'Target',
    data: [2000, 2000, 2100, 2100, 2200, 2200, 2300, 2300, 2400, 2400, 2500, 2500]
  }
])

const salesTrendOptions = ref({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false }
  },
  stroke: {
    curve: 'smooth',
    width: [3, 2],
    dashArray: [0, 5]
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    title: { text: 'Amount ($K)' }
  },
  colors: ['#22c55e', '#94a3b8'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  },
  markers: {
    size: 0,
    hover: { size: 5 }
  }
})

// Sales by Channel
const channelSeries = ref([42, 28, 18, 12])
const channelOptions = ref({
  chart: {
    type: 'donut',
    height: 280
  },
  labels: ['E-commerce', 'Retail Stores', 'Wholesale', 'B2B Direct'],
  colors: ['#3b82f6', '#22c55e', '#eab308', '#a855f7'],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center'
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: { show: true, fontSize: '14px' },
          value: { show: true, fontSize: '20px', fontWeight: 'bold' },
          total: {
            show: true,
            label: 'Total Sales',
            fontSize: '12px',
            formatter: () => '$2.46M'
          }
        }
      }
    }
  }
})

// Top Products
const topProducts = ref([
  {
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    unitsSold: 1248,
    revenue: '$374,400',
    growth: '+28.5%',
    stock: 342
  },
  {
    name: 'Smart Watch Pro Series',
    category: 'Wearables',
    unitsSold: 1056,
    revenue: '$316,800',
    growth: '+22.3%',
    stock: 189
  },
  {
    name: 'Laptop Ultra Slim 15"',
    category: 'Computers',
    unitsSold: 834,
    revenue: '$750,600',
    growth: '+18.7%',
    stock: 95
  },
  {
    name: 'Bluetooth Speaker Mini',
    category: 'Audio',
    unitsSold: 2156,
    revenue: '$129,360',
    growth: '+35.2%',
    stock: 567
  },
  {
    name: 'USB-C Hub Multi-Port',
    category: 'Accessories',
    unitsSold: 1842,
    revenue: '$92,100',
    growth: '+15.8%',
    stock: 423
  }
])

// Top Sales Representatives
const topSalesReps = ref([
  {
    name: 'Alexandra Pierce',
    avatar: '',
    totalSales: '$456,800',
    orders: 234,
    conversionRate: 68,
    performance: 96
  },
  {
    name: 'Marcus Chen',
    avatar: '',
    totalSales: '$398,200',
    orders: 198,
    conversionRate: 64,
    performance: 92
  },
  {
    name: 'Sarah Johnson',
    avatar: '',
    totalSales: '$345,600',
    orders: 176,
    conversionRate: 61,
    performance: 88
  },
  {
    name: 'David Rodriguez',
    avatar: '',
    totalSales: '$312,400',
    orders: 165,
    conversionRate: 58,
    performance: 85
  },
  {
    name: 'Emily Watson',
    avatar: '',
    totalSales: '$289,500',
    orders: 152,
    conversionRate: 55,
    performance: 82
  }
])

// Recent Orders
const recentOrders = ref([
  {
    orderNumber: 'ORD-2025-8456',
    customer: 'Tech Solutions Inc',
    items: 12,
    total: '$8,450',
    date: '2025-10-11',
    status: 'Completed',
    paymentStatus: 'Paid'
  },
  {
    orderNumber: 'ORD-2025-8455',
    customer: 'Global Retail Corp',
    items: 8,
    total: '$5,280',
    date: '2025-10-11',
    status: 'Processing',
    paymentStatus: 'Paid'
  },
  {
    orderNumber: 'ORD-2025-8454',
    customer: 'Smart Devices Ltd',
    items: 24,
    total: '$12,640',
    date: '2025-10-10',
    status: 'Shipped',
    paymentStatus: 'Paid'
  },
  {
    orderNumber: 'ORD-2025-8453',
    customer: 'Digital Hub Store',
    items: 6,
    total: '$3,890',
    date: '2025-10-10',
    status: 'Pending',
    paymentStatus: 'Pending'
  },
  {
    orderNumber: 'ORD-2025-8452',
    customer: 'Premium Electronics',
    items: 15,
    total: '$9,750',
    date: '2025-10-09',
    status: 'Completed',
    paymentStatus: 'Paid'
  }
])

// Sales by Region
const regionData = ref([
  { region: 'North America', sales: '$892,400', percentage: 36.3, growth: '+18.5%', orders: 1245 },
  { region: 'Europe', sales: '$687,200', percentage: 28.0, growth: '+22.3%', orders: 956 },
  { region: 'Asia Pacific', sales: '$542,800', percentage: 22.1, growth: '+28.7%', orders: 823 },
  { region: 'South America', sales: '$234,500', percentage: 9.5, growth: '+15.2%', orders: 534 },
  { region: 'Middle East & Africa', sales: '$100,000', percentage: 4.1, growth: '+12.8%', orders: 284 }
])

// Customer Acquisition
const acquisitionData = ref({
  newCustomers: 486,
  returningCustomers: 1842,
  churnRate: 2.8,
  retentionRate: 87.5
})

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700'
    case 'Processing':
    case 'Shipped': return 'bg-blue-100 text-blue-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Cancelled': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Refunded': return 'bg-blue-100 text-blue-700'
    case 'Failed': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function getStockStatus(stock: number) {
  if (stock < 100) return { color: 'text-red-600', label: 'Low Stock' }
  if (stock < 300) return { color: 'text-yellow-600', label: 'Medium Stock' }
  return { color: 'text-green-600', label: 'In Stock' }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
        <p class="text-muted-foreground mt-1">Track sales performance and revenue metrics</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <Calendar class="h-4 w-4 mr-2" />
          This Month
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- Sales Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in salesStats" :key="stat.title" class="relative hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center justify-between mt-2 w-full">
            <div class="flex items-center">
              <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                         :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
              <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-xs font-medium']">
                {{ stat.change }}
              </span>
            </div>
            <span class="text-xs text-muted-foreground">{{ stat.description }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Sales Trend -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Sales Trend & Target</CardTitle>
              <CardDescription>Monthly revenue vs target comparison</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="line"
              height="300"
              :options="salesTrendOptions"
              :series="salesTrendSeries"
          />
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-xs text-muted-foreground mb-1">Achievement</div>
              <div class="text-lg font-bold text-green-600">102.4%</div>
            </div>
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-xs text-muted-foreground mb-1">YTD Revenue</div>
              <div class="text-lg font-bold text-blue-600">$27.89M</div>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <div class="text-xs text-muted-foreground mb-1">Forecast</div>
              <div class="text-lg font-bold text-purple-600">$30.2M</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Sales by Channel -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Sales by Channel</CardTitle>
            <Button variant="ghost" size="icon">
              <ShoppingCart class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="donut"
              height="280"
              :options="channelOptions"
              :series="channelSeries"
          />
        </CardContent>
      </Card>

      <!-- Top Products -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers this month</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="(product, index) in topProducts" :key="product.name"
                 class="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ product.name }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ product.category }} • {{ product.unitsSold }} units sold
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span :class="[getStockStatus(product.stock).color, 'text-xs font-medium']">
                      {{ getStockStatus(product.stock).label }}
                    </span>
                    <span class="text-xs text-muted-foreground">• {{ product.stock }} units</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold">{{ product.revenue }}</div>
                <div class="text-xs text-green-600 font-medium mt-1">{{ product.growth }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Customer Acquisition -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Customer Metrics</CardTitle>
            <Button variant="ghost" size="icon">
              <Users class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <div class="text-sm text-muted-foreground">New Customers</div>
                  <div class="text-2xl font-bold">{{ acquisitionData.newCustomers }}</div>
                </div>
                <div class="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Users class="h-6 w-6" />
                </div>
              </div>
              <div class="text-xs text-green-600 font-medium">+12.8% vs last month</div>
            </div>

            <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <div>
                  <div class="text-sm text-muted-foreground">Returning Customers</div>
                  <div class="text-2xl font-bold">{{ acquisitionData.returningCustomers }}</div>
                </div>
                <div class="bg-green-100 text-green-600 p-3 rounded-full">
                  <Target class="h-6 w-6" />
                </div>
              </div>
              <div class="text-xs text-green-600 font-medium">+8.5% vs last month</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 border rounded-lg">
                <div class="text-xs text-muted-foreground mb-1">Retention Rate</div>
                <div class="text-lg font-bold text-green-600">{{ acquisitionData.retentionRate }}%</div>
                <Progress :model-value="acquisitionData.retentionRate" class="h-1.5 mt-2" />
              </div>
              <div class="p-3 border rounded-lg">
                <div class="text-xs text-muted-foreground mb-1">Churn Rate</div>
                <div class="text-lg font-bold text-red-600">{{ acquisitionData.churnRate }}%</div>
                <Progress :model-value="acquisitionData.churnRate" class="h-1.5 mt-2" />
              </div>
            </div>

            <div class="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div class="text-sm font-medium text-orange-700 mb-1">Customer Lifetime Value</div>
              <div class="text-xl font-bold text-orange-700">$3,842</div>
              <div class="text-xs text-orange-600 mt-1">Average per customer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Sales by Region -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>Geographic revenue distribution</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MapPin class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="region in regionData" :key="region.region"
                 class="space-y-2">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 flex-1">
                  <MapPin class="h-4 w-4 text-muted-foreground" />
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ region.region }}</div>
                    <div class="text-xs text-muted-foreground">{{ region.orders }} orders</div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-xs text-green-600 font-medium">{{ region.growth }}</div>
                  <div class="text-right">
                    <div class="text-sm font-bold">{{ region.sales }}</div>
                    <div class="text-xs text-muted-foreground">{{ region.percentage }}%</div>
                  </div>
                </div>
              </div>
              <Progress :model-value="region.percentage" class="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Top Sales Reps -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Top Sales Reps</CardTitle>
            <Button variant="ghost" size="icon">
              <Award class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="(rep, index) in topSalesReps" :key="rep.name"
                 class="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
              <div class="relative">
                <Avatar>
                  <AvatarImage :src="rep.avatar" />
                  <AvatarFallback>{{ getInitials(rep.name) }}</AvatarFallback>
                </Avatar>
                <div v-if="index < 3"
                     class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span class="text-xs font-bold text-white">{{ index + 1 }}</span>
                </div>
              </div>
              <div class="flex-1">
                <div class="font-medium text-sm">{{ rep.name }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ rep.orders }} orders • {{ rep.conversionRate }}% conversion
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <Progress :model-value="rep.performance" class="h-1.5 flex-1" />
                  <span class="text-xs font-medium text-green-600">{{ rep.performance }}%</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold">{{ rep.totalSales }}</div>
                <div class="flex items-center gap-0.5 text-yellow-500 text-xs mt-1">
                  <Star class="h-3 w-3 fill-current" />
                  <span class="font-medium">{{ (rep.performance / 20).toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Orders -->
      <Card class="lg:col-span-3">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders and transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="order in recentOrders" :key="order.orderNumber"
                 class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-3 flex-1">
                <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Package class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ order.orderNumber }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ order.customer }} • {{ order.items }} items
                  </div>
                  <div class="text-xs text-muted-foreground mt-1">
                    {{ order.date }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <div class="text-sm font-bold">{{ order.total }}</div>
                  <Badge :class="getPaymentStatusColor(order.paymentStatus)" class="border-0 text-xs mt-1">
                    {{ order.paymentStatus }}
                  </Badge>
                </div>
                <Badge :class="getStatusColor(order.status)" class="border-0">
                  {{ order.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
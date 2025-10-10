<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import VueApexCharts from 'vue3-apexcharts'
import {
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download,
  MoreVertical,
  Truck,
  FileText,
  Users
} from 'lucide-vue-next'

const purchasingStats = ref([
  {
    title: 'Total PO Value',
    value: '$1,245,800',
    change: '+15.3%',
    isPositive: true,
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
    description: 'vs last month'
  },
  {
    title: 'Active Orders',
    value: '87',
    change: '+8',
    isPositive: true,
    icon: Package,
    color: 'bg-green-100 text-green-600',
    description: 'in progress'
  },
  {
    title: 'Pending Approvals',
    value: '23',
    change: '+5',
    isPositive: false,
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'awaiting review'
  },
  {
    title: 'On-Time Delivery',
    value: '94.2%',
    change: '+3.5%',
    isPositive: true,
    icon: Truck,
    color: 'bg-purple-100 text-purple-600',
    description: 'vs last month'
  }
])

// Monthly Spending Trend
const spendingSeries = ref([
  {
    name: 'Raw Materials',
    data: [420, 450, 480, 510, 490, 520, 560, 540, 580, 610]
  },
  {
    name: 'Equipment',
    data: [180, 190, 170, 200, 210, 190, 220, 230, 210, 240]
  },
  {
    name: 'Services',
    data: [120, 130, 125, 140, 135, 150, 145, 160, 155, 170]
  },
  {
    name: 'Others',
    data: [80, 75, 85, 80, 90, 85, 95, 90, 100, 95]
  }
])

const spendingOptions = ref({
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false },
    stacked: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.4,
      opacityTo: 0.1
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  },
  yaxis: {
    title: { text: 'Amount ($K)' }
  },
  colors: ['#3b82f6', '#22c55e', '#eab308', '#a855f7'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Supplier Performance
const supplierSeries = ref([85, 78, 72, 68, 65])
const supplierOptions = ref({
  chart: {
    type: 'bar',
    height: 280,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '70%',
      distributed: true
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}%`
  },
  xaxis: {
    categories: ['Global Tech Supplies', 'Premium Materials Co', 'Swift Logistics Ltd', 'Quality Parts Inc', 'Mega Wholesale']
  },
  colors: ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'],
  legend: { show: false },
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Purchase Orders Status
const poStatusData = ref([
  { status: 'Completed', count: 156, percentage: 52, color: 'bg-green-600' },
  { status: 'In Progress', count: 87, percentage: 29, color: 'bg-blue-600' },
  { status: 'Pending', count: 34, percentage: 11, color: 'bg-yellow-600' },
  { status: 'Delayed', count: 18, percentage: 6, color: 'bg-red-600' },
  { status: 'Cancelled', count: 5, percentage: 2, color: 'bg-gray-600' }
])

// Recent Purchase Orders
const recentPurchaseOrders = ref([
  {
    poNumber: 'PO-2025-1842',
    supplier: 'Global Tech Supplies',
    items: 45,
    totalValue: '$45,200',
    date: '2025-10-10',
    status: 'In Progress',
    deliveryDate: '2025-10-20'
  },
  {
    poNumber: 'PO-2025-1841',
    supplier: 'Premium Materials Co',
    items: 32,
    totalValue: '$38,900',
    date: '2025-10-09',
    status: 'Pending Approval',
    deliveryDate: '2025-10-22'
  },
  {
    poNumber: 'PO-2025-1840',
    supplier: 'Swift Logistics Ltd',
    items: 28,
    totalValue: '$22,500',
    date: '2025-10-08',
    status: 'Completed',
    deliveryDate: '2025-10-18'
  },
  {
    poNumber: 'PO-2025-1839',
    supplier: 'Quality Parts Inc',
    items: 56,
    totalValue: '$67,300',
    date: '2025-10-07',
    status: 'In Transit',
    deliveryDate: '2025-10-19'
  },
  {
    poNumber: 'PO-2025-1838',
    supplier: 'Mega Wholesale',
    items: 41,
    totalValue: '$31,800',
    date: '2025-10-06',
    status: 'Delayed',
    deliveryDate: '2025-10-17'
  }
])

// Top Suppliers
const topSuppliers = ref([
  {
    name: 'Global Tech Supplies',
    totalOrders: 142,
    totalValue: '$456,800',
    onTimeRate: 96,
    rating: 4.8
  },
  {
    name: 'Premium Materials Co',
    totalOrders: 128,
    totalValue: '$398,200',
    onTimeRate: 94,
    rating: 4.6
  },
  {
    name: 'Swift Logistics Ltd',
    totalOrders: 95,
    totalValue: '$312,500',
    onTimeRate: 92,
    rating: 4.5
  },
  {
    name: 'Quality Parts Inc',
    totalOrders: 87,
    totalValue: '$289,400',
    onTimeRate: 88,
    rating: 4.3
  },
  {
    name: 'Mega Wholesale',
    totalOrders: 73,
    totalValue: '$245,600',
    onTimeRate: 85,
    rating: 4.1
  }
])

// Pending Approvals
const pendingApprovals = ref([
  {
    poNumber: 'PR-2025-0456',
    requestedBy: 'John Smith',
    department: 'Operations',
    items: 'Office Equipment & Supplies',
    amount: '$12,450',
    urgency: 'High',
    date: '2025-10-11'
  },
  {
    poNumber: 'PR-2025-0455',
    requestedBy: 'Sarah Chen',
    department: 'IT',
    items: 'Server Hardware',
    amount: '$28,900',
    urgency: 'Medium',
    date: '2025-10-10'
  },
  {
    poNumber: 'PR-2025-0454',
    requestedBy: 'Mike Johnson',
    department: 'Production',
    items: 'Raw Materials',
    amount: '$45,200',
    urgency: 'High',
    date: '2025-10-10'
  },
  {
    poNumber: 'PR-2025-0453',
    requestedBy: 'Emily Davis',
    department: 'Marketing',
    items: 'Promotional Materials',
    amount: '$8,750',
    urgency: 'Low',
    date: '2025-10-09'
  }
])

// Category Spending
const categorySpending = ref([
  { category: 'Raw Materials', amount: 580, percentage: 46.5, change: '+8.2%' },
  { category: 'Equipment', amount: 240, percentage: 19.2, change: '+12.5%' },
  { category: 'Services', amount: 170, percentage: 13.6, change: '+5.3%' },
  { category: 'Packaging', amount: 135, percentage: 10.8, change: '+3.8%' },
  { category: 'Others', amount: 120, percentage: 9.9, change: '-2.1%' }
])

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700'
    case 'In Progress':
    case 'In Transit': return 'bg-blue-100 text-blue-700'
    case 'Pending Approval': return 'bg-yellow-100 text-yellow-700'
    case 'Delayed': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'High': return 'bg-red-100 text-red-700'
    case 'Medium': return 'bg-yellow-100 text-yellow-700'
    case 'Low': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Purchasing Dashboard</h1>
        <p class="text-muted-foreground mt-1">Monitor procurement activities and supplier performance</p>
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

    <!-- Purchasing Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in purchasingStats" :key="stat.title" class="relative hover:shadow-md transition-shadow">
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
      <!-- Monthly Spending Trend -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>Procurement expenses by category</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="area"
              height="300"
              :options="spendingOptions"
              :series="spendingSeries"
          />
        </CardContent>
      </Card>

      <!-- PO Status Overview -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Purchase Orders Status</CardTitle>
            <Button variant="ghost" size="icon">
              <FileText class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="status in poStatusData" :key="status.status"
                 class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1">
                <div :class="[status.color, 'w-3 h-3 rounded-full']"></div>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ status.status }}</div>
                  <div class="text-xs text-muted-foreground">{{ status.count }} orders</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold">{{ status.percentage }}%</div>
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-2">
            <div v-for="status in poStatusData" :key="status.status">
              <Progress :model-value="status.percentage" class="h-1.5" />
            </div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="text-sm font-medium mb-1">Total Orders</div>
            <div class="text-2xl font-bold">300</div>
            <div class="text-xs text-muted-foreground mt-1">This month</div>
          </div>
        </CardContent>
      </Card>

      <!-- Supplier Performance -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Top Supplier Performance</CardTitle>
              <CardDescription>Based on on-time delivery rate</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="bar"
              height="280"
              :options="supplierOptions"
              :series="[{ name: 'Performance Score', data: supplierSeries }]"
          />
        </CardContent>
      </Card>

      <!-- Category Spending Breakdown -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Category Spending</CardTitle>
            <Button variant="ghost" size="icon">
              <DollarSign class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="category in categorySpending" :key="category.category"
                 class="space-y-2">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm font-medium">{{ category.category }}</div>
                  <div class="text-xs text-muted-foreground">{{ category.percentage }}%</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold">${{ category.amount }}K</div>
                  <div :class="[
                    'text-xs',
                    category.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ category.change }}
                  </div>
                </div>
              </div>
              <Progress :model-value="category.percentage" class="h-2" />
            </div>

            <div class="pt-4 border-t">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div class="text-sm font-medium">Total Spending</div>
                <div class="text-xl font-bold">$1,245K</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Purchase Orders -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest procurement activities</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="order in recentPurchaseOrders" :key="order.poNumber"
                 class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-3 flex-1">
                <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <ShoppingCart class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ order.poNumber }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ order.supplier }} • {{ order.items }} items
                  </div>
                  <div class="text-xs text-muted-foreground mt-1">
                    Delivery: {{ order.deliveryDate }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <div class="font-semibold text-sm">{{ order.totalValue }}</div>
                  <div class="text-xs text-muted-foreground">{{ order.date }}</div>
                </div>
                <Badge :class="getStatusColor(order.status)" class="border-0">
                  {{ order.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Top Suppliers Details -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Top Suppliers</CardTitle>
            <Button variant="ghost" size="icon">
              <Users class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="(supplier, index) in topSuppliers" :key="supplier.name"
                 class="p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="font-medium text-sm">{{ supplier.name }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ supplier.totalOrders }} orders
                    </div>
                  </div>
                </div>
                <div class="text-sm font-bold">{{ supplier.totalValue }}</div>
              </div>
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs">
                  <span class="text-muted-foreground">On-Time Rate</span>
                  <span class="font-medium">{{ supplier.onTimeRate }}%</span>
                </div>
                <Progress :model-value="supplier.onTimeRate" class="h-1.5" />
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-muted-foreground">Rating</span>
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-500">★</span>
                    <span class="text-sm font-medium">{{ supplier.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Pending Approvals -->
      <Card class="lg:col-span-3">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Purchase requests awaiting review</CardDescription>
            </div>
            <Badge variant="outline" class="bg-yellow-50 text-yellow-700 border-yellow-200">
              {{ pendingApprovals.length }} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="approval in pendingApprovals" :key="approval.poNumber"
                 class="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-4 flex-1">
                <Avatar>
                  <AvatarFallback>{{ getInitials(approval.requestedBy) }}</AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-sm">{{ approval.poNumber }}</span>
                    <Badge :class="getUrgencyColor(approval.urgency)" class="border-0 text-xs">
                      {{ approval.urgency }}
                    </Badge>
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ approval.items }}
                  </div>
                  <div class="text-xs text-muted-foreground mt-1">
                    {{ approval.requestedBy }} • {{ approval.department }} • {{ approval.date }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right mr-3">
                  <div class="text-lg font-bold">{{ approval.amount }}</div>
                </div>
                <div class="flex gap-2">
                  <Button size="sm" class="h-8">
                    <CheckCircle class="h-3.5 w-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" class="h-8">
                    <AlertTriangle class="h-3.5 w-3.5 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
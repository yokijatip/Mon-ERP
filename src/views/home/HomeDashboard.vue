<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import VueApexCharts  from "vue3-apexcharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingCart,
  Smartphone,
  Shirt,
  Home,
  Trophy,
  MoreVertical
} from 'lucide-vue-next'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
}

const statsCards = ref([
  {
    title: 'Profit',
    value: '$12,628',
    change: '+72.8%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Sales',
    value: '$4,679',
    change: '+28.42%',
    isPositive: true,
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Payments',
    value: '$2,468',
    change: '-14.82%',
    isPositive: false,
    icon: CreditCard,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Transactions',
    value: '$14,857',
    change: '+28.14%',
    isPositive: true,
    icon: Wallet,
    color: 'bg-purple-100 text-purple-600'
  }
])

// Revenue Chart Data
const revenueSeries = ref([
  {
    name: '2024',
    data: [15, 8, 12, 28, 18, 10, 15]
  },
  {
    name: '2023',
    data: [10, 15, 12, 20, 18, 20, 18]
  }
])

const revenueOptions = ref({
  chart: {
    type: 'bar',
    height: 300,
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
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  },
  colors: ['#3b82f6', '#22d3ee'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Growth Radial Chart
const growthSeries = ref([78])
const growthOptions = ref({
  chart: {
    type: 'radialBar',
    height: 280
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '65%'
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '14px',
          color: '#64748b',
          offsetY: 10
        },
        value: {
          show: true,
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#0f172a',
          offsetY: -10,
          formatter: (val: number) => `${val}%`
        }
      }
    }
  },
  colors: ['#6366f1'],
  labels: ['Growth']
})

// Profile Report Line Chart
const profileSeries = ref([{
  name: 'Revenue',
  data: [30, 40, 35, 50, 49, 60, 70, 65, 75, 80]
}])

const profileOptions = ref({
  chart: {
    type: 'area',
    height: 100,
    sparkline: { enabled: true }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1
    }
  },
  colors: ['#f59e0b']
})

// Order Statistics Donut Chart
const orderSeries = ref([82.5, 23.8, 0.849, 0.099])
const orderOptions = ref({
  chart: {
    type: 'donut',
    height: 200
  },
  labels: ['Electronic', 'Fashion', 'Decor', 'Sports'],
  colors: ['#6366f1', '#22c55e', '#06b6d4', '#64748b'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '12px',
            fontWeight: 400,
            color: '#64748b',
            formatter: () => '38%'
          },
          total: {
            show: true,
            label: 'Weekly',
            fontSize: '12px',
            color: '#64748b'
          }
        }
      }
    }
  }
})

// Income Line Chart
const incomeSeries = ref([{
  name: 'Income',
  data: [70, 60, 50, 35, 45, 55, 40, 30, 25]
}])

const incomeOptions = ref({
  chart: {
    type: 'line',
    height: 130,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  markers: {
    size: [0, 0, 0, 0, 0, 0, 0, 0, 6],
    colors: ['#6366f1'],
    strokeColors: '#fff',
    strokeWidth: 2
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    labels: { show: false }
  },
  yaxis: { show: false },
  grid: { show: false },
  colors: ['#6366f1'],
  tooltip: {
    enabled: true,
    x: { show: true }
  }
})

const orderCategories = ref([
  {
    name: 'Electronic',
    items: 'Mobile, Earbuds, TV',
    count: '82.5k',
    icon: Smartphone,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'Fashion',
    items: 'Tshirt, Jeans, Shoes',
    count: '23.8k',
    icon: Shirt,
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'Decor',
    items: 'Fine Art, Dining',
    count: '849',
    icon: Home,
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    name: 'Sports',
    items: 'Football, Cricket Kit',
    count: '99',
    icon: Trophy,
    color: 'bg-gray-100 text-gray-600'
  }
])

const transactions = ref([
  {
    name: 'PayPal',
    description: 'Send money',
    amount: '+$82.6',
    icon: CreditCard,
    color: 'bg-red-100 text-red-600'
  },
  {
    name: 'Wallet',
    description: "Mac'D",
    amount: '+$270.69',
    icon: Wallet,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'Transfer',
    description: 'Refund',
    amount: '+$637.91',
    icon: CreditCard,
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    name: 'Credit Card',
    description: 'Ordered Food',
    amount: '-$838.71',
    icon: CreditCard,
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'Wallet',
    description: 'Starbucks',
    amount: '+$203.33',
    icon: Wallet,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'Mastercard',
    description: 'Ordered Food',
    amount: '-$92.45',
    icon: CreditCard,
    color: 'bg-yellow-100 text-yellow-600'
  }
])

const incomeTab = ref('income')
const selectedYear = ref('2023')
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ getGreeting() }}!</h1>
      <p class="text-muted-foreground mt-1">
        You have done 72% more sales today
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in statsCards" :key="stat.title" class="relative">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <div :class="[stat.color, 'p-2 rounded-lg']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
          <Button variant="ghost" size="icon" class="h-8 w-8">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div class="text-2xl font-bold mt-1">{{ stat.value }}</div>
          <div class="flex items-center mt-2">
            <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                       :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
            <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-sm font-medium']">
              {{ stat.change }}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Total Revenue Chart -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="bar"
              height="300"
              :options="revenueOptions"
              :series="revenueSeries"
          />
        </CardContent>
      </Card>

      <!-- Growth Circle -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div class="w-full flex justify-between items-start">
            <div></div>
            <Button variant="outline" size="sm">
              {{ selectedYear }}
            </Button>
          </div>
        </CardHeader>
        <CardContent class="flex flex-col items-center justify-center">
          <VueApexCharts
              type="radialBar"
              height="280"
              :options="growthOptions"
              :series="growthSeries"
          />
          <p class="text-center text-muted-foreground mb-6">62% Company Growth</p>
          <div class="grid grid-cols-2 gap-4 w-full">
            <div class="flex items-center gap-2">
              <DollarSign class="h-8 w-8 p-2 bg-blue-100 text-blue-600 rounded" />
              <div>
                <div class="text-xs text-muted-foreground">2023</div>
                <div class="font-semibold">$2.54k</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Wallet class="h-8 w-8 p-2 bg-cyan-100 text-cyan-600 rounded" />
              <div>
                <div class="text-xs text-muted-foreground">2022</div>
                <div class="font-semibold">$4.21k</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Profile Report -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle class="text-base">Profile Report</CardTitle>
            <Badge variant="secondary" class="mt-2 bg-yellow-100 text-yellow-700 border-0">
              Year 2022
            </Badge>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 mb-4">
            <TrendingUp class="h-4 w-4 text-green-600" />
            <span class="text-sm font-medium text-green-600">68.2%</span>
          </div>
          <div class="text-3xl font-bold mb-6">$84,686k</div>
          <VueApexCharts
              type="area"
              height="100"
              :options="profileOptions"
              :series="profileSeries"
          />
        </CardContent>
      </Card>

      <!-- Order Statistics -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Order Statistics</CardTitle>
            <CardDescription>42.82k Total Sales</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col items-center mb-6">
            <VueApexCharts
                type="donut"
                height="200"
                :options="orderOptions"
                :series="orderSeries"
            />
            <div class="text-3xl font-bold mt-4">8,258</div>
            <div class="text-sm text-muted-foreground">Total Orders</div>
          </div>

          <div class="space-y-4">
            <div v-for="category in orderCategories" :key="category.name"
                 class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div :class="[category.color, 'p-2 rounded-lg']">
                  <component :is="category.icon" class="h-4 w-4" />
                </div>
                <div>
                  <div class="font-medium text-sm">{{ category.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ category.items }}</div>
                </div>
              </div>
              <div class="font-semibold">{{ category.count }}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Income/Expenses/Profit -->
      <Card>
        <CardHeader>
          <div class="flex gap-2">
            <Button
                @click="incomeTab = 'income'"
                :variant="incomeTab === 'income' ? 'default' : 'ghost'"
                size="sm"
            >
              Income
            </Button>
            <Button
                @click="incomeTab = 'expenses'"
                :variant="incomeTab === 'expenses' ? 'default' : 'ghost'"
                size="sm"
            >
              Expenses
            </Button>
            <Button
                @click="incomeTab = 'profit'"
                :variant="incomeTab === 'profit' ? 'default' : 'ghost'"
                size="sm"
            >
              Profit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <DollarSign class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Total Income</div>
              <div class="text-xl font-bold">$459.1k</div>
            </div>
            <div class="flex items-center text-green-600 text-sm ml-auto">
              <TrendingUp class="h-4 w-4 mr-1" />
              65%
            </div>
          </div>

          <VueApexCharts
              type="line"
              height="130"
              :options="incomeOptions"
              :series="incomeSeries"
          />

          <div class="grid grid-cols-7 gap-2 text-xs text-muted-foreground text-center mt-4">
            <div>Jan</div>
            <div>Feb</div>
            <div>Mar</div>
            <div>Apr</div>
            <div>May</div>
            <div>Jun</div>
            <div>Jul</div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              $6.5
            </div>
            <div>
              <div class="font-medium text-sm">Income This Week</div>
              <div class="text-xs text-muted-foreground">$39k less than last week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Transactions -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="(transaction, index) in transactions" :key="index"
                 class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div :class="[transaction.color, 'p-2 rounded-lg']">
                  <component :is="transaction.icon" class="h-4 w-4" />
                </div>
                <div>
                  <div class="font-medium text-sm">{{ transaction.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ transaction.description }}</div>
                </div>
              </div>
              <div :class="[
                'font-semibold',
                transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
              ]">
                {{ transaction.amount }} <span class="text-muted-foreground text-xs">USD</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
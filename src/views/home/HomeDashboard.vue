<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

const revenueData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  data2024: [15, 8, 12, 28, 18, 10, 15],
  data2023: [-10, -15, -12, -20, -18, -20, -18]
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
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ getGreeting() }}!</h1>
      <p class="text-muted-foreground mt-1">
        You have done 72% more sales today. Check your new raising badge in your profile.
      </p>
      <Button variant="outline" class="mt-3" size="sm">
        View Badges
      </Button>
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
            <div>
              <CardTitle>Total Revenue</CardTitle>
              <div class="flex items-center gap-4 mt-2">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span class="text-sm">2024</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-cyan-400"></div>
                  <span class="text-sm">2023</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-end justify-around gap-4 px-4">
            <div v-for="(label, index) in revenueData.labels" :key="label" class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full flex flex-col items-center gap-1">
                <div class="w-12 bg-blue-600 rounded-t"
                  :style="{ height: `${Math.abs(revenueData.data2024[index] || 0) * 8}px` }">
                </div>
                <div class="w-12 bg-cyan-400 rounded-b"
                  :style="{ height: `${Math.abs(revenueData.data2023[index] || 0) * 8}px` }">
                </div>
              </div>
              <span class="text-xs text-muted-foreground mt-2">{{ label }}</span>
            </div>
          </div>
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
        <CardContent class="flex flex-col items-center justify-center py-8">
          <div class="relative w-40 h-40 mb-4">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#e5e7eb" stroke-width="12" fill="none" />
              <circle cx="80" cy="80" r="70" stroke="#6366f1" stroke-width="12" fill="none"
                stroke-dasharray="440" stroke-dashoffset="97" stroke-linecap="round" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-4xl font-bold">78%</div>
              <div class="text-sm text-muted-foreground">Growth</div>
            </div>
          </div>
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
          <div class="h-24">
            <svg class="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <polyline
                points="0,40 30,35 60,45 90,25 120,30 150,15 180,20 200,10"
                fill="none"
                stroke="#f59e0b"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
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
            <div class="relative w-32 h-32">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" stroke-width="16" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#6366f1" stroke-width="16" fill="none"
                  stroke-dasharray="352" stroke-dashoffset="88" />
                <circle cx="64" cy="64" r="56" stroke="#22c55e" stroke-width="16" fill="none"
                  stroke-dasharray="352" stroke-dashoffset="220" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-sm text-muted-foreground">38%</div>
                <div class="text-xs text-muted-foreground">Weekly</div>
              </div>
            </div>
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

          <div class="h-32 mb-4">
            <svg class="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <polyline
                points="0,70 40,60 80,50 120,35 160,45 200,55 240,40 280,30 300,25"
                fill="none"
                stroke="#6366f1"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="300" cy="25" r="6" fill="#6366f1" stroke="white" stroke-width="2" />
            </svg>
          </div>

          <div class="grid grid-cols-7 gap-2 text-xs text-muted-foreground text-center">
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

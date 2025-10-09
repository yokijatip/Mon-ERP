<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import VueApexCharts from 'vue3-apexcharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Calendar,
  PieChart
} from 'lucide-vue-next'

const financeStats = ref([
  {
    title: 'Total Revenue',
    value: '$845,230',
    change: '+18.5%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    description: 'vs last month'
  },
  {
    title: 'Total Expenses',
    value: '$324,680',
    change: '+5.2%',
    isPositive: false,
    icon: CreditCard,
    color: 'bg-red-100 text-red-600',
    description: 'vs last month'
  },
  {
    title: 'Net Profit',
    value: '$520,550',
    change: '+24.8%',
    isPositive: true,
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-600',
    description: 'vs last month'
  },
  {
    title: 'Cash Flow',
    value: '$692,340',
    change: '+12.3%',
    isPositive: true,
    icon: Wallet,
    color: 'bg-purple-100 text-purple-600',
    description: 'vs last month'
  }
])

// Revenue vs Expenses Chart
const revenueExpensesSeries = ref([
  {
    name: 'Revenue',
    data: [65, 70, 75, 80, 72, 88, 92, 95, 85, 90]
  },
  {
    name: 'Expenses',
    data: [35, 38, 42, 45, 40, 48, 50, 52, 48, 50]
  }
])

const revenueExpensesOptions = ref({
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
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  },
  colors: ['#22c55e', '#ef4444'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  },
  yaxis: {
    title: {
      text: 'Amount ($K)'
    }
  }
})

// Profit Margin Area Chart
const profitMarginSeries = ref([{
  name: 'Profit Margin',
  data: [45, 35, 38, 28, 32, 22, 26, 18, 23, 20]
}])

const profitMarginOptions = ref({
  chart: {
    type: 'area',
    height: 130,
    toolbar: { show: false },
    sparkline: { enabled: false }
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
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    labels: { show: false }
  },
  yaxis: { show: false },
  grid: { show: false },
  colors: ['#22c55e'],
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}%`
    }
  }
})

// Expense Breakdown Donut
const expenseSeries = ref([38.6, 27.5, 17.5, 10.6, 5.8])
const expenseOptions = ref({
  chart: {
    type: 'donut',
    height: 280
  },
  labels: ['Salaries & Wages', 'Operations', 'Marketing', 'Utilities', 'Others'],
  colors: ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#6b7280'],
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
          name: {
            show: true,
            fontSize: '14px'
          },
          value: {
            show: true,
            fontSize: '20px',
            fontWeight: 'bold',
            formatter: (val: string) => `${val}%`
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '12px',
            formatter: () => '$324.68K'
          }
        }
      }
    }
  }
})

const topExpenses = ref([
  {
    category: 'Salaries & Wages',
    amount: '$125,400',
    percentage: 38.6,
    change: '+2.5%',
    isPositive: false,
    color: 'bg-blue-600'
  },
  {
    category: 'Operations',
    amount: '$89,200',
    percentage: 27.5,
    change: '+5.8%',
    isPositive: false,
    color: 'bg-green-600'
  },
  {
    category: 'Marketing',
    amount: '$56,800',
    percentage: 17.5,
    change: '+12.3%',
    isPositive: false,
    color: 'bg-yellow-600'
  },
  {
    category: 'Utilities',
    amount: '$34,280',
    percentage: 10.6,
    change: '-3.2%',
    isPositive: true,
    color: 'bg-purple-600'
  },
  {
    category: 'Others',
    amount: '$19,000',
    percentage: 5.8,
    change: '+1.2%',
    isPositive: false,
    color: 'bg-gray-600'
  }
])

const recentTransactions = ref([
  {
    type: 'income',
    description: 'Payment from Client ABC',
    amount: '+$15,250',
    date: '2025-10-08',
    status: 'Completed',
    reference: 'INV-2845'
  },
  {
    type: 'expense',
    description: 'Office Rent Payment',
    amount: '-$5,000',
    date: '2025-10-08',
    status: 'Completed',
    reference: 'EXP-1234'
  },
  {
    type: 'income',
    description: 'Product Sales Revenue',
    amount: '+$8,450',
    date: '2025-10-07',
    status: 'Completed',
    reference: 'INV-2844'
  },
  {
    type: 'expense',
    description: 'Marketing Campaign',
    amount: '-$3,200',
    date: '2025-10-07',
    status: 'Pending',
    reference: 'EXP-1233'
  },
  {
    type: 'income',
    description: 'Consulting Services',
    amount: '+$12,800',
    date: '2025-10-06',
    status: 'Completed',
    reference: 'INV-2843'
  },
  {
    type: 'expense',
    description: 'Software Subscriptions',
    amount: '-$1,850',
    date: '2025-10-06',
    status: 'Completed',
    reference: 'EXP-1232'
  }
])

const cashFlowData = ref({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  inflow: [120000, 145000, 132000, 158000],
  outflow: [85000, 92000, 88000, 95000]
})

const accountsReceivable = ref([
  {
    client: 'Tech Corp Ltd',
    invoice: 'INV-2840',
    amount: '$25,500',
    dueDate: '2025-10-15',
    status: 'Pending',
    overdue: false
  },
  {
    client: 'Digital Solutions Inc',
    invoice: 'INV-2835',
    amount: '$18,200',
    dueDate: '2025-10-20',
    status: 'Pending',
    overdue: false
  },
  {
    client: 'Global Retail Co',
    invoice: 'INV-2828',
    amount: '$32,400',
    dueDate: '2025-10-05',
    status: 'Overdue',
    overdue: true
  },
  {
    client: 'Smart Systems LLC',
    invoice: 'INV-2825',
    amount: '$15,800',
    dueDate: '2025-10-25',
    status: 'Pending',
    overdue: false
  }
])

function getTransactionColor(type: string) {
  return type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Overdue': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p class="text-muted-foreground mt-1">Comprehensive overview of your financial performance</p>
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

    <!-- Finance Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in financeStats" :key="stat.title" class="relative hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center justify-between mt-2 w-full">

            <div class="flex items-center justify-between">
              <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                         :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
              <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-xs font-medium']">
                {{ stat.change }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-muted-foreground">{{ stat.description }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly comparison of income and expenditure</CardDescription>
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
              :options="revenueExpensesOptions"
              :series="revenueExpensesSeries"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Profit Margin Trend</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-center mb-6">
            <div class="text-center">
              <div class="text-4xl font-bold text-green-600">66.2%</div>
              <div class="text-sm text-muted-foreground mt-1">Current Margin</div>
            </div>
          </div>

          <VueApexCharts
              type="area"
              height="130"
              :options="profitMarginOptions"
              :series="profitMarginSeries"
          />

          <div class="space-y-3 mt-4">
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div class="text-sm font-medium">Average Margin</div>
                <div class="text-xs text-muted-foreground">Last 10 months</div>
              </div>
              <div class="text-lg font-bold text-green-600">63.5%</div>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div class="text-sm font-medium">Best Month</div>
                <div class="text-xs text-muted-foreground">August 2025</div>
              </div>
              <div class="text-lg font-bold text-blue-600">67.4%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Weekly cash inflow vs outflow</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div v-for="(label, index) in cashFlowData.labels" :key="label" class="text-center">
              <div class="text-xs text-muted-foreground mb-2">{{ label }}</div>
              <div class="space-y-2">
                <div class="flex items-center justify-center gap-2">
                  <ArrowUpRight class="h-4 w-4 text-green-600" />
                  <span class="text-sm font-semibold text-green-600">
                    ${{ ((cashFlowData.inflow[index] || 0) / 1000).toFixed(0) }}k
                  </span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <ArrowDownRight class="h-4 w-4 text-red-600" />
                  <span class="text-sm font-semibold text-red-600">
                    ${{ ((cashFlowData.outflow[index] || 0) / 1000).toFixed(0) }}k
                  </span>
                </div>
                <div class="mt-2 pt-2 border-t">
                  <div class="text-xs text-muted-foreground">Net</div>
                  <div class="text-sm font-bold text-blue-600">
                    +${{ (((cashFlowData.inflow[index] || 0) - (cashFlowData.outflow[index] || 0)) / 1000).toFixed(0) }}k
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="text-xs text-muted-foreground mb-1">Total Inflow</div>
              <div class="text-lg font-bold text-green-600">$555k</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-muted-foreground mb-1">Total Outflow</div>
              <div class="text-lg font-bold text-red-600">$360k</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-muted-foreground mb-1">Net Cash Flow</div>
              <div class="text-lg font-bold text-blue-600">+$195k</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Expense Breakdown</CardTitle>
            <Button variant="ghost" size="icon">
              <PieChart class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="donut"
              height="280"
              :options="expenseOptions"
              :series="expenseSeries"
          />
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="transaction in recentTransactions" :key="transaction.reference"
                 class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-3 flex-1">
                <div :class="[
                  getTransactionColor(transaction.type),
                  'p-2 rounded-lg'
                ]">
                  <component :is="transaction.type === 'income' ? ArrowUpRight : ArrowDownRight"
                             class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ transaction.description }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ transaction.reference }} • {{ transaction.date }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Badge :class="getStatusColor(transaction.status)" class="border-0">
                  {{ transaction.status }}
                </Badge>
                <div :class="[
                  'font-semibold text-sm',
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ transaction.amount }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Accounts Receivable</CardTitle>
              <CardDescription>Outstanding invoices</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3 mb-4">
            <div v-for="account in accountsReceivable" :key="account.invoice"
                 class="p-3 rounded-lg border"
                 :class="account.overdue ? 'border-red-200 bg-red-50' : ''">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-medium text-sm">{{ account.client }}</div>
                  <div class="text-xs text-muted-foreground">{{ account.invoice }}</div>
                </div>
                <Badge :class="getStatusColor(account.status)" class="border-0">
                  {{ account.status }}
                </Badge>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-sm text-muted-foreground">Due: {{ account.dueDate }}</div>
                <div class="text-sm font-semibold">{{ account.amount }}</div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm font-medium mb-1">Total Outstanding</div>
            <div class="text-2xl font-bold">$91,900</div>
            <div class="text-xs text-red-600 mt-1">$32,400 overdue</div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
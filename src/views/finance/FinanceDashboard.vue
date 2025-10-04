<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Download, Clock, Building2, Users2
} from 'lucide-vue-next'
import Header from "@/components/kakangCustom/Header.vue"
import { useAuthStore } from "@/stores/auth"
import { useFinance, type Transaction } from '@/composables/useFinance'
import { useDateRange } from '@/composables/useDateRange'
import {
  createCashFlowChartConfig,
  createExpenseBreakdownConfig,
  createRevenueExpenseChartConfig
} from '@/config/chartConfig'
import { toast } from "vue-sonner"

// Lazy load charts for better performance
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

// ============= Composables =============
const authStore = useAuthStore()
const { formatCurrency, getStatusColor, getTransactionStyle } = useFinance()
const { value: dateRange, DateRangePicker, exportReport } = useDateRange()

// ============= Computed Values =============
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})

const userName = computed(() =>
    authStore.userProfile?.displayName ||
    authStore.user?.displayName ||
    'User'
)

// ============= Financial KPIs =============
interface FinancialKPI {
  title: string
  value: number
  change: string
  trend: 'up' | 'down'
  icon: any
  color: string
  bgColor: string
  isPercentage?: boolean
}

const financialKpis = ref<FinancialKPI[]>([
  {
    title: 'Total Cash Balance',
    value: 1_850_000_000,
    change: '+18.2%',
    trend: 'up',
    icon: Wallet,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Accounts Receivable',
    value: 456_000_000,
    change: '+5.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Accounts Payable',
    value: 289_000_000,
    change: '-12.1%',
    trend: 'down',
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Net Profit Margin',
    value: 28.5,
    change: '+3.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    isPercentage: true
  }
])

// ============= Chart Data =============
const cashFlowSeries = ref([
  {
    name: 'Cash Inflow',
    data: [125_000_000, 138_000_000, 142_000_000, 155_000_000, 148_000_000, 165_000_000,
      178_000_000, 172_000_000, 185_000_000, 195_000_000, 188_000_000, 205_000_000]
  },
  {
    name: 'Cash Outflow',
    data: [95_000_000, 102_000_000, 98_000_000, 115_000_000, 108_000_000, 122_000_000,
      135_000_000, 128_000_000, 138_000_000, 145_000_000, 142_000_000, 155_000_000]
  },
  {
    name: 'Net Cash Flow',
    data: [30_000_000, 36_000_000, 44_000_000, 40_000_000, 40_000_000, 43_000_000,
      43_000_000, 44_000_000, 47_000_000, 50_000_000, 46_000_000, 50_000_000]
  }
])

const expenseBreakdownSeries = ref([45_000_000, 55_000_000, 25_000_000, 15_000_000, 10_000_000, 5_000_000])

const revenueExpenseSeries = ref([
  {
    name: 'Revenue',
    data: [125_000_000, 138_000_000, 142_000_000, 155_000_000, 148_000_000, 165_000_000,
      178_000_000, 172_000_000, 185_000_000, 195_000_000, 188_000_000, 205_000_000]
  },
  {
    name: 'Expenses',
    data: [95_000_000, 102_000_000, 98_000_000, 115_000_000, 108_000_000, 122_000_000,
      135_000_000, 128_000_000, 138_000_000, 145_000_000, 142_000_000, 155_000_000]
  }
])

// Helper for chart value formatting
const formatChartValue = (val: number): string => {
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)}jt`
  return `Rp ${(val / 1_000).toFixed(0)}rb`
}

// Chart configurations
const cashFlowOptions = computed(() =>
    createCashFlowChartConfig(formatCurrency, formatChartValue)
)
const expenseBreakdownOptions = computed(() =>
    createExpenseBreakdownConfig(formatCurrency)
)
const revenueExpenseOptions = computed(() =>
    createRevenueExpenseChartConfig(formatCurrency, formatChartValue)
)

// ============= Accounts Receivable & Payable =============
interface AccountItem {
  customer?: string
  vendor?: string
  invoice: string
  amount: number
  dueDate: string
  status: 'overdue' | 'pending'
  days: number
}

const accountsReceivable = ref<AccountItem[]>([
  { customer: 'PT Maju Jaya', invoice: 'INV-2024-001', amount: 125_000_000, dueDate: '2024-10-10', status: 'overdue', days: 5 },
  { customer: 'CV Sukses Mandiri', invoice: 'INV-2024-002', amount: 85_000_000, dueDate: '2024-10-15', status: 'pending', days: 12 },
  { customer: 'Toko Berkah', invoice: 'INV-2024-003', amount: 45_000_000, dueDate: '2024-10-08', status: 'overdue', days: 2 },
  { customer: 'UD Sejahtera', invoice: 'INV-2024-004', amount: 95_000_000, dueDate: '2024-10-20', status: 'pending', days: 17 },
  { customer: 'PT Global Tech', invoice: 'INV-2024-005', amount: 106_000_000, dueDate: '2024-10-25', status: 'pending', days: 22 }
])

const accountsPayable = ref<AccountItem[]>([
  { vendor: 'PT Supplier Utama', invoice: 'BILL-2024-001', amount: 75_000_000, dueDate: '2024-10-12', status: 'pending', days: 9 },
  { vendor: 'CV Material Indo', invoice: 'BILL-2024-002', amount: 52_000_000, dueDate: '2024-10-18', status: 'pending', days: 15 },
  { vendor: 'Toko Bahan Baku', invoice: 'BILL-2024-003', amount: 38_000_000, dueDate: '2024-10-22', status: 'pending', days: 19 },
  { vendor: 'PT Logistik Cepat', invoice: 'BILL-2024-004', amount: 64_000_000, dueDate: '2024-10-28', status: 'pending', days: 25 },
  { vendor: 'CV Packaging Pro', invoice: 'BILL-2024-005', amount: 60_000_000, dueDate: '2024-11-05', status: 'pending', days: 33 }
])

// ============= Recent Transactions =============
const recentTransactions = ref<Transaction[]>([
  { id: 'TRX-2024-001', type: 'income', description: 'Payment from PT Maju Jaya', amount: 125_000_000, date: '2024-10-03', category: 'Sales', status: 'confirmed' },
  { id: 'TRX-2024-002', type: 'expense', description: 'Salary Payment - October', amount: 55_000_000, date: '2024-10-03', category: 'Payroll', status: 'confirmed' },
  { id: 'TRX-2024-003', type: 'income', description: 'Payment from CV Sukses Mandiri', amount: 85_000_000, date: '2024-10-02', category: 'Sales', status: 'confirmed' },
  { id: 'TRX-2024-004', type: 'expense', description: 'Office Rent - October', amount: 15_000_000, date: '2024-10-02', category: 'Operational', status: 'confirmed' },
  { id: 'TRX-2024-005', type: 'expense', description: 'Marketing Campaign', amount: 12_000_000, date: '2024-10-01', category: 'Marketing', status: 'confirmed' },
  { id: 'TRX-2024-006', type: 'income', description: 'Payment from Toko Berkah', amount: 45_000_000, date: '2024-10-01', category: 'Sales', status: 'confirmed' }
])

// ============= Functions =============
const handleDownloadReport = () => {
  exportReport('Financial Dashboard Report', () => {
    // Export logic here
    console.log('Exporting report for:', dateRange.value)
  })
}
</script>

<template>
  <div class="space-y-6 pb-8">
    <!-- Header with Date Picker -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Header
          title="Finance Dashboard"
          :subtitle="`${greeting}, ${userName}!`"
          align="left"
      />

      <div class="flex items-center gap-2 flex-wrap">
        <DateRangePicker v-model="dateRange" />

        <Button @click="handleDownloadReport" class="gap-2">
          <Download class="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>

    <!-- Financial KPI Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card
          v-for="kpi in financialKpis"
          :key="kpi.title"
          class="hover:shadow-md transition-shadow duration-200"
      >
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ kpi.title }}
          </CardTitle>
          <div :class="[kpi.bgColor, 'p-2 rounded-lg']">
            <component :is="kpi.icon" :class="[kpi.color, 'w-4 h-4']" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ kpi.isPercentage ? `${kpi.value}%` : formatCurrency(kpi.value) }}
          </div>
          <div class="flex items-center text-sm mt-1">
            <component
                :is="kpi.trend === 'up' ? TrendingUp : TrendingDown"
                :class="[kpi.trend === 'up' ? 'text-green-600' : 'text-red-600', 'w-3 h-3 mr-1']"
            />
            <span :class="kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ kpi.change }}
            </span>
            <span class="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Charts Row -->
    <div class="grid gap-4 md:grid-cols-7">
      <!-- Cash Flow Chart -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Cash Flow Analysis</CardTitle>
          <CardDescription>Monthly cash inflow, outflow, and net cash flow for 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <VueApexCharts
                type="area"
                height="350"
                :options="cashFlowOptions"
                :series="cashFlowSeries"
            />
            <template #fallback>
              <div class="flex items-center justify-center h-[350px]">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </template>
          </Suspense>
        </CardContent>
      </Card>

      <!-- Expense Breakdown -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Distribution of expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <VueApexCharts
                type="donut"
                height="320"
                :options="expenseBreakdownOptions"
                :series="expenseBreakdownSeries"
            />
            <template #fallback>
              <div class="flex items-center justify-center h-[320px]">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </template>
          </Suspense>
        </CardContent>
      </Card>
    </div>

    <!-- Revenue vs Expense Chart -->
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Expenses</CardTitle>
        <CardDescription>Monthly comparison of revenue and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <VueApexCharts
              type="bar"
              height="320"
              :options="revenueExpenseOptions"
              :series="revenueExpenseSeries"
          />
          <template #fallback>
            <div class="flex items-center justify-center h-[320px]">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </template>
        </Suspense>
      </CardContent>
    </Card>

    <!-- Accounts Receivable & Payable Row -->
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Accounts Receivable -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Accounts Receivable</CardTitle>
              <CardDescription>Outstanding customer invoices</CardDescription>
            </div>
            <Badge variant="outline" class="text-lg font-semibold">
              {{ formatCurrency(456_000_000) }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
                v-for="ar in accountsReceivable"
                :key="ar.invoice"
                class="flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50"
                :class="ar.status === 'overdue' ? 'border-red-200 bg-red-50/30' : ''"
            >
              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                  <Building2 class="w-4 h-4 text-muted-foreground" />
                  <p class="font-medium">{{ ar.customer }}</p>
                </div>
                <p class="text-sm text-muted-foreground">{{ ar.invoice }}</p>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock class="w-3 h-3" />
                  <span>Due: {{ ar.dueDate }} ({{ ar.days }} days)</span>
                </div>
              </div>
              <div class="text-right space-y-2">
                <p class="font-semibold">{{ formatCurrency(ar.amount) }}</p>
                <Badge :class="getStatusColor(ar.status)" class="capitalize">
                  {{ ar.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Accounts Payable -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Accounts Payable</CardTitle>
              <CardDescription>Outstanding vendor bills</CardDescription>
            </div>
            <Badge variant="outline" class="text-lg font-semibold">
              {{ formatCurrency(289_000_000) }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
                v-for="ap in accountsPayable"
                :key="ap.invoice"
                class="flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50"
            >
              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-2">
                  <Users2 class="w-4 h-4 text-muted-foreground" />
                  <p class="font-medium">{{ ap.vendor }}</p>
                </div>
                <p class="text-sm text-muted-foreground">{{ ap.invoice }}</p>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock class="w-3 h-3" />
                  <span>Due: {{ ap.dueDate }} ({{ ap.days }} days)</span>
                </div>
              </div>
              <div class="text-right space-y-2">
                <p class="font-semibold">{{ formatCurrency(ap.amount) }}</p>
                <Badge :class="getStatusColor(ap.status)" class="capitalize">
                  {{ ap.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Transactions -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest financial transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3 flex-1">
              <div :class="[
                getTransactionStyle(transaction.type).bgColor,
                'p-2 rounded-lg'
              ]">
                <component
                    :is="transaction.type === 'income' ? ArrowDownRight : ArrowUpRight"
                    :class="[getTransactionStyle(transaction.type).color, 'w-4 h-4']"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ transaction.description }}</p>
                <div class="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{{ transaction.id }}</span>
                  <span>•</span>
                  <span>{{ transaction.date }}</span>
                  <span>•</span>
                  <Badge variant="outline" class="text-xs">{{ transaction.category }}</Badge>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p :class="[
                'font-semibold text-lg',
                getTransactionStyle(transaction.type).color
              ]">
                {{ getTransactionStyle(transaction.type).prefix }}{{ formatCurrency(transaction.amount) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
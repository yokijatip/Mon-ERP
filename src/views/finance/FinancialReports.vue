<script setup lang="ts">
import {ref, computed} from 'vue'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  BarChart3,
  PieChart
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import Header from "@/components/kakangCustom/Header.vue"
import {useAuthStore} from "@/stores/auth.ts"
import type {DateRange} from "reka-ui"
import type {Ref} from "vue"
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date"
import {CalendarIcon} from "lucide-vue-next"
import {cn} from "@/lib/utils"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {RangeCalendar} from "@/components/ui/range-calendar"
import {toast} from "vue-sonner"

// Date Picker Setup
const df = new DateFormatter("en-US", {
  dateStyle: "medium",
})

const value = ref({
  start: new CalendarDate(2024, 1, 1),
  end: new CalendarDate(2024, 12, 31),
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

// P&L Statement Data
const profitLossData = ref({
  revenue: {
    salesRevenue: 2450000000,
    serviceRevenue: 320000000,
    otherRevenue: 85000000,
    total: 2855000000
  },
  expenses: {
    costOfGoodsSold: 1470000000,
    operatingExpenses: 650000000,
    salariesBenefits: 520000000,
    depreciation: 85000000,
    interestExpense: 45000000,
    total: 2770000000
  },
  grossProfit: 1385000000,
  operatingIncome: 735000000,
  netIncome: 85000000
})

// Balance Sheet Data
const balanceSheetData = ref({
  assets: {
    currentAssets: {
      cash: 1850000000,
      accountsReceivable: 456000000,
      inventory: 680000000,
      prepaidExpenses: 125000000,
      total: 3111000000
    },
    fixedAssets: {
      propertyPlantEquipment: 2850000000,
      accumulatedDepreciation: -850000000,
      intangibleAssets: 320000000,
      total: 2320000000
    },
    totalAssets: 5431000000
  },
  liabilities: {
    currentLiabilities: {
      accountsPayable: 289000000,
      shortTermDebt: 180000000,
      accruedExpenses: 145000000,
      total: 614000000
    },
    longTermLiabilities: {
      longTermDebt: 1250000000,
      deferredTaxLiabilities: 85000000,
      total: 1335000000
    },
    totalLiabilities: 1949000000
  },
  equity: {
    shareCapital: 2500000000,
    retainedEarnings: 982000000,
    total: 3482000000
  }
})

// Report Types
const reportTypes = ref([
  {
    id: 'profit-loss',
    name: 'Profit & Loss Statement',
    icon: TrendingUp,
    description: 'Income statement showing revenue, expenses, and net profit'
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    icon: Calculator,
    description: 'Financial position showing assets, liabilities, and equity'
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Statement',
    icon: DollarSign,
    description: 'Cash inflows and outflows from operations, investing, and financing'
  },
  {
    id: 'trial-balance',
    name: 'Trial Balance',
    icon: BarChart3,
    description: 'List of all general ledger accounts with their balances'
  },
  {
    id: 'aged-receivables',
    name: 'Aged Receivables',
    icon: FileText,
    description: 'Outstanding customer invoices by age'
  },
  {id: 'aged-payables', name: 'Aged Payables', icon: FileText, description: 'Outstanding vendor bills by age'}
])

const selectedReportType = ref('profit-loss')
const selectedPeriod = ref('annual')

// Functions
const generateReport = () => {
  const start = value.value?.start
  const end = value.value?.end ?? start

  if (!start) {
    toast.error('Please select a date range first.')
    return
  }

  const toastId = toast.loading('Generating financial report...')

  setTimeout(() => {
    toast.success('Financial report generated successfully!', {
      id: toastId,
      duration: 3000
    })
  }, 1500)
}

const exportReport = () => {
  const toastId = toast.loading('Exporting report...')

  setTimeout(() => {
    toast.success('Report exported successfully!', {
      id: toastId,
      duration: 3000
    })
  }, 1000)
}

// Chart configurations
const revenueExpenseChart = ref({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {show: false}
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4
    }
  },
  dataLabels: {enabled: false},
  xaxis: {
    categories: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  colors: ['#10b981', '#ef4444'],
  legend: {position: 'top'}
})

const revenueExpenseSeries = ref([
  {
    name: 'Revenue',
    data: [650000000, 720000000, 680000000, 805000000]
  },
  {
    name: 'Expenses',
    data: [580000000, 640000000, 620000000, 730000000]
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Header
          title="Financial Reports"
          :subtitle="`${greeting}, ${userName}!`"
          align="left"
      />

      <div class="flex items-center gap-2">
        <Popover>
          <PopoverTrigger as-child>
            <Button
                variant="outline"
                :class="cn(
                  'w-[280px] justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                )"
            >
              <CalendarIcon class="mr-2 h-4 w-4"/>
              <template v-if="value.start">
                <template v-if="value.end">
                  {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
                  {{ df.format(value.end.toDate(getLocalTimeZone())) }}
                </template>
                <template v-else>
                  {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                </template>
              </template>
              <template v-else>
                Select period
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

        <Button @click="generateReport">
          <FileText class="mr-2 h-4 w-4"/>
          Generate
        </Button>

        <Button @click="exportReport">
          <Download class="mr-2 h-4 w-4"/>
          Export
        </Button>
      </div>
    </div>

    <!-- Report Selection -->
    <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      <Card
          v-for="report in reportTypes"
          :key="report.id"
          :class="selectedReportType === report.id ? 'ring-2 ring-primary' : ''"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="selectedReportType = report.id"
      >
        <CardHeader class="pb-2">
          <div class="flex items-center gap-2">
            <component :is="report.icon" class="h-5 w-5 text-primary"/>
            <CardTitle class="text-sm">{{ report.name }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-xs text-muted-foreground">{{ report.description }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Financial Reports Tabs -->
    <Tabs :value="selectedReportType" @update:value="selectedReportType = $event">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="profit-loss">P&L Statement</TabsTrigger>
        <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
        <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
      </TabsList>

      <!-- Profit & Loss Statement -->
      <TabsContent value="profit-loss" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle class="text-green-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex justify-between">
                <span>Sales Revenue</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.revenue.salesRevenue) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Service Revenue</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.revenue.serviceRevenue) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Other Revenue</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.revenue.otherRevenue) }}</span>
              </div>
              <hr>
              <div class="flex justify-between font-bold text-lg">
                <span>Total Revenue</span>
                <span class="text-green-600">{{ formatCurrency(profitLossData.revenue.total) }}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-red-600">Expenses</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex justify-between">
                <span>Cost of Goods Sold</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.expenses.costOfGoodsSold) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Operating Expenses</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.expenses.operatingExpenses) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Salaries & Benefits</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.expenses.salariesBenefits) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Depreciation</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.expenses.depreciation) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Interest Expense</span>
                <span class="font-semibold">{{ formatCurrency(profitLossData.expenses.interestExpense) }}</span>
              </div>
              <hr>
              <div class="flex justify-between font-bold text-lg">
                <span>Total Expenses</span>
                <span class="text-red-600">{{ formatCurrency(profitLossData.expenses.total) }}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profitability Summary</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 md:grid-cols-3">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-muted-foreground">Gross Profit</p>
                <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(profitLossData.grossProfit) }}</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-sm text-muted-foreground">Operating Income</p>
                <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(profitLossData.operatingIncome) }}</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-muted-foreground">Net Income</p>
                <p class="text-2xl font-bold text-green-600">{{ formatCurrency(profitLossData.netIncome) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <VueApexCharts
                type="bar"
                height="300"
                :options="revenueExpenseChart"
                :series="revenueExpenseSeries"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Balance Sheet -->
      <TabsContent value="balance-sheet" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle class="text-blue-600">Assets</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <h4 class="font-semibold mb-2">Current Assets</h4>
                <div class="space-y-2 ml-4">
                  <div class="flex justify-between">
                    <span>Cash & Cash Equivalents</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.currentAssets.cash) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Accounts Receivable</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.currentAssets.accountsReceivable) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Inventory</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.currentAssets.inventory) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Prepaid Expenses</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.currentAssets.prepaidExpenses) }}</span>
                  </div>
                  <hr>
                  <div class="flex justify-between font-semibold">
                    <span>Total Current Assets</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.currentAssets.total) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-2">Fixed Assets</h4>
                <div class="space-y-2 ml-4">
                  <div class="flex justify-between">
                    <span>Property, Plant & Equipment</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.fixedAssets.propertyPlantEquipment) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Accumulated Depreciation</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.fixedAssets.accumulatedDepreciation) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Intangible Assets</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.fixedAssets.intangibleAssets) }}</span>
                  </div>
                  <hr>
                  <div class="flex justify-between font-semibold">
                    <span>Total Fixed Assets</span>
                    <span>{{ formatCurrency(balanceSheetData.assets.fixedAssets.total) }}</span>
                  </div>
                </div>
              </div>

              <hr>
              <div class="flex justify-between font-bold text-lg">
                <span>Total Assets</span>
                <span class="text-blue-600">{{ formatCurrency(balanceSheetData.assets.totalAssets) }}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-red-600">Liabilities & Equity</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <h4 class="font-semibold mb-2">Current Liabilities</h4>
                <div class="space-y-2 ml-4">
                  <div class="flex justify-between">
                    <span>Accounts Payable</span>
                    <span>{{ formatCurrency(balanceSheetData.liabilities.currentLiabilities.accountsPayable) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Short-term Debt</span>
                    <span>{{ formatCurrency(balanceSheetData.liabilities.currentLiabilities.shortTermDebt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Accrued Expenses</span>
                    <span>{{ formatCurrency(balanceSheetData.liabilities.currentLiabilities.accruedExpenses) }}</span>
                  </div>
                  <hr>
                  <div class="flex justify-between font-semibold">
                    <span>Total Current Liabilities</span>
                    <span>{{ formatCurrency(balanceSheetData.liabilities.currentLiabilities.total) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-2">Long-term Liabilities</h4>
                <div class="space-y-2 ml-4">
                  <div class="flex justify-between">
                    <span>Long-term Debt</span>
                    <span>{{ formatCurrency(balanceSheetData.liabilities.longTermLiabilities.longTermDebt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Deferred Tax Liabilities</span>
                    <span>{{
                        formatCurrency(balanceSheetData.liabilities.longTermLiabilities.deferredTaxLiabilities)
                      }}</span>
                  </div>
                  <hr>
                  <div class="flex justify-between font-semibold">
                    <span>Total Long-term Liabilities</span>
                    <span>{{ formatCurrency(balanceSheetData.liabilities.longTermLiabilities.total) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-2">Shareholders' Equity</h4>
                <div class="space-y-2 ml-4">
                  <div class="flex justify-between">
                    <span>Share Capital</span>
                    <span>{{ formatCurrency(balanceSheetData.equity.shareCapital) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Retained Earnings</span>
                    <span>{{ formatCurrency(balanceSheetData.equity.retainedEarnings) }}</span>
                  </div>
                  <hr>
                  <div class="flex justify-between font-semibold">
                    <span>Total Equity</span>
                    <span>{{ formatCurrency(balanceSheetData.equity.total) }}</span>
                  </div>
                </div>
              </div>

              <hr>
              <div class="flex justify-between font-bold text-lg">
                <span>Total Liabilities & Equity</span>
                <span class="text-red-600">{{
                    formatCurrency(balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.total)
                  }}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Cash Flow Statement -->
      <TabsContent value="cash-flow" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Statement</CardTitle>
            <CardDescription>Detailed cash flow analysis for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="text-center py-8">
              <FileText class="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
              <p class="text-muted-foreground">Cash Flow Statement will be displayed here</p>
              <p class="text-sm text-muted-foreground mt-2">Select a date range and click Generate to view the
                report</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<style scoped>

</style>

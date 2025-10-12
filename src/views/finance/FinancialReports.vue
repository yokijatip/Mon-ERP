<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import VueApexCharts from 'vue3-apexcharts'
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Printer,
  Share2,
  BarChart3,
  PieChart,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-vue-next'

// Report Period
const selectedPeriod = ref('2025')
const selectedQuarter = ref('Q4')
const comparisonPeriod = ref('2024')

// Quick Stats
const quickStats = ref([
  {
    title: 'Net Profit',
    value: '$1,245,680',
    change: '+24.5%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Profit Margin',
    value: '24.6%',
    change: '+3.2%',
    isPositive: true,
    icon: Percent,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Total Assets',
    value: '$3,809,130',
    change: '+18.5%',
    isPositive: true,
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'ROE',
    value: '37.1%',
    change: '+5.8%',
    isPositive: true,
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-600'
  }
])

// Profit & Loss Statement Data
const profitLossData = ref({
  revenue: {
    salesRevenue: { current: 3842680, previous: 3125450, label: 'Sales Revenue' },
    serviceRevenue: { current: 1234500, previous: 982340, label: 'Service Revenue' },
    otherIncome: { current: 156450, previous: 123890, label: 'Other Income' },
    total: { current: 5233630, previous: 4231680, label: 'Total Revenue' }
  },
  costOfSales: {
    cogs: { current: 1856340, previous: 1523680, label: 'Cost of Goods Sold' },
    directLabor: { current: 456780, previous: 398450, label: 'Direct Labor' },
    total: { current: 2313120, previous: 1922130, label: 'Total Cost of Sales' }
  },
  grossProfit: { current: 2920510, previous: 2309550, label: 'Gross Profit' },
  operatingExpenses: {
    salariesWages: { current: 842500, previous: 745680, label: 'Salaries & Wages' },
    rentExpense: { current: 102000, previous: 102000, label: 'Rent Expense' },
    utilitiesExpense: { current: 34280, previous: 31450, label: 'Utilities Expense' },
    marketingExpense: { current: 156800, previous: 134560, label: 'Marketing & Advertising' },
    insuranceExpense: { current: 45600, previous: 45600, label: 'Insurance' },
    depreciationExpense: { current: 89340, previous: 85230, label: 'Depreciation' },
    otherExpenses: { current: 98450, previous: 89670, label: 'Other Operating Expenses' },
    total: { current: 1368970, previous: 1234190, label: 'Total Operating Expenses' }
  },
  operatingProfit: { current: 1551540, previous: 1075360, label: 'Operating Profit (EBIT)' },
  otherIncomeExpenses: {
    interestIncome: { current: 12450, previous: 9850, label: 'Interest Income' },
    interestExpense: { current: -23680, previous: -28450, label: 'Interest Expense' },
    total: { current: -11230, previous: -18600, label: 'Net Other Income/(Expense)' }
  },
  profitBeforeTax: { current: 1540310, previous: 1056760, label: 'Profit Before Tax' },
  incomeTax: { current: 294630, previous: 201785, label: 'Income Tax (19%)' },
  netProfit: { current: 1245680, previous: 854975, label: 'Net Profit' }
})

// Balance Sheet Data
const balanceSheetData = ref({
  assets: {
    currentAssets: {
      cash: { current: 722830, previous: 598450, label: 'Cash and Cash Equivalents' },
      accountsReceivable: { current: 456200, previous: 389670, label: 'Accounts Receivable' },
      inventory: { current: 384500, previous: 312890, label: 'Inventory' },
      prepaidExpenses: { current: 45600, previous: 38920, label: 'Prepaid Expenses' },
      total: { current: 1609130, previous: 1339930, label: 'Total Current Assets' }
    },
    fixedAssets: {
      ppe: { current: 1450000, previous: 1450000, label: 'Property, Plant & Equipment' },
      accumulatedDepreciation: { current: -204400, previous: -115060, label: 'Accumulated Depreciation' },
      netPPE: { current: 1245600, previous: 1334940, label: 'Net PP&E' },
      intangibleAssets: { current: 125400, previous: 98750, label: 'Intangible Assets' },
      total: { current: 1371000, previous: 1433690, label: 'Total Fixed Assets' }
    },
    otherAssets: {
      investments: { current: 829000, previous: 645380, label: 'Long-term Investments' },
      total: { current: 829000, previous: 645380, label: 'Total Other Assets' }
    },
    totalAssets: { current: 3809130, previous: 3419000, label: 'Total Assets' }
  },
  liabilities: {
    currentLiabilities: {
      accountsPayable: { current: 298450, previous: 256780, label: 'Accounts Payable' },
      shortTermLoans: { current: 125000, previous: 150000, label: 'Short-term Loans' },
      accruedExpenses: { current: 89340, previous: 76540, label: 'Accrued Expenses' },
      total: { current: 512790, previous: 483320, label: 'Total Current Liabilities' }
    },
    longTermLiabilities: {
      longTermDebt: { current: 340110, previous: 425600, label: 'Long-term Debt' },
      deferredTax: { current: 45000, previous: 38920, label: 'Deferred Tax Liabilities' },
      total: { current: 385110, previous: 464520, label: 'Total Long-term Liabilities' }
    },
    totalLiabilities: { current: 897900, previous: 947840, label: 'Total Liabilities' }
  },
  equity: {
    ownersEquity: { current: 2500000, previous: 2500000, label: 'Owner\'s Capital' },
    retainedEarnings: { current: 411230, previous: -28840, label: 'Retained Earnings' },
    totalEquity: { current: 2911230, previous: 2471160, label: 'Total Equity' }
  },
  totalLiabilitiesEquity: { current: 3809130, previous: 3419000, label: 'Total Liabilities & Equity' }
})

// Cash Flow Statement Data
const cashFlowStatementData = ref({
  operatingActivities: {
    netProfit: { current: 1245680, previous: 854975, label: 'Net Profit' },
    adjustments: {
      depreciation: { current: 89340, previous: 85230, label: 'Depreciation & Amortization' },
      accountsReceivable: { current: -66530, previous: -45680, label: 'Change in Accounts Receivable' },
      inventory: { current: -71610, previous: -38920, label: 'Change in Inventory' },
      accountsPayable: { current: 41670, previous: 32450, label: 'Change in Accounts Payable' },
      accruedExpenses: { current: 12800, previous: 8750, label: 'Change in Accrued Expenses' }
    },
    total: { current: 1251350, previous: 896805, label: 'Net Cash from Operating Activities' }
  },
  investingActivities: {
    purchasePPE: { current: 0, previous: -345000, label: 'Purchase of PP&E' },
    investments: { current: -183620, previous: -125450, label: 'Purchase of Investments' },
    intangibleAssets: { current: -26650, previous: -45600, label: 'Acquisition of Intangible Assets' },
    total: { current: -210270, previous: -516050, label: 'Net Cash from Investing Activities' }
  },
  financingActivities: {
    loanRepayment: { current: -110490, previous: -89340, label: 'Loan Repayment' },
    dividendsPaid: { current: -806210, previous: -125600, label: 'Dividends Paid' },
    total: { current: -916700, previous: -214940, label: 'Net Cash from Financing Activities' }
  },
  netCashChange: { current: 124380, previous: 165815, label: 'Net Increase/(Decrease) in Cash' },
  beginningCash: { current: 598450, previous: 432635, label: 'Cash at Beginning of Period' },
  endingCash: { current: 722830, previous: 598450, label: 'Cash at End of Period' }
})

// Financial Ratios
const financialRatios = ref([
  {
    category: 'Profitability Ratios',
    ratios: [
      { name: 'Gross Profit Margin', value: '55.8%', previous: '54.6%', change: '+1.2%', isPositive: true },
      { name: 'Operating Profit Margin', value: '29.7%', previous: '25.4%', change: '+4.3%', isPositive: true },
      { name: 'Net Profit Margin', value: '23.8%', previous: '20.2%', change: '+3.6%', isPositive: true },
      { name: 'Return on Assets (ROA)', value: '32.7%', previous: '25.0%', change: '+7.7%', isPositive: true },
      { name: 'Return on Equity (ROE)', value: '42.8%', previous: '34.6%', change: '+8.2%', isPositive: true }
    ]
  },
  {
    category: 'Liquidity Ratios',
    ratios: [
      { name: 'Current Ratio', value: '3.14', previous: '2.77', change: '+0.37', isPositive: true },
      { name: 'Quick Ratio', value: '2.39', previous: '2.12', change: '+0.27', isPositive: true },
      { name: 'Cash Ratio', value: '1.41', previous: '1.24', change: '+0.17', isPositive: true }
    ]
  },
  {
    category: 'Efficiency Ratios',
    ratios: [
      { name: 'Asset Turnover', value: '1.37', previous: '1.24', change: '+0.13', isPositive: true },
      { name: 'Inventory Turnover', value: '4.83', previous: '4.87', change: '-0.04', isPositive: false },
      { name: 'Receivables Turnover', value: '11.47', previous: '10.89', change: '+0.58', isPositive: true }
    ]
  },
  {
    category: 'Leverage Ratios',
    ratios: [
      { name: 'Debt to Assets', value: '23.6%', previous: '27.7%', change: '-4.1%', isPositive: true },
      { name: 'Debt to Equity', value: '30.8%', previous: '38.4%', change: '-7.6%', isPositive: true },
      { name: 'Interest Coverage', value: '65.5x', previous: '37.8x', change: '+27.7x', isPositive: true }
    ]
  }
])

// Revenue Trend Chart
const revenueTrendSeries = ref([
  {
    name: 'Revenue',
    data: [3245, 3420, 3680, 3850, 4020, 4250, 4480, 4620, 4850, 5050, 5180, 5234]
  },
  {
    name: 'Net Profit',
    data: [645, 720, 805, 890, 920, 985, 1050, 1105, 1145, 1180, 1220, 1246]
  }
])

const revenueTrendOptions = ref({
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false }
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
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    title: { text: 'Amount ($K)' },
    labels: {
      formatter: (val: number) => `$${val}K`
    }
  },
  colors: ['#3b82f6', '#22c55e'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  }
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function calculateChange(current: number, previous: number): { percentage: string, isPositive: boolean } {
  const change = ((current - previous) / previous) * 100
  return {
    percentage: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    isPositive: change >= 0
  }
}

function getChangeColor(isPositive: boolean): string {
  return isPositive ? 'text-green-600' : 'text-red-600'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p class="text-muted-foreground mt-1">Comprehensive financial statements and analysis</p>
      </div>
      <div class="flex gap-2">
        <Select v-model="selectedPeriod">
          <SelectTrigger class="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="selectedQuarter">
          <SelectTrigger class="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Q1">Q1</SelectItem>
            <SelectItem value="Q2">Q2</SelectItem>
            <SelectItem value="Q3">Q3</SelectItem>
            <SelectItem value="Q4">Q4</SelectItem>
            <SelectItem value="Full Year">Full Year</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Printer class="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Share2 class="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in quickStats" :key="stat.title" class="hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center mt-2">
            <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                       :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
            <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-xs font-medium']">
              {{ stat.change }}
            </span>
            <span class="text-xs text-muted-foreground ml-2">vs last year</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Revenue Trend -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Revenue & Profit Trend</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <VueApexCharts
            type="area"
            height="300"
            :options="revenueTrendOptions"
            :series="revenueTrendSeries"
        />
      </CardContent>
    </Card>

    <!-- Financial Statements Tabs -->
    <Tabs default-value="profit-loss" class="space-y-4">
      <TabsList class="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="profit-loss">
          <FileText class="h-4 w-4 mr-2" />
          P&L Statement
        </TabsTrigger>
        <TabsTrigger value="balance-sheet">
          <BarChart3 class="h-4 w-4 mr-2" />
          Balance Sheet
        </TabsTrigger>
        <TabsTrigger value="cash-flow">
          <DollarSign class="h-4 w-4 mr-2" />
          Cash Flow
        </TabsTrigger>
        <TabsTrigger value="ratios">
          <PieChart class="h-4 w-4 mr-2" />
          Financial Ratios
        </TabsTrigger>
      </TabsList>

      <!-- Profit & Loss Statement Tab -->
      <TabsContent value="profit-loss">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>Income statement for the period ending Dec 31, {{ selectedPeriod }}</CardDescription>
              </div>
              <Badge variant="outline" class="bg-blue-50 text-blue-700 border-blue-200">
                Comparative Analysis
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg overflow-hidden">
              <!-- Header -->
              <div class="bg-gray-50 border-b">
                <div class="flex items-center p-3 font-semibold text-sm">
                  <div class="flex-1">Account</div>
                  <div class="w-40 text-right">{{ selectedPeriod }}</div>
                  <div class="w-40 text-right">{{ comparisonPeriod }}</div>
                  <div class="w-32 text-right">Change</div>
                </div>
              </div>

              <!-- Revenue Section -->
              <div class="border-b">
                <div class="bg-blue-50 p-3 font-semibold text-sm text-blue-700">
                  Revenue
                </div>
                <div v-for="(item, key) in profitLossData.revenue" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-blue-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Cost of Sales Section -->
              <div class="border-b">
                <div class="bg-red-50 p-3 font-semibold text-sm text-red-700">
                  Cost of Sales
                </div>
                <div v-for="(item, key) in profitLossData.costOfSales" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-red-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Gross Profit -->
              <div class="border-b bg-green-100">
                <div class="flex items-center p-3 font-bold">
                  <div class="flex-1 text-sm text-green-800">
                    {{ profitLossData.grossProfit.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-green-800">
                    {{ formatCurrency(profitLossData.grossProfit.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-green-700">
                    {{ formatCurrency(profitLossData.grossProfit.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-green-800">
                    {{ calculateChange(profitLossData.grossProfit.current, profitLossData.grossProfit.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Operating Expenses Section -->
              <div class="border-b">
                <div class="bg-orange-50 p-3 font-semibold text-sm text-orange-700">
                  Operating Expenses
                </div>
                <div v-for="(item, key) in profitLossData.operatingExpenses" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-orange-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Operating Profit -->
              <div class="border-b bg-purple-100">
                <div class="flex items-center p-3 font-bold">
                  <div class="flex-1 text-sm text-purple-800">
                    {{ profitLossData.operatingProfit.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-purple-800">
                    {{ formatCurrency(profitLossData.operatingProfit.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-purple-700">
                    {{ formatCurrency(profitLossData.operatingProfit.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-purple-800">
                    {{ calculateChange(profitLossData.operatingProfit.current, profitLossData.operatingProfit.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Other Income/Expenses -->
              <div class="border-b">
                <div class="bg-gray-50 p-3 font-semibold text-sm">
                  Other Income/(Expenses)
                </div>
                <div v-for="(item, key) in profitLossData.otherIncomeExpenses" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-gray-100 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Profit Before Tax -->
              <div class="border-b bg-yellow-100">
                <div class="flex items-center p-3 font-bold">
                  <div class="flex-1 text-sm text-yellow-800">
                    {{ profitLossData.profitBeforeTax.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-yellow-800">
                    {{ formatCurrency(profitLossData.profitBeforeTax.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-yellow-700">
                    {{ formatCurrency(profitLossData.profitBeforeTax.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-yellow-800">
                    {{ calculateChange(profitLossData.profitBeforeTax.current, profitLossData.profitBeforeTax.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Income Tax -->
              <div class="border-b">
                <div class="flex items-center p-3 hover:bg-gray-50">
                  <div class="flex-1 text-sm pl-4">
                    {{ profitLossData.incomeTax.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(profitLossData.incomeTax.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(profitLossData.incomeTax.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(profitLossData.incomeTax.current, profitLossData.incomeTax.previous).isPositive)">
                    {{ calculateChange(profitLossData.incomeTax.current, profitLossData.incomeTax.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Net Profit -->
              <div class="bg-green-200 border-t-2 border-green-400">
                <div class="flex items-center p-4 font-bold">
                  <div class="flex-1 text-base text-green-900">
                    {{ profitLossData.netProfit.label }}
                  </div>
                  <div class="w-40 text-right text-base text-green-900">
                    {{ formatCurrency(profitLossData.netProfit.current) }}
                  </div>
                  <div class="w-40 text-right text-base text-green-800">
                    {{ formatCurrency(profitLossData.netProfit.previous) }}
                  </div>
                  <div class="w-32 text-right text-base text-green-900">
                    {{ calculateChange(profitLossData.netProfit.current, profitLossData.netProfit.previous).percentage }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Balance Sheet Tab -->
      <TabsContent value="balance-sheet">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>Statement of financial position as of Dec 31, {{ selectedPeriod }}</CardDescription>
              </div>
              <Badge variant="outline" class="bg-purple-50 text-purple-700 border-purple-200">
                Year-over-Year Comparison
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg overflow-hidden">
              <!-- Header -->
              <div class="bg-gray-50 border-b">
                <div class="flex items-center p-3 font-semibold text-sm">
                  <div class="flex-1">Account</div>
                  <div class="w-40 text-right">{{ selectedPeriod }}</div>
                  <div class="w-40 text-right">{{ comparisonPeriod }}</div>
                  <div class="w-32 text-right">Change</div>
                </div>
              </div>

              <!-- ASSETS -->
              <div class="bg-blue-100 p-3 font-bold text-blue-900 border-b">
                ASSETS
              </div>

              <!-- Current Assets -->
              <div class="border-b">
                <div class="bg-blue-50 p-3 font-semibold text-sm text-blue-700">
                  Current Assets
                </div>
                <div v-for="(item, key) in balanceSheetData.assets.currentAssets" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-blue-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Fixed Assets -->
              <div class="border-b">
                <div class="bg-blue-50 p-3 font-semibold text-sm text-blue-700">
                  Fixed Assets
                </div>
                <div v-for="(item, key) in balanceSheetData.assets.fixedAssets" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-blue-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Other Assets -->
              <div class="border-b">
                <div class="bg-blue-50 p-3 font-semibold text-sm text-blue-700">
                  Other Assets
                </div>
                <div v-for="(item, key) in balanceSheetData.assets.otherAssets" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-blue-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Total Assets -->
              <div class="bg-blue-200 border-b border-t-2 border-blue-400">
                <div class="flex items-center p-3 font-bold">
                  <div class="flex-1 text-sm text-blue-900">
                    {{ balanceSheetData.assets.totalAssets.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-blue-900">
                    {{ formatCurrency(balanceSheetData.assets.totalAssets.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-blue-800">
                    {{ formatCurrency(balanceSheetData.assets.totalAssets.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-blue-900">
                    {{ calculateChange(balanceSheetData.assets.totalAssets.current, balanceSheetData.assets.totalAssets.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- LIABILITIES -->
              <div class="bg-red-100 p-3 font-bold text-red-900 border-b mt-4">
                LIABILITIES
              </div>

              <!-- Current Liabilities -->
              <div class="border-b">
                <div class="bg-red-50 p-3 font-semibold text-sm text-red-700">
                  Current Liabilities
                </div>
                <div v-for="(item, key) in balanceSheetData.liabilities.currentLiabilities" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-red-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Long-term Liabilities -->
              <div class="border-b">
                <div class="bg-red-50 p-3 font-semibold text-sm text-red-700">
                  Long-term Liabilities
                </div>
                <div v-for="(item, key) in balanceSheetData.liabilities.longTermLiabilities" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-red-50 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Total Liabilities -->
              <div class="bg-red-200 border-b border-t-2 border-red-400">
                <div class="flex items-center p-3 font-bold">
                  <div class="flex-1 text-sm text-red-900">
                    {{ balanceSheetData.liabilities.totalLiabilities.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-red-900">
                    {{ formatCurrency(balanceSheetData.liabilities.totalLiabilities.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-red-800">
                    {{ formatCurrency(balanceSheetData.liabilities.totalLiabilities.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-red-900">
                    {{ calculateChange(balanceSheetData.liabilities.totalLiabilities.current, balanceSheetData.liabilities.totalLiabilities.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- EQUITY -->
              <div class="bg-green-100 p-3 font-bold text-green-900 border-b mt-4">
                EQUITY
              </div>

              <!-- Equity Items -->
              <div class="border-b">
                <div v-for="(item, key) in balanceSheetData.equity" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'totalEquity' ? 'bg-green-100 font-bold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'totalEquity' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Total Liabilities & Equity -->
              <div class="bg-gray-200 border-t-2 border-gray-400">
                <div class="flex items-center p-4 font-bold">
                  <div class="flex-1 text-base text-gray-900">
                    {{ balanceSheetData.totalLiabilitiesEquity.label }}
                  </div>
                  <div class="w-40 text-right text-base text-gray-900">
                    {{ formatCurrency(balanceSheetData.totalLiabilitiesEquity.current) }}
                  </div>
                  <div class="w-40 text-right text-base text-gray-800">
                    {{ formatCurrency(balanceSheetData.totalLiabilitiesEquity.previous) }}
                  </div>
                  <div class="w-32 text-right text-base text-gray-900">
                    {{ calculateChange(balanceSheetData.totalLiabilitiesEquity.current, balanceSheetData.totalLiabilitiesEquity.previous).percentage }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Cash Flow Statement Tab -->
      <TabsContent value="cash-flow">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Cash Flow Statement</CardTitle>
                <CardDescription>Statement of cash flows for the year ended Dec 31, {{ selectedPeriod }}</CardDescription>
              </div>
              <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200">
                Direct Method
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="border rounded-lg overflow-hidden">
              <!-- Header -->
              <div class="bg-gray-50 border-b">
                <div class="flex items-center p-3 font-semibold text-sm">
                  <div class="flex-1">Activity</div>
                  <div class="w-40 text-right">{{ selectedPeriod }}</div>
                  <div class="w-40 text-right">{{ comparisonPeriod }}</div>
                  <div class="w-32 text-right">Change</div>
                </div>
              </div>

              <!-- Operating Activities -->
              <div class="border-b">
                <div class="bg-green-50 p-3 font-semibold text-sm text-green-700">
                  Cash Flows from Operating Activities
                </div>
                <div class="flex items-center p-3 hover:bg-gray-50">
                  <div class="flex-1 text-sm pl-4">
                    {{ cashFlowStatementData.operatingActivities.netProfit.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(cashFlowStatementData.operatingActivities.netProfit.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(cashFlowStatementData.operatingActivities.netProfit.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium text-green-600">
                    {{ calculateChange(cashFlowStatementData.operatingActivities.netProfit.current, cashFlowStatementData.operatingActivities.netProfit.previous).percentage }}
                  </div>
                </div>
                <div class="pl-4 text-xs text-muted-foreground p-2 bg-gray-50">
                  Adjustments for non-cash items:
                </div>
                <div v-for="(item, key) in cashFlowStatementData.operatingActivities.adjustments" :key="key"
                     class="flex items-center p-3 hover:bg-gray-50">
                  <div class="flex-1 text-sm pl-8">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
                <div class="flex items-center p-3 bg-green-100 font-semibold border-t-2">
                  <div class="flex-1 text-sm">
                    {{ cashFlowStatementData.operatingActivities.total.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-green-700">
                    {{ formatCurrency(cashFlowStatementData.operatingActivities.total.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-green-600">
                    {{ formatCurrency(cashFlowStatementData.operatingActivities.total.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-green-700">
                    {{ calculateChange(cashFlowStatementData.operatingActivities.total.current, cashFlowStatementData.operatingActivities.total.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Investing Activities -->
              <div class="border-b">
                <div class="bg-blue-50 p-3 font-semibold text-sm text-blue-700">
                  Cash Flows from Investing Activities
                </div>
                <div v-for="(item, key) in cashFlowStatementData.investingActivities" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-blue-100 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="key === 'total' ? 'text-blue-700' : getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Financing Activities -->
              <div class="border-b">
                <div class="bg-purple-50 p-3 font-semibold text-sm text-purple-700">
                  Cash Flows from Financing Activities
                </div>
                <div v-for="(item, key) in cashFlowStatementData.financingActivities" :key="key"
                     :class="[
                       'flex items-center p-3',
                       key === 'total' ? 'bg-purple-100 font-semibold border-t-2' : 'hover:bg-gray-50'
                     ]">
                  <div class="flex-1 text-sm" :class="key === 'total' ? '' : 'pl-4'">
                    {{ item.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(item.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(item.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium"
                       :class="key === 'total' ? 'text-purple-700' : getChangeColor(calculateChange(item.current, item.previous).isPositive)">
                    {{ calculateChange(item.current, item.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Net Cash Change -->
              <div class="bg-yellow-100 border-b">
                <div class="flex items-center p-3 font-bold">
                  <div class="flex-1 text-sm text-yellow-900">
                    {{ cashFlowStatementData.netCashChange.label }}
                  </div>
                  <div class="w-40 text-right text-sm text-yellow-900">
                    {{ formatCurrency(cashFlowStatementData.netCashChange.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-yellow-800">
                    {{ formatCurrency(cashFlowStatementData.netCashChange.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm text-yellow-900">
                    {{ calculateChange(cashFlowStatementData.netCashChange.current, cashFlowStatementData.netCashChange.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Beginning & Ending Cash -->
              <div class="border-b">
                <div class="flex items-center p-3 hover:bg-gray-50">
                  <div class="flex-1 text-sm">
                    {{ cashFlowStatementData.beginningCash.label }}
                  </div>
                  <div class="w-40 text-right text-sm font-semibold">
                    {{ formatCurrency(cashFlowStatementData.beginningCash.current) }}
                  </div>
                  <div class="w-40 text-right text-sm text-muted-foreground">
                    {{ formatCurrency(cashFlowStatementData.beginningCash.previous) }}
                  </div>
                  <div class="w-32 text-right text-sm font-medium text-green-600">
                    {{ calculateChange(cashFlowStatementData.beginningCash.current, cashFlowStatementData.beginningCash.previous).percentage }}
                  </div>
                </div>
              </div>

              <!-- Ending Cash -->
              <div class="bg-green-200 border-t-2 border-green-400">
                <div class="flex items-center p-4 font-bold">
                  <div class="flex-1 text-base text-green-900">
                    {{ cashFlowStatementData.endingCash.label }}
                  </div>
                  <div class="w-40 text-right text-base text-green-900">
                    {{ formatCurrency(cashFlowStatementData.endingCash.current) }}
                  </div>
                  <div class="w-40 text-right text-base text-green-800">
                    {{ formatCurrency(cashFlowStatementData.endingCash.previous) }}
                  </div>
                  <div class="w-32 text-right text-base text-green-900">
                    {{ calculateChange(cashFlowStatementData.endingCash.current, cashFlowStatementData.endingCash.previous).percentage }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Financial Ratios Tab -->
      <TabsContent value="ratios">
        <div class="grid gap-4">
          <Card v-for="ratioGroup in financialRatios" :key="ratioGroup.category">
            <CardHeader>
              <CardTitle class="text-lg">{{ ratioGroup.category }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div v-for="ratio in ratioGroup.ratios" :key="ratio.name"
                     class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ ratio.name }}</div>
                    <div class="text-xs text-muted-foreground mt-1">
                      Previous: {{ ratio.previous }}
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <div class="text-lg font-bold">{{ ratio.value }}</div>
                      <div class="flex items-center gap-1 text-xs"
                           :class="ratio.isPositive ? 'text-green-600' : 'text-red-600'">
                        <component :is="ratio.isPositive ? ArrowUpRight : ArrowDownRight" class="h-3 w-3" />
                        <span class="font-medium">{{ ratio.change }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
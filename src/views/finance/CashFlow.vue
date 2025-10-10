<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Progress } from '@/components/ui/progress'
import VueApexCharts from 'vue3-apexcharts'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Plus,
  Search,
  MoreVertical,
  Wallet,
  CreditCard,
  Building,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-vue-next'

// Cash Flow Summary Stats
const cashFlowStats = ref([
  {
    title: 'Opening Balance',
    value: '$485,200',
    period: 'Oct 1, 2025',
    icon: Wallet,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Total Inflows',
    value: '$892,450',
    change: '+18.5%',
    isPositive: true,
    icon: ArrowUpRight,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Total Outflows',
    value: '$654,820',
    change: '+12.3%',
    isPositive: false,
    icon: ArrowDownRight,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Closing Balance',
    value: '$722,830',
    change: '+48.9%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-600'
  }
])

// Cash Flow Trend Chart
const cashFlowSeries = ref([
  {
    name: 'Cash Inflow',
    data: [125, 145, 132, 158, 142, 165, 178, 154, 189, 195, 182, 205]
  },
  {
    name: 'Cash Outflow',
    data: [85, 92, 88, 95, 102, 98, 115, 108, 122, 118, 125, 132]
  },
  {
    name: 'Net Cash Flow',
    data: [40, 53, 44, 63, 40, 67, 63, 46, 67, 77, 57, 73]
  }
])

const cashFlowOptions = ref({
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: true }
  },
  stroke: {
    curve: 'smooth',
    width: [3, 3, 2],
    dashArray: [0, 0, 5]
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
  colors: ['#22c55e', '#ef4444', '#3b82f6'],
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

// Cash Flow by Category (Inflows)
const inflowCategories = ref([
  {
    category: 'Product Sales',
    amount: '$456,200',
    percentage: 51.1,
    change: '+22.5%',
    color: 'bg-green-600',
    transactions: 1248
  },
  {
    category: 'Service Revenue',
    amount: '$234,800',
    percentage: 26.3,
    change: '+18.3%',
    color: 'bg-blue-600',
    transactions: 456
  },
  {
    category: 'Investment Income',
    amount: '$125,450',
    percentage: 14.1,
    change: '+8.7%',
    color: 'bg-purple-600',
    transactions: 34
  },
  {
    category: 'Other Income',
    amount: '$76,000',
    percentage: 8.5,
    change: '+15.2%',
    color: 'bg-yellow-600',
    transactions: 89
  }
])

// Cash Flow by Category (Outflows)
const outflowCategories = ref([
  {
    category: 'Operating Expenses',
    amount: '$245,680',
    percentage: 37.5,
    change: '+8.5%',
    color: 'bg-red-600',
    transactions: 892
  },
  {
    category: 'Salaries & Wages',
    amount: '$198,400',
    percentage: 30.3,
    change: '+5.2%',
    color: 'bg-orange-600',
    transactions: 248
  },
  {
    category: 'Supplier Payments',
    amount: '$142,320',
    percentage: 21.7,
    change: '+12.8%',
    color: 'bg-pink-600',
    transactions: 456
  },
  {
    category: 'Loan Repayments',
    amount: '$45,220',
    percentage: 6.9,
    change: '+2.1%',
    color: 'bg-gray-600',
    transactions: 12
  },
  {
    category: 'Other Expenses',
    amount: '$23,200',
    percentage: 3.6,
    change: '+6.3%',
    color: 'bg-slate-600',
    transactions: 134
  }
])

// Recent Transactions
const recentTransactions = ref([
  {
    id: 'CF-2025-1245',
    type: 'inflow',
    category: 'Product Sales',
    description: 'Payment from Tech Solutions Inc',
    amount: '$25,450',
    date: '2025-10-11',
    time: '14:32',
    status: 'Completed',
    method: 'Bank Transfer',
    reference: 'INV-2845'
  },
  {
    id: 'CF-2025-1244',
    type: 'outflow',
    category: 'Operating Expenses',
    description: 'Office Rent Payment',
    amount: '$8,500',
    date: '2025-10-11',
    time: '10:15',
    status: 'Completed',
    method: 'Bank Transfer',
    reference: 'EXP-1234'
  },
  {
    id: 'CF-2025-1243',
    type: 'inflow',
    category: 'Service Revenue',
    description: 'Consulting Services - Q4',
    amount: '$18,900',
    date: '2025-10-10',
    time: '16:45',
    status: 'Completed',
    method: 'Wire Transfer',
    reference: 'INV-2844'
  },
  {
    id: 'CF-2025-1242',
    type: 'outflow',
    category: 'Salaries & Wages',
    description: 'Monthly Payroll',
    amount: '$45,200',
    date: '2025-10-10',
    time: '09:00',
    status: 'Completed',
    method: 'Payroll System',
    reference: 'PAY-1023'
  },
  {
    id: 'CF-2025-1241',
    type: 'inflow',
    category: 'Product Sales',
    description: 'Payment from Global Retail Corp',
    amount: '$32,800',
    date: '2025-10-09',
    time: '13:20',
    status: 'Completed',
    method: 'Credit Card',
    reference: 'INV-2843'
  },
  {
    id: 'CF-2025-1240',
    type: 'outflow',
    category: 'Supplier Payments',
    description: 'Raw Materials Purchase',
    amount: '$15,600',
    date: '2025-10-09',
    time: '11:30',
    status: 'Completed',
    method: 'Bank Transfer',
    reference: 'PO-1842'
  },
  {
    id: 'CF-2025-1239',
    type: 'inflow',
    category: 'Investment Income',
    description: 'Dividend Payment',
    amount: '$12,500',
    date: '2025-10-08',
    time: '15:00',
    status: 'Completed',
    method: 'Bank Transfer',
    reference: 'DIV-089'
  },
  {
    id: 'CF-2025-1238',
    type: 'outflow',
    category: 'Other Expenses',
    description: 'Marketing Campaign',
    amount: '$8,900',
    date: '2025-10-08',
    time: '10:45',
    status: 'Pending',
    method: 'Credit Card',
    reference: 'MKT-456'
  }
])

// Cash Flow Forecast
const forecastData = ref([
  { month: 'Nov 2025', projected: 238, actual: null, confidence: 'High' },
  { month: 'Dec 2025', projected: 245, actual: null, confidence: 'High' },
  { month: 'Jan 2026', projected: 228, actual: null, confidence: 'Medium' },
  { month: 'Feb 2026', projected: 252, actual: null, confidence: 'Medium' },
  { month: 'Mar 2026', projected: 268, actual: null, confidence: 'Low' }
])

// Bank Accounts
const bankAccounts = ref([
  {
    name: 'Main Operating Account',
    bank: 'Chase Bank',
    accountNumber: '****4521',
    balance: '$485,200',
    type: 'Checking',
    status: 'Active'
  },
  {
    name: 'Savings Account',
    bank: 'Bank of America',
    accountNumber: '****7832',
    balance: '$156,400',
    type: 'Savings',
    status: 'Active'
  },
  {
    name: 'Payroll Account',
    bank: 'Wells Fargo',
    accountNumber: '****2156',
    balance: '$81,230',
    type: 'Checking',
    status: 'Active'
  }
])

// Filters
const selectedPeriod = ref('This Month')
const selectedType = ref('All')
const searchQuery = ref('')
const showAddTransaction = ref(false)

function getTransactionColor(type: string) {
  return type === 'inflow' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Failed': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getConfidenceColor(confidence: string) {
  switch (confidence) {
    case 'High': return 'text-green-600'
    case 'Medium': return 'text-yellow-600'
    case 'Low': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function formatAmount(amount: string) {
  return amount
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Cash Flow Management</h1>
        <p class="text-muted-foreground mt-1">Track and analyze your cash inflows and outflows</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <Calendar class="h-4 w-4 mr-2" />
          {{ selectedPeriod }}
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
        <Sheet v-model:open="showAddTransaction">
          <SheetTrigger as-child>
            <Button size="sm">
              <Plus class="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Cash Flow Transaction</SheetTitle>
              <SheetDescription>
                Record a new cash inflow or outflow transaction
              </SheetDescription>
            </SheetHeader>
            <div class="space-y-4 mt-6">
              <div class="space-y-2">
                <Label>Transaction Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inflow">Cash Inflow</SelectItem>
                    <SelectItem value="outflow">Cash Outflow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Product Sales</SelectItem>
                    <SelectItem value="service">Service Revenue</SelectItem>
                    <SelectItem value="investment">Investment Income</SelectItem>
                    <SelectItem value="other">Other Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div class="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Enter description" />
              </div>
              <div class="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div class="space-y-2">
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="wire">Wire Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label>Reference Number</Label>
                <Input placeholder="Enter reference" />
              </div>
              <div class="flex gap-2 pt-4">
                <Button class="flex-1">Save Transaction</Button>
                <Button variant="outline" class="flex-1" @click="showAddTransaction = false">
                  Cancel
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in cashFlowStats" :key="stat.title" class="relative hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <div v-if="stat.change" class="flex items-center justify-between mt-2">
            <div class="flex items-center">
              <component :is="stat.isPositive ? TrendingUp : TrendingDown"
                         :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
              <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-xs font-medium']">
                {{ stat.change }}
              </span>
            </div>
            <span class="text-xs text-muted-foreground">vs last month</span>
          </div>
          <div v-else class="text-xs text-muted-foreground mt-2">{{ stat.period }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Cash Flow Trend -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Cash Flow Trend</CardTitle>
            <CardDescription>Monthly cash inflows and outflows over time</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <VueApexCharts
            type="line"
            height="350"
            :options="cashFlowOptions"
            :series="cashFlowSeries"
        />
      </CardContent>
    </Card>

    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Cash Inflows by Category -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Cash Inflows by Category</CardTitle>
              <CardDescription>Breakdown of incoming cash</CardDescription>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600">$892,450</div>
              <div class="text-xs text-muted-foreground">Total Inflows</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="category in inflowCategories" :key="category.category" class="space-y-2">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <div :class="[category.color, 'w-3 h-3 rounded-full']"></div>
                    <div class="font-medium text-sm">{{ category.category }}</div>
                  </div>
                  <div class="text-xs text-muted-foreground ml-5">
                    {{ category.transactions }} transactions
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold">{{ category.amount }}</div>
                  <div class="text-xs text-green-600">{{ category.change }}</div>
                </div>
              </div>
              <Progress :model-value="category.percentage" class="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Cash Outflows by Category -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Cash Outflows by Category</CardTitle>
              <CardDescription>Breakdown of outgoing cash</CardDescription>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-red-600">$654,820</div>
              <div class="text-xs text-muted-foreground">Total Outflows</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="category in outflowCategories" :key="category.category" class="space-y-2">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <div :class="[category.color, 'w-3 h-3 rounded-full']"></div>
                    <div class="font-medium text-sm">{{ category.category }}</div>
                  </div>
                  <div class="text-xs text-muted-foreground ml-5">
                    {{ category.transactions }} transactions
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold">{{ category.amount }}</div>
                  <div class="text-xs text-red-600">{{ category.change }}</div>
                </div>
              </div>
              <Progress :model-value="category.percentage" class="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Bank Accounts & Forecast -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Bank Accounts -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>Connected accounts and balances</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus class="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="account in bankAccounts" :key="account.accountNumber"
                 class="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-4 flex-1">
                <div class="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <Building class="h-5 w-5" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ account.name }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ account.bank }} • {{ account.accountNumber }}
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <Badge variant="outline" class="text-xs">{{ account.type }}</Badge>
                    <Badge :class="getStatusColor(account.status)" class="border-0 text-xs">
                      {{ account.status }}
                    </Badge>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold">{{ account.balance }}</div>
                <Button variant="ghost" size="sm" class="mt-2">
                  <Eye class="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
          <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-blue-700">Total Cash on Hand</div>
                <div class="text-xs text-blue-600">Across all accounts</div>
              </div>
              <div class="text-2xl font-bold text-blue-700">$722,830</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Cash Flow Forecast -->
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Forecast</CardTitle>
          <CardDescription>Projected net cash flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="forecast in forecastData" :key="forecast.month"
                 class="p-3 rounded-lg border">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-medium text-sm">{{ forecast.month }}</div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-muted-foreground">Confidence:</span>
                    <span :class="[getConfidenceColor(forecast.confidence), 'text-xs font-medium']">
                      {{ forecast.confidence }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold text-green-600">+${{ forecast.projected }}K</div>
                </div>
              </div>
              <Progress :model-value="75" class="h-1.5" />
            </div>
          </div>
          <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="text-sm font-medium text-green-700 mb-1">Avg. Monthly Projection</div>
            <div class="text-xl font-bold text-green-700">+$246K</div>
            <div class="text-xs text-green-600 mt-1">Next 5 months</div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Transactions -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest cash flow activities</CardDescription>
          </div>
          <div class="flex gap-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchQuery"
                  placeholder="Search transactions..."
                  class="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="transaction in recentTransactions" :key="transaction.id"
               class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3 flex-1">
              <div :class="[
                getTransactionColor(transaction.type),
                'p-2 rounded-lg'
              ]">
                <component :is="transaction.type === 'inflow' ? ArrowUpRight : ArrowDownRight"
                           class="h-4 w-4" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm">{{ transaction.description }}</span>
                  <Badge variant="outline" class="text-xs">{{ transaction.category }}</Badge>
                </div>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{{ transaction.id }}</span>
                  <span>•</span>
                  <span>{{ transaction.method }}</span>
                  <span>•</span>
                  <span>{{ transaction.reference }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div :class="[
                  'font-semibold text-sm',
                  transaction.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ transaction.type === 'inflow' ? '+' : '-' }}{{ transaction.amount }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ transaction.date }} • {{ transaction.time }}
                </div>
              </div>
              <Badge :class="getStatusColor(transaction.status)" class="border-0">
                {{ transaction.status }}
              </Badge>
              <Button variant="ghost" size="icon">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import VueApexCharts from 'vue3-apexcharts'
import {
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  BarChart3,
  ArrowUpDown
} from 'lucide-vue-next'

// General Ledger Summary Stats
const glStats = ref([
  {
    title: 'Total Accounts',
    value: '156',
    change: '+8',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Active Journal Entries',
    value: '2,845',
    change: '+245',
    icon: FileText,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Total Debit',
    value: '$4,856,420',
    change: '+12.5%',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Total Credit',
    value: '$4,856,420',
    change: '+12.5%',
    icon: DollarSign,
    color: 'bg-orange-100 text-orange-600'
  }
])

// Chart of Accounts
const chartOfAccounts = ref([
  {
    accountCode: '1000',
    accountName: 'Cash and Cash Equivalents',
    accountType: 'Asset',
    category: 'Current Assets',
    balance: '$722,830',
    debit: '$3,245,680',
    credit: '$2,522,850',
    status: 'Active',
    lastActivity: '2025-10-11'
  },
  {
    accountCode: '1100',
    accountName: 'Accounts Receivable',
    accountType: 'Asset',
    category: 'Current Assets',
    balance: '$456,200',
    debit: '$1,856,340',
    credit: '$1,400,140',
    status: 'Active',
    lastActivity: '2025-10-10'
  },
  {
    accountCode: '1200',
    accountName: 'Inventory',
    accountType: 'Asset',
    category: 'Current Assets',
    balance: '$384,500',
    debit: '$2,145,890',
    credit: '$1,761,390',
    status: 'Active',
    lastActivity: '2025-10-09'
  },
  {
    accountCode: '1500',
    accountName: 'Property, Plant & Equipment',
    accountType: 'Asset',
    category: 'Fixed Assets',
    balance: '$1,245,600',
    debit: '$1,450,000',
    credit: '$204,400',
    status: 'Active',
    lastActivity: '2025-10-08'
  },
  {
    accountCode: '2000',
    accountName: 'Accounts Payable',
    accountType: 'Liability',
    category: 'Current Liabilities',
    balance: '$298,450',
    debit: '$1,156,780',
    credit: '$1,455,230',
    status: 'Active',
    lastActivity: '2025-10-11'
  },
  {
    accountCode: '2100',
    accountName: 'Short-term Loans',
    accountType: 'Liability',
    category: 'Current Liabilities',
    balance: '$125,000',
    debit: '$50,000',
    credit: '$175,000',
    status: 'Active',
    lastActivity: '2025-10-07'
  },
  {
    accountCode: '3000',
    accountName: 'Owner\'s Equity',
    accountType: 'Equity',
    category: 'Capital',
    balance: '$2,500,000',
    debit: '$0',
    credit: '$2,500,000',
    status: 'Active',
    lastActivity: '2025-01-01'
  },
  {
    accountCode: '3100',
    accountName: 'Retained Earnings',
    accountType: 'Equity',
    category: 'Capital',
    balance: '$856,230',
    debit: '$145,600',
    credit: '$1,001,830',
    status: 'Active',
    lastActivity: '2025-10-10'
  },
  {
    accountCode: '4000',
    accountName: 'Sales Revenue',
    accountType: 'Revenue',
    category: 'Operating Revenue',
    balance: '$3,842,680',
    debit: '$156,450',
    credit: '$3,999,130',
    status: 'Active',
    lastActivity: '2025-10-11'
  },
  {
    accountCode: '4100',
    accountName: 'Service Revenue',
    accountType: 'Revenue',
    category: 'Operating Revenue',
    balance: '$1,234,500',
    debit: '$45,230',
    credit: '$1,279,730',
    status: 'Active',
    lastActivity: '2025-10-10'
  },
  {
    accountCode: '5000',
    accountName: 'Cost of Goods Sold',
    accountType: 'Expense',
    category: 'Direct Costs',
    balance: '$1,856,340',
    debit: '$1,945,680',
    credit: '$89,340',
    status: 'Active',
    lastActivity: '2025-10-11'
  },
  {
    accountCode: '6000',
    accountName: 'Salaries & Wages',
    accountType: 'Expense',
    category: 'Operating Expenses',
    balance: '$842,500',
    debit: '$842,500',
    credit: '$0',
    status: 'Active',
    lastActivity: '2025-10-10'
  },
  {
    accountCode: '6100',
    accountName: 'Rent Expense',
    accountType: 'Expense',
    category: 'Operating Expenses',
    balance: '$102,000',
    debit: '$102,000',
    credit: '$0',
    status: 'Active',
    lastActivity: '2025-10-01'
  },
  {
    accountCode: '6200',
    accountName: 'Utilities Expense',
    accountType: 'Expense',
    category: 'Operating Expenses',
    balance: '$34,280',
    debit: '$34,280',
    credit: '$0',
    status: 'Active',
    lastActivity: '2025-10-09'
  }
])

// Journal Entries
const journalEntries = ref([
  {
    entryNumber: 'JE-2025-1245',
    date: '2025-10-11',
    description: 'Sales Revenue - Invoice #INV-2845',
    reference: 'INV-2845',
    status: 'Posted',
    createdBy: 'John Smith',
    totalDebit: '$25,450',
    totalCredit: '$25,450',
    lines: [
      { accountCode: '1000', accountName: 'Cash', debit: '$25,450', credit: '$0' },
      { accountCode: '4000', accountName: 'Sales Revenue', debit: '$0', credit: '$25,450' }
    ]
  },
  {
    entryNumber: 'JE-2025-1244',
    date: '2025-10-11',
    description: 'Office Rent Payment - October',
    reference: 'RENT-OCT',
    status: 'Posted',
    createdBy: 'Sarah Chen',
    totalDebit: '$8,500',
    totalCredit: '$8,500',
    lines: [
      { accountCode: '6100', accountName: 'Rent Expense', debit: '$8,500', credit: '$0' },
      { accountCode: '1000', accountName: 'Cash', debit: '$0', credit: '$8,500' }
    ]
  },
  {
    entryNumber: 'JE-2025-1243',
    date: '2025-10-10',
    description: 'Inventory Purchase - PO-1842',
    reference: 'PO-1842',
    status: 'Posted',
    createdBy: 'Mike Johnson',
    totalDebit: '$45,200',
    totalCredit: '$45,200',
    lines: [
      { accountCode: '1200', accountName: 'Inventory', debit: '$45,200', credit: '$0' },
      { accountCode: '2000', accountName: 'Accounts Payable', debit: '$0', credit: '$45,200' }
    ]
  },
  {
    entryNumber: 'JE-2025-1242',
    date: '2025-10-10',
    description: 'Monthly Payroll',
    reference: 'PAY-1023',
    status: 'Posted',
    createdBy: 'Emily Davis',
    totalDebit: '$45,200',
    totalCredit: '$45,200',
    lines: [
      { accountCode: '6000', accountName: 'Salaries & Wages', debit: '$45,200', credit: '$0' },
      { accountCode: '1000', accountName: 'Cash', debit: '$0', credit: '$45,200' }
    ]
  },
  {
    entryNumber: 'JE-2025-1241',
    date: '2025-10-09',
    description: 'Payment from Customer - INV-2843',
    reference: 'INV-2843',
    status: 'Posted',
    createdBy: 'John Smith',
    totalDebit: '$32,800',
    totalCredit: '$32,800',
    lines: [
      { accountCode: '1000', accountName: 'Cash', debit: '$32,800', credit: '$0' },
      { accountCode: '1100', accountName: 'Accounts Receivable', debit: '$0', credit: '$32,800' }
    ]
  },
  {
    entryNumber: 'JE-2025-1240',
    date: '2025-10-09',
    description: 'Utility Bill Payment',
    reference: 'UTIL-089',
    status: 'Pending',
    createdBy: 'Sarah Chen',
    totalDebit: '$2,840',
    totalCredit: '$2,840',
    lines: [
      { accountCode: '6200', accountName: 'Utilities Expense', debit: '$2,840', credit: '$0' },
      { accountCode: '1000', accountName: 'Cash', debit: '$0', credit: '$2,840' }
    ]
  }
])

// Trial Balance
const trialBalance = ref([
  {
    accountCode: '1000',
    accountName: 'Cash and Cash Equivalents',
    accountType: 'Asset',
    debit: '$722,830',
    credit: '$0',
    balance: '$722,830'
  },
  {
    accountCode: '1100',
    accountName: 'Accounts Receivable',
    accountType: 'Asset',
    debit: '$456,200',
    credit: '$0',
    balance: '$456,200'
  },
  {
    accountCode: '1200',
    accountName: 'Inventory',
    accountType: 'Asset',
    debit: '$384,500',
    credit: '$0',
    balance: '$384,500'
  },
  {
    accountCode: '1500',
    accountName: 'Property, Plant & Equipment',
    accountType: 'Asset',
    debit: '$1,245,600',
    credit: '$0',
    balance: '$1,245,600'
  },
  {
    accountCode: '2000',
    accountName: 'Accounts Payable',
    accountType: 'Liability',
    debit: '$0',
    credit: '$298,450',
    balance: '$298,450'
  },
  {
    accountCode: '2100',
    accountName: 'Short-term Loans',
    accountType: 'Liability',
    debit: '$0',
    credit: '$125,000',
    balance: '$125,000'
  },
  {
    accountCode: '3000',
    accountName: 'Owner\'s Equity',
    accountType: 'Equity',
    debit: '$0',
    credit: '$2,500,000',
    balance: '$2,500,000'
  },
  {
    accountCode: '3100',
    accountName: 'Retained Earnings',
    accountType: 'Equity',
    debit: '$0',
    credit: '$856,230',
    balance: '$856,230'
  },
  {
    accountCode: '4000',
    accountName: 'Sales Revenue',
    accountType: 'Revenue',
    debit: '$0',
    credit: '$3,842,680',
    balance: '$3,842,680'
  },
  {
    accountCode: '4100',
    accountName: 'Service Revenue',
    accountType: 'Revenue',
    debit: '$0',
    credit: '$1,234,500',
    balance: '$1,234,500'
  },
  {
    accountCode: '5000',
    accountName: 'Cost of Goods Sold',
    accountType: 'Expense',
    debit: '$1,856,340',
    credit: '$0',
    balance: '$1,856,340'
  },
  {
    accountCode: '6000',
    accountName: 'Salaries & Wages',
    accountType: 'Expense',
    debit: '$842,500',
    credit: '$0',
    balance: '$842,500'
  },
  {
    accountCode: '6100',
    accountName: 'Rent Expense',
    accountType: 'Expense',
    debit: '$102,000',
    credit: '$0',
    balance: '$102,000'
  },
  {
    accountCode: '6200',
    accountName: 'Utilities Expense',
    accountType: 'Expense',
    debit: '$34,280',
    credit: '$0',
    balance: '$34,280'
  }
])

// Account Balance Trend
const balanceTrendSeries = ref([
  {
    name: 'Assets',
    data: [2450, 2520, 2680, 2750, 2820, 2890, 2950, 3020, 3100, 3180, 3250, 3320]
  },
  {
    name: 'Liabilities',
    data: [380, 390, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495]
  },
  {
    name: 'Equity',
    data: [2070, 2130, 2275, 2335, 2395, 2455, 2505, 2565, 2635, 2705, 2765, 2825]
  }
])

const balanceTrendOptions = ref({
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
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    title: { text: 'Amount ($K)' },
    labels: {
      formatter: (val: number) => `$${val}K`
    }
  },
  colors: ['#3b82f6', '#ef4444', '#22c55e'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Account Type Distribution
const accountTypeSeries = ref([2809, 423, 3356, 5077, 2835])
const accountTypeOptions = ref({
  chart: {
    type: 'donut',
    height: 300
  },
  labels: ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'],
  colors: ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f97316'],
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
          value: {
            show: true,
            fontSize: '20px',
            fontWeight: 'bold',
            formatter: (val: string) => `$${parseFloat(val).toFixed(0)}K`
          },
          total: {
            show: true,
            label: 'Total Balance',
            fontSize: '12px',
            formatter: () => '$14.5M'
          }
        }
      }
    }
  }
})

// Filters
const searchQuery = ref('')
const selectedAccountType = ref('All')
const showAddEntry = ref(false)
const showAddAccount = ref(false)

// Calculate totals
const totalDebit = ref('$4,856,420')
const totalCredit = ref('$4,856,420')
const difference = ref('$0')
const isBalanced = ref(true)

function getStatusColor(status: string) {
  switch (status) {
    case 'Posted': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Draft': return 'bg-gray-100 text-gray-700'
    case 'Void': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getAccountTypeColor(type: string) {
  switch (type) {
    case 'Asset': return 'bg-blue-100 text-blue-700'
    case 'Liability': return 'bg-red-100 text-red-700'
    case 'Equity': return 'bg-green-100 text-green-700'
    case 'Revenue': return 'bg-purple-100 text-purple-700'
    case 'Expense': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">General Ledger</h1>
        <p class="text-muted-foreground mt-1">Manage accounts, journal entries, and trial balance</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <Calendar class="h-4 w-4 mr-2" />
          Oct 2025
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in glStats" :key="stat.title" class="relative hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center mt-2">
            <TrendingUp class="h-4 w-4 mr-1 text-green-600" />
            <span class="text-xs font-medium text-green-600">{{ stat.change }}</span>
            <span class="text-xs text-muted-foreground ml-2">this month</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts -->
    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Account Balance Trend</CardTitle>
              <CardDescription>Monthly balance by account type</CardDescription>
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
              :options="balanceTrendOptions"
              :series="balanceTrendSeries"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Distribution</CardTitle>
          <CardDescription>Balance by account type</CardDescription>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="donut"
              height="300"
              :options="accountTypeOptions"
              :series="accountTypeSeries"
          />
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Tabs -->
    <Tabs default-value="chart-of-accounts" class="space-y-4">
      <TabsList class="grid w-full grid-cols-3 lg:w-auto">
        <TabsTrigger value="chart-of-accounts">
          <BookOpen class="h-4 w-4 mr-2" />
          Chart of Accounts
        </TabsTrigger>
        <TabsTrigger value="journal-entries">
          <FileText class="h-4 w-4 mr-2" />
          Journal Entries
        </TabsTrigger>
        <TabsTrigger value="trial-balance">
          <BarChart3 class="h-4 w-4 mr-2" />
          Trial Balance
        </TabsTrigger>
      </TabsList>

      <!-- Chart of Accounts Tab -->
      <TabsContent value="chart-of-accounts" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Chart of Accounts</CardTitle>
                <CardDescription>Complete list of all accounts</CardDescription>
              </div>
              <div class="flex gap-2">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      v-model="searchQuery"
                      placeholder="Search accounts..."
                      class="pl-9 w-64"
                  />
                </div>
                <Select v-model="selectedAccountType">
                  <SelectTrigger class="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Sheet v-model:open="showAddAccount">
                  <SheetTrigger as-child>
                    <Button size="sm">
                      <Plus class="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Add New Account</SheetTitle>
                      <SheetDescription>
                        Create a new account in the chart of accounts
                      </SheetDescription>
                    </SheetHeader>
                    <div class="space-y-4 mt-6">
                      <div class="space-y-2">
                        <Label>Account Code</Label>
                        <Input placeholder="e.g., 1000" />
                      </div>
                      <div class="space-y-2">
                        <Label>Account Name</Label>
                        <Input placeholder="Enter account name" />
                      </div>
                      <div class="space-y-2">
                        <Label>Account Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asset">Asset</SelectItem>
                            <SelectItem value="liability">Liability</SelectItem>
                            <SelectItem value="equity">Equity</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div class="space-y-2">
                        <Label>Category</Label>
                        <Input placeholder="e.g., Current Assets" />
                      </div>
                      <div class="space-y-2">
                        <Label>Opening Balance</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div class="flex gap-2 pt-4">
                        <Button class="flex-1">Create Account</Button>
                        <Button variant="outline" class="flex-1" @click="showAddAccount = false">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div v-for="account in chartOfAccounts" :key="account.accountCode"
                   class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4 flex-1">
                  <div class="text-center min-w-16">
                    <div class="font-mono font-bold text-sm">{{ account.accountCode }}</div>
                    <Badge :class="getAccountTypeColor(account.accountType)" class="border-0 text-xs mt-1">
                      {{ account.accountType }}
                    </Badge>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ account.accountName }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ account.category }} • Last activity: {{ account.lastActivity }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right min-w-32">
                    <div class="text-xs text-muted-foreground">Debit</div>
                    <div class="text-sm font-semibold">{{ account.debit }}</div>
                  </div>
                  <div class="text-right min-w-32">
                    <div class="text-xs text-muted-foreground">Credit</div>
                    <div class="text-sm font-semibold">{{ account.credit }}</div>
                  </div>
                  <div class="text-right min-w-32">
                    <div class="text-xs text-muted-foreground">Balance</div>
                    <div class="text-sm font-bold">{{ account.balance }}</div>
                  </div>
                  <div class="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Journal Entries Tab -->
      <TabsContent value="journal-entries" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Journal Entries</CardTitle>
                <CardDescription>All recorded transactions</CardDescription>
              </div>
              <div class="flex gap-2">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search entries..."
                      class="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter class="h-4 w-4" />
                </Button>
                <Sheet v-model:open="showAddEntry">
                  <SheetTrigger as-child>
                    <Button size="sm">
                      <Plus class="h-4 w-4 mr-2" />
                      New Entry
                    </Button>
                  </SheetTrigger>
                  <SheetContent class="sm:max-w-xl">
                    <SheetHeader>
                      <SheetTitle>Create Journal Entry</SheetTitle>
                      <SheetDescription>
                        Record a new journal entry with debit and credit lines
                      </SheetDescription>
                    </SheetHeader>
                    <div class="space-y-4 mt-6">
                      <div class="space-y-2">
                        <Label>Entry Date</Label>
                        <Input type="date" />
                      </div>
                      <div class="space-y-2">
                        <Label>Description</Label>
                        <Input placeholder="Enter description" />
                      </div>
                      <div class="space-y-2">
                        <Label>Reference</Label>
                        <Input placeholder="e.g., INV-2845" />
                      </div>

                      <div class="border rounded-lg p-4 space-y-3">
                        <div class="font-medium text-sm">Entry Lines</div>

                        <!-- Debit Line -->
                        <div class="space-y-2 p-3 bg-green-50 rounded-lg">
                          <div class="text-xs font-medium text-green-700">Debit</div>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1000">1000 - Cash</SelectItem>
                              <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
                              <SelectItem value="1200">1200 - Inventory</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input type="number" placeholder="Amount" />
                        </div>

                        <!-- Credit Line -->
                        <div class="space-y-2 p-3 bg-red-50 rounded-lg">
                          <div class="text-xs font-medium text-red-700">Credit</div>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4000">4000 - Sales Revenue</SelectItem>
                              <SelectItem value="4100">4100 - Service Revenue</SelectItem>
                              <SelectItem value="2000">2000 - Accounts Payable</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input type="number" placeholder="Amount" />
                        </div>

                        <Button variant="outline" size="sm" class="w-full">
                          <Plus class="h-4 w-4 mr-2" />
                          Add Line
                        </Button>
                      </div>

                      <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium">Total Debit:</span>
                        <span class="font-bold">$0.00</span>
                      </div>
                      <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium">Total Credit:</span>
                        <span class="font-bold">$0.00</span>
                      </div>
                      <div class="flex justify-between p-3 bg-blue-50 rounded-lg">
                        <span class="font-medium">Difference:</span>
                        <span class="font-bold text-blue-600">$0.00</span>
                      </div>

                      <div class="flex gap-2 pt-4">
                        <Button class="flex-1">Post Entry</Button>
                        <Button variant="outline" class="flex-1" @click="showAddEntry = false">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="entry in journalEntries" :key="entry.entryNumber"
                   class="border rounded-lg hover:shadow-sm transition-shadow">
                <div class="flex items-center justify-between p-4 border-b bg-gray-50">
                  <div class="flex items-center gap-4 flex-1">
                    <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <FileText class="h-5 w-5" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-sm">{{ entry.entryNumber }}</span>
                        <Badge :class="getStatusColor(entry.status)" class="border-0">
                          {{ entry.status }}
                        </Badge>
                      </div>
                      <div class="text-sm mt-1">{{ entry.description }}</div>
                      <div class="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{{ entry.date }}</span>
                        <span>•</span>
                        <span>Ref: {{ entry.reference }}</span>
                        <span>•</span>
                        <span>By: {{ entry.createdBy }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <div class="text-xs text-muted-foreground">Total</div>
                      <div class="text-sm font-bold">{{ entry.totalDebit }}</div>
                    </div>
                    <div class="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <!-- Entry Lines -->
                <div class="p-4 space-y-2">
                  <div v-for="(line, index) in entry.lines" :key="index"
                       class="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div class="flex items-center gap-3 flex-1">
                      <div class="w-20 text-center">
                        <div class="font-mono text-xs text-muted-foreground">{{ line.accountCode }}</div>
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ line.accountName }}</div>
                      </div>
                    </div>
                    <div class="flex gap-8">
                      <div class="text-right w-28">
                        <div class="text-xs text-muted-foreground mb-1">Debit</div>
                        <div class="text-sm font-semibold" :class="line.debit !== '$0' ? 'text-green-600' : 'text-gray-400'">
                          {{ line.debit }}
                        </div>
                      </div>
                      <div class="text-right w-28">
                        <div class="text-xs text-muted-foreground mb-1">Credit</div>
                        <div class="text-sm font-semibold" :class="line.credit !== '$0' ? 'text-red-600' : 'text-gray-400'">
                          {{ line.credit }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Trial Balance Tab -->
      <TabsContent value="trial-balance" class="space-y-4">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Trial Balance</CardTitle>
                <CardDescription>Summary of all account balances</CardDescription>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar class="h-4 w-4 mr-2" />
                  As of Oct 11, 2025
                </Button>
                <Button variant="outline" size="sm">
                  <Download class="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <!-- Balance Status -->
            <div class="mb-6 p-4 rounded-lg" :class="isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <component :is="isBalanced ? CheckCircle : AlertCircle"
                             :class="isBalanced ? 'text-green-600' : 'text-red-600'"
                             class="h-6 w-6" />
                  <div>
                    <div :class="isBalanced ? 'text-green-700' : 'text-red-700'" class="font-semibold">
                      {{ isBalanced ? 'Trial Balance is Balanced' : 'Trial Balance is Unbalanced' }}
                    </div>
                    <div class="text-sm" :class="isBalanced ? 'text-green-600' : 'text-red-600'">
                      {{ isBalanced ? 'All debits equal all credits' : 'Debits and credits do not match' }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-muted-foreground">Difference</div>
                  <div class="text-2xl font-bold" :class="isBalanced ? 'text-green-600' : 'text-red-600'">
                    {{ difference }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Trial Balance Table -->
            <div class="border rounded-lg overflow-hidden">
              <!-- Table Header -->
              <div class="bg-gray-50 border-b">
                <div class="flex items-center p-3 font-semibold text-sm">
                  <div class="w-24">Code</div>
                  <div class="flex-1">Account Name</div>
                  <div class="w-32 text-center">Type</div>
                  <div class="w-40 text-right">Debit</div>
                  <div class="w-40 text-right">Credit</div>
                  <div class="w-40 text-right">Balance</div>
                </div>
              </div>

              <!-- Assets Section -->
              <div class="border-b">
                <div class="bg-blue-50 p-2 font-semibold text-sm text-blue-700">
                  Assets
                </div>
                <div v-for="account in trialBalance.filter(a => a.accountType === 'Asset')"
                     :key="account.accountCode"
                     class="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0">
                  <div class="w-24 font-mono text-sm">{{ account.accountCode }}</div>
                  <div class="flex-1 text-sm">{{ account.accountName }}</div>
                  <div class="w-32 text-center">
                    <Badge :class="getAccountTypeColor(account.accountType)" class="border-0 text-xs">
                      {{ account.accountType }}
                    </Badge>
                  </div>
                  <div class="w-40 text-right text-sm font-semibold text-green-600">{{ account.debit }}</div>
                  <div class="w-40 text-right text-sm text-gray-400">{{ account.credit }}</div>
                  <div class="w-40 text-right text-sm font-bold">{{ account.balance }}</div>
                </div>
              </div>

              <!-- Liabilities Section -->
              <div class="border-b">
                <div class="bg-red-50 p-2 font-semibold text-sm text-red-700">
                  Liabilities
                </div>
                <div v-for="account in trialBalance.filter(a => a.accountType === 'Liability')"
                     :key="account.accountCode"
                     class="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0">
                  <div class="w-24 font-mono text-sm">{{ account.accountCode }}</div>
                  <div class="flex-1 text-sm">{{ account.accountName }}</div>
                  <div class="w-32 text-center">
                    <Badge :class="getAccountTypeColor(account.accountType)" class="border-0 text-xs">
                      {{ account.accountType }}
                    </Badge>
                  </div>
                  <div class="w-40 text-right text-sm text-gray-400">{{ account.debit }}</div>
                  <div class="w-40 text-right text-sm font-semibold text-red-600">{{ account.credit }}</div>
                  <div class="w-40 text-right text-sm font-bold">{{ account.balance }}</div>
                </div>
              </div>

              <!-- Equity Section -->
              <div class="border-b">
                <div class="bg-green-50 p-2 font-semibold text-sm text-green-700">
                  Equity
                </div>
                <div v-for="account in trialBalance.filter(a => a.accountType === 'Equity')"
                     :key="account.accountCode"
                     class="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0">
                  <div class="w-24 font-mono text-sm">{{ account.accountCode }}</div>
                  <div class="flex-1 text-sm">{{ account.accountName }}</div>
                  <div class="w-32 text-center">
                    <Badge :class="getAccountTypeColor(account.accountType)" class="border-0 text-xs">
                      {{ account.accountType }}
                    </Badge>
                  </div>
                  <div class="w-40 text-right text-sm text-gray-400">{{ account.debit }}</div>
                  <div class="w-40 text-right text-sm font-semibold text-green-600">{{ account.credit }}</div>
                  <div class="w-40 text-right text-sm font-bold">{{ account.balance }}</div>
                </div>
              </div>

              <!-- Revenue Section -->
              <div class="border-b">
                <div class="bg-purple-50 p-2 font-semibold text-sm text-purple-700">
                  Revenue
                </div>
                <div v-for="account in trialBalance.filter(a => a.accountType === 'Revenue')"
                     :key="account.accountCode"
                     class="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0">
                  <div class="w-24 font-mono text-sm">{{ account.accountCode }}</div>
                  <div class="flex-1 text-sm">{{ account.accountName }}</div>
                  <div class="w-32 text-center">
                    <Badge :class="getAccountTypeColor(account.accountType)" class="border-0 text-xs">
                      {{ account.accountType }}
                    </Badge>
                  </div>
                  <div class="w-40 text-right text-sm text-gray-400">{{ account.debit }}</div>
                  <div class="w-40 text-right text-sm font-semibold text-purple-600">{{ account.credit }}</div>
                  <div class="w-40 text-right text-sm font-bold">{{ account.balance }}</div>
                </div>
              </div>

              <!-- Expenses Section -->
              <div class="border-b">
                <div class="bg-orange-50 p-2 font-semibold text-sm text-orange-700">
                  Expenses
                </div>
                <div v-for="account in trialBalance.filter(a => a.accountType === 'Expense')"
                     :key="account.accountCode"
                     class="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0">
                  <div class="w-24 font-mono text-sm">{{ account.accountCode }}</div>
                  <div class="flex-1 text-sm">{{ account.accountName }}</div>
                  <div class="w-32 text-center">
                    <Badge :class="getAccountTypeColor(account.accountType)" class="border-0 text-xs">
                      {{ account.accountType }}
                    </Badge>
                  </div>
                  <div class="w-40 text-right text-sm font-semibold text-orange-600">{{ account.debit }}</div>
                  <div class="w-40 text-right text-sm text-gray-400">{{ account.credit }}</div>
                  <div class="w-40 text-right text-sm font-bold">{{ account.balance }}</div>
                </div>
              </div>

              <!-- Totals -->
              <div class="bg-gray-100 border-t-2 border-gray-300">
                <div class="flex items-center p-4 font-bold">
                  <div class="w-24"></div>
                  <div class="flex-1 text-lg">Total</div>
                  <div class="w-32"></div>
                  <div class="w-40 text-right text-lg text-green-600">{{ totalDebit }}</div>
                  <div class="w-40 text-right text-lg text-red-600">{{ totalCredit }}</div>
                  <div class="w-40 text-right text-lg">{{ difference }}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
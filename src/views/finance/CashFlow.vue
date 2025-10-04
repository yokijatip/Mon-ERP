<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Download, Plus,
  Search, DollarSign, Wallet, Trash2
} from 'lucide-vue-next'
import Header from "@/components/kakangCustom/Header.vue"
import { useAuthStore } from "@/stores/auth"
import { useFinance, useSearch, type Transaction, type TransactionStatus } from '@/composables/useFinance'
import { useDateRange } from '@/composables/useDataRange.ts'
import { createCashFlowTrendConfig } from '@/config/chartConfig'
import { toast } from "vue-sonner"

// Lazy load charts
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

// ============= Cash Flow Summary =============
interface CashFlowSummary {
  openingBalance: number
  totalInflow: number
  totalOutflow: number
  netCashFlow: number
  closingBalance: number
  forecastedBalance: number
}

const cashFlowSummary = ref<CashFlowSummary>({
  openingBalance: 1_650_000_000,
  totalInflow: 2_450_000_000,
  totalOutflow: 1_890_000_000,
  netCashFlow: 560_000_000,
  closingBalance: 2_210_000_000,
  forecastedBalance: 2_580_000_000
})

// ============= Chart Configuration =============
const formatChartValue = (val: number): string => {
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)}jt`
  return `Rp ${(val / 1_000).toFixed(0)}rb`
}

const cashFlowChartOptions = computed(() =>
    createCashFlowTrendConfig(formatCurrency, formatChartValue)
)

const cashFlowChartSeries = ref([
  {
    name: 'Cash Balance',
    data: [1_650_000_000, 1_780_000_000, 1_920_000_000, 2_210_000_000,
      2_350_000_000, 2_480_000_000, 2_520_000_000, 2_580_000_000]
  },
  {
    name: 'Cash Inflow',
    data: [450_000_000, 520_000_000, 480_000_000, 650_000_000,
      580_000_000, 620_000_000, 590_000_000, 610_000_000]
  },
  {
    name: 'Cash Outflow',
    data: [320_000_000, 380_000_000, 350_000_000, 360_000_000,
      440_000_000, 490_000_000, 450_000_000, 470_000_000]
  }
])

// ============= Cash Flow Transactions =============
interface CashFlowTransaction extends Transaction {
  type: 'inflow' | 'outflow'
}

const cashFlowTransactions = ref<CashFlowTransaction[]>([
  {
    id: 'CF-2024-001', date: '2024-10-03', type: 'inflow', category: 'Sales Revenue',
    description: 'Payment from PT Maju Jaya - Invoice INV-2024-001',
    amount: 125_000_000, status: 'confirmed', reference: 'INV-2024-001'
  },
  {
    id: 'CF-2024-002', date: '2024-10-03', type: 'outflow', category: 'Salaries & Benefits',
    description: 'Monthly Salary Payment - October 2024',
    amount: 55_000_000, status: 'confirmed', reference: 'PAY-2024-010'
  },
  {
    id: 'CF-2024-003', date: '2024-10-02', type: 'inflow', category: 'Sales Revenue',
    description: 'Payment from CV Sukses Mandiri - Invoice INV-2024-002',
    amount: 85_000_000, status: 'confirmed', reference: 'INV-2024-002'
  },
  {
    id: 'CF-2024-004', date: '2024-10-02', type: 'outflow', category: 'Operating Expenses',
    description: 'Office Rent Payment - October 2024',
    amount: 15_000_000, status: 'confirmed', reference: 'RENT-2024-10'
  },
  {
    id: 'CF-2024-005', date: '2024-10-01', type: 'outflow', category: 'Operating Expenses',
    description: 'Marketing Campaign - Digital Advertising',
    amount: 12_000_000, status: 'confirmed', reference: 'MKT-2024-015'
  },
  {
    id: 'CF-2024-006', date: '2024-10-05', type: 'inflow', category: 'Sales Revenue',
    description: 'Expected payment from Toko Berkah',
    amount: 45_000_000, status: 'forecasted', reference: 'INV-2024-003'
  },
  {
    id: 'CF-2024-007', date: '2024-10-08', type: 'outflow', category: 'Loan Payments',
    description: 'Bank Loan Installment - October 2024',
    amount: 35_000_000, status: 'scheduled', reference: 'LOAN-2024-10'
  }
])

// ============= Search & Filter =============
const { searchQuery, filteredItems } = useSearch(cashFlowTransactions, ['description', 'reference', 'category'])
const selectedFilter = ref<'all' | 'inflow' | 'outflow'>('all')

const displayTransactions = computed(() => {
  if (selectedFilter.value === 'all') return filteredItems.value
  return filteredItems.value.filter(t => t.type === selectedFilter.value)
})

// ============= Dialog & Form State =============
const isAddTransactionOpen = ref(false)

const newTransaction = ref<Partial<CashFlowTransaction>>({
  type: 'inflow',
  category: '',
  description: '',
  amount: 0,
  date: '',
  reference: '',
  status: 'scheduled'
})

const resetForm = () => {
  newTransaction.value = {
    type: 'inflow',
    category: '',
    description: '',
    amount: 0,
    date: '',
    reference: '',
    status: 'scheduled'
  }
}

// ============= Functions =============
const handleAddTransaction = () => {
  if (!newTransaction.value.description || !newTransaction.value.amount) {
    toast.error('Please fill in all required fields')
    return
  }

  const transaction: CashFlowTransaction = {
    id: `CF-2024-${String(cashFlowTransactions.value.length + 1).padStart(3, '0')}`,
    type: newTransaction.value.type as 'inflow' | 'outflow',
    category: newTransaction.value.category || '',
    description: newTransaction.value.description,
    amount: newTransaction.value.amount,
    date: newTransaction.value.date || new Date().toISOString().split('T')[0],
    status: newTransaction.value.status as TransactionStatus,
    reference: newTransaction.value.reference
  }

  cashFlowTransactions.value.unshift(transaction)
  resetForm()
  isAddTransactionOpen.value = false

  toast.success('Cash flow transaction added successfully!')
}

const handleDeleteTransaction = (id: string) => {
  cashFlowTransactions.value = cashFlowTransactions.value.filter(t => t.id !== id)
  toast.success('Transaction deleted successfully!')
}

const handleExportCashFlow = () => {
  exportReport('Cash Flow Report', () => {
    console.log('Exporting cash flow data...')
  })
}

// ============= Summary Cards Config =============
const summaryCards = computed(() => [
  { label: 'Opening Balance', value: cashFlowSummary.value.openingBalance, icon: Wallet, color: 'text-blue-600' },
  { label: 'Total Inflow', value: cashFlowSummary.value.totalInflow, icon: ArrowDownRight, color: 'text-green-600' },
  { label: 'Total Outflow', value: cashFlowSummary.value.totalOutflow, icon: ArrowUpRight, color: 'text-red-600' },
  { label: 'Net Cash Flow', value: cashFlowSummary.value.netCashFlow, icon: TrendingUp, color: 'text-purple-600' },
  { label: 'Closing Balance', value: cashFlowSummary.value.closingBalance, icon: DollarSign, color: 'text-blue-600' },
  { label: 'Forecasted Balance', value: cashFlowSummary.value.forecastedBalance, icon: TrendingUp, color: 'text-orange-600' }
])
</script>

<template>
  <div class="space-y-6 pb-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Header
          title="Cash Flow Management"
          :subtitle="`${greeting}, ${userName}!`"
          align="left"
      />

      <div class="flex items-center gap-2 flex-wrap">
        <DateRangePicker v-model="dateRange" />

        <Button @click="handleExportCashFlow" variant="outline" class="gap-2">
          <Download class="h-4 w-4" />
          Export
        </Button>

        <Dialog v-model:open="isAddTransactionOpen">
          <DialogTrigger as-child>
            <Button class="gap-2">
              <Plus class="h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Cash Flow Transaction</DialogTitle>
              <DialogDescription>
                Add a new cash flow transaction to track inflows and outflows.
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Type</Label>
                  <Select v-model="newTransaction.type">
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
                  <Label>Status</Label>
                  <Select v-model="newTransaction.status">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="forecasted">Forecasted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div class="space-y-2">
                <Label>Category</Label>
                <Input v-model="newTransaction.category" placeholder="e.g., Sales Revenue, Operating Expenses" />
              </div>
              <div class="space-y-2">
                <Label>Description *</Label>
                <Textarea v-model="newTransaction.description" placeholder="Transaction description" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Amount (IDR) *</Label>
                  <Input v-model.number="newTransaction.amount" type="number" placeholder="0" />
                </div>
                <div class="space-y-2">
                  <Label>Date</Label>
                  <Input v-model="newTransaction.date" type="date" />
                </div>
              </div>
              <div class="space-y-2">
                <Label>Reference</Label>
                <Input v-model="newTransaction.reference" placeholder="Invoice/Reference number" />
              </div>
              <div class="flex justify-end gap-2">
                <Button variant="outline" @click="() => { isAddTransactionOpen = false; resetForm() }">
                  Cancel
                </Button>
                <Button @click="handleAddTransaction">Add Transaction</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Cash Flow Summary Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      <Card
          v-for="card in summaryCards"
          :key="card.label"
          class="hover:shadow-md transition-shadow duration-200"
      >
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ card.label }}
          </CardTitle>
          <component :is="card.icon" :class="[card.color, 'h-4 w-4']" />
        </CardHeader>
        <CardContent>
          <div :class="['text-2xl font-bold', card.color]">
            {{ formatCurrency(card.value) }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Cash Flow Chart -->
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Trend & Forecast</CardTitle>
        <CardDescription>Weekly cash flow analysis with 4-week forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <VueApexCharts
              type="line"
              height="400"
              :options="cashFlowChartOptions"
              :series="cashFlowChartSeries"
          />
          <template #fallback>
            <div class="flex items-center justify-center h-[400px]">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </template>
        </Suspense>
      </CardContent>
    </Card>

    <!-- Cash Flow Transactions -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Cash Flow Transactions</CardTitle>
            <CardDescription>Detailed list of all cash flow transactions</CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchQuery"
                  placeholder="Search transactions..."
                  class="pl-8 w-64"
              />
            </div>
            <Select v-model="selectedFilter">
              <SelectTrigger class="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="inflow">Inflow</SelectItem>
                <SelectItem value="outflow">Outflow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
              v-for="transaction in displayTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
          >
            <div class="flex items-center gap-4 flex-1">
              <div :class="[
                getTransactionStyle(transaction.type).bgColor,
                'p-2 rounded-lg'
              ]">
                <component
                    :is="transaction.type === 'inflow' ? ArrowDownRight : ArrowUpRight"
                    :class="[getTransactionStyle(transaction.type).color, 'w-5 h-5']"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium">{{ transaction.description }}</p>
                  <Badge :class="getStatusColor(transaction.status)" class="text-xs">
                    {{ transaction.status }}
                  </Badge>
                </div>
                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{{ transaction.id }}</span>
                  <span>•</span>
                  <span>{{ transaction.date }}</span>
                  <span>•</span>
                  <Badge variant="outline" class="text-xs">{{ transaction.category }}</Badge>
                  <span v-if="transaction.reference">•</span>
                  <span v-if="transaction.reference" class="text-xs">{{ transaction.reference }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p :class="[
                  'font-semibold text-lg',
                  getTransactionStyle(transaction.type).color
                ]">
                  {{ getTransactionStyle(transaction.type).prefix }}{{ formatCurrency(transaction.amount) }}
                </p>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  @click="handleDeleteTransaction(transaction.id)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="displayTransactions.length === 0" class="text-center py-12">
            <p class="text-muted-foreground">No transactions found</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
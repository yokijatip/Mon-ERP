<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Download, BookOpen, FileText, Edit, Trash2, Eye } from 'lucide-vue-next'
import Header from "@/components/kakangCustom/Header.vue"
import { useAuthStore } from "@/stores/auth"
import {
  useFinance,
  useSearch,
  type Account,
  type JournalEntry,
  type JournalEntryLine,
  type AccountType
} from '@/composables/useFinance'
import { useDateRange } from '@/composables/useDateRange'
import { toast } from "vue-sonner"

// ============= Composables =============
const authStore = useAuthStore()
const { formatCurrency, getAccountTypeColor, getStatusColor, validateJournalBalance } = useFinance()
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

// ============= Chart of Accounts =============
const chartOfAccounts = ref<Account[]>([
  { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 1_850_000_000, status: 'active' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 456_000_000, status: 'active' },
  { code: '1200', name: 'Inventory', type: 'Asset', balance: 680_000_000, status: 'active' },
  { code: '1300', name: 'Prepaid Expenses', type: 'Asset', balance: 125_000_000, status: 'active' },
  { code: '1500', name: 'Property, Plant & Equipment', type: 'Asset', balance: 2_850_000_000, status: 'active' },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 289_000_000, status: 'active' },
  { code: '2100', name: 'Short-term Debt', type: 'Liability', balance: 180_000_000, status: 'active' },
  { code: '2200', name: 'Accrued Expenses', type: 'Liability', balance: 145_000_000, status: 'active' },
  { code: '2500', name: 'Long-term Debt', type: 'Liability', balance: 1_250_000_000, status: 'active' },
  { code: '3000', name: 'Share Capital', type: 'Equity', balance: 2_500_000_000, status: 'active' },
  { code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 982_000_000, status: 'active' },
  { code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 2_450_000_000, status: 'active' },
  { code: '4100', name: 'Service Revenue', type: 'Revenue', balance: 320_000_000, status: 'active' },
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 1_470_000_000, status: 'active' },
  { code: '6000', name: 'Operating Expenses', type: 'Expense', balance: 650_000_000, status: 'active' },
  { code: '6100', name: 'Salaries and Benefits', type: 'Expense', balance: 520_000_000, status: 'active' }
])

// ============= Journal Entries =============
const journalEntries = ref<JournalEntry[]>([
  {
    id: 'JE-2024-001',
    date: '2024-10-03',
    reference: 'INV-2024-001',
    description: 'Payment received from PT Maju Jaya',
    entries: [
      { account: '1000', accountName: 'Cash and Cash Equivalents', debit: 125_000_000, credit: 0 },
      { account: '1100', accountName: 'Accounts Receivable', debit: 0, credit: 125_000_000 }
    ],
    totalDebit: 125_000_000,
    totalCredit: 125_000_000,
    status: 'posted'
  },
  {
    id: 'JE-2024-002',
    date: '2024-10-03',
    reference: 'PAY-2024-010',
    description: 'Monthly salary payment',
    entries: [
      { account: '6100', accountName: 'Salaries and Benefits', debit: 55_000_000, credit: 0 },
      { account: '1000', accountName: 'Cash and Cash Equivalents', debit: 0, credit: 55_000_000 }
    ],
    totalDebit: 55_000_000,
    totalCredit: 55_000_000,
    status: 'posted'
  },
  {
    id: 'JE-2024-003',
    date: '2024-10-02',
    reference: 'RENT-2024-10',
    description: 'Office rent payment',
    entries: [
      { account: '6000', accountName: 'Operating Expenses', debit: 15_000_000, credit: 0 },
      { account: '1000', accountName: 'Cash and Cash Equivalents', debit: 0, credit: 15_000_000 }
    ],
    totalDebit: 15_000_000,
    totalCredit: 15_000_000,
    status: 'posted'
  },
  {
    id: 'JE-2024-004',
    date: '2024-10-05',
    reference: 'DRAFT-001',
    description: 'Equipment purchase - pending approval',
    entries: [
      { account: '1500', accountName: 'Property, Plant & Equipment', debit: 85_000_000, credit: 0 },
      { account: '1000', accountName: 'Cash and Cash Equivalents', debit: 0, credit: 85_000_000 }
    ],
    totalDebit: 85_000_000,
    totalCredit: 85_000_000,
    status: 'draft'
  }
])

// ============= Search & Filter =============
const { searchQuery, filteredItems: filteredAccounts } = useSearch(chartOfAccounts, ['name', 'code'])
const selectedAccountType = ref<'all' | AccountType>('all')
const selectedStatus = ref<'all' | 'active' | 'inactive'>('all')

const displayAccounts = computed(() => {
  let accounts = filteredAccounts.value

  if (selectedAccountType.value !== 'all') {
    accounts = accounts.filter(acc => acc.type === selectedAccountType.value)
  }

  if (selectedStatus.value !== 'all') {
    accounts = accounts.filter(acc => acc.status === selectedStatus.value)
  }

  return accounts
})

// ============= Account Type Totals =============
const accountTypeTotals = computed(() => {
  const totals: Record<AccountType, number> = {
    Asset: 0,
    Liability: 0,
    Equity: 0,
    Revenue: 0,
    Expense: 0
  }

  chartOfAccounts.value.forEach(account => {
    totals[account.type] += account.balance
  })

  return totals
})

// ============= Dialog States =============
const isAddJournalOpen = ref(false)
const isAddAccountOpen = ref(false)

// ============= Form States =============
const newAccount = ref<Partial<Account>>({
  code: '',
  name: '',
  type: 'Asset',
  status: 'active',
  balance: 0
})

const newJournalEntry = ref<Partial<JournalEntry> & { entries: JournalEntryLine[] }>({
  date: '',
  reference: '',
  description: '',
  entries: [
    { account: '', accountName: '', debit: 0, credit: 0 },
    { account: '', accountName: '', debit: 0, credit: 0 }
  ]
})

// ============= Form Reset Functions =============
const resetAccountForm = () => {
  newAccount.value = {
    code: '',
    name: '',
    type: 'Asset',
    status: 'active',
    balance: 0
  }
}

const resetJournalForm = () => {
  newJournalEntry.value = {
    date: '',
    reference: '',
    description: '',
    entries: [
      { account: '', accountName: '', debit: 0, credit: 0 },
      { account: '', accountName: '', debit: 0, credit: 0 }
    ]
  }
}

// ============= CRUD Functions =============
const handleAddAccount = () => {
  if (!newAccount.value.code || !newAccount.value.name) {
    toast.error('Please fill in all required fields')
    return
  }

  // Check for duplicate account code
  if (chartOfAccounts.value.some(acc => acc.code === newAccount.value.code)) {
    toast.error('Account code already exists')
    return
  }

  const account: Account = {
    code: newAccount.value.code,
    name: newAccount.value.name,
    type: newAccount.value.type as AccountType,
    balance: 0,
    status: 'active'
  }

  chartOfAccounts.value.push(account)
  resetAccountForm()
  isAddAccountOpen.value = false

  toast.success('Account added successfully!')
}

const handleAddJournalEntry = () => {
  if (!newJournalEntry.value.description || !newJournalEntry.value.date) {
    toast.error('Please fill in all required fields')
    return
  }

  if (!validateJournalBalance(newJournalEntry.value.entries)) {
    toast.error('Total debits must equal total credits')
    return
  }

  const totalDebit = newJournalEntry.value.entries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = newJournalEntry.value.entries.reduce((sum, entry) => sum + entry.credit, 0)

  const entry: JournalEntry = {
    id: `JE-2024-${String(journalEntries.value.length + 1).padStart(3, '0')}`,
    date: newJournalEntry.value.date || new Date().toISOString().split('T')[0],
    reference: newJournalEntry.value.reference || '',
    description: newJournalEntry.value.description || '',
    entries: [...newJournalEntry.value.entries],
    totalDebit,
    totalCredit,
    status: 'draft'
  }

  journalEntries.value.unshift(entry)
  resetJournalForm()
  isAddJournalOpen.value = false

  toast.success('Journal entry added successfully!')
}

const addJournalEntryLine = () => {
  newJournalEntry.value.entries.push({ account: '', accountName: '', debit: 0, credit: 0 })
}

const removeJournalEntryLine = (index: number) => {
  if (newJournalEntry.value.entries.length > 2) {
    newJournalEntry.value.entries.splice(index, 1)
  }
}

const updateAccountName = (index: number, accountCode: string) => {
  const account = chartOfAccounts.value.find(acc => acc.code === accountCode)
  if (account) {
    newJournalEntry.value.entries[index].accountName = account.name
  }
}

const handleExportLedger = () => {
  exportReport('General Ledger', () => {
    console.log('Exporting general ledger data...')
  })
}

// ============= Computed Journal Entry Totals =============
const journalEntryTotals = computed(() => {
  const totalDebit = newJournalEntry.value.entries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = newJournalEntry.value.entries.reduce((sum, entry) => sum + entry.credit, 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  return { totalDebit, totalCredit, isBalanced }
})
</script>

<template>
  <div class="space-y-6 pb-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Header
          title="General Ledger"
          :subtitle="`${greeting}, ${userName}!`"
          align="left"
      />

      <div class="flex items-center gap-2 flex-wrap">
        <DateRangePicker v-model="dateRange" />

        <Button @click="handleExportLedger" variant="outline" class="gap-2">
          <Download class="h-4 w-4" />
          Export
        </Button>

        <Dialog v-model:open="isAddAccountOpen">
          <DialogTrigger as-child>
            <Button variant="outline" class="gap-2">
              <Plus class="h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>
                Add a new account to the chart of accounts.
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Account Code *</Label>
                  <Input v-model="newAccount.code" placeholder="e.g., 1000" />
                </div>
                <div class="space-y-2">
                  <Label>Account Type *</Label>
                  <Select v-model="newAccount.type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div class="space-y-2">
                <Label>Account Name *</Label>
                <Input v-model="newAccount.name" placeholder="Account name" />
              </div>
              <div class="flex justify-end gap-2">
                <Button variant="outline" @click="() => { isAddAccountOpen = false; resetAccountForm() }">
                  Cancel
                </Button>
                <Button @click="handleAddAccount">Add Account</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog v-model:open="isAddJournalOpen">
          <DialogTrigger as-child>
            <Button class="gap-2">
              <Plus class="h-4 w-4" />
              Add Journal Entry
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Journal Entry</DialogTitle>
              <DialogDescription>
                Create a new journal entry with debits and credits.
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-2">
                  <Label>Date *</Label>
                  <Input v-model="newJournalEntry.date" type="date" />
                </div>
                <div class="space-y-2">
                  <Label>Reference</Label>
                  <Input v-model="newJournalEntry.reference" placeholder="Reference number" />
                </div>
                <div class="space-y-2">
                  <Label>Description *</Label>
                  <Input v-model="newJournalEntry.description" placeholder="Entry description" />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label>Journal Entry Lines</Label>
                  <Button variant="outline" size="sm" @click="addJournalEntryLine" class="gap-1">
                    <Plus class="h-3 w-3" />
                    Add Line
                  </Button>
                </div>

                <div class="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead class="w-[40%]">Account</TableHead>
                        <TableHead class="w-[25%]">Debit</TableHead>
                        <TableHead class="w-[25%]">Credit</TableHead>
                        <TableHead class="w-[10%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="(entry, index) in newJournalEntry.entries" :key="index">
                        <TableCell>
                          <Select
                              v-model="entry.account"
                              @update:modelValue="(value) => updateAccountName(index, value as string)"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                  v-for="account in chartOfAccounts"
                                  :key="account.code"
                                  :value="account.code"
                              >
                                {{ account.code }} - {{ account.name }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input v-model.number="entry.debit" type="number" placeholder="0" min="0" />
                        </TableCell>
                        <TableCell>
                          <Input v-model.number="entry.credit" type="number" placeholder="0" min="0" />
                        </TableCell>
                        <TableCell>
                          <Button
                              variant="ghost"
                              size="sm"
                              @click="removeJournalEntryLine(index)"
                              :disabled="newJournalEntry.entries.length <= 2"
                          >
                            <Trash2 class="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow class="border-t-2 font-semibold bg-muted/50">
                        <TableCell>Total</TableCell>
                        <TableCell class="text-right">{{ formatCurrency(entry.totalDebit) }}</TableCell>
                        <TableCell class="text-right">{{ formatCurrency(entry.totalCredit) }}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            </CardContent>
            </Card>
      </div>
</template>ibold">
<TableCell>Total</TableCell>
<TableCell :class="journalEntryTotals.isBalanced ? 'text-green-600' : 'text-red-600'">
{{ formatCurrency(journalEntryTotals.totalDebit) }}
</TableCell>
<TableCell :class="journalEntryTotals.isBalanced ? 'text-green-600' : 'text-red-600'">
{{ formatCurrency(journalEntryTotals.totalCredit) }}
</TableCell>
<TableCell></TableCell>
</TableRow>
</TableBody>
</Table>
</div>

<p v-if="!journalEntryTotals.isBalanced" class="text-sm text-destructive">
⚠️ Debits and credits must be equal
</p>
</div>

<div class="flex justify-end gap-2">
<Button variant="outline" @click="() => { isAddJournalOpen = false; resetJournalForm() }">
  Cancel
</Button>
<Button @click="handleAddJournalEntry" :disabled="!journalEntryTotals.isBalanced">
  Add Entry
</Button>
</div>
</div>
</DialogContent>
</Dialog>
</div>
</div>

<!-- Account Type Summary -->
<div class="grid gap-4 md:grid-cols-5">
<Card
    v-for="(total, type) in accountTypeTotals"
    :key="type"
    class="hover:shadow-md transition-shadow duration-200"
>
  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle class="text-sm font-medium text-muted-foreground">
      {{ type }}
    </CardTitle>
    <BookOpen class="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div class="text-2xl font-bold">{{ formatCurrency(total) }}</div>
    <Badge :class="getAccountTypeColor(type as AccountType)" class="mt-2">
      {{ chartOfAccounts.filter(acc => acc.type === type).length }} accounts
    </Badge>
  </CardContent>
</Card>
</div>

<!-- Chart of Accounts -->
<Card>
<CardHeader>
  <div class="flex items-center justify-between flex-wrap gap-4">
    <div>
      <CardTitle>Chart of Accounts</CardTitle>
      <CardDescription>Complete list of all accounts in the general ledger</CardDescription>
    </div>
    <div class="flex items-center gap-2">
      <div class="relative">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            v-model="searchQuery"
            placeholder="Search accounts..."
            class="pl-8 w-64"
        />
      </div>
      <Select v-model="selectedAccountType">
        <SelectTrigger class="w-32">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Asset">Asset</SelectItem>
          <SelectItem value="Liability">Liability</SelectItem>
          <SelectItem value="Equity">Equity</SelectItem>
          <SelectItem value="Revenue">Revenue</SelectItem>
          <SelectItem value="Expense">Expense</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</CardHeader>
<CardContent>
  <div class="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account Code</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead class="text-right">Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
            v-for="account in displayAccounts"
            :key="account.code"
            class="hover:bg-muted/50 transition-colors"
        >
          <TableCell class="font-mono">{{ account.code }}</TableCell>
          <TableCell class="font-medium">{{ account.name }}</TableCell>
          <TableCell>
            <Badge :class="getAccountTypeColor(account.type)">
              {{ account.type }}
            </Badge>
          </TableCell>
          <TableCell class="font-semibold text-right">{{ formatCurrency(account.balance) }}</TableCell>
          <TableCell>
            <Badge :class="getStatusColor(account.status as any)">
              {{ account.status }}
            </Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">
              <Eye class="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>

  <!-- Empty State -->
  <div v-if="displayAccounts.length === 0" class="text-center py-12">
    <p class="text-muted-foreground">No accounts found</p>
  </div>
</CardContent>
</Card>

<!-- Journal Entries -->
<Card>
<CardHeader>
  <CardTitle>Recent Journal Entries</CardTitle>
  <CardDescription>Latest journal entries and transactions</CardDescription>
</CardHeader>
<CardContent>
  <div class="space-y-4">
    <div
        v-for="entry in journalEntries"
        :key="entry.id"
        class="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-50 rounded-lg">
            <FileText class="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p class="font-medium">{{ entry.description }}</p>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{{ entry.id }}</span>
              <span>•</span>
              <span>{{ entry.date }}</span>
              <span v-if="entry.reference">•</span>
              <span v-if="entry.reference">{{ entry.reference }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Badge :class="getStatusColor(entry.status as any)">
            {{ entry.status }}
          </Badge>
          <Button variant="ghost" size="sm">
            <Edit class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead class="text-right">Debit</TableHead>
              <TableHead class="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="line in entry.entries" :key="line.account">
              <TableCell>
                <div>
                  <span class="font-mono text-sm">{{ line.account }}</span>
                  <span class="ml-2">{{ line.accountName }}</span>
                </div>
              </TableCell>
              <TableCell class="text-right">
                {{ line.debit > 0 ? formatCurrency(line.debit) : '-' }}
              </TableCell>
              <TableCell class="text-right">
                {{ line.credit > 0 ? formatCurrency(line.credit) : '-' }}
              </TableCell>
            </TableRow>
            <TableRow class="border-t-2 font-sem
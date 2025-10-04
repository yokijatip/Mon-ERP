// composables/useFinance.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// ============= Types & Interfaces =============
export interface Transaction {
    id: string
    date: string
    type: 'income' | 'expense' | 'inflow' | 'outflow'
    category: string
    description: string
    amount: number
    status: TransactionStatus
    reference?: string
}

export interface Account {
    code: string
    name: string
    type: AccountType
    balance: number
    status: 'active' | 'inactive'
}

export interface JournalEntry {
    id: string
    date: string
    reference: string
    description: string
    entries: JournalEntryLine[]
    totalDebit: number
    totalCredit: number
    status: 'posted' | 'draft'
}

export interface JournalEntryLine {
    account: string
    accountName: string
    debit: number
    credit: number
}

export type TransactionStatus = 'confirmed' | 'pending' | 'scheduled' | 'forecasted' | 'overdue' | 'cancelled'
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'

// ============= Constants =============
export const STATUS_COLORS: Record<TransactionStatus, string> = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    forecasted: 'bg-orange-100 text-orange-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
}

export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
    Asset: 'bg-blue-100 text-blue-800',
    Liability: 'bg-red-100 text-red-800',
    Equity: 'bg-purple-100 text-purple-800',
    Revenue: 'bg-green-100 text-green-800',
    Expense: 'bg-orange-100 text-orange-800'
}

// ============= Composable =============
export function useFinance() {
    // Format currency with Indonesian locale
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    // Format large numbers for charts
    const formatChartValue = (val: number): string => {
        if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`
        if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)}jt`
        return `Rp ${(val / 1_000).toFixed(0)}rb`
    }

    // Get status badge color
    const getStatusColor = (status: TransactionStatus): string => {
        return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
    }

    // Get account type badge color
    const getAccountTypeColor = (type: AccountType): string => {
        return ACCOUNT_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800'
    }

    // Get transaction styling
    const getTransactionStyle = (type: 'income' | 'expense' | 'inflow' | 'outflow') => {
        const isPositive = type === 'income' || type === 'inflow'
        return {
            color: isPositive ? 'text-green-600' : 'text-red-600',
            bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
            prefix: isPositive ? '+' : '-'
        }
    }

    // Calculate percentage change
    const calculatePercentageChange = (current: number, previous: number): string => {
        if (previous === 0) return '+0%'
        const change = ((current - previous) / previous) * 100
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
    }

    // Validate journal entry balance
    const validateJournalBalance = (entries: JournalEntryLine[]): boolean => {
        const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0)
        const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0)
        return Math.abs(totalDebit - totalCredit) < 0.01 // Allow for floating point precision
    }

    return {
        formatCurrency,
        formatChartValue,
        getStatusColor,
        getAccountTypeColor,
        getTransactionStyle,
        calculatePercentageChange,
        validateJournalBalance
    }
}

// ============= Date Utilities =============
export function useDateUtils() {
    const formatDate = (date: string | Date, locale = 'id-ID'): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(dateObj)
    }

    const isOverdue = (dueDate: string): boolean => {
        return new Date(dueDate) < new Date()
    }

    const getDaysUntil = (date: string): number => {
        const today = new Date()
        const target = new Date(date)
        const diffTime = target.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return {
        formatDate,
        isOverdue,
        getDaysUntil
    }
}

// ============= Search & Filter Utilities =============
export function useSearch<T>(items: Ref<T[]>, searchKeys: (keyof T)[]) {
    const searchQuery = ref('')

    const filteredItems = computed(() => {
        if (!searchQuery.value) return items.value

        const query = searchQuery.value.toLowerCase()
        return items.value.filter(item =>
            searchKeys.some(key => {
                const value = item[key]
                return String(value).toLowerCase().includes(query)
            })
        )
    })

    return {
        searchQuery,
        filteredItems
    }
}
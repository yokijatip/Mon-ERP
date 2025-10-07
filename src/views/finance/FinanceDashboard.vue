<script setup lang="ts">
import { computed } from 'vue'
import ApexChart from '@/components/ApexChart.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ApexOptions } from 'apexcharts'

const cashFlowChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false },
    stacked: false
  },
  colors: ['#10b981', '#ef4444'],
  dataLabels: { enabled: false },
  stroke: { width: [3, 3], curve: 'smooth' },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  }
}))

const cashFlowSeries = [
  {
    name: 'Cash Inflow',
    data: [52000, 58000, 51000, 63000, 59000, 71000, 76000, 72000, 79000, 86000, 82000, 89000]
  },
  {
    name: 'Cash Outflow',
    data: [35000, 41000, 38000, 44000, 42000, 48000, 52000, 49000, 55000, 58000, 54000, 61000]
  }
]

const profitMarginChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false }
  },
  colors: ['#3b82f6'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      dataLabels: { position: 'top' }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}%`,
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `${val}%`
    }
  }
}))

const profitMarginSeries = [
  {
    name: 'Profit Margin',
    data: [32, 29, 26, 31, 29, 32, 32, 32, 30, 33, 34, 31]
  }
]

const accountBalanceChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false }
  },
  colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
  labels: ['Operating Account', 'Savings Account', 'Investment Account', 'Petty Cash'],
  legend: {
    position: 'bottom'
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`
    }
  }
}))

const accountBalanceSeries = [285000, 450000, 320000, 15000]

const expenseBreakdownChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false }
  },
  colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
  },
  xaxis: {
    categories: ['Salaries', 'Operations', 'Marketing', 'R&D', 'Admin', 'Other']
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`
    }
  }
}))

const expenseBreakdownSeries = [
  {
    name: 'Amount',
    data: [125000, 75000, 45000, 35000, 28000, 15000]
  }
]
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$1,070,000</div>
          <p class="text-xs text-muted-foreground mt-1">+18.2% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Total Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$285,000</div>
          <p class="text-xs text-muted-foreground mt-1">-5.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Net Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$28,000</div>
          <p class="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Cash Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$285,000</div>
          <p class="text-xs text-muted-foreground mt-1">Available funds</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart
            :options="cashFlowChartOptions"
            :series="cashFlowSeries"
            type="line"
            height="300"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart
            :options="accountBalanceChartOptions"
            :series="accountBalanceSeries"
            type="pie"
            height="300"
          />
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Profit Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart
            :options="profitMarginChartOptions"
            :series="profitMarginSeries"
            type="bar"
            height="300"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart
            :options="expenseBreakdownChartOptions"
            :series="expenseBreakdownSeries"
            type="bar"
            height="300"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

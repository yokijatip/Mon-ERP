<script setup lang="ts">
import { computed } from 'vue'
import ApexChart from '@/components/ApexChart.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ApexOptions } from 'apexcharts'

const revenueChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false },
    animations: { enabled: true }
  },
  colors: ['#3b82f6'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
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
  }
}))

const revenueSeries = [
  {
    name: 'Revenue',
    data: [45000, 52000, 48000, 61000, 55000, 68000, 72000, 69000, 75000, 82000, 78000, 85000]
  }
]

const expenseChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false }
  },
  colors: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`
    }
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`
    }
  }
}))

const expenseSeries = [
  { name: 'Operations', data: [28000, 31000, 29000, 33000] },
  { name: 'Marketing', data: [12000, 15000, 14000, 18000] },
  { name: 'HR', data: [18000, 19000, 20000, 21000] },
  { name: 'Other', data: [8000, 9000, 7500, 9500] }
]

const categoryChartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false }
  },
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  labels: ['Products', 'Services', 'Subscriptions', 'Consulting', 'Other'],
  legend: {
    position: 'bottom'
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString()}`
    }
  }
}))

const categorySeries = [145000, 98000, 67000, 45000, 23000]
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$756,000</div>
          <p class="text-xs text-muted-foreground mt-1">+12.5% from last year</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$267,500</div>
          <p class="text-xs text-muted-foreground mt-1">+8.2% from last year</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium">Net Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$488,500</div>
          <p class="text-xs text-muted-foreground mt-1">+15.3% from last year</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart
            :options="revenueChartOptions"
            :series="revenueSeries"
            type="area"
            height="300"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart
            :options="categoryChartOptions"
            :series="categorySeries"
            type="donut"
            height="300"
          />
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Quarterly Expenses Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexChart
          :options="expenseChartOptions"
          :series="expenseSeries"
          type="bar"
          height="350"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
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
import VueApexCharts from 'vue3-apexcharts'
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Truck,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Printer,
  Mail,
  RefreshCw,
  Clock
} from 'lucide-vue-next'

// Report Types
const reportTypes = ref([
  {
    id: 'financial',
    title: 'Financial Reports',
    description: 'Revenue, expenses, profit & loss statements',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    reports: [
      { name: 'Profit & Loss Statement', lastGenerated: '2025-10-10', format: 'PDF' },
      { name: 'Cash Flow Report', lastGenerated: '2025-10-10', format: 'Excel' },
      { name: 'Balance Sheet', lastGenerated: '2025-10-09', format: 'PDF' },
      { name: 'Revenue by Channel', lastGenerated: '2025-10-08', format: 'Excel' }
    ]
  },
  {
    id: 'sales',
    title: 'Sales Reports',
    description: 'Sales performance, orders, and customer analytics',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
    reports: [
      { name: 'Monthly Sales Summary', lastGenerated: '2025-10-11', format: 'PDF' },
      { name: 'Top Products Report', lastGenerated: '2025-10-10', format: 'Excel' },
      { name: 'Customer Orders Analysis', lastGenerated: '2025-10-09', format: 'PDF' },
      { name: 'Sales by Region', lastGenerated: '2025-10-08', format: 'Excel' }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Reports',
    description: 'Stock levels, movements, and warehouse analytics',
    icon: Package,
    color: 'bg-purple-100 text-purple-600',
    reports: [
      { name: 'Stock Level Report', lastGenerated: '2025-10-11', format: 'PDF' },
      { name: 'Low Stock Alert', lastGenerated: '2025-10-11', format: 'Excel' },
      { name: 'Inventory Valuation', lastGenerated: '2025-10-10', format: 'PDF' },
      { name: 'Stock Movement History', lastGenerated: '2025-10-09', format: 'Excel' }
    ]
  },
  {
    id: 'purchasing',
    title: 'Purchasing Reports',
    description: 'Purchase orders, suppliers, and procurement analytics',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600',
    reports: [
      { name: 'Purchase Order Summary', lastGenerated: '2025-10-10', format: 'PDF' },
      { name: 'Supplier Performance', lastGenerated: '2025-10-09', format: 'Excel' },
      { name: 'Spend Analysis', lastGenerated: '2025-10-08', format: 'PDF' },
      { name: 'Pending Approvals', lastGenerated: '2025-10-08', format: 'Excel' }
    ]
  },
  {
    id: 'hr',
    title: 'HR Reports',
    description: 'Employee data, attendance, and payroll reports',
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    reports: [
      { name: 'Employee Roster', lastGenerated: '2025-10-10', format: 'PDF' },
      { name: 'Attendance Summary', lastGenerated: '2025-10-10', format: 'Excel' },
      { name: 'Payroll Report', lastGenerated: '2025-10-01', format: 'PDF' },
      { name: 'Leave Balance', lastGenerated: '2025-10-01', format: 'Excel' }
    ]
  }
])

// Sample consolidated data
const consolidatedStats = ref({
  totalRevenue: 1245800,
  revenueChange: 15.3,
  totalExpenses: 892400,
  expenseChange: -8.2,
  netProfit: 353400,
  profitMargin: 28.4,
  totalOrders: 1842,
  orderChange: 12.5,
  totalCustomers: 523,
  customerChange: 8.3,
  inventoryValue: 456700,
  stockTurnover: 4.2
})

// Monthly Comparison Data
const monthlyComparisonSeries = ref([
  {
    name: 'Revenue',
    data: [98000, 105000, 112000, 108000, 115000, 122000, 118000, 125000, 132000, 128000]
  },
  {
    name: 'Expenses',
    data: [72000, 75000, 78000, 76000, 80000, 82000, 79000, 84000, 87000, 85000]
  },
  {
    name: 'Profit',
    data: [26000, 30000, 34000, 32000, 35000, 40000, 39000, 41000, 45000, 43000]
  }
])

const monthlyComparisonOptions = ref({
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: false }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  },
  yaxis: {
    title: { text: 'Amount ($)' }
  },
  colors: ['#22c55e', '#ef4444', '#3b82f6'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Department Performance
const departmentPerformanceSeries = ref([32, 28, 18, 15, 7])
const departmentPerformanceOptions = ref({
  chart: {
    type: 'donut',
    height: 320
  },
  labels: ['Sales', 'Production', 'Purchasing', 'Marketing', 'HR'],
  colors: ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899'],
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`
  }
})

// Top Performing Categories
const topCategories = ref([
  { name: 'Electronics', sales: 425800, growth: 18.5, orders: 342 },
  { name: 'Fashion', sales: 318900, growth: 12.3, orders: 567 },
  { name: 'Home & Living', sales: 256700, growth: -3.2, orders: 289 },
  { name: 'Food & Beverage', sales: 198400, growth: 22.8, orders: 421 },
  { name: 'Health & Beauty', sales: 145900, growth: 8.9, orders: 223 }
])

// Filters
const selectedPeriod = ref('this-month')
const selectedReportType = ref('all')
const dateFrom = ref('')
const dateTo = ref('')

// Generate Report State
const showGenerateSheet = ref(false)
const generateConfig = ref({
  reportType: '',
  format: 'pdf',
  period: 'this-month',
  includeCharts: true,
  includeDetails: true,
  email: '',
  schedule: false
})

function generateReport() {
  console.log('Generating report:', generateConfig.value)
  // TODO: Implement report generation
  showGenerateSheet.value = false
}

function viewReport(reportName: string) {
  console.log('Viewing report:', reportName)
  // TODO: Implement report view
}

function downloadReport(reportName: string, format: string) {
  console.log('Downloading report:', reportName, format)
  // TODO: Implement download
}

function emailReport(reportName: string) {
  console.log('Emailing report:', reportName)
  // TODO: Implement email
}

function printReport(reportName: string) {
  console.log('Printing report:', reportName)
  // TODO: Implement print
}

function refreshData() {
  console.log('Refreshing data...')
  // TODO: Implement data refresh
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Consolidated Reports</h1>
        <p class="text-muted-foreground mt-1">Comprehensive business analytics and reporting</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="refreshData">
          <RefreshCw class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Sheet v-model:open="showGenerateSheet">
          <SheetTrigger as-child>
            <Button size="sm">
              <FileText class="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </SheetTrigger>
          <SheetContent class="sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Generate Custom Report</SheetTitle>
              <SheetDescription>
                Configure and generate your custom report
              </SheetDescription>
            </SheetHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label for="report-type">Report Type</Label>
                <Select v-model="generateConfig.reportType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="purchasing">Purchasing Report</SelectItem>
                    <SelectItem value="hr">HR Report</SelectItem>
                    <SelectItem value="consolidated">Consolidated Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="period">Period</Label>
                <Select v-model="generateConfig.period">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div v-if="generateConfig.period === 'custom'" class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="date-from">From Date</Label>
                  <Input id="date-from" type="date" v-model="dateFrom" />
                </div>
                <div class="space-y-2">
                  <Label for="date-to">To Date</Label>
                  <Input id="date-to" type="date" v-model="dateTo" />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="format">Export Format</Label>
                <Select v-model="generateConfig.format">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-3">
                <Label>Report Options</Label>
                <div class="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      id="include-charts"
                      v-model="generateConfig.includeCharts"
                      class="rounded border-gray-300"
                  />
                  <label for="include-charts" class="text-sm">Include charts and graphs</label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      id="include-details"
                      v-model="generateConfig.includeDetails"
                      class="rounded border-gray-300"
                  />
                  <label for="include-details" class="text-sm">Include detailed breakdowns</label>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="email">Email Report To (Optional)</Label>
                <Input
                    id="email"
                    type="email"
                    v-model="generateConfig.email"
                    placeholder="recipient@company.com"
                />
              </div>

              <div class="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <input
                    type="checkbox"
                    id="schedule"
                    v-model="generateConfig.schedule"
                    class="rounded border-gray-300"
                />
                <label for="schedule" class="text-sm">
                  <span class="font-medium">Schedule recurring report</span>
                  <p class="text-xs text-muted-foreground">Automatically generate this report periodically</p>
                </label>
              </div>
            </div>
            <div class="flex gap-2">
              <Button variant="outline" class="flex-1" @click="showGenerateSheet = false">
                Cancel
              </Button>
              <Button class="flex-1" @click="generateReport">
                <Download class="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    <!-- Key Metrics Overview -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign class="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ consolidatedStats.totalRevenue.toLocaleString() }}</div>
          <div class="flex items-center text-xs mt-1">
            <TrendingUp class="h-3 w-3 text-green-600 mr-1" />
            <span class="text-green-600 font-medium">+{{ consolidatedStats.revenueChange }}%</span>
            <span class="text-muted-foreground ml-1">vs last period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown class="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ consolidatedStats.totalExpenses.toLocaleString() }}</div>
          <div class="flex items-center text-xs mt-1">
            <TrendingDown class="h-3 w-3 text-green-600 mr-1" />
            <span class="text-green-600 font-medium">{{ consolidatedStats.expenseChange }}%</span>
            <span class="text-muted-foreground ml-1">vs last period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Net Profit</CardTitle>
          <BarChart3 class="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ consolidatedStats.netProfit.toLocaleString() }}</div>
          <div class="flex items-center text-xs mt-1">
            <span class="text-muted-foreground">Margin:</span>
            <span class="font-medium ml-1">{{ consolidatedStats.profitMargin }}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart class="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ consolidatedStats.totalOrders.toLocaleString() }}</div>
          <div class="flex items-center text-xs mt-1">
            <TrendingUp class="h-3 w-3 text-green-600 mr-1" />
            <span class="text-green-600 font-medium">+{{ consolidatedStats.orderChange }}%</span>
            <span class="text-muted-foreground ml-1">vs last period</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Period Filter -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1">
            <Label for="period-filter" class="mb-2">Report Period</Label>
            <Select v-model="selectedPeriod">
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex-1">
            <Label for="report-filter" class="mb-2">Report Category</Label>
            <Select v-model="selectedReportType">
              <SelectTrigger>
                <SelectValue placeholder="All reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="purchasing">Purchasing</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button>
            <Filter class="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Charts Row -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Monthly Comparison -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Financial Performance Trend</CardTitle>
              <CardDescription>Revenue, expenses, and profit over time</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Download class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="line"
              height="350"
              :options="monthlyComparisonOptions"
              :series="monthlyComparisonSeries"
          />
        </CardContent>
      </Card>

      <!-- Department Performance -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Department Performance</CardTitle>
            <Button variant="ghost" size="icon">
              <Download class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="donut"
              height="320"
              :options="departmentPerformanceOptions"
              :series="departmentPerformanceSeries"
          />
        </CardContent>
      </Card>
    </div>

    <!-- Top Categories Performance -->
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Categories</CardTitle>
        <CardDescription>Sales performance by product category</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="category in topCategories" :key="category.name"
               class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div class="flex-1">
              <div class="font-semibold mb-1">{{ category.name }}</div>
              <div class="text-sm text-muted-foreground">{{ category.orders }} orders</div>
            </div>
            <div class="flex items-center gap-8">
              <div class="text-right">
                <div class="font-bold text-lg">${{ category.sales.toLocaleString() }}</div>
                <div class="flex items-center text-sm">
                  <component
                      :is="category.growth > 0 ? TrendingUp : TrendingDown"
                      :class="[
                      'h-3 w-3 mr-1',
                      category.growth > 0 ? 'text-green-600' : 'text-red-600'
                    ]"
                  />
                  <span :class="category.growth > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ Math.abs(category.growth) }}%
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Eye class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Report Categories -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="reportType in reportTypes" :key="reportType.id"
            class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <div :class="[reportType.color, 'p-3 rounded-lg']">
                <component :is="reportType.icon" class="h-6 w-6" />
              </div>
              <div>
                <CardTitle class="text-lg">{{ reportType.title }}</CardTitle>
                <CardDescription class="text-xs">{{ reportType.description }}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div v-for="report in reportType.reports" :key="report.name"
                 class="flex items-center justify-between p-2 rounded hover:bg-gray-50">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ report.name }}</div>
                <div class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Clock class="h-3 w-3" />
                  <span>{{ report.lastGenerated }}</span>
                  <Badge variant="outline" class="text-xs">{{ report.format }}</Badge>
                </div>
              </div>
              <div class="flex gap-1 ml-2">
                <Button variant="ghost" size="icon" class="h-7 w-7" @click="viewReport(report.name)">
                  <Eye class="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" class="h-7 w-7" @click="downloadReport(report.name, report.format)">
                  <Download class="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" class="w-full mt-4">
            <FileText class="h-3.5 w-3.5 mr-2" />
            View All {{ reportType.title }}
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common reporting tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" class="h-20 flex-col gap-2">
            <Download class="h-5 w-5" />
            <span class="text-xs">Export All Data</span>
          </Button>
          <Button variant="outline" class="h-20 flex-col gap-2">
            <Mail class="h-5 w-5" />
            <span class="text-xs">Email Reports</span>
          </Button>
          <Button variant="outline" class="h-20 flex-col gap-2">
            <Printer class="h-5 w-5" />
            <span class="text-xs">Print Reports</span>
          </Button>
          <Button variant="outline" class="h-20 flex-col gap-2">
            <Calendar class="h-5 w-5" />
            <span class="text-xs">Schedule Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Search,
  Filter,
  Calendar,
  Package,
  ShoppingCart,
  Users,
  Truck,
  DollarSign,
  Plus,
  RefreshCw,
  Eye
} from 'lucide-vue-next'

// Export history data
const exportHistory = ref([
  {
    id: 'EXP-2025-001',
    name: 'Monthly Sales Report',
    type: 'Sales Data',
    format: 'Excel',
    size: '2.4 MB',
    records: 1842,
    status: 'Completed',
    createdBy: 'John Manager',
    createdAt: '2025-10-11 14:23',
    expiresAt: '2025-10-18 14:23',
    downloadUrl: '#'
  },
  {
    id: 'EXP-2025-002',
    name: 'Product Inventory Full Export',
    type: 'Inventory Data',
    format: 'CSV',
    size: '8.7 MB',
    records: 5634,
    status: 'Completed',
    createdBy: 'Sarah Chen',
    createdAt: '2025-10-11 10:15',
    expiresAt: '2025-10-18 10:15',
    downloadUrl: '#'
  },
  {
    id: 'EXP-2025-003',
    name: 'Customer Database Export',
    type: 'Customer Data',
    format: 'Excel',
    size: '1.2 MB',
    records: 523,
    status: 'Processing',
    createdBy: 'Mike Johnson',
    createdAt: '2025-10-11 09:45',
    expiresAt: '2025-10-18 09:45',
    progress: 65,
    downloadUrl: null
  },
  {
    id: 'EXP-2025-004',
    name: 'Purchase Orders Q3 2025',
    type: 'Purchasing Data',
    format: 'PDF',
    size: '4.3 MB',
    records: 287,
    status: 'Completed',
    createdBy: 'Emily Davis',
    createdAt: '2025-10-10 16:30',
    expiresAt: '2025-10-17 16:30',
    downloadUrl: '#'
  },
  {
    id: 'EXP-2025-005',
    name: 'Employee Payroll September',
    type: 'HR Data',
    format: 'Excel',
    size: '892 KB',
    records: 156,
    status: 'Completed',
    createdBy: 'HR Department',
    createdAt: '2025-10-10 11:20',
    expiresAt: '2025-10-17 11:20',
    downloadUrl: '#'
  },
  {
    id: 'EXP-2025-006',
    name: 'Financial Transactions Export',
    type: 'Financial Data',
    format: 'JSON',
    size: '3.1 MB',
    records: 2341,
    status: 'Failed',
    createdBy: 'Finance Team',
    createdAt: '2025-10-09 15:45',
    expiresAt: '2025-10-16 15:45',
    error: 'Connection timeout. Please try again.',
    downloadUrl: null
  },
  {
    id: 'EXP-2025-007',
    name: 'Supplier Performance Report',
    type: 'Purchasing Data',
    format: 'PDF',
    size: '1.8 MB',
    records: 73,
    status: 'Completed',
    createdBy: 'Procurement Team',
    createdAt: '2025-10-09 13:10',
    expiresAt: '2025-10-16 13:10',
    downloadUrl: '#'
  },
  {
    id: 'EXP-2025-008',
    name: 'Order Fulfillment Data',
    type: 'Sales Data',
    format: 'CSV',
    size: '5.6 MB',
    records: 3128,
    status: 'Expired',
    createdBy: 'Operations',
    createdAt: '2025-10-01 09:30',
    expiresAt: '2025-10-08 09:30',
    downloadUrl: null
  }
])

// Export templates
const exportTemplates = ref([
  {
    id: 'tpl-sales',
    name: 'Sales Data Export',
    description: 'Complete sales records including orders, revenue, and customers',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
    dataType: 'Sales Data',
    fields: ['Order ID', 'Customer', 'Products', 'Total Amount', 'Status', 'Date'],
    formats: ['Excel', 'CSV', 'PDF']
  },
  {
    id: 'tpl-inventory',
    name: 'Inventory Export',
    description: 'Stock levels, movements, and warehouse data',
    icon: Package,
    color: 'bg-purple-100 text-purple-600',
    dataType: 'Inventory Data',
    fields: ['SKU', 'Product Name', 'Quantity', 'Location', 'Status', 'Last Updated'],
    formats: ['Excel', 'CSV']
  },
  {
    id: 'tpl-customers',
    name: 'Customer Database',
    description: 'Customer information and contact details',
    icon: Users,
    color: 'bg-green-100 text-green-600',
    dataType: 'Customer Data',
    fields: ['Customer ID', 'Name', 'Email', 'Phone', 'Address', 'Total Orders'],
    formats: ['Excel', 'CSV', 'JSON']
  },
  {
    id: 'tpl-purchasing',
    name: 'Purchase Orders',
    description: 'PO history, suppliers, and procurement data',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600',
    dataType: 'Purchasing Data',
    fields: ['PO Number', 'Supplier', 'Items', 'Amount', 'Status', 'Date'],
    formats: ['Excel', 'PDF', 'CSV']
  },
  {
    id: 'tpl-financial',
    name: 'Financial Transactions',
    description: 'Revenue, expenses, and transaction history',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    dataType: 'Financial Data',
    fields: ['Transaction ID', 'Type', 'Amount', 'Category', 'Description', 'Date'],
    formats: ['Excel', 'CSV', 'JSON']
  },
  {
    id: 'tpl-products',
    name: 'Product Catalog',
    description: 'Complete product information and pricing',
    icon: Database,
    color: 'bg-pink-100 text-pink-600',
    dataType: 'Product Data',
    fields: ['SKU', 'Name', 'Category', 'Price', 'Stock', 'Status'],
    formats: ['Excel', 'CSV', 'JSON']
  }
])

// Stats
const stats = computed(() => ({
  total: exportHistory.value.length,
  completed: exportHistory.value.filter(e => e.status === 'Completed').length,
  processing: exportHistory.value.filter(e => e.status === 'Processing').length,
  failed: exportHistory.value.filter(e => e.status === 'Failed').length
}))

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const formatFilter = ref('all')

// Filtered exports
const filteredExports = computed(() => {
  return exportHistory.value.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        exp.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || exp.status === statusFilter.value
    const matchesType = typeFilter.value === 'all' || exp.type === typeFilter.value
    const matchesFormat = formatFilter.value === 'all' || exp.format === formatFilter.value

    return matchesSearch && matchesStatus && matchesType && matchesFormat
  })
})

// New export state
const showNewExportSheet = ref(false)
const newExport = ref({
  template: '',
  format: '',
  dateFrom: '',
  dateTo: '',
  filters: {
    status: 'all',
    category: 'all'
  },
  includeHeaders: true,
  compression: false
})

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200'
    case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Failed': return 'bg-red-100 text-red-700 border-red-200'
    case 'Expired': return 'bg-gray-100 text-gray-700 border-gray-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Completed': return CheckCircle
    case 'Processing': return Clock
    case 'Failed': return XCircle
    case 'Expired': return AlertTriangle
    default: return Clock
  }
}

function getFormatIcon(format: string) {
  switch (format) {
    case 'Excel': return FileSpreadsheet
    case 'CSV': return FileText
    case 'PDF': return FileText
    case 'JSON': return FileJson
    default: return FileText
  }
}

function createExport() {
  console.log('Creating export:', newExport.value)
  // TODO: Implement export creation
  showNewExportSheet.value = false
  // Reset form
  newExport.value = {
    template: '',
    format: '',
    dateFrom: '',
    dateTo: '',
    filters: {
      status: 'all',
      category: 'all'
    },
    includeHeaders: true,
    compression: false
  }
}

function downloadExport(id: string) {
  console.log('Downloading export:', id)
  // TODO: Implement download
}

function retryExport(id: string) {
  console.log('Retrying export:', id)
  // TODO: Implement retry
}

function deleteExport(id: string) {
  const index = exportHistory.value.findIndex(e => e.id === id)
  if (index > -1) {
    exportHistory.value.splice(index, 1)
  }
}

function selectTemplate(templateId: string) {
  const template = exportTemplates.value.find(t => t.id === templateId)
  if (template) {
    newExport.value.template = templateId
    newExport.value.format = template.formats[0]
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Data Exports</h1>
        <p class="text-muted-foreground mt-1">Export and download your business data</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Sheet v-model:open="showNewExportSheet">
          <SheetTrigger as-child>
            <Button size="sm">
              <Plus class="h-4 w-4 mr-2" />
              New Export
            </Button>
          </SheetTrigger>
          <SheetContent class="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Create New Export</SheetTitle>
              <SheetDescription>
                Select data type and configure export settings
              </SheetDescription>
            </SheetHeader>
            <div class="space-y-6 py-4">
              <!-- Template Selection -->
              <div class="space-y-3">
                <Label>Select Data Type</Label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                      v-for="template in exportTemplates"
                      :key="template.id"
                      @click="selectTemplate(template.id)"
                      :class="[
                      'p-4 border-2 rounded-lg text-left transition-all hover:shadow-md',
                      newExport.template === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <div class="flex items-start gap-3">
                      <div :class="[template.color, 'p-2 rounded-lg']">
                        <component :is="template.icon" class="h-5 w-5" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-sm">{{ template.name }}</div>
                        <div class="text-xs text-muted-foreground mt-1">
                          {{ template.description }}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Format Selection -->
              <div v-if="newExport.template" class="space-y-2">
                <Label for="format">Export Format</Label>
                <Select v-model="newExport.format">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                        v-for="format in exportTemplates.find(t => t.id === newExport.template)?.formats"
                        :key="format"
                        :value="format"
                    >
                      {{ format }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Date Range -->
              <div class="space-y-2">
                <Label>Date Range (Optional)</Label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <Label for="date-from" class="text-xs text-muted-foreground">From</Label>
                    <Input id="date-from" type="date" v-model="newExport.dateFrom" />
                  </div>
                  <div>
                    <Label for="date-to" class="text-xs text-muted-foreground">To</Label>
                    <Input id="date-to" type="date" v-model="newExport.dateTo" />
                  </div>
                </div>
              </div>

              <!-- Filters -->
              <div class="space-y-2">
                <Label>Additional Filters</Label>
                <div class="grid grid-cols-2 gap-4">
                  <Select v-model="newExport.filters.status">
                    <SelectTrigger>
                      <SelectValue placeholder="Status filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="completed">Completed Only</SelectItem>
                      <SelectItem value="pending">Pending Only</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select v-model="newExport.filters.category">
                    <SelectTrigger>
                      <SelectValue placeholder="Category filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <!-- Options -->
              <div class="space-y-3">
                <Label>Export Options</Label>
                <div class="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      id="include-headers"
                      v-model="newExport.includeHeaders"
                      class="rounded border-gray-300"
                  />
                  <label for="include-headers" class="text-sm">Include column headers</label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                      type="checkbox"
                      id="compression"
                      v-model="newExport.compression"
                      class="rounded border-gray-300"
                  />
                  <label for="compression" class="text-sm">Compress file (ZIP format)</label>
                </div>
              </div>

              <!-- Preview -->
              <div v-if="newExport.template" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="text-sm font-medium mb-2">Export Preview</div>
                <div class="space-y-1 text-xs text-muted-foreground">
                  <div>Data Type: <span class="font-medium text-foreground">{{ exportTemplates.find(t => t.id === newExport.template)?.dataType }}</span></div>
                  <div>Format: <span class="font-medium text-foreground">{{ newExport.format || 'Not selected' }}</span></div>
                  <div>Fields: <span class="font-medium text-foreground">{{ exportTemplates.find(t => t.id === newExport.template)?.fields.length }} columns</span></div>
                  <div v-if="newExport.dateFrom && newExport.dateTo">
                    Date Range: <span class="font-medium text-foreground">{{ newExport.dateFrom }} to {{ newExport.dateTo }}</span>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" @click="showNewExportSheet = false">Cancel</Button>
              <Button @click="createExport" :disabled="!newExport.template || !newExport.format">
                <Download class="h-4 w-4 mr-2" />
                Create Export
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Exports</CardTitle>
          <Database class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Completed</CardTitle>
          <CheckCircle class="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.completed }}</div>
          <p class="text-xs text-muted-foreground">Ready to download</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Processing</CardTitle>
          <Clock class="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.processing }}</div>
          <p class="text-xs text-muted-foreground">In progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Failed</CardTitle>
          <XCircle class="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.failed }}</div>
          <p class="text-xs text-muted-foreground">Need attention</p>
        </CardContent>
      </Card>
    </div>

    <!-- Export Templates -->
    <Card>
      <CardHeader>
        <CardTitle>Export Templates</CardTitle>
        <CardDescription>Quick export templates for common data types</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <button
              v-for="template in exportTemplates"
              :key="template.id"
              @click="() => { showNewExportSheet = true; selectTemplate(template.id) }"
              class="p-4 border rounded-lg text-left hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <div class="flex items-start gap-3 mb-3">
              <div :class="[template.color, 'p-2 rounded-lg']">
                <component :is="template.icon" class="h-5 w-5" />
              </div>
              <div class="flex-1">
                <div class="font-semibold">{{ template.name }}</div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ template.description }}
                </div>
              </div>
            </div>
            <div class="flex gap-1 flex-wrap">
              <Badge v-for="format in template.formats" :key="format" variant="outline" class="text-xs">
                {{ format }}
              </Badge>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchQuery"
                  placeholder="Search exports by name or ID..."
                  class="pl-9"
              />
            </div>
          </div>

          <Select v-model="statusFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="typeFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sales Data">Sales Data</SelectItem>
              <SelectItem value="Inventory Data">Inventory Data</SelectItem>
              <SelectItem value="Customer Data">Customer Data</SelectItem>
              <SelectItem value="Purchasing Data">Purchasing Data</SelectItem>
              <SelectItem value="Financial Data">Financial Data</SelectItem>
              <SelectItem value="HR Data">HR Data</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="formatFilter">
            <SelectTrigger class="w-[130px]">
              <SelectValue placeholder="All Formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="Excel">Excel</SelectItem>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Export History -->
    <Card>
      <CardHeader>
        <CardTitle>Export History ({{ filteredExports.length }})</CardTitle>
        <CardDescription>Recent data exports and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="exp in filteredExports" :key="exp.id"
               class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div class="flex items-start gap-4 flex-1">
              <div :class="[
                'p-2 rounded-lg',
                exp.status === 'Completed' ? 'bg-green-100 text-green-600' :
                exp.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                exp.status === 'Failed' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              ]">
                <component :is="getFormatIcon(exp.format)" class="h-5 w-5" />
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold">{{ exp.name }}</span>
                  <Badge :class="getStatusColor(exp.status)" class="text-xs">
                    <component :is="getStatusIcon(exp.status)" class="h-3 w-3 mr-1" />
                    {{ exp.status }}
                  </Badge>
                  <Badge variant="outline" class="text-xs">{{ exp.format }}</Badge>
                </div>

                <div class="text-sm text-muted-foreground space-y-1">
                  <div>{{ exp.type }} • {{ exp.records.toLocaleString() }} records • {{ exp.size }}</div>
                  <div class="flex items-center gap-4">
                    <span>Created: {{ exp.createdAt }}</span>
                    <span>•</span>
                    <span>By: {{ exp.createdBy }}</span>
                    <span>•</span>
                    <span :class="exp.status === 'Expired' ? 'text-red-600' : ''">
                      Expires: {{ exp.expiresAt }}
                    </span>
                  </div>
                </div>

                <!-- Progress bar for processing -->
                <div v-if="exp.status === 'Processing'" class="mt-2">
                  <Progress :model-value="exp.progress" class="h-2" />
                  <div class="text-xs text-muted-foreground mt-1">{{ exp.progress }}% complete</div>
                </div>

                <!-- Error message -->
                <div v-if="exp.status === 'Failed' && exp.error"
                     class="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle class="h-3 w-3" />
                  {{ exp.error }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Completed actions -->
              <template v-if="exp.status === 'Completed'">
                <Button size="sm" @click="downloadExport(exp.id)">
                  <Download class="h-4 w-4 mr-1" />
                  Download
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Export?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this export? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction @click="deleteExport(exp.id)">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </template>

              <!-- Failed actions -->
              <template v-if="exp.status === 'Failed'">
                <Button size="sm" variant="outline" @click="retryExport(exp.id)">
                  <RefreshCw class="h-4 w-4 mr-1" />
                  Retry
                </Button>
                <Button variant="ghost" size="icon" @click="deleteExport(exp.id)">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </template>

              <!-- Processing actions -->
              <template v-if="exp.status === 'Processing'">
                <Button size="sm" variant="outline" disabled>
                  <Clock class="h-4 w-4 mr-1" />
                  Processing...
                </Button>
              </template>

              <!-- Expired actions -->
              <template v-if="exp.status === 'Expired'">
                <Button size="sm" variant="outline" @click="retryExport(exp.id)">
                  <RefreshCw class="h-4 w-4 mr-1" />
                  Re-export
                </Button>
                <Button variant="ghost" size="icon" @click="deleteExport(exp.id)">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </template>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredExports.length === 0" class="text-center py-12">
          <Database class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-1">No exports found</h3>
          <p class="text-muted-foreground mb-4">Try adjusting your filters or create a new export</p>
          <Button @click="showNewExportSheet = true">
            <Plus class="h-4 w-4 mr-2" />
            Create First Export
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
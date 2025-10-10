<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import {
  Search,
  Download,
  Eye,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-vue-next'

// Sample PO data
const purchaseOrders = ref([
  {
    id: 'PO-2025-1842',
    prNumber: 'PR-2025-0456',
    supplier: {
      name: 'Global Tech Supplies',
      contact: 'support@globaltech.com',
      phone: '+1-234-567-8900'
    },
    orderDate: '2025-10-10',
    deliveryDate: '2025-10-20',
    expectedDelivery: '2025-10-20',
    status: 'In Progress',
    paymentStatus: 'Pending',
    paymentTerms: 'Net 30',
    items: [
      { name: 'Laptop HP Pavilion', sku: 'LPT-HP-001', quantity: 5, unit: 'pcs', unitPrice: 1700, received: 0 },
      { name: 'Office Chair Ergonomic', sku: 'CHR-ERG-002', quantity: 10, unit: 'pcs', unitPrice: 250, received: 0 },
      { name: 'Printer Canon MF445dw', sku: 'PRT-CN-003', quantity: 2, unit: 'pcs', unitPrice: 2250, received: 0 }
    ],
    subtotal: 15500,
    tax: 1550,
    shipping: 150,
    total: 17200,
    notes: 'Urgent delivery required',
    history: [
      { date: '2025-10-10', action: 'PO Created', user: 'Sarah Johnson', details: 'Purchase order created from PR-2025-0456' },
      { date: '2025-10-10', action: 'Sent to Supplier', user: 'System', details: 'PO sent to supplier via email' }
    ]
  },
  {
    id: 'PO-2025-1841',
    prNumber: 'PR-2025-0455',
    supplier: {
      name: 'Premium Materials Co',
      contact: 'sales@premiummaterials.com',
      phone: '+1-234-567-8901'
    },
    orderDate: '2025-10-09',
    deliveryDate: '2025-10-22',
    expectedDelivery: '2025-10-22',
    status: 'Pending Approval',
    paymentStatus: 'Not Started',
    paymentTerms: 'Net 45',
    items: [
      { name: 'Dell PowerEdge R740', sku: 'SRV-DL-001', quantity: 2, unit: 'units', unitPrice: 12000, received: 0 },
      { name: 'Network Switch 48-port', sku: 'NSW-48P-001', quantity: 1, unit: 'unit', unitPrice: 3500, received: 0 },
      { name: 'UPS APC 3000VA', sku: 'UPS-APC-3K', quantity: 2, unit: 'units', unitPrice: 700, received: 0 }
    ],
    subtotal: 28900,
    tax: 2890,
    shipping: 200,
    total: 31990,
    notes: 'Infrastructure upgrade project',
    history: [
      { date: '2025-10-09', action: 'PO Created', user: 'Mike Chen', details: 'Purchase order created from approved PR' }
    ]
  },
  {
    id: 'PO-2025-1840',
    prNumber: 'PR-2025-0454',
    supplier: {
      name: 'Swift Logistics Ltd',
      contact: 'orders@swiftlogistics.com',
      phone: '+1-234-567-8902'
    },
    orderDate: '2025-10-08',
    deliveryDate: '2025-10-18',
    expectedDelivery: '2025-10-18',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentTerms: 'Net 30',
    items: [
      { name: 'Packaging Boxes Large', sku: 'PKG-BX-L01', quantity: 500, unit: 'pcs', unitPrice: 2.5, received: 500 },
      { name: 'Bubble Wrap Roll', sku: 'PKG-BW-R01', quantity: 50, unit: 'rolls', unitPrice: 15, received: 50 },
      { name: 'Packing Tape Heavy Duty', sku: 'PKG-TP-HD', quantity: 100, unit: 'rolls', unitPrice: 3.5, received: 100 }
    ],
    subtotal: 2350,
    tax: 235,
    shipping: 85,
    total: 2670,
    notes: 'Monthly packaging supplies',
    history: [
      { date: '2025-10-08', action: 'PO Created', user: 'Emily Davis', details: 'Regular monthly order' },
      { date: '2025-10-08', action: 'Approved', user: 'John Manager', details: 'PO approved by purchasing manager' },
      { date: '2025-10-08', action: 'Sent to Supplier', user: 'System', details: 'PO sent via email' },
      { date: '2025-10-15', action: 'In Transit', user: 'System', details: 'Shipment tracking: TRK123456' },
      { date: '2025-10-18', action: 'Received', user: 'Warehouse Team', details: 'All items received and verified' },
      { date: '2025-10-18', action: 'Completed', user: 'System', details: 'PO marked as completed' }
    ]
  },
  {
    id: 'PO-2025-1839',
    prNumber: 'PR-2025-0453',
    supplier: {
      name: 'Quality Parts Inc',
      contact: 'info@qualityparts.com',
      phone: '+1-234-567-8903'
    },
    orderDate: '2025-10-07',
    deliveryDate: '2025-10-19',
    expectedDelivery: '2025-10-19',
    status: 'In Transit',
    paymentStatus: 'Partial',
    paymentTerms: 'Net 60',
    items: [
      { name: 'Steel Components Grade A', sku: 'MTL-STL-A01', quantity: 200, unit: 'kg', unitPrice: 45, received: 0 },
      { name: 'Aluminum Sheets 2mm', sku: 'MTL-ALM-2M', quantity: 100, unit: 'sheets', unitPrice: 85, received: 0 },
      { name: 'Fasteners Kit Premium', sku: 'FST-KT-PR', quantity: 50, unit: 'kits', unitPrice: 120, received: 0 }
    ],
    subtotal: 23500,
    tax: 2350,
    shipping: 300,
    total: 26150,
    notes: 'Production materials Q4',
    history: [
      { date: '2025-10-07', action: 'PO Created', user: 'Production Manager', details: 'Quarterly material order' },
      { date: '2025-10-07', action: 'Approved', user: 'CFO', details: 'Approved by finance department' },
      { date: '2025-10-07', action: 'Sent to Supplier', user: 'System', details: 'PO confirmation sent' },
      { date: '2025-10-12', action: 'Payment - Deposit', user: 'Finance Team', details: '50% deposit paid: $13,075' },
      { date: '2025-10-16', action: 'Shipped', user: 'Supplier', details: 'Items shipped, tracking: TRK789012' }
    ]
  },
  {
    id: 'PO-2025-1838',
    prNumber: 'PR-2025-0452',
    supplier: {
      name: 'Mega Wholesale',
      contact: 'wholesale@mega.com',
      phone: '+1-234-567-8904'
    },
    orderDate: '2025-10-06',
    deliveryDate: '2025-10-17',
    expectedDelivery: '2025-10-17',
    status: 'Delayed',
    paymentStatus: 'Pending',
    paymentTerms: 'COD',
    items: [
      { name: 'Office Supplies Bundle', sku: 'OFF-BDL-001', quantity: 10, unit: 'bundles', unitPrice: 150, received: 0 },
      { name: 'Cleaning Supplies Kit', sku: 'CLN-KIT-001', quantity: 5, unit: 'kits', unitPrice: 80, received: 0 },
      { name: 'Pantry Stock Monthly', sku: 'PNT-MNT-001', quantity: 1, unit: 'package', unitPrice: 450, received: 0 }
    ],
    subtotal: 2350,
    tax: 235,
    shipping: 50,
    total: 2635,
    notes: 'Monthly office supplies - DELAYED by supplier',
    history: [
      { date: '2025-10-06', action: 'PO Created', user: 'Admin Office', details: 'Monthly recurring order' },
      { date: '2025-10-06', action: 'Approved', user: 'Office Manager', details: 'Auto-approved recurring order' },
      { date: '2025-10-06', action: 'Sent to Supplier', user: 'System', details: 'Order placed online' },
      { date: '2025-10-15', action: 'Delay Notification', user: 'Supplier', details: 'Delivery postponed to Oct 25' }
    ]
  },
  {
    id: 'PO-2025-1837',
    prNumber: 'PR-2025-0451',
    supplier: {
      name: 'Tech Solutions Hub',
      contact: 'sales@techsolutions.com',
      phone: '+1-234-567-8905'
    },
    orderDate: '2025-10-05',
    deliveryDate: '2025-10-15',
    expectedDelivery: '2025-10-15',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    paymentTerms: 'Net 30',
    items: [
      { name: 'Software Licenses Annual', sku: 'SW-LIC-AN1', quantity: 25, unit: 'licenses', unitPrice: 299, received: 0 },
      { name: 'Cloud Storage 1TB', sku: 'CLD-STR-1T', quantity: 10, unit: 'subscriptions', unitPrice: 120, received: 0 }
    ],
    subtotal: 8675,
    tax: 867.5,
    shipping: 0,
    total: 9542.5,
    notes: 'Order cancelled - found better pricing elsewhere',
    history: [
      { date: '2025-10-05', action: 'PO Created', user: 'IT Manager', details: 'Annual software renewal' },
      { date: '2025-10-05', action: 'Approved', user: 'CTO', details: 'Budget approved' },
      { date: '2025-10-06', action: 'Cancelled', user: 'IT Manager', details: 'Better offer found from another vendor' },
      { date: '2025-10-07', action: 'Refund Processed', user: 'Finance', details: 'Full refund of deposit' }
    ]
  }
])

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const paymentStatusFilter = ref('all')
const dateRangeFilter = ref('all')

// Computed filtered data
const filteredOrders = computed(() => {
  return purchaseOrders.value.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        po.supplier.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        po.prNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || po.status === statusFilter.value
    const matchesPayment = paymentStatusFilter.value === 'all' || po.paymentStatus === paymentStatusFilter.value

    return matchesSearch && matchesStatus && matchesPayment
  })
})

// Stats
const stats = computed(() => ({
  total: purchaseOrders.value.length,
  inProgress: purchaseOrders.value.filter(po => po.status === 'In Progress' || po.status === 'In Transit').length,
  completed: purchaseOrders.value.filter(po => po.status === 'Completed').length,
  totalValue: purchaseOrders.value.reduce((sum, po) => sum + po.total, 0)
}))

// Selected PO for detail view
const selectedPO = ref(null)

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200'
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'In Transit': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'Pending Approval': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'Delayed': return 'bg-red-100 text-red-700 border-red-200'
    case 'Cancelled': return 'bg-gray-100 text-gray-700 border-gray-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-700'
    case 'Partial': return 'bg-blue-100 text-blue-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Not Started': return 'bg-gray-100 text-gray-700'
    case 'Refunded': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Completed': return CheckCircle
    case 'In Progress': return Clock
    case 'In Transit': return Truck
    case 'Pending Approval': return AlertTriangle
    case 'Delayed': return XCircle
    case 'Cancelled': return XCircle
    default: return Package
  }
}

function calculateReceivingProgress(items: any[]) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const receivedQuantity = items.reduce((sum, item) => sum + item.received, 0)
  return totalQuantity > 0 ? (receivedQuantity / totalQuantity) * 100 : 0
}

function viewDetails(po: any) {
  selectedPO.value = po
}

function exportPO(po: any) {
  console.log('Exporting PO:', po.id)
  // TODO: Implement PDF export
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Purchase Order History</h1>
        <p class="text-muted-foreground mt-1">Track and manage all purchase orders</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <Calendar class="h-4 w-4 mr-2" />
          Date Range
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Orders</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground">All purchase orders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Active Orders</CardTitle>
          <Package class="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.inProgress }}</div>
          <p class="text-xs text-muted-foreground">In progress & transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Completed</CardTitle>
          <CheckCircle class="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.completed }}</div>
          <p class="text-xs text-muted-foreground">Successfully fulfilled</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Value</CardTitle>
          <DollarSign class="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ stats.totalValue.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground flex items-center">
            <TrendingUp class="h-3 w-3 mr-1 text-green-600" />
            <span class="text-green-600">+12.5%</span> vs last month
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Filters & Search -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  v-model="searchQuery"
                  placeholder="Search by PO number, supplier, or PR number..."
                  class="pl-9"
              />
            </div>
          </div>

          <Select v-model="statusFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="paymentStatusFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- PO List -->
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders ({{ filteredOrders.length }})</CardTitle>
        <CardDescription>Complete history of all purchase orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="po in filteredOrders" :key="po.id"
               class="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-start gap-3">
                <div :class="[
                  'p-2 rounded-lg',
                  po.status === 'Completed' ? 'bg-green-100 text-green-600' :
                  po.status === 'In Transit' ? 'bg-purple-100 text-purple-600' :
                  po.status === 'Delayed' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                ]">
                  <component :is="getStatusIcon(po.status)" class="h-5 w-5" />
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-lg">{{ po.id }}</span>
                    <Badge :class="getStatusColor(po.status)" class="text-xs">
                      {{ po.status }}
                    </Badge>
                  </div>

                  <div class="text-sm space-y-1">
                    <div class="font-medium">{{ po.supplier.name }}</div>
                    <div class="text-muted-foreground">
                      From: {{ po.prNumber }} • {{ po.items.length }} items • {{ po.paymentTerms }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <div class="text-2xl font-bold mb-1">${{ po.total.toLocaleString() }}</div>
                <Badge :class="getPaymentStatusColor(po.paymentStatus)" class="text-xs mb-2">
                  {{ po.paymentStatus }}
                </Badge>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <div class="text-muted-foreground text-xs">Order Date</div>
                <div class="font-medium">{{ po.orderDate }}</div>
              </div>
              <div>
                <div class="text-muted-foreground text-xs">Expected Delivery</div>
                <div class="font-medium">{{ po.expectedDelivery }}</div>
              </div>
              <div>
                <div class="text-muted-foreground text-xs">Items Progress</div>
                <div class="font-medium">
                  {{ po.items.reduce((sum, item) => sum + item.received, 0) }} /
                  {{ po.items.reduce((sum, item) => sum + item.quantity, 0) }}
                </div>
              </div>
            </div>

            <div v-if="po.status !== 'Cancelled' && po.status !== 'Completed'" class="mb-3">
              <Progress :model-value="calculateReceivingProgress(po.items)" class="h-2" />
            </div>

            <div class="flex items-center justify-between pt-3 border-t">
              <div class="text-sm text-muted-foreground">
                Last updated: {{ po.history[po.history.length - 1].date }}
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="exportPO(po)">
                  <Download class="h-3.5 w-3.5 mr-1" />
                  Export
                </Button>

                <Sheet>
                  <SheetTrigger as-child>
                    <Button variant="outline" size="sm" @click="viewDetails(po)">
                      <Eye class="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent class="sm:max-w-3xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Purchase Order Details</SheetTitle>
                      <SheetDescription>{{ po.id }}</SheetDescription>
                    </SheetHeader>

                    <div class="space-y-6 py-4">
                      <!-- PO Header -->
                      <div class="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 class="text-lg font-bold mb-2">{{ po.id }}</h3>
                          <div class="flex gap-2 mb-3">
                            <Badge :class="getStatusColor(po.status)">
                              {{ po.status }}
                            </Badge>
                            <Badge :class="getPaymentStatusColor(po.paymentStatus)">
                              Payment: {{ po.paymentStatus }}
                            </Badge>
                          </div>
                          <div class="text-sm text-muted-foreground">
                            Reference PR: {{ po.prNumber }}
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-sm text-muted-foreground mb-1">Total Amount</div>
                          <div class="text-3xl font-bold">${{ po.total.toLocaleString() }}</div>
                        </div>
                      </div>

                      <!-- Supplier Info -->
                      <div>
                        <h4 class="font-semibold mb-3">Supplier Information</h4>
                        <div class="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                          <div>
                            <div class="text-sm text-muted-foreground">Company Name</div>
                            <div class="font-medium">{{ po.supplier.name }}</div>
                          </div>
                          <div>
                            <div class="text-sm text-muted-foreground">Payment Terms</div>
                            <div class="font-medium">{{ po.paymentTerms }}</div>
                          </div>
                          <div>
                            <div class="text-sm text-muted-foreground">Contact Email</div>
                            <div class="font-medium">{{ po.supplier.contact }}</div>
                          </div>
                          <div>
                            <div class="text-sm text-muted-foreground">Phone</div>
                            <div class="font-medium">{{ po.supplier.phone }}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Delivery Info -->
                      <div>
                        <h4 class="font-semibold mb-3">Delivery Schedule</h4>
                        <div class="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                          <div>
                            <div class="text-sm text-muted-foreground">Order Date</div>
                            <div class="font-medium">{{ po.orderDate }}</div>
                          </div>
                          <div>
                            <div class="text-sm text-muted-foreground">Expected Delivery</div>
                            <div class="font-medium">{{ po.expectedDelivery }}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Items -->
                      <div>
                        <h4 class="font-semibold mb-3">Order Items</h4>
                        <div class="space-y-2">
                          <div v-for="(item, index) in po.items" :key="index"
                               class="p-3 border rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                              <div class="flex-1">
                                <div class="font-medium">{{ item.name }}</div>
                                <div class="text-sm text-muted-foreground">SKU: {{ item.sku }}</div>
                              </div>
                              <div class="text-right">
                                <div class="font-bold">${{ (item.quantity * item.unitPrice).toLocaleString() }}</div>
                                <div class="text-sm text-muted-foreground">
                                  {{ item.quantity }} {{ item.unit }} × ${{ item.unitPrice }}
                                </div>
                              </div>
                            </div>
                            <div v-if="po.status !== 'Cancelled'" class="mt-2">
                              <div class="flex justify-between text-xs mb-1">
                                <span class="text-muted-foreground">Received</span>
                                <span>{{ item.received }} / {{ item.quantity }}</span>
                              </div>
                              <Progress :model-value="(item.received / item.quantity) * 100" class="h-1.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Cost Breakdown -->
                      <div>
                        <h4 class="font-semibold mb-3">Cost Breakdown</h4>
                        <div class="space-y-2 p-4 border rounded-lg">
                          <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Subtotal</span>
                            <span class="font-medium">${{ po.subtotal.toLocaleString() }}</span>
                          </div>
                          <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Tax (10%)</span>
                            <span class="font-medium">${{ po.tax.toLocaleString() }}</span>
                          </div>
                          <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Shipping</span>
                            <span class="font-medium">${{ po.shipping.toLocaleString() }}</span>
                          </div>
                          <div class="flex justify-between pt-2 border-t">
                            <span class="font-semibold">Total</span>
                            <span class="text-xl font-bold">${{ po.total.toLocaleString() }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Notes -->
                      <div v-if="po.notes">
                        <h4 class="font-semibold mb-2">Notes</h4>
                        <p class="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
                          {{ po.notes }}
                        </p>
                      </div>

                      <!-- History Timeline -->
                      <div>
                        <h4 class="font-semibold mb-3">Order History</h4>
                        <div class="space-y-3">
                          <div v-for="(event, index) in po.history" :key="index"
                               class="flex gap-3 relative">
                            <div v-if="index < po.history.length - 1"
                                 class="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200"></div>
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <div class="flex-1 pb-4">
                              <div class="flex justify-between items-start mb-1">
                                <div class="font-medium">{{ event.action }}</div>
                                <div class="text-xs text-muted-foreground">{{ event.date }}</div>
                              </div>
                              <div class="text-sm text-muted-foreground">{{ event.details }}</div>
                              <div class="text-xs text-muted-foreground mt-1">by {{ event.user }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="text-center py-12">
          <Package class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-1">No purchase orders found</h3>
          <p class="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
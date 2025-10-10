<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Phone,
  Mail,
  MapPin,
  Building,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-vue-next'

// Sample suppliers data
const suppliers = ref([
  {
    id: 'SUP-001',
    name: 'Global Tech Supplies',
    category: 'Electronics',
    contact: {
      email: 'support@globaltech.com',
      phone: '+1-234-567-8900',
      address: '123 Tech Street, Silicon Valley, CA 94025',
      contactPerson: 'John Anderson',
      position: 'Sales Manager'
    },
    rating: 4.8,
    status: 'Active',
    paymentTerms: 'Net 30',
    leadTime: '7-10 days',
    minimumOrder: 5000,
    statistics: {
      totalOrders: 142,
      totalValue: 456800,
      onTimeDelivery: 96,
      qualityScore: 95,
      averageOrderValue: 3217
    },
    recentOrders: [
      { poNumber: 'PO-2025-1842', date: '2025-10-10', amount: 17200, status: 'In Progress' },
      { poNumber: 'PO-2025-1820', date: '2025-09-25', amount: 12450, status: 'Completed' },
      { poNumber: 'PO-2025-1798', date: '2025-09-10', amount: 8900, status: 'Completed' }
    ],
    documents: ['Certificate_ISO9001.pdf', 'Tax_ID.pdf', 'Business_License.pdf'],
    notes: 'Preferred supplier for IT equipment. Excellent quality and service.',
    joinedDate: '2023-01-15',
    lastOrderDate: '2025-10-10'
  },
  {
    id: 'SUP-002',
    name: 'Premium Materials Co',
    category: 'Raw Materials',
    contact: {
      email: 'sales@premiummaterials.com',
      phone: '+1-234-567-8901',
      address: '456 Industrial Ave, Detroit, MI 48201',
      contactPerson: 'Sarah Martinez',
      position: 'Account Manager'
    },
    rating: 4.6,
    status: 'Active',
    paymentTerms: 'Net 45',
    leadTime: '14-21 days',
    minimumOrder: 10000,
    statistics: {
      totalOrders: 128,
      totalValue: 398200,
      onTimeDelivery: 94,
      qualityScore: 92,
      averageOrderValue: 3111
    },
    recentOrders: [
      { poNumber: 'PO-2025-1841', date: '2025-10-09', amount: 31990, status: 'Pending' },
      { poNumber: 'PO-2025-1815', date: '2025-09-20', amount: 28500, status: 'Completed' }
    ],
    documents: ['Material_Certifications.pdf', 'Insurance_Certificate.pdf'],
    notes: 'Reliable for bulk material orders. Sometimes delays during peak season.',
    joinedDate: '2023-03-22',
    lastOrderDate: '2025-10-09'
  },
  {
    id: 'SUP-003',
    name: 'Swift Logistics Ltd',
    category: 'Packaging',
    contact: {
      email: 'orders@swiftlogistics.com',
      phone: '+1-234-567-8902',
      address: '789 Warehouse Blvd, Houston, TX 77001',
      contactPerson: 'Michael Chen',
      position: 'Operations Director'
    },
    rating: 4.5,
    status: 'Active',
    paymentTerms: 'Net 30',
    leadTime: '3-5 days',
    minimumOrder: 1000,
    statistics: {
      totalOrders: 95,
      totalValue: 312500,
      onTimeDelivery: 92,
      qualityScore: 89,
      averageOrderValue: 3289
    },
    recentOrders: [
      { poNumber: 'PO-2025-1840', date: '2025-10-08', amount: 2670, status: 'Completed' },
      { poNumber: 'PO-2025-1825', date: '2025-09-28', amount: 3200, status: 'Completed' }
    ],
    documents: ['Business_Registration.pdf'],
    notes: 'Fast delivery for packaging supplies. Good pricing.',
    joinedDate: '2023-06-10',
    lastOrderDate: '2025-10-08'
  },
  {
    id: 'SUP-004',
    name: 'Quality Parts Inc',
    category: 'Components',
    contact: {
      email: 'info@qualityparts.com',
      phone: '+1-234-567-8903',
      address: '321 Manufacturing Way, Cleveland, OH 44101',
      contactPerson: 'David Wilson',
      position: 'Business Development'
    },
    rating: 4.3,
    status: 'Active',
    paymentTerms: 'Net 60',
    leadTime: '10-14 days',
    minimumOrder: 8000,
    statistics: {
      totalOrders: 87,
      totalValue: 289400,
      onTimeDelivery: 88,
      qualityScore: 90,
      averageOrderValue: 3327
    },
    recentOrders: [
      { poNumber: 'PO-2025-1839', date: '2025-10-07', amount: 26150, status: 'In Transit' },
      { poNumber: 'PO-2025-1810', date: '2025-09-15', amount: 19800, status: 'Completed' }
    ],
    documents: ['Quality_Certification.pdf', 'Compliance_Documents.pdf'],
    notes: 'Good quality but sometimes delivery delays.',
    joinedDate: '2023-08-05',
    lastOrderDate: '2025-10-07'
  },
  {
    id: 'SUP-005',
    name: 'Mega Wholesale',
    category: 'Office Supplies',
    contact: {
      email: 'wholesale@mega.com',
      phone: '+1-234-567-8904',
      address: '555 Commerce St, New York, NY 10001',
      contactPerson: 'Emily Rodriguez',
      position: 'Key Account Manager'
    },
    rating: 4.1,
    status: 'Active',
    paymentTerms: 'COD',
    leadTime: '1-3 days',
    minimumOrder: 500,
    statistics: {
      totalOrders: 73,
      totalValue: 245600,
      onTimeDelivery: 85,
      qualityScore: 87,
      averageOrderValue: 3364
    },
    recentOrders: [
      { poNumber: 'PO-2025-1838', date: '2025-10-06', amount: 2635, status: 'Delayed' }
    ],
    documents: ['Supplier_Agreement.pdf'],
    notes: 'Good for quick office supply needs. Recent delivery issues.',
    joinedDate: '2024-01-20',
    lastOrderDate: '2025-10-06'
  },
  {
    id: 'SUP-006',
    name: 'Tech Solutions Hub',
    category: 'Software & Services',
    contact: {
      email: 'sales@techsolutions.com',
      phone: '+1-234-567-8905',
      address: '888 Digital Lane, Austin, TX 78701',
      contactPerson: 'Robert Kim',
      position: 'Enterprise Sales'
    },
    rating: 3.8,
    status: 'Inactive',
    paymentTerms: 'Net 30',
    leadTime: 'Immediate',
    minimumOrder: 0,
    statistics: {
      totalOrders: 15,
      totalValue: 89500,
      onTimeDelivery: 100,
      qualityScore: 85,
      averageOrderValue: 5967
    },
    recentOrders: [
      { poNumber: 'PO-2025-1837', date: '2025-10-05', amount: 9542, status: 'Cancelled' }
    ],
    documents: ['Software_License_Agreement.pdf'],
    notes: 'Moved to competitor. Last order cancelled.',
    joinedDate: '2024-05-15',
    lastOrderDate: '2025-10-05'
  }
])

// Filters
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const ratingFilter = ref('all')

// Computed filtered data
const filteredSuppliers = computed(() => {
  return suppliers.value.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        supplier.contact.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        supplier.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = categoryFilter.value === 'all' || supplier.category === categoryFilter.value
    const matchesStatus = statusFilter.value === 'all' || supplier.status === statusFilter.value
    const matchesRating = ratingFilter.value === 'all' ||
        (ratingFilter.value === '4+' && supplier.rating >= 4) ||
        (ratingFilter.value === '3-4' && supplier.rating >= 3 && supplier.rating < 4)

    return matchesSearch && matchesCategory && matchesStatus && matchesRating
  })
})

// Stats
const stats = computed(() => ({
  total: suppliers.value.length,
  active: suppliers.value.filter(s => s.status === 'Active').length,
  averageRating: (suppliers.value.reduce((sum, s) => sum + s.rating, 0) / suppliers.value.length).toFixed(1),
  totalSpend: suppliers.value.reduce((sum, s) => sum + s.statistics.totalValue, 0)
}))

// Selected supplier for detail view
const selectedSupplier = ref<any>(null)

// Form state for new supplier
const showNewSupplierSheet = ref(false)
const showEditSupplierSheet = ref(false)
const editingSupplier = ref<any>(null)

const newSupplier = ref({
  name: '',
  category: '',
  email: '',
  phone: '',
  address: '',
  contactPerson: '',
  position: '',
  paymentTerms: '',
  leadTime: '',
  minimumOrder: 0,
  notes: ''
})

function getStatusColor(status: string) {
  return status === 'Active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
}

function getRatingColor(rating: number) {
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 4.0) return 'text-blue-600'
  if (rating >= 3.5) return 'text-yellow-600'
  return 'text-red-600'
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function viewDetails(supplier: any) {
  selectedSupplier.value = supplier
}

function editSupplier(supplier: any) {
  editingSupplier.value = { ...supplier }
  showEditSupplierSheet.value = true
}

function deleteSupplier(id: string) {
  const index = suppliers.value.findIndex(s => s.id === id)
  if (index > -1) {
    suppliers.value.splice(index, 1)
  }
}

function submitNewSupplier() {
  // TODO: Implement form submission
  console.log('New supplier:', newSupplier.value)
  showNewSupplierSheet.value = false
  // Reset form
  newSupplier.value = {
    name: '',
    category: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    position: '',
    paymentTerms: '',
    leadTime: '',
    minimumOrder: 0,
    notes: ''
  }
}

function updateSupplier() {
  // TODO: Implement update logic
  console.log('Updating supplier:', editingSupplier.value)
  showEditSupplierSheet.value = false
}

function exportSuppliers() {
  console.log('Exporting suppliers...')
  // TODO: Implement export
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Suppliers</h1>
        <p class="text-muted-foreground mt-1">Manage your supplier relationships</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="exportSuppliers">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
        <Sheet v-model:open="showNewSupplierSheet">
          <SheetTrigger as-child>
            <Button size="sm">
              <Plus class="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </SheetTrigger>
          <SheetContent class="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Supplier</SheetTitle>
              <SheetDescription>
                Enter the supplier details to add them to your database
              </SheetDescription>
            </SheetHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label for="supplier-name">Supplier Name *</Label>
                <Input id="supplier-name" v-model="newSupplier.name" placeholder="Company name" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="category">Category *</Label>
                  <Select v-model="newSupplier.category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                      <SelectItem value="Packaging">Packaging</SelectItem>
                      <SelectItem value="Components">Components</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Software & Services">Software & Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label for="payment-terms">Payment Terms</Label>
                  <Select v-model="newSupplier.paymentTerms">
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="email">Email *</Label>
                <Input id="email" v-model="newSupplier.email" type="email" placeholder="supplier@company.com" />
              </div>

              <div class="space-y-2">
                <Label for="phone">Phone Number</Label>
                <Input id="phone" v-model="newSupplier.phone" placeholder="+1-234-567-8900" />
              </div>

              <div class="space-y-2">
                <Label for="address">Address</Label>
                <textarea
                    id="address"
                    v-model="newSupplier.address"
                    class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Full address"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="contact-person">Contact Person</Label>
                  <Input id="contact-person" v-model="newSupplier.contactPerson" placeholder="John Doe" />
                </div>

                <div class="space-y-2">
                  <Label for="position">Position</Label>
                  <Input id="position" v-model="newSupplier.position" placeholder="Sales Manager" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="lead-time">Lead Time</Label>
                  <Input id="lead-time" v-model="newSupplier.leadTime" placeholder="7-10 days" />
                </div>

                <div class="space-y-2">
                  <Label for="minimum-order">Minimum Order ($)</Label>
                  <Input id="minimum-order" v-model.number="newSupplier.minimumOrder" type="number" />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="notes">Notes</Label>
                <textarea
                    id="notes"
                    v-model="newSupplier.notes"
                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Additional information about the supplier"
                ></textarea>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" @click="showNewSupplierSheet = false">Cancel</Button>
              <Button @click="submitNewSupplier">Add Supplier</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Suppliers</CardTitle>
          <Building class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground">Registered suppliers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Active Suppliers</CardTitle>
          <CheckCircle class="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.active }}</div>
          <p class="text-xs text-muted-foreground">Currently working with</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Average Rating</CardTitle>
          <Star class="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.averageRating }}</div>
          <p class="text-xs text-muted-foreground">Out of 5.0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Spend</CardTitle>
          <TrendingUp class="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ (stats.totalSpend / 1000).toFixed(0) }}K</div>
          <p class="text-xs text-muted-foreground">All-time value</p>
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
                  placeholder="Search suppliers by name, email, or ID..."
                  class="pl-9"
              />
            </div>
          </div>

          <Select v-model="categoryFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Raw Materials">Raw Materials</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
              <SelectItem value="Components">Components</SelectItem>
              <SelectItem value="Office Supplies">Office Supplies</SelectItem>
              <SelectItem value="Software & Services">Software & Services</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="statusFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="ratingFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4+">4+ Stars</SelectItem>
              <SelectItem value="3-4">3-4 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Suppliers Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="supplier in filteredSuppliers" :key="supplier.id"
            class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <Avatar class="h-12 w-12">
                <AvatarFallback class="text-lg">{{ getInitials(supplier.name) }}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle class="text-lg">{{ supplier.name }}</CardTitle>
                <CardDescription>{{ supplier.id }}</CardDescription>
              </div>
            </div>
            <Badge :class="getStatusColor(supplier.status)" class="text-xs">
              {{ supplier.status }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <Badge variant="outline" class="text-xs">{{ supplier.category }}</Badge>
            <div class="flex items-center gap-1">
              <Star :class="[getRatingColor(supplier.rating), 'h-4 w-4 fill-current']" />
              <span class="text-sm font-semibold">{{ supplier.rating }}</span>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Mail class="h-3.5 w-3.5" />
              <span class="truncate">{{ supplier.contact.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <Phone class="h-3.5 w-3.5" />
              <span>{{ supplier.contact.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <Clock class="h-3.5 w-3.5" />
              <span>Lead time: {{ supplier.leadTime }}</span>
            </div>
          </div>

          <div class="pt-3 border-t space-y-2">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div class="text-muted-foreground">Total Orders</div>
                <div class="font-semibold">{{ supplier.statistics.totalOrders }}</div>
              </div>
              <div>
                <div class="text-muted-foreground">Total Value</div>
                <div class="font-semibold">${{ (supplier.statistics.totalValue / 1000).toFixed(0) }}K</div>
              </div>
              <div>
                <div class="text-muted-foreground">On-Time Rate</div>
                <div class="font-semibold">{{ supplier.statistics.onTimeDelivery }}%</div>
              </div>
              <div>
                <div class="text-muted-foreground">Quality Score</div>
                <div class="font-semibold">{{ supplier.statistics.qualityScore }}%</div>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="outline" size="sm" class="flex-1" @click="viewDetails(supplier)">
                  <Eye class="h-3.5 w-3.5 mr-1" />
                  View
                </Button>
              </SheetTrigger>
              <SheetContent class="sm:max-w-3xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Supplier Details</SheetTitle>
                  <SheetDescription>{{ supplier.id }}</SheetDescription>
                </SheetHeader>

                <div class="space-y-6 py-4">
                  <!-- Supplier Header -->
                  <div class="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-start gap-4">
                      <Avatar class="h-16 w-16">
                        <AvatarFallback class="text-2xl">{{ getInitials(supplier.name) }}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 class="text-xl font-bold mb-2">{{ supplier.name }}</h3>
                        <div class="flex gap-2 mb-2">
                          <Badge :class="getStatusColor(supplier.status)">
                            {{ supplier.status }}
                          </Badge>
                          <Badge variant="outline">{{ supplier.category }}</Badge>
                        </div>
                        <div class="flex items-center gap-2">
                          <Star :class="[getRatingColor(supplier.rating), 'h-5 w-5 fill-current']" />
                          <span class="text-lg font-semibold">{{ supplier.rating }}</span>
                          <span class="text-sm text-muted-foreground">({{ supplier.statistics.totalOrders }} orders)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div>
                    <h4 class="font-semibold mb-3">Contact Information</h4>
                    <div class="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div>
                        <div class="text-sm text-muted-foreground mb-1">Contact Person</div>
                        <div class="font-medium">{{ supplier.contact.contactPerson }}</div>
                        <div class="text-sm text-muted-foreground">{{ supplier.contact.position }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-muted-foreground mb-1">Payment Terms</div>
                        <div class="font-medium">{{ supplier.paymentTerms }}</div>
                      </div>
                      <div class="col-span-2">
                        <div class="text-sm text-muted-foreground mb-1">Email</div>
                        <div class="font-medium flex items-center gap-2">
                          <Mail class="h-4 w-4 text-muted-foreground" />
                          {{ supplier.contact.email }}
                        </div>
                      </div>
                      <div class="col-span-2">
                        <div class="text-sm text-muted-foreground mb-1">Phone</div>
                        <div class="font-medium flex items-center gap-2">
                          <Phone class="h-4 w-4 text-muted-foreground" />
                          {{ supplier.contact.phone }}
                        </div>
                      </div>
                      <div class="col-span-2">
                        <div class="text-sm text-muted-foreground mb-1">Address</div>
                        <div class="font-medium flex items-start gap-2">
                          <MapPin class="h-4 w-4 text-muted-foreground mt-0.5" />
                          {{ supplier.contact.address }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Performance Metrics -->
                  <div>
                    <h4 class="font-semibold mb-3">Performance Metrics</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent class="pt-6">
                          <div class="text-2xl font-bold mb-1">{{ supplier.statistics.totalOrders }}</div>
                          <div class="text-sm text-muted-foreground">Total Orders</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent class="pt-6">
                          <div class="text-2xl font-bold mb-1">${{ supplier.statistics.totalValue.toLocaleString() }}</div>
                          <div class="text-sm text-muted-foreground">Total Value</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent class="pt-6">
                          <div class="text-2xl font-bold mb-1">${{ supplier.statistics.averageOrderValue.toLocaleString() }}</div>
                          <div class="text-sm text-muted-foreground">Average Order</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent class="pt-6">
                          <div class="text-2xl font-bold mb-1">{{ supplier.statistics.onTimeDelivery }}%</div>
                          <div class="text-sm text-muted-foreground">On-Time Delivery</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div class="mt-4 space-y-3">
                      <div>
                        <div class="flex justify-between text-sm mb-2">
                          <span class="text-muted-foreground">On-Time Delivery Rate</span>
                          <span class="font-medium">{{ supplier.statistics.onTimeDelivery }}%</span>
                        </div>
                        <Progress :model-value="supplier.statistics.onTimeDelivery" class="h-2" />
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-2">
                          <span class="text-muted-foreground">Quality Score</span>
                          <span class="font-medium">{{ supplier.statistics.qualityScore }}%</span>
                        </div>
                        <Progress :model-value="supplier.statistics.qualityScore" class="h-2" />
                      </div>
                    </div>
                  </div>

                  <!-- Order Terms -->
                  <div>
                    <h4 class="font-semibold mb-3">Order Terms</h4>
                    <div class="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div>
                        <div class="text-sm text-muted-foreground mb-1">Lead Time</div>
                        <div class="font-medium">{{ supplier.leadTime }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-muted-foreground mb-1">Payment Terms</div>
                        <div class="font-medium">{{ supplier.paymentTerms }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-muted-foreground mb-1">Minimum Order</div>
                        <div class="font-medium">${{ supplier.minimumOrder.toLocaleString() }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Recent Orders -->
                  <div>
                    <h4 class="font-semibold mb-3">Recent Orders</h4>
                    <div class="space-y-2">
                      <div v-for="order in supplier.recentOrders" :key="order.poNumber"
                           class="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div class="font-medium">{{ order.poNumber }}</div>
                          <div class="text-sm text-muted-foreground">{{ order.date }}</div>
                        </div>
                        <div class="text-right">
                          <div class="font-semibold">${{ order.amount.toLocaleString() }}</div>
                          <Badge :class="getStatusColor(order.status)" class="text-xs mt-1">
                            {{ order.status }}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Documents -->
                  <div v-if="supplier.documents.length > 0">
                    <h4 class="font-semibold mb-3">Documents</h4>
                    <div class="space-y-2">
                      <div v-for="doc in supplier.documents" :key="doc"
                           class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div class="flex items-center gap-2">
                          <div class="p-2 bg-blue-50 rounded">
                            <FileText class="h-4 w-4 text-blue-600" />
                          </div>
                          <span class="text-sm font-medium">{{ doc }}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <!-- Notes -->
                  <div v-if="supplier.notes">
                    <h4 class="font-semibold mb-2">Notes</h4>
                    <p class="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
                      {{ supplier.notes }}
                    </p>
                  </div>

                  <!-- Timeline Info -->
                  <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
                    <div>
                      <div class="text-muted-foreground mb-1">Joined Date</div>
                      <div class="font-medium">{{ supplier.joinedDate }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground mb-1">Last Order Date</div>
                      <div class="font-medium">{{ supplier.lastOrderDate }}</div>
                    </div>
                  </div>
                </div>

                <SheetFooter class="gap-2">
                  <Button variant="outline" @click="editSupplier(supplier)">
                    <Edit class="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button variant="destructive">
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Supplier?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {{ supplier.name }}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="deleteSupplier(supplier.id)">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Button variant="outline" size="sm" @click="editSupplier(supplier)">
              <Edit class="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-if="filteredSuppliers.length === 0" class="text-center py-12">
      <Building class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-semibold mb-1">No suppliers found</h3>
      <p class="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
      <Button @click="showNewSupplierSheet = true">
        <Plus class="h-4 w-4 mr-2" />
        Add Your First Supplier
      </Button>
    </div>

    <!-- Edit Supplier Sheet -->
    <Sheet v-model:open="showEditSupplierSheet">
      <SheetContent class="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Supplier</SheetTitle>
          <SheetDescription>
            Update supplier information
          </SheetDescription>
        </SheetHeader>
        <div v-if="editingSupplier" class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="edit-name">Supplier Name</Label>
            <Input id="edit-name" v-model="editingSupplier.name" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-category">Category</Label>
              <Select v-model="editingSupplier.category">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                  <SelectItem value="Components">Components</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Software & Services">Software & Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="edit-status">Status</Label>
              <Select v-model="editingSupplier.status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="edit-email">Email</Label>
            <Input id="edit-email" v-model="editingSupplier.contact.email" type="email" />
          </div>

          <div class="space-y-2">
            <Label for="edit-phone">Phone</Label>
            <Input id="edit-phone" v-model="editingSupplier.contact.phone" />
          </div>

          <div class="space-y-2">
            <Label for="edit-address">Address</Label>
            <textarea
                id="edit-address"
                v-model="editingSupplier.contact.address"
                class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-contact-person">Contact Person</Label>
              <Input id="edit-contact-person" v-model="editingSupplier.contact.contactPerson" />
            </div>

            <div class="space-y-2">
              <Label for="edit-position">Position</Label>
              <Input id="edit-position" v-model="editingSupplier.contact.position" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-payment">Payment Terms</Label>
              <Select v-model="editingSupplier.paymentTerms">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="edit-lead-time">Lead Time</Label>
              <Input id="edit-lead-time" v-model="editingSupplier.leadTime" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="edit-minimum">Minimum Order ($)</Label>
            <Input id="edit-minimum" v-model.number="editingSupplier.minimumOrder" type="number" />
          </div>

          <div class="space-y-2">
            <Label for="edit-notes">Notes</Label>
            <textarea
                id="edit-notes"
                v-model="editingSupplier.notes"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            ></textarea>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" @click="showEditSupplierSheet = false">Cancel</Button>
          <Button @click="updateSupplier">Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
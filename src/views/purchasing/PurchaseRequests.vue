<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MoreVertical,
  FileText,
  Calendar
} from 'lucide-vue-next'

// Sample data
const purchaseRequests = ref([
  {
    id: 'PR-2025-0456',
    title: 'Office Equipment & Supplies',
    requestedBy: 'John Smith',
    department: 'Operations',
    date: '2025-10-11',
    urgency: 'High',
    status: 'Pending Approval',
    items: [
      { name: 'Laptop HP Pavilion', quantity: 5, unit: 'pcs', estimatedPrice: 8500 },
      { name: 'Office Chair Ergonomic', quantity: 10, unit: 'pcs', estimatedPrice: 2500 },
      { name: 'Printer Canon MF445dw', quantity: 2, unit: 'pcs', estimatedPrice: 4500 }
    ],
    totalAmount: 12450,
    notes: 'Urgent requirement for new employee onboarding',
    attachments: ['equipment-specs.pdf', 'budget-approval.pdf']
  },
  {
    id: 'PR-2025-0455',
    title: 'Server Hardware',
    requestedBy: 'Sarah Chen',
    department: 'IT',
    date: '2025-10-10',
    urgency: 'Medium',
    status: 'Approved',
    items: [
      { name: 'Dell PowerEdge R740', quantity: 2, unit: 'units', estimatedPrice: 12000 },
      { name: 'Network Switch 48-port', quantity: 1, unit: 'unit', estimatedPrice: 3500 },
      { name: 'UPS APC 3000VA', quantity: 2, unit: 'units', estimatedPrice: 1400 }
    ],
    totalAmount: 28900,
    notes: 'Infrastructure upgrade for Q4',
    attachments: ['technical-specs.pdf']
  },
  {
    id: 'PR-2025-0454',
    title: 'Raw Materials',
    requestedBy: 'Mike Johnson',
    department: 'Production',
    date: '2025-10-10',
    urgency: 'High',
    status: 'In Review',
    items: [
      { name: 'Steel Plate 2mm', quantity: 500, unit: 'kg', estimatedPrice: 3.5 },
      { name: 'Aluminum Rod 10mm', quantity: 200, unit: 'meters', estimatedPrice: 8.2 },
      { name: 'Copper Wire 5mm', quantity: 1000, unit: 'meters', estimatedPrice: 2.1 }
    ],
    totalAmount: 45200,
    notes: 'Monthly stock replenishment',
    attachments: []
  },
  {
    id: 'PR-2025-0453',
    title: 'Promotional Materials',
    requestedBy: 'Emily Davis',
    department: 'Marketing',
    date: '2025-10-09',
    urgency: 'Low',
    status: 'Rejected',
    items: [
      { name: 'Branded T-Shirts', quantity: 500, unit: 'pcs', estimatedPrice: 8 },
      { name: 'Brochures Full Color', quantity: 5000, unit: 'pcs', estimatedPrice: 0.5 },
      { name: 'Roll-up Banner', quantity: 10, unit: 'pcs', estimatedPrice: 45 }
    ],
    totalAmount: 8750,
    notes: 'For upcoming trade show event',
    attachments: ['design-mockup.pdf']
  },
  {
    id: 'PR-2025-0452',
    title: 'Maintenance Tools',
    requestedBy: 'David Wilson',
    department: 'Maintenance',
    date: '2025-10-08',
    urgency: 'Medium',
    status: 'Draft',
    items: [
      { name: 'Power Drill Set', quantity: 3, unit: 'sets', estimatedPrice: 250 },
      { name: 'Safety Equipment Kit', quantity: 10, unit: 'kits', estimatedPrice: 120 },
      { name: 'Tool Cabinet Heavy Duty', quantity: 2, unit: 'units', estimatedPrice: 850 }
    ],
    totalAmount: 3650,
    notes: 'Annual tool replacement program',
    attachments: []
  }
])

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const urgencyFilter = ref('all')
const departmentFilter = ref('all')

// Computed filtered data
const filteredRequests = computed(() => {
  return purchaseRequests.value.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        req.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        req.requestedBy.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || req.status === statusFilter.value
    const matchesUrgency = urgencyFilter.value === 'all' || req.urgency === urgencyFilter.value
    const matchesDepartment = departmentFilter.value === 'all' || req.department === departmentFilter.value

    return matchesSearch && matchesStatus && matchesUrgency && matchesDepartment
  })
})

// Stats
const stats = computed(() => ({
  total: purchaseRequests.value.length,
  pending: purchaseRequests.value.filter(r => r.status === 'Pending Approval').length,
  approved: purchaseRequests.value.filter(r => r.status === 'Approved').length,
  rejected: purchaseRequests.value.filter(r => r.status === 'Rejected').length
}))

// Selected request for detail view
const selectedRequest = ref(null)

// Form state for new request
const showNewRequestSheet = ref(false)
const newRequest = ref({
  title: '',
  department: '',
  urgency: '',
  notes: '',
  items: [{ name: '', quantity: 1, unit: '', estimatedPrice: 0 }]
})

function getStatusColor(status: string) {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-700 border-green-200'
    case 'Pending Approval': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'In Review': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Rejected': return 'bg-red-100 text-red-700 border-red-200'
    case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'High': return 'bg-red-100 text-red-700 border-red-200'
    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function viewDetails(request: any) {
  selectedRequest.value = request
}

function addItemRow() {
  newRequest.value.items.push({ name: '', quantity: 1, unit: '', estimatedPrice: 0 })
}

function removeItemRow(index: number) {
  newRequest.value.items.splice(index, 1)
}

function calculateTotal() {
  return newRequest.value.items.reduce((sum, item) =>
      sum + (item.quantity * item.estimatedPrice), 0
  )
}

function submitNewRequest() {
  // TODO: Implement form submission
  console.log('New request submitted:', newRequest.value)
  showNewRequestSheet.value = false
  // Reset form
  newRequest.value = {
    title: '',
    department: '',
    urgency: '',
    notes: '',
    items: [{ name: '', quantity: 1, unit: '', estimatedPrice: 0 }]
  }
}

function approveRequest(id: string) {
  const request = purchaseRequests.value.find(r => r.id === id)
  if (request) {
    request.status = 'Approved'
  }
}

function rejectRequest(id: string) {
  const request = purchaseRequests.value.find(r => r.id === id)
  if (request) {
    request.status = 'Rejected'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Purchase Requests</h1>
        <p class="text-muted-foreground mt-1">Manage and review purchase requisitions</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
        <Sheet v-model:open="showNewRequestSheet">
          <SheetTrigger as-child>
            <Button size="sm">
              <Plus class="h-4 w-4 mr-2" />
              New Request
            </Button>
          </SheetTrigger>
          <SheetContent class="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Create Purchase Request</SheetTitle>
              <SheetDescription>
                Fill in the details for your purchase request
              </SheetDescription>
            </SheetHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label for="title">Request Title</Label>
                <Input id="title" v-model="newRequest.title" placeholder="e.g., Office Equipment Purchase" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="department">Department</Label>
                  <Select v-model="newRequest.department">
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label for="urgency">Urgency Level</Label>
                  <Select v-model="newRequest.urgency">
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button type="button" variant="outline" size="sm" @click="addItemRow">
                    <Plus class="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div v-for="(item, index) in newRequest.items" :key="index"
                     class="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                  <div class="col-span-5">
                    <Label class="text-xs">Item Name</Label>
                    <Input v-model="item.name" placeholder="Product name" class="h-8" />
                  </div>
                  <div class="col-span-2">
                    <Label class="text-xs">Qty</Label>
                    <Input v-model.number="item.quantity" type="number" class="h-8" />
                  </div>
                  <div class="col-span-2">
                    <Label class="text-xs">Unit</Label>
                    <Input v-model="item.unit" placeholder="pcs" class="h-8" />
                  </div>
                  <div class="col-span-2">
                    <Label class="text-xs">Price</Label>
                    <Input v-model.number="item.estimatedPrice" type="number" class="h-8" />
                  </div>
                  <div class="col-span-1">
                    <Button
                        v-if="newRequest.items.length > 1"
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        @click="removeItemRow(index)"
                    >
                      <XCircle class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div class="flex justify-end p-3 bg-gray-50 rounded-lg">
                  <div class="text-sm">
                    <span class="text-muted-foreground mr-2">Estimated Total:</span>
                    <span class="text-lg font-bold">${{ calculateTotal().toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="notes">Notes</Label>
                <textarea
                    id="notes"
                    v-model="newRequest.notes"
                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Additional information or justification for this request"
                ></textarea>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" @click="showNewRequestSheet = false">Cancel</Button>
              <Button @click="submitNewRequest">Submit Request</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Requests</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.total }}</div>
          <p class="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Pending Approval</CardTitle>
          <Clock class="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.pending }}</div>
          <p class="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Approved</CardTitle>
          <CheckCircle class="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.approved }}</div>
          <p class="text-xs text-muted-foreground">Ready for PO</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Rejected</CardTitle>
          <XCircle class="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.rejected }}</div>
          <p class="text-xs text-muted-foreground">Not approved</p>
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
                  placeholder="Search by ID, title, or requester..."
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
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="urgencyFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="All Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="departmentFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Requests List -->
    <Card>
      <CardHeader>
        <CardTitle>Purchase Requests ({{ filteredRequests.length }})</CardTitle>
        <CardDescription>Review and manage purchase requisitions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="request in filteredRequests" :key="request.id"
               class="flex items-start justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
            <div class="flex items-start gap-4 flex-1">
              <Avatar>
                <AvatarFallback>{{ getInitials(request.requestedBy) }}</AvatarFallback>
              </Avatar>

              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{{ request.id }}</span>
                  <Badge :class="getStatusColor(request.status)" class="text-xs">
                    {{ request.status }}
                  </Badge>
                  <Badge :class="getUrgencyColor(request.urgency)" class="text-xs">
                    {{ request.urgency }}
                  </Badge>
                </div>

                <h3 class="font-medium">{{ request.title }}</h3>

                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{{ request.requestedBy }}</span>
                  <span>•</span>
                  <span>{{ request.department }}</span>
                  <span>•</span>
                  <span>{{ request.items.length }} items</span>
                  <span>•</span>
                  <span>{{ request.date }}</span>
                </div>

                <div v-if="request.notes" class="text-sm text-muted-foreground mt-1">
                  {{ request.notes }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-lg font-bold">${{ request.totalAmount.toLocaleString() }}</div>
                <div class="text-xs text-muted-foreground">Total amount</div>
              </div>

              <Sheet>
                <SheetTrigger as-child>
                  <Button variant="outline" size="sm" @click="viewDetails(request)">
                    <Eye class="h-4 w-4 mr-1" />
                    View
                  </Button>
                </SheetTrigger>
                <SheetContent class="sm:max-w-2xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Purchase Request Details</SheetTitle>
                    <SheetDescription>{{ request.id }}</SheetDescription>
                  </SheetHeader>

                  <div class="space-y-6 py-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-lg font-semibold">{{ request.title }}</h3>
                        <div class="flex items-center gap-2 mt-2">
                          <Badge :class="getStatusColor(request.status)">
                            {{ request.status }}
                          </Badge>
                          <Badge :class="getUrgencyColor(request.urgency)">
                            {{ request.urgency }}
                          </Badge>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-2xl font-bold">${{ request.totalAmount.toLocaleString() }}</div>
                        <div class="text-sm text-muted-foreground">Total Amount</div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div class="text-sm text-muted-foreground">Requested By</div>
                        <div class="font-medium">{{ request.requestedBy }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-muted-foreground">Department</div>
                        <div class="font-medium">{{ request.department }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-muted-foreground">Request Date</div>
                        <div class="font-medium">{{ request.date }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-muted-foreground">Items Count</div>
                        <div class="font-medium">{{ request.items.length }} items</div>
                      </div>
                    </div>

                    <div>
                      <h4 class="font-semibold mb-3">Requested Items</h4>
                      <div class="space-y-2">
                        <div v-for="(item, index) in request.items" :key="index"
                             class="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div class="font-medium">{{ item.name }}</div>
                            <div class="text-sm text-muted-foreground">
                              {{ item.quantity }} {{ item.unit }} × ${{ item.estimatedPrice.toLocaleString() }}
                            </div>
                          </div>
                          <div class="font-semibold">
                            ${{ (item.quantity * item.estimatedPrice).toLocaleString() }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="request.notes">
                      <h4 class="font-semibold mb-2">Notes</h4>
                      <p class="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
                        {{ request.notes }}
                      </p>
                    </div>

                    <div v-if="request.attachments.length > 0">
                      <h4 class="font-semibold mb-2">Attachments</h4>
                      <div class="space-y-2">
                        <div v-for="file in request.attachments" :key="file"
                             class="flex items-center gap-2 p-2 border rounded">
                          <FileText class="h-4 w-4 text-muted-foreground" />
                          <span class="text-sm">{{ file }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <SheetFooter v-if="request.status === 'Pending Approval'" class="gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger as-child>
                        <Button variant="outline">
                          <XCircle class="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Purchase Request?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reject the purchase request {{ request.id }}. The requester will be notified.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction @click="rejectRequest(request.id)">
                            Confirm Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button @click="approveRequest(request.id)">
                      <CheckCircle class="h-4 w-4 mr-2" />
                      Approve Request
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div v-if="filteredRequests.length === 0" class="text-center py-12">
          <AlertTriangle class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-1">No requests found</h3>
          <p class="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import VueApexCharts from 'vue3-apexcharts'
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  Download,
  MoreVertical,
  Award,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'

const hrStats = ref([
  {
    title: 'Total Employees',
    value: '248',
    change: '+12',
    isPositive: true,
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
    description: 'vs last month'
  },
  {
    title: 'New Hires',
    value: '18',
    change: '+5',
    isPositive: true,
    icon: UserPlus,
    color: 'bg-green-100 text-green-600',
    description: 'this month'
  },
  {
    title: 'Turnover Rate',
    value: '3.2%',
    change: '-0.8%',
    isPositive: true,
    icon: UserMinus,
    color: 'bg-orange-100 text-orange-600',
    description: 'vs last month'
  },
  {
    title: 'Avg. Attendance',
    value: '96.5%',
    change: '+2.3%',
    isPositive: true,
    icon: CheckCircle,
    color: 'bg-purple-100 text-purple-600',
    description: 'vs last month'
  }
])

// Employee Distribution by Department
const departmentSeries = ref([45, 38, 32, 28, 25, 22, 18, 15, 12, 13])
const departmentOptions = ref({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '70%'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toString()
  },
  xaxis: {
    categories: [
      'Sales & Marketing',
      'Operations',
      'IT & Development',
      'Customer Service',
      'Finance',
      'HR & Admin',
      'Product',
      'Engineering',
      'Legal',
      'Research'
    ]
  },
  colors: ['#3b82f6'],
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Attendance Trend
const attendanceSeries = ref([
  {
    name: 'Present',
    data: [92, 94, 95, 93, 96, 97, 95, 94, 96, 97, 96, 95]
  },
  {
    name: 'Late',
    data: [5, 4, 3, 5, 3, 2, 4, 5, 3, 2, 3, 4]
  },
  {
    name: 'Absent',
    data: [3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]
  }
])

const attendanceOptions = ref({
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false },
    stacked: true
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.1
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    title: { text: 'Percentage (%)' },
    max: 100
  },
  colors: ['#22c55e', '#eab308', '#ef4444'],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  grid: {
    borderColor: '#f1f5f9'
  }
})

// Recent Activities
const recentActivities = ref([
  {
    type: 'hire',
    employee: 'Sarah Johnson',
    position: 'Senior Developer',
    department: 'IT & Development',
    date: '2025-10-10',
    status: 'Active'
  },
  {
    type: 'promotion',
    employee: 'Michael Chen',
    position: 'Team Lead',
    department: 'Sales & Marketing',
    date: '2025-10-09',
    status: 'Active'
  },
  {
    type: 'leave',
    employee: 'Emma Davis',
    position: 'HR Manager',
    department: 'HR & Admin',
    date: '2025-10-08',
    status: 'On Leave'
  },
  {
    type: 'hire',
    employee: 'James Wilson',
    position: 'Product Designer',
    department: 'Product',
    date: '2025-10-07',
    status: 'Active'
  },
  {
    type: 'resignation',
    employee: 'Linda Martinez',
    position: 'Accountant',
    department: 'Finance',
    date: '2025-10-05',
    status: 'Resigned'
  }
])

// Leave Requests
const leaveRequests = ref([
  {
    employee: 'Robert Taylor',
    avatar: '',
    type: 'Annual Leave',
    duration: '5 days',
    dates: 'Oct 20 - Oct 24',
    status: 'Pending',
    reason: 'Family vacation'
  },
  {
    employee: 'Jessica Brown',
    avatar: '',
    type: 'Sick Leave',
    duration: '2 days',
    dates: 'Oct 15 - Oct 16',
    status: 'Approved',
    reason: 'Medical treatment'
  },
  {
    employee: 'David Lee',
    avatar: '',
    type: 'Personal Leave',
    duration: '1 day',
    dates: 'Oct 18',
    status: 'Pending',
    reason: 'Personal matter'
  },
  {
    employee: 'Amanda White',
    avatar: '',
    type: 'Annual Leave',
    duration: '3 days',
    dates: 'Oct 22 - Oct 24',
    status: 'Rejected',
    reason: 'Project deadline'
  }
])

// Top Performers
const topPerformers = ref([
  {
    name: 'Alex Thompson',
    position: 'Sales Manager',
    department: 'Sales',
    performance: 98,
    avatar: ''
  },
  {
    name: 'Maria Garcia',
    position: 'Product Lead',
    department: 'Product',
    performance: 95,
    avatar: ''
  },
  {
    name: 'Chris Anderson',
    position: 'Tech Lead',
    department: 'Engineering',
    performance: 94,
    avatar: ''
  },
  {
    name: 'Nina Patel',
    position: 'Marketing Head',
    department: 'Marketing',
    performance: 92,
    avatar: ''
  },
  {
    name: 'Tom Harris',
    position: 'Operations Manager',
    department: 'Operations',
    performance: 90,
    avatar: ''
  }
])

// Payroll Summary
const payrollSummary = ref({
  totalPayroll: '$842,500',
  avgSalary: '$3,400',
  benefits: '$156,200',
  bonuses: '$42,800',
  monthlyBreakdown: [
    { month: 'Jul', amount: 820 },
    { month: 'Aug', amount: 835 },
    { month: 'Sep', amount: 828 },
    { month: 'Oct', amount: 842 }
  ]
})

function getActivityIcon(type: string) {
  switch (type) {
    case 'hire': return UserPlus
    case 'promotion': return TrendingUp
    case 'leave': return Calendar
    case 'resignation': return UserMinus
    default: return Users
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'hire': return 'bg-green-100 text-green-700'
    case 'promotion': return 'bg-blue-100 text-blue-700'
    case 'leave': return 'bg-yellow-100 text-yellow-700'
    case 'resignation': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Approved':
    case 'Active': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-700'
    case 'Rejected':
    case 'Resigned': return 'bg-red-100 text-red-700'
    case 'On Leave': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Human Resources Dashboard</h1>
        <p class="text-muted-foreground mt-1">Manage your workforce and track HR metrics</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm">
          <Calendar class="h-4 w-4 mr-2" />
          This Month
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- HR Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in hrStats" :key="stat.title" class="relative hover:shadow-md transition-shadow">
        <CardHeader class="flex flex-row items-start justify-between">
          <div class="text-sm text-muted-foreground">{{ stat.title }}</div>
          <div :class="[stat.color, 'p-2 rounded-md']">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ stat.value }}</div>
          <div class="flex items-center justify-between mt-2 w-full">
            <div class="flex items-center">
              <component :is="stat.isPositive ? TrendingUp : AlertCircle"
                         :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'h-4 w-4 mr-1']" />
              <span :class="[stat.isPositive ? 'text-green-600' : 'text-red-600', 'text-xs font-medium']">
                {{ stat.change }}
              </span>
            </div>
            <span class="text-xs text-muted-foreground">{{ stat.description }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Employee Distribution -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Employee Distribution by Department</CardTitle>
              <CardDescription>Total workforce allocation across departments</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="bar"
              height="300"
              :options="departmentOptions"
              :series="[{ name: 'Employees', data: departmentSeries }]"
          />
        </CardContent>
      </Card>

      <!-- Payroll Summary -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Payroll Summary</CardTitle>
            <Button variant="ghost" size="icon">
              <DollarSign class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <div class="text-sm text-muted-foreground mb-1">Total Monthly Payroll</div>
              <div class="text-2xl font-bold">{{ payrollSummary.totalPayroll }}</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 border rounded-lg">
                <div class="text-xs text-muted-foreground mb-1">Avg. Salary</div>
                <div class="text-lg font-semibold">{{ payrollSummary.avgSalary }}</div>
              </div>
              <div class="p-3 border rounded-lg">
                <div class="text-xs text-muted-foreground mb-1">Benefits</div>
                <div class="text-lg font-semibold">{{ payrollSummary.benefits }}</div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="text-sm font-medium">Monthly Trend (K)</div>
              <div v-for="month in payrollSummary.monthlyBreakdown" :key="month.month"
                   class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ month.month }}</span>
                <div class="flex items-center gap-2 flex-1 mx-3">
                  <Progress :model-value="(month.amount / 850) * 100" class="h-2" />
                </div>
                <span class="text-sm font-medium">${{ month.amount }}K</span>
              </div>
            </div>

            <div class="p-3 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-green-700">Bonuses Paid</div>
                <div class="text-lg font-bold text-green-700">{{ payrollSummary.bonuses }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Attendance Trend -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Attendance Trend</CardTitle>
              <CardDescription>Monthly attendance statistics</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VueApexCharts
              type="area"
              height="300"
              :options="attendanceOptions"
              :series="attendanceSeries"
          />
        </CardContent>
      </Card>

      <!-- Top Performers -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Top Performers</CardTitle>
            <Button variant="ghost" size="icon">
              <Award class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="(performer, index) in topPerformers" :key="performer.name"
                 class="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-3 flex-1">
                <div class="relative">
                  <Avatar>
                    <AvatarImage :src="performer.avatar" />
                    <AvatarFallback>{{ getInitials(performer.name) }}</AvatarFallback>
                  </Avatar>
                  <div v-if="index < 3"
                       class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span class="text-xs font-bold text-white">{{ index + 1 }}</span>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ performer.name }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ performer.position }} • {{ performer.department }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-green-600">{{ performer.performance }}%</div>
                <Progress :model-value="performer.performance" class="h-1.5 w-16 mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activities -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest employee movements and updates</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="activity in recentActivities" :key="activity.employee"
                 class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div class="flex items-center gap-3 flex-1">
                <div :class="[getActivityColor(activity.type), 'p-2 rounded-lg']">
                  <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ activity.employee }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ activity.position }} • {{ activity.department }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-xs text-muted-foreground">{{ activity.date }}</div>
                <Badge :class="getStatusColor(activity.status)" class="border-0">
                  {{ activity.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Leave Requests -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Pending approvals</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Clock class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="request in leaveRequests" :key="request.employee"
                 class="p-3 rounded-lg border">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="request.avatar" />
                    <AvatarFallback>{{ getInitials(request.employee) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium text-sm">{{ request.employee }}</div>
                    <div class="text-xs text-muted-foreground">{{ request.type }}</div>
                  </div>
                </div>
                <Badge :class="getStatusColor(request.status)" class="border-0">
                  {{ request.status }}
                </Badge>
              </div>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Duration:</span>
                  <span class="font-medium">{{ request.duration }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Dates:</span>
                  <span class="font-medium">{{ request.dates }}</span>
                </div>
                <div class="text-muted-foreground mt-2">{{ request.reason }}</div>
              </div>
              <div v-if="request.status === 'Pending'" class="flex gap-2 mt-3">
                <Button size="sm" class="flex-1 h-7 text-xs">
                  <CheckCircle class="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" class="flex-1 h-7 text-xs">
                  <XCircle class="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
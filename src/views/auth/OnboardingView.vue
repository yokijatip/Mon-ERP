<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, Store, Users, CircleCheck as CheckCircle, ArrowRight, ArrowLeft, Briefcase, ShoppingBag, Utensils, Smartphone, Shirt, Hop as Home, Package } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

// Current step (1-4)
const currentStep = ref(1)
const totalSteps = 4

// Form data
const businessInfo = ref({
  businessName: '',
  businessType: '',
  address: '',
  phone: '',
  description: ''
})

const selectedIndustry = ref('')
const teamMembers = ref([
  { email: '', role: 'manager', name: '' }
])

const errorMessage = ref('')
const successMessage = ref('')

// Industries data
const industries = [
  { id: 'fashion', name: 'Fashion & Clothing', icon: Shirt, color: 'bg-pink-100 text-pink-700' },
  { id: 'food', name: 'Food & Beverage', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-700' },
  { id: 'retail', name: 'Retail & General', icon: ShoppingBag, color: 'bg-green-100 text-green-700' },
  { id: 'services', name: 'Services', icon: Briefcase, color: 'bg-purple-100 text-purple-700' },
  { id: 'home', name: 'Home & Garden', icon: Home, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'other', name: 'Other', icon: Package, color: 'bg-gray-100 text-gray-700' }
]

// Computed
const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100)
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return businessInfo.value.businessName && businessInfo.value.businessType && businessInfo.value.address
    case 2:
      return selectedIndustry.value
    case 3:
      return true // Team members are optional
    case 4:
      return true // Summary step
    default:
      return false
  }
})

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps && canProceed.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const addTeamMember = () => {
  teamMembers.value.push({ email: '', role: 'staff', name: '' })
}

const removeTeamMember = (index: number) => {
  if (teamMembers.value.length > 1) {
    teamMembers.value.splice(index, 1)
  }
}

const completeOnboarding = async () => {
  if (!authStore.user) return

  const finishLoading = startLoading()
  errorMessage.value = ''

  try {
    // Generate organization ID and slug
    const orgId = crypto.randomUUID()
    const slug = businessInfo.value.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Create organization document
    await setDoc(doc(db, 'organizations', orgId), {
      id: orgId,
      name: businessInfo.value.businessName,
      slug,
      industry: selectedIndustry.value,
      plan: 'trial',
      planStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      businessInfo: {
        address: businessInfo.value.address,
        phone: businessInfo.value.phone,
        email: authStore.user.email,
        description: businessInfo.value.description
      },
      onboardingCompleted: true,
      setupSteps: {
        businessInfo: true,
        industrySelection: true,
        teamInvite: teamMembers.value.length > 1,
        firstProduct: false
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: authStore.user.uid
    })

    // Add owner to organization members
    await setDoc(doc(db, 'organizations', orgId, 'members', authStore.user.uid), {
      userId: authStore.user.uid,
      role: 'owner',
      status: 'active',
      joinedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp()
    })

    // Update user profile with organization
    await updateDoc(doc(db, 'users', authStore.user.uid), {
      [`organizations.${orgId}`]: {
        role: 'owner',
        joinedAt: serverTimestamp(),
        status: 'active'
      }
    })

    // Reload user profile
    await authStore.loadUserProfile(authStore.user.uid)

    successMessage.value = 'Onboarding completed successfully!'
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/home/dashboard')
    }, 2000)

  } catch (error: any) {
    console.error('Onboarding error:', error)
    errorMessage.value = 'Failed to complete onboarding. Please try again.'
  } finally {
    finishLoading()
  }
}

const getStepTitle = (step: number) => {
  switch (step) {
    case 1: return 'Business Information'
    case 2: return 'Industry Selection'
    case 3: return 'Team Setup'
    case 4: return 'Review & Complete'
    default: return ''
  }
}

const getStepDescription = (step: number) => {
  switch (step) {
    case 1: return 'Tell us about your business'
    case 2: return 'Choose your industry type'
    case 3: return 'Invite your team members (optional)'
    case 4: return 'Review your information and complete setup'
    default: return ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to Your ERP System!</h1>
        <p class="text-gray-600">Let's set up your business in just a few steps</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-700">Step {{ currentStep }} of {{ totalSteps }}</span>
          <span class="text-sm text-gray-500">{{ Math.round(progressPercentage) }}% Complete</span>
        </div>
        <Progress :model-value="progressPercentage" class="h-3" />
      </div>

      <!-- Main Card -->
      <Card class="shadow-xl">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">{{ getStepTitle(currentStep) }}</CardTitle>
          <CardDescription>{{ getStepDescription(currentStep) }}</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Setting up your business...</span>
              <span class="text-muted-foreground">{{ Math.round(progress) }}%</span>
            </div>
            <Progress :model-value="progress" class="h-2" />
          </div>

          <!-- Error Alert -->
          <Alert v-if="errorMessage" variant="destructive">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <!-- Success Alert -->
          <Alert v-if="successMessage" class="bg-green-50 border-green-200">
            <CheckCircle class="h-4 w-4 text-green-600" />
            <AlertDescription class="text-green-800">{{ successMessage }}</AlertDescription>
          </Alert>

          <!-- Step 1: Business Information -->
          <div v-if="currentStep === 1" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  v-model="businessInfo.businessName"
                  placeholder="Enter your business name"
                  :disabled="isLoading"
                />
              </div>
              <div class="space-y-2">
                <Label for="businessType">Business Type *</Label>
                <Input
                  id="businessType"
                  v-model="businessInfo.businessType"
                  placeholder="e.g., Online Store, Restaurant"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="address">Business Address *</Label>
              <Input
                id="address"
                v-model="businessInfo.address"
                placeholder="Enter your business address"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                v-model="businessInfo.phone"
                placeholder="Enter your phone number"
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="description">Business Description</Label>
              <Input
                id="description"
                v-model="businessInfo.description"
                placeholder="Brief description of your business"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Step 2: Industry Selection -->
          <div v-if="currentStep === 2" class="space-y-4">
            <p class="text-sm text-gray-600 mb-4">
              Choose the industry that best describes your business. This helps us customize your experience.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="industry in industries"
                :key="industry.id"
                @click="selectedIndustry = industry.id"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md',
                  selectedIndustry === industry.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div :class="['p-2 rounded-lg', industry.color]">
                    <component :is="industry.icon" class="h-6 w-6" />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ industry.name }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Team Setup -->
          <div v-if="currentStep === 3" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium">Invite Team Members</h3>
                <p class="text-sm text-gray-600">Add team members to collaborate (optional)</p>
              </div>
              <Button @click="addTeamMember" variant="outline" size="sm">
                <Users class="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(member, index) in teamMembers"
                :key="index"
                class="flex items-center space-x-3 p-3 border rounded-lg"
              >
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    v-model="member.name"
                    placeholder="Full Name"
                    :disabled="isLoading"
                  />
                  <Input
                    v-model="member.email"
                    type="email"
                    placeholder="Email Address"
                    :disabled="isLoading"
                  />
                  <select
                    v-model="member.role"
                    class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :disabled="isLoading"
                  >
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </div>
                <Button
                  v-if="teamMembers.length > 1"
                  @click="removeTeamMember(index)"
                  variant="outline"
                  size="sm"
                  class="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <!-- Step 4: Review & Complete -->
          <div v-if="currentStep === 4" class="space-y-6">
            <div class="text-center">
              <CheckCircle class="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 class="text-xl font-semibold mb-2">Almost Done!</h3>
              <p class="text-gray-600">Please review your information before completing the setup.</p>
            </div>

            <Separator />

            <!-- Business Info Summary -->
            <div class="space-y-4">
              <h4 class="font-semibold flex items-center">
                <Building2 class="h-5 w-5 mr-2" />
                Business Information
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Business Name:</span>
                  <span class="font-medium">{{ businessInfo.businessName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Business Type:</span>
                  <span class="font-medium">{{ businessInfo.businessType }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Address:</span>
                  <span class="font-medium">{{ businessInfo.address }}</span>
                </div>
                <div v-if="businessInfo.phone" class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ businessInfo.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Industry Summary -->
            <div class="space-y-4">
              <h4 class="font-semibold flex items-center">
                <Store class="h-5 w-5 mr-2" />
                Industry
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <Badge variant="secondary" class="text-sm">
                  {{ industries.find(i => i.id === selectedIndustry)?.name }}
                </Badge>
              </div>
            </div>

            <!-- Team Summary -->
            <div class="space-y-4">
              <h4 class="font-semibold flex items-center">
                <Users class="h-5 w-5 mr-2" />
                Team Members
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-2">
                  {{ teamMembers.filter(m => m.email).length }} team member(s) will be invited
                </p>
                <div v-if="teamMembers.some(m => m.email)" class="space-y-1">
                  <div
                    v-for="member in teamMembers.filter(m => m.email)"
                    :key="member.email"
                    class="text-sm flex justify-between"
                  >
                    <span>{{ member.name || member.email }}</span>
                    <Badge variant="outline" class="text-xs">{{ member.role }}</Badge>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500">No team members added</p>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-6">
            <Button
              v-if="currentStep > 1"
              @click="prevStep"
              variant="outline"
              :disabled="isLoading"
            >
              <ArrowLeft class="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div v-else></div>

            <Button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              :disabled="!canProceed || isLoading"
            >
              Next
              <ArrowRight class="h-4 w-4 ml-2" />
            </Button>
            <Button
              v-else
              @click="completeOnboarding"
              :disabled="isLoading"
              class="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle class="h-4 w-4 mr-2" />
              {{ isLoading ? 'Setting up...' : 'Complete Setup' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Circle, Building2, Store, Users, Rocket } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

const currentStep = ref(1)
const totalSteps = 4
const errorMessage = ref('')

// Form data
const businessInfo = ref({
  name: '',
  industry: '',
  address: '',
  phone: '',
  email: authStore.user?.email || ''
})

const steps = [
  { id: 1, title: 'Welcome', icon: Rocket, description: 'Get started with your business' },
  { id: 2, title: 'Business Info', icon: Building2, description: 'Tell us about your business' },
  { id: 3, title: 'Industry', icon: Store, description: 'Select your industry type' },
  { id: 4, title: 'Complete', icon: Users, description: 'Setup complete!' }
]

const industries = [
  { value: 'fashion', label: 'Fashion & Clothing' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'beauty', label: 'Beauty & Cosmetics' },
  { value: 'home', label: 'Home & Living' },
  { value: 'general', label: 'General Retail' }
]

const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100)

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateStep = () => {
  errorMessage.value = ''
  
  if (currentStep.value === 2) {
    if (!businessInfo.value.name || !businessInfo.value.address || !businessInfo.value.phone) {
      errorMessage.value = 'Please fill in all business information fields'
      return false
    }
  }
  
  if (currentStep.value === 3) {
    if (!businessInfo.value.industry) {
      errorMessage.value = 'Please select your industry'
      return false
    }
  }
  
  return true
}

const handleNext = () => {
  if (validateStep()) {
    nextStep()
  }
}

const completeOnboarding = async () => {
  if (!validateStep()) return
  
  const finishLoading = startLoading()
  
  try {
    // Here you would typically create the organization in Firestore
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update user profile to indicate onboarding is complete
    await authStore.updateUserProfile({
      organizations: {
        'temp-org-id': {
          role: 'owner',
          joinedAt: new Date(),
          status: 'active'
        }
      }
    })
    
    // Redirect to dashboard
    router.push('/home/dashboard')
  } catch (error: any) {
    errorMessage.value = 'Failed to complete setup. Please try again.'
  } finally {
    finishLoading()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Welcome to Your ERP System</h1>
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

      <!-- Steps Indicator -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center space-x-4">
          <div
            v-for="step in steps"
            :key="step.id"
            class="flex items-center"
          >
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors',
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                ]"
              >
                <CheckCircle v-if="currentStep > step.id" class="w-6 h-6" />
                <component v-else :is="step.icon" class="w-6 h-6" />
              </div>
              <span class="text-xs mt-2 text-center font-medium">{{ step.title }}</span>
            </div>
            <div
              v-if="step.id < totalSteps"
              :class="[
                'w-16 h-0.5 mx-4',
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <Card class="max-w-2xl mx-auto shadow-xl">
        <CardContent class="p-8">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-4 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Setting up your business...</span>
              <span class="text-muted-foreground">{{ Math.round(progress) }}%</span>
            </div>
            <Progress :model-value="progress" class="h-2" />
          </div>

          <!-- Error Alert -->
          <Alert v-if="errorMessage" variant="destructive" class="mb-6">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <!-- Step 1: Welcome -->
          <div v-if="currentStep === 1" class="text-center space-y-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Rocket class="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold mb-2">Welcome, {{ authStore.user?.displayName }}!</h2>
              <p class="text-gray-600">
                We're excited to help you manage your business more efficiently. 
                Let's start by setting up your business profile.
              </p>
            </div>
          </div>

          <!-- Step 2: Business Information -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="text-center mb-6">
              <Building2 class="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 class="text-2xl font-bold mb-2">Business Information</h2>
              <p class="text-gray-600">Tell us about your business</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  v-model="businessInfo.name"
                  placeholder="Your Business Name"
                  :disabled="isLoading"
                />
              </div>

              <div class="space-y-2">
                <Label for="businessPhone">Phone Number *</Label>
                <Input
                  id="businessPhone"
                  v-model="businessInfo.phone"
                  placeholder="+62 812 3456 7890"
                  :disabled="isLoading"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="businessAddress">Business Address *</Label>
                <Input
                  id="businessAddress"
                  v-model="businessInfo.address"
                  placeholder="Your business address"
                  :disabled="isLoading"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label for="businessEmail">Email</Label>
                <Input
                  id="businessEmail"
                  v-model="businessInfo.email"
                  type="email"
                  placeholder="business@example.com"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Industry Selection -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div class="text-center mb-6">
              <Store class="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 class="text-2xl font-bold mb-2">Select Your Industry</h2>
              <p class="text-gray-600">This helps us customize your experience</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="industry in industries"
                :key="industry.value"
                @click="businessInfo.industry = industry.value"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-blue-300',
                  businessInfo.industry === industry.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <Circle
                    :class="[
                      'w-5 h-5',
                      businessInfo.industry === industry.value
                        ? 'text-blue-600 fill-current'
                        : 'text-gray-400'
                    ]"
                  />
                  <span class="font-medium">{{ industry.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Complete -->
          <div v-if="currentStep === 4" class="text-center space-y-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle class="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold mb-2">Setup Complete!</h2>
              <p class="text-gray-600 mb-4">
                Your business profile has been created successfully. 
                You're now ready to start managing your business with our ERP system.
              </p>
              
              <div class="bg-gray-50 rounded-lg p-4 text-left">
                <h3 class="font-semibold mb-2">Business Summary:</h3>
                <div class="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {{ businessInfo.name }}</p>
                  <p><strong>Industry:</strong> {{ industries.find(i => i.value === businessInfo.industry)?.label }}</p>
                  <p><strong>Address:</strong> {{ businessInfo.address }}</p>
                  <p><strong>Phone:</strong> {{ businessInfo.phone }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8 pt-6 border-t">
            <Button
              v-if="currentStep > 1 && currentStep < 4"
              variant="outline"
              @click="prevStep"
              :disabled="isLoading"
            >
              Previous
            </Button>
            <div v-else></div>

            <Button
              v-if="currentStep < 3"
              @click="handleNext"
              :disabled="isLoading"
            >
              Next
            </Button>
            <Button
              v-else-if="currentStep === 3"
              @click="handleNext"
              :disabled="isLoading"
            >
              Complete Setup
            </Button>
            <Button
              v-else-if="currentStep === 4"
              @click="completeOnboarding"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Setting up...' : 'Go to Dashboard' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
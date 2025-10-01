<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

// Form state
const currentStep = ref(1)
const totalSteps = 3

// Step 1: Organization Info
const organizationName = ref('')
const organizationType = ref('company')
const organizationAddress = ref('')

// Step 2: User Profile
const fullName = ref(authStore.user?.displayName || '')
const position = ref('')
const whatsapp = ref('')

// Step 3: Business Settings
const currency = ref('IDR')
const taxRate = ref('11')
const fiscalYearStart = ref('01')

const errorMessage = ref('')
const successMessage = ref('')

// Organization type options
const orgTypes = [
  { value: 'company', label: 'Company / PT' },
  { value: 'cv', label: 'CV' },
  { value: 'individual', label: 'Individual Business' },
  { value: 'nonprofit', label: 'Non-Profit Organization' }
]

// Computed
const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100)
const isFirstStep = computed(() => currentStep.value === 1)
const isLastStep = computed(() => currentStep.value === totalSteps)

// Step validation
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return organizationName.value.trim() !== '' && organizationType.value !== ''
    case 2:
      return fullName.value.trim() !== '' && position.value.trim() !== ''
    case 3:
      return true
    default:
      return false
  }
})

// Methods
const nextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
    errorMessage.value = ''
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    errorMessage.value = ''
  }
}

const handleComplete = async () => {
  if (!authStore.user) {
    errorMessage.value = 'User not authenticated'
    return
  }

  const finishLoading = startLoading()
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Generate organization ID
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create organization document
    await setDoc(doc(db, 'organizations', orgId), {
      id: orgId,
      name: organizationName.value,
      type: organizationType.value,
      address: organizationAddress.value,
      currency: currency.value,
      taxRate: parseFloat(taxRate.value),
      fiscalYearStart: parseInt(fiscalYearStart.value),
      ownerId: authStore.user.uid,
      members: {
        [authStore.user.uid]: {
          role: 'owner',
          joinedAt: new Date()
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Update user profile
    await authStore.updateUserProfile({
      profile: {
        fullName: fullName.value,
        position: position.value,
        whatsapp: whatsapp.value || null
      },
      organizations: {
        [orgId]: {
          role: 'owner',
          joinedAt: new Date()
        }
      }
    })

    successMessage.value = 'Onboarding completed successfully!'

    // Redirect to dashboard after short delay
    setTimeout(() => {
      router.push({ name: 'HomeDashboard' })
    }, 1000)

  } catch (error: any) {
    console.error('Onboarding error:', error)
    errorMessage.value = error.message || 'Failed to complete onboarding. Please try again.'
  } finally {
    finishLoading()
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <div class="w-full max-w-2xl">
      <Card class="shadow-xl">
        <CardHeader class="text-center">
          <CardTitle class="text-3xl font-bold text-gray-900">Welcome to Your ERP System</CardTitle>
          <CardDescription>Let's set up your account and organization</CardDescription>

          <!-- Step Progress -->
          <div class="mt-6 space-y-2">
            <div class="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {{ currentStep }} of {{ totalSteps }}</span>
              <span>{{ Math.round(progressPercentage) }}%</span>
            </div>
            <Progress :model-value="progressPercentage" class="h-2" />
          </div>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Setting up your account...</span>
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
            <AlertDescription class="text-green-800">{{ successMessage }}</AlertDescription>
          </Alert>

          <!-- Step 1: Organization Information -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="text-center mb-4">
              <h3 class="text-xl font-semibold">Organization Information</h3>
              <p class="text-sm text-muted-foreground">Tell us about your organization</p>
            </div>

            <div class="space-y-2">
              <Label for="org-name">Organization Name *</Label>
              <Input
                  id="org-name"
                  v-model="organizationName"
                  placeholder="PT. Example Company"
                  :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="org-type">Organization Type *</Label>
              <select
                  id="org-type"
                  v-model="organizationType"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :disabled="isLoading"
              >
                <option v-for="type in orgTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <Label for="org-address">Address</Label>
              <Input
                  id="org-address"
                  v-model="organizationAddress"
                  placeholder="Full address"
                  :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Step 2: User Profile -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div class="text-center mb-4">
              <h3 class="text-xl font-semibold">Your Profile</h3>
              <p class="text-sm text-muted-foreground">Complete your personal information</p>
            </div>

            <div class="space-y-2">
              <Label for="full-name">Full Name *</Label>
              <Input
                  id="full-name"
                  v-model="fullName"
                  placeholder="John Doe"
                  :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="position">Position / Role *</Label>
              <Input
                  id="position"
                  v-model="position"
                  placeholder="e.g., CEO, Manager, Owner"
                  :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="whatsapp">WhatsApp Number (Optional)</Label>
              <Input
                  id="whatsapp"
                  v-model="whatsapp"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Step 3: Business Settings -->
          <div v-show="currentStep === 3" class="space-y-4">
            <div class="text-center mb-4">
              <h3 class="text-xl font-semibold">Business Settings</h3>
              <p class="text-sm text-muted-foreground">Configure your business preferences</p>
            </div>

            <div class="space-y-2">
              <Label for="currency">Currency</Label>
              <select
                  id="currency"
                  v-model="currency"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :disabled="isLoading"
              >
                <option value="IDR">Indonesian Rupiah (IDR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="SGD">Singapore Dollar (SGD)</option>
              </select>
            </div>

            <div class="space-y-2">
              <Label for="tax-rate">Default Tax Rate (%)</Label>
              <Input
                  id="tax-rate"
                  v-model="taxRate"
                  type="number"
                  step="0.01"
                  placeholder="11"
                  :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="fiscal-year">Fiscal Year Start (Month)</Label>
              <select
                  id="fiscal-year"
                  v-model="fiscalYearStart"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :disabled="isLoading"
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>

          <Separator />

          <!-- Navigation Buttons -->
          <div class="flex justify-between gap-4">
            <Button
                v-if="!isFirstStep"
                variant="outline"
                @click="previousStep"
                :disabled="isLoading"
                class="w-32"
            >
              Previous
            </Button>
            <div v-else class="w-32"></div>

            <Button
                v-if="!isLastStep"
                @click="nextStep"
                :disabled="!canProceed || isLoading"
                class="w-32"
            >
              Next
            </Button>
            <Button
                v-else
                @click="handleComplete"
                :disabled="!canProceed || isLoading"
                class="w-32"
            >
              {{ isLoading ? 'Completing...' : 'Complete' }}
            </Button>
          </div>

          <!-- Step Indicators -->
          <div class="flex justify-center gap-2 pt-4">
            <div
                v-for="step in totalSteps"
                :key="step"
                class="h-2 w-2 rounded-full transition-colors"
                :class="step <= currentStep ? 'bg-primary' : 'bg-muted'"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
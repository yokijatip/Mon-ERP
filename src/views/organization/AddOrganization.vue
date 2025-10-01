<script setup lang="ts">
import { ref } from 'vue'
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
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

// Form state
const organizationName = ref('')
const organizationType = ref('company')
const organizationAddress = ref('')
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

const canSubmit = () => {
  return organizationName.value.trim() !== '' && organizationType.value !== ''
}

const goBack = () => {
  router.back()
}

const handleCreateOrganization = async () => {
  if (!authStore.user) {
    errorMessage.value = 'User not authenticated'
    return
  }

  if (!canSubmit()) {
    errorMessage.value = 'Please fill in required fields'
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

    // Update user profile with new organization
    const currentOrgs = authStore.userProfile?.organizations || {}
    await authStore.updateUserProfile({
      organizations: {
        ...currentOrgs,
        [orgId]: {
          role: 'owner',
          joinedAt: new Date()
        }
      }
    })

    // Set as active organization
    authStore.setActiveOrganization(orgId)

    successMessage.value = 'Organization created successfully!'

    // Redirect to dashboard after short delay
    setTimeout(() => {
      router.push({ name: 'HomeDashboard' })
    }, 1000)

  } catch (error: any) {
    console.error('Create organization error:', error)
    errorMessage.value = error.message || 'Failed to create organization. Please try again.'
  } finally {
    finishLoading()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <div class="max-w-2xl mx-auto pt-8">
      <!-- Back Button -->
      <Button
          variant="ghost"
          size="sm"
          @click="goBack"
          class="mb-4"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card class="shadow-xl">
        <CardHeader class="text-center">
          <CardTitle class="text-3xl font-bold text-gray-900">Create New Organization</CardTitle>
          <CardDescription>Add another organization to manage</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Creating organization...</span>
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

          <!-- Form -->
          <form @submit.prevent="handleCreateOrganization" class="space-y-6">
            <!-- Organization Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Organization Information</h3>

              <div class="space-y-2">
                <Label for="org-name">Organization Name *</Label>
                <Input
                    id="org-name"
                    v-model="organizationName"
                    placeholder="PT. Example Company"
                    required
                    :disabled="isLoading || !!successMessage"
                />
              </div>

              <div class="space-y-2">
                <Label for="org-type">Organization Type *</Label>
                <select
                    id="org-type"
                    v-model="organizationType"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :disabled="isLoading || !!successMessage"
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
                    :disabled="isLoading || !!successMessage"
                />
              </div>
            </div>

            <!-- Business Settings -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Business Settings</h3>

              <div class="space-y-2">
                <Label for="currency">Currency</Label>
                <select
                    id="currency"
                    v-model="currency"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :disabled="isLoading || !!successMessage"
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
                    :disabled="isLoading || !!successMessage"
                />
              </div>

              <div class="space-y-2">
                <Label for="fiscal-year">Fiscal Year Start (Month)</Label>
                <select
                    id="fiscal-year"
                    v-model="fiscalYearStart"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :disabled="isLoading || !!successMessage"
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

            <!-- Submit Button -->
            <div class="flex gap-4">
              <Button
                  type="button"
                  variant="outline"
                  @click="goBack"
                  :disabled="isLoading || !!successMessage"
                  class="flex-1"
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  :disabled="!canSubmit() || isLoading || !!successMessage"
                  class="flex-1"
              >
                {{ isLoading ? 'Creating...' : 'Create Organization' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
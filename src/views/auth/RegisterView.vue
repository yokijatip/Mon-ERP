<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  // Validation
  if (!displayName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  const finishLoading = startLoading()
  errorMessage.value = ''

  try {
    await authStore.register(email.value, password.value, displayName.value)
    
    // Redirect to onboarding
    router.push('/onboarding')
  } catch (error: any) {
    errorMessage.value = getErrorMessage(error.code)
  } finally {
    finishLoading()
  }
}

const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/weak-password':
      return 'Password is too weak'
    default:
      return 'Registration failed. Please try again'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md">
      <Card class="shadow-xl">
        <CardHeader class="text-center">
          <CardTitle class="text-3xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        
        <CardContent class="space-y-6">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Creating account...</span>
              <span class="text-muted-foreground">{{ Math.round(progress) }}%</span>
            </div>
            <Progress :model-value="progress" class="h-2" />
          </div>

          <!-- Error Alert -->
          <Alert v-if="errorMessage" variant="destructive">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <!-- Register Form -->
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <Label for="displayName">Full Name</Label>
              <Input
                id="displayName"
                v-model="displayName"
                type="text"
                placeholder="John Doe"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                :disabled="isLoading"
              />
              <p class="text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div class="space-y-2">
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                :disabled="isLoading"
              />
            </div>

            <Button
              type="submit"
              class="w-full"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </Button>
          </form>

          <!-- Login Link -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <router-link
                to="/login"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </router-link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
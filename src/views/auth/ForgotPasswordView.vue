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

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleResetPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address'
    return
  }

  const finishLoading = startLoading()
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.resetPassword(email.value)

    successMessage.value = 'Password reset email sent! Check your inbox.'

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error: any) {
    errorMessage.value = getErrorMessage(error.code)
  } finally {
    finishLoading()
  }
}

const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email'
    case 'auth/invalid-email':
      return 'Invalid email address'
    default:
      return 'Failed to send reset email. Please try again'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md">
      <Card class="shadow-xl">
        <CardHeader class="text-center">
          <CardTitle class="text-3xl font-bold text-gray-900">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Sending reset link...</span>
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

          <!-- Reset Form -->
          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  :disabled="isLoading || !!successMessage"
              />
            </div>

            <Button
                type="submit"
                class="w-full"
                :disabled="isLoading || !!successMessage"
            >
              {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
            </Button>
          </form>

          <!-- Back to Login Link -->
          <div class="text-center">
            <router-link
                to="/login"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Login
            </router-link>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
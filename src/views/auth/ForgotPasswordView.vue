<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleResetPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    await authStore.resetPassword(email.value)

    successMessage.value = 'Password reset email sent! Check your inbox.'

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error: any) {
    errorMessage.value = getErrorMessage(error.code)
  } finally {
    isLoading.value = false
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
      <div class="bg-white rounded-lg shadow-xl p-8">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p class="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        <!-- Error Alert -->
        <Alert v-if="errorMessage" variant="destructive" class="mb-6">
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>

        <!-- Success Alert -->
        <Alert v-if="successMessage" class="mb-6 bg-green-50 border-green-200">
          <AlertDescription class="text-green-800">{{ successMessage }}</AlertDescription>
        </Alert>

        <!-- Reset Form -->
        <form @submit.prevent="handleResetPassword" class="space-y-6">
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
        <div class="mt-6 text-center">
          <router-link
              to="/login"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
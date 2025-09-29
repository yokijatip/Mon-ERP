<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    await authStore.login(email.value, password.value)

    // Redirect to the page they tried to access or home
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
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
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-disabled':
      return 'This account has been disabled'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later'
    default:
      return 'Login failed. Please try again'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-xl p-8">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p class="text-gray-600">Sign in to your account to continue</p>
        </div>

        <!-- Error Alert -->
        <Alert v-if="errorMessage" variant="destructive" class="mb-6">
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
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
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <router-link
                  to="/forgot-password"
                  class="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </router-link>
            </div>
            <Input
                id="password"
                v-model="password"
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
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link
                to="/register"
                class="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
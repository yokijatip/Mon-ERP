<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  const finishLoading = startLoading()
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)

    // Redirect to the page they tried to access or home
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
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
      <Card class="shadow-xl">
        <CardHeader class="text-center">
          <CardTitle class="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Loading Progress -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Signing in...</span>
              <span class="text-muted-foreground">{{ Math.round(progress) }}%</span>
            </div>
            <Progress :model-value="progress" class="h-2" />
          </div>

          <!-- Error Alert -->
          <Alert v-if="errorMessage" variant="destructive">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
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
          <div class="text-center">
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
        </CardContent>
      </Card>
    </div>
  </div>
</template>
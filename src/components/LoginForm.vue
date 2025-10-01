<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

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
    case 'auth/invalid-credential':
      return 'Invalid email or password'
    default:
      return 'Login failed. Please try again'
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="handleLogin" class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">
                Login to your account
              </h1>
              <p class="text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            <div v-if="isLoading" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Signing in...</span>
                <span class="text-muted-foreground">{{ Math.round(progress) }}%</span>
              </div>
              <Progress :model-value="progress" class="h-2" />
            </div>

            <Alert v-if="errorMessage" variant="destructive">
              <AlertDescription>{{ errorMessage }}</AlertDescription>
            </Alert>

            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="m@example.com"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <router-link
                  to="/forgot-password"
                  class="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </router-link>
              </div>
              <Input
                id="password"
                v-model="password"
                type="password"
                required
                :disabled="isLoading"
              />
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Signing in...' : 'Login' }}
            </Button>
            <div class="text-center text-sm">
              Don't have an account?
              <router-link to="/register" class="underline underline-offset-4">
                Sign up
              </router-link>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Business workspace"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          >
        </div>
      </CardContent>
    </Card>
    <div class="text-muted-foreground text-center text-xs text-balance">
      By clicking continue, you agree to our Terms of Service and Privacy Policy.
    </div>
  </div>
</template>

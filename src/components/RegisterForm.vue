<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
const authStore = useAuthStore()
const { isLoading, progress, startLoading } = useLoading()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
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
    await authStore.register(email.value, password.value, fullName.value)
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
      return 'This email is already registered'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/weak-password':
      return 'Password is too weak'
    case 'auth/operation-not-allowed':
      return 'Registration is currently disabled'
    default:
      return 'Registration failed. Please try again'
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="handleRegister" class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">
                Create an account
              </h1>
              <p class="text-muted-foreground text-balance">
                Start managing your business today
              </p>
            </div>

            <div v-if="isLoading" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Creating account...</span>
                <span class="text-muted-foreground">{{ Math.round(progress) }}%</span>
              </div>
              <Progress :model-value="progress" class="h-2" />
            </div>

            <Alert v-if="errorMessage" variant="destructive">
              <AlertDescription>{{ errorMessage }}</AlertDescription>
            </Alert>

            <div class="grid gap-3">
              <Label for="fullName">Full Name</Label>
              <Input
                id="fullName"
                v-model="fullName"
                type="text"
                placeholder="John Doe"
                required
                :disabled="isLoading"
              />
            </div>
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
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="At least 6 characters"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="grid gap-3">
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                :disabled="isLoading"
              />
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Creating account...' : 'Sign up' }}
            </Button>
            <div class="text-center text-sm">
              Already have an account?
              <router-link to="/login" class="underline underline-offset-4">
                Sign in
              </router-link>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Business team"
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

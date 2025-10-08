<script setup lang="ts">
import {useAuth} from "@/composables/useAuth.ts";

const { user } = useAuth()

// Greetings
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
}
</script>

<template>
  <div class="space-y-4">


<!--  Title or Header Start  -->
    <div>
      <!-- Title -->
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Welcome to your ERP Dashboard</h1>
        <p class="text-muted-foreground">{{ getGreeting() }}, <span>{{ user?.displayName || 'User' }}</span></p>
      </div>

      <!-- Date range picker and Button Download -->
    </div>
  </div>
</template>

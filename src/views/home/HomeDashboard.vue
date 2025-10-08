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
    </div>
<!--  Title or Hedaer End  -->

<!--  TEMPLATE DARI SHAdCN VUE  -->

<!--    <div class="grid auto-rows-min gap-4 md:grid-cols-3">-->
<!--      <div class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">-->
<!--        <p class="text-muted-foreground">Chart 1</p>-->
<!--      </div>-->
<!--      <div class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">-->
<!--        <p class="text-muted-foreground">Chart 2</p>-->
<!--      </div>-->
<!--      <div class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">-->
<!--        <p class="text-muted-foreground">Chart 3</p>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">-->
<!--      <div class="text-center">-->
<!--        <h1 class="text-2xl font-bold mb-2">Home Dashboard</h1>-->
<!--        <p class="text-muted-foreground">Welcome to your ERP dashboard</p>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

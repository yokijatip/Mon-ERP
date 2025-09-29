<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from "vue";

const authStore = useAuthStore()

// Initialize authentication on app mount
onMounted(async () => {
  await useAuthStore().initAuth()
})
</script>

<template>
  <Toaster/>
  <div v-if="authStore.loading" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
  <RouterView v-else />
</template>

<style scoped>

</style>

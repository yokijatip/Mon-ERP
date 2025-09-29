<script setup lang="ts">

import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header>
<!--    Untuk Breadcrumb dan header    -->
      </header>

<!--   Tempat Area content yang dinamis berganti ganti pas si user klik navigasi dari sidebar   -->
      <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>


<style scoped>

</style>
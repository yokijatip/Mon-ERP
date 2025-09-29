<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarProps } from '@/components/ui/sidebar'
import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Settings2,
  Music2,
  Store,
  House,
  Shirt
} from "lucide-vue-next"
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const route = useRoute()

// Data sidebar - bisa dipindahkan ke composable atau store
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      icon: House,
      url: '/home/dashboard',
      items: [
        {
          title: "Dashboard",
          url: "/home/dashboard",
        },
      ],
    },
    {
      title: "Products",
      url: "/products/dashboard",
      icon: Shirt,
      items: [
        {
          title: "Dashboard",
          url: "/products/dashboard",
        },
        {
          title: "Listing",
          url: "/products/listing"
        },
        {
          title: "View Products",
          url: "/products/view",
        },
        {
          title: "Add Product",
          url: "/products/add",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation/introduction",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/documentation/introduction",
        },
        {
          title: "Get Started",
          url: "/documentation/get-started",
        },
        {
          title: "Tutorials",
          url: "/documentation/tutorials",
        },
        {
          title: "Changelog",
          url: "/documentation/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings/general",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Limits",
          url: "/settings/limits",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Zarqa Store",
      url: "#",
      icon: Store,
    },
    {
      name: "Adelia Shop",
      url: "#",
      icon: Music2,
    },
    {
      name: "Daily Moeslim by Zarqa",
      url: "#",
      icon: Music2,
    },
  ],
}

// Computed untuk menentukan menu aktif berdasarkan route
const navMainWithActive = computed(() => {
  return data.navMain.map(item => ({
    ...item,
    isActive: route.path.startsWith(item.url)
  }))
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMainWithActive" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
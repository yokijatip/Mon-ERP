<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarProps } from '@/components/ui/sidebar'
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  House,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  FileText,
  TrendingUp,
  Settings
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

// Data sidebar
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
      title: "home",
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
      title: "finance",
      url: "/finance/dashboard",
      icon: DollarSign,
      items: [
        {
          title: "Dashboard",
          url: "/finance/dashboard",
        },
        {
          title: "Cash Flow",
          url: "/finance/cash-flow",
        },
        {
          title: "Financial reports",
          url: "/finance/financial-reports",
        },
        {
          title: "General Ledger",
          url: "/finance/general-ledger",
        },
      ],
    },
    {
      title: "Human Resources",
      url: "/human-resources/dashboard",
      icon: Users,
      items: [
        {
          title: "Dashboard",
          url: "/human-resources/dashboard",
        },
        {
          title: "Employees",
          url: "/human-resources/employees",
        },
        {
          title: "Attendance",
          url: "/human-resources/attendance",
        },
        {
          title: "Payroll",
          url: "/human-resources/payroll",
        },
      ],
    },
    {
      title: "inventory",
      url: "/inventory/dashboard",
      icon: Package,
      items: [
        {
          title: "Dashboard",
          url: "/inventory/dashboard",
        },
        {
          title: "Stock Overview",
          url: "/inventory/stock-overview",
        },
        {
          title: "Adjustments",
          url: "/inventory/adjustments",
        },
        {
          title: "Stock reports",
          url: "/inventory/stock-reports",
        },
      ],
    },
    {
      title: "purchasing",
      url: "/purchasing/dashboard",
      icon: ShoppingCart,
      items: [
        {
          title: "Dashboard",
          url: "/purchasing/dashboard",
        },
        {
          title: "Purchase Requests",
          url: "/purchasing/purchase-requests",
        },
        {
          title: "Purchase Order History",
          url: "/purchasing/purchase-order-history",
        },
        {
          title: "Suppliers",
          url: "/purchasing/suppliers",
        },
      ],
    },
    {
      title: "reports",
      url: "/reports/consolidated-reports",
      icon: FileText,
      items: [
        {
          title: "Consolidated reports",
          url: "/reports/consolidated-reports",
        },
        {
          title: "Exports",
          url: "/reports/exports",
        },
      ],
    },
    {
      title: "sales",
      url: "/sales/dashboard",
      icon: TrendingUp,
      items: [
        {
          title: "Dashboard",
          url: "/sales/dashboard",
        },
        {
          title: "Customers",
          url: "/sales/customers",
        },
        {
          title: "Orders",
          url: "/sales/orders",
        },
        {
          title: "Invoices",
          url: "/sales/invoices",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings/integrations",
      icon: Settings,
      items: [
        {
          title: "Integrations",
          url: "/settings/integrations",
        },
        {
          title: "Roles & Permission",
          url: "/settings/roles-permission",
        },
        {
          title: "System Preferences",
          url: "/settings/system-preferences",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Zarqa Store",
      url: "#",
      icon: GalleryVerticalEnd,
    },
    {
      name: "Adelia Shop",
      url: "#",
      icon: AudioWaveform,
    },
    {
      name: "Daily Moeslim by Zarqa",
      url: "#",
      icon: Command,
    },
  ],
}

// Computed untuk menentukan menu aktif berdasarkan route
const navMainWithActive = computed(() => {
  return data.navMain.map(item => ({
    ...item,
    isActive: route.path.startsWith(item.url.split('/').slice(0, 2).join('/'))
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
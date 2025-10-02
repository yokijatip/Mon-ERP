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
import OrganizationSwitcher from "@/components/OrganizationSwitcher.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {useAuthStore} from "@/stores/auth.ts";
import router from "@/router";

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})


const route = useRoute()
const authStore = useAuthStore()

// Handle Logout

const handleLogout = async () => {
  try {
    await authStore.logout()
    await router.push('/login')
  } catch (error){
    console.error('Logout Failed:', error)
  }
}

const user = computed(() => ({
  name: authStore.userProfile?.displayName || authStore.user?.displayName || 'User',
  email: authStore.user?.email || '',
  avatar: authStore.user?.photoURL || ''
}))

// Data sidebar
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  organizationList: [
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
      title: "Finance",
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
      title: "Inventory",
      url: "/inventory/dashboard",
      icon: Package,
      items: [
        {
          title: "Dashboard",
          url: "/inventory/dashboard",
        },
        {
          title: "Products",
          url: "/products",
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
      title: "Purchasing",
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
      title: "Reports",
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
      title: "Sales",
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
      <OrganizationSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMainWithActive" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user" @logout="handleLogout" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
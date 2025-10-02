<script setup lang="ts">
import { computed} from "vue"

import { ChevronsUpDown, Plus } from "lucide-vue-next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()
const { isMobile } = useSidebar()

const activeOrg = computed(() => authStore.activeOrganization)
const organizations = computed(() => authStore.organizations)
const userOrgs = computed(() => authStore.userOrganizations)

const organizationList = computed(() => {
  return Object.entries(organizations.value).map(([id, org]) => ({
    id,
    name: org.name,
    type: org.type,
    role: userOrgs.value[id]?.role || 'member',
    logo: org.logo
  }))
})

const switchOrganization = (orgId: string) => {
  try {
    authStore.setActiveOrganization(orgId)
    router.push({name: "HomeDashboard"})
  } catch (error) {
    console.error('Failed to Switch organization:', error)
  }
}

const addOrganization = () => {
  router.push({ name: "AddOrganization"})
}

</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
<!--              <component :is="activeTeam?.logo" class="size-4" />-->
              <span class="text-sm font-semibold">
                {{ activeOrg?.name?.substring(0, 2).toUpperCase() || 'NA' }}
              </span>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ activeOrg?.name || 'No Organization'}}
              </span>
              <span class="truncate text-xs">{{ activeOrg?.type || 'Select Organization' }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >


          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Organizations
          </DropdownMenuLabel>

          <template v-for="org in organizationList" :key="org.id">
            <DropdownMenuItem
                class="gap-2 p-2 cursor-pointer"
                @click="switchOrganization(org.id)"
            >
              <div class="flex size-6 items-center justify-center rounded-sm border">
               <span class="text-sm font-medium">
                 {{ org.name?.substring(0, 2).toUpperCase() }}
               </span>
              </div>
              {{ org.name }}
              <span class="text-xs text-muted-foreground">
                {{ org.role }}
              </span>

            </DropdownMenuItem>
          </template>

          <DropdownMenuSeparator />

          <DropdownMenuItem class="gap-2 p-2 cursor-pointer" @click="addOrganization">
            <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">
              Add Organization
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

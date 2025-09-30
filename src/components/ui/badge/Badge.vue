<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { BadgeVariants } from "."
import { cn } from "@/lib/utils"
import { badgeVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: BadgeVariants["variant"]
}>()
</script>

<template>
  <div
    data-slot="badge"
    :class="cn(badgeVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
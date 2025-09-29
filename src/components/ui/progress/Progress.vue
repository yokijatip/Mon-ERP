<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { ProgressVariants } from "."
import { cn } from "@/lib/utils"
import { progressVariants } from "."

const props = withDefaults(defineProps<{
  modelValue?: number
  max?: number
  class?: HTMLAttributes["class"]
  variant?: ProgressVariants["variant"]
}>(), {
  modelValue: 0,
  max: 100,
  variant: "default",
})
</script>

<template>
  <div
    data-slot="progress"
    :class="cn(progressVariants({ variant }), props.class)"
    role="progressbar"
    :aria-valuemax="max"
    :aria-valuenow="modelValue"
  >
    <div
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="{ transform: `translateX(-${100 - (modelValue / max) * 100}%)` }"
    />
  </div>
</template>
<script setup lang="ts">
<<<<<<< HEAD
import type { ProgressRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  ProgressIndicator,
  ProgressRoot,

} from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    modelValue: 0,
  },
)

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        props.class,
      )
    "
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="bg-primary h-full w-full flex-1 transition-all"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
=======
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
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22

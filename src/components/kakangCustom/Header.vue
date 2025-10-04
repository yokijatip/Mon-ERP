<script setup lang="ts">
 import { computed } from 'vue'

 interface Props {
   title: string
   subtitle?: string
   align?: 'left' | 'center' | 'right'
 }

 const props = withDefaults(defineProps<Props>(), {
   align: 'left',
 })

 const justify = computed(() => {
   switch (props.align) {
     case 'center':
       return 'sm:justify-center sm:text-center'
     case 'right':
       return 'sm:justify-end sm:text-right'
     default:
       return 'sm:justify-between'
   }
 })
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center" :class="justify" v-bind="$attrs">
    <div class="min-w-0">
      <h1 class="text-3xl font-bold tracking-tight">
        <slot name="title">
          {{ props.title }}
        </slot>
      </h1>
      <p v-if="props.subtitle || $slots.subtitle" class="text-muted-foreground">
        <slot name="subtitle">
          {{ props.subtitle }}
        </slot>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
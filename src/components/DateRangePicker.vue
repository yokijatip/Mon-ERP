<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'

const props = withDefaults(defineProps<{
  modelValue: DateRange
  placeholder?: string
  buttonClass?: string
  format?: string
  numberOfMonths?: number
  disabled?: boolean
  defaultToCurrentMonth?: boolean
}>(), {
  placeholder: 'Tanggal',
  buttonClass: '',
  format: 'medium',
  numberOfMonths: 2,
  disabled: false,
  defaultToCurrentMonth: true
})

const emit = defineEmits<{
  'update:modelValue': [value: DateRange]
}>()

const dateFormatter = new DateFormatter('en-US', {
  dateStyle: props.format as any
})

const value = computed({
  get: () => props.modelValue,
  set: (newValue: DateRange) => {
    emit('update:modelValue', newValue)
  }
})

const displayValue = computed(() => {
  if (!value.value?.start) return ''
  
  if (value.value.end) {
    return `${dateFormatter.format(value.value.start.toDate(getLocalTimeZone()))} - ${dateFormatter.format(value.value.end.toDate(getLocalTimeZone()))}`
  }
  
  return dateFormatter.format(value.value.start.toDate(getLocalTimeZone()))
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        :disabled="disabled"
        variant="outline"
        :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !value?.start && 'text-muted-foreground',
          buttonClass
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ displayValue || placeholder }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar 
        v-model="value" 
        :disabled-dates="disabled"
        :number-of-months="numberOfMonths" 
        initial-focus 
      />
    </PopoverContent>
  </Popover>
</template>
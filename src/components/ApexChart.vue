<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'

interface Props {
  options: ApexOptions
  series: ApexOptions['series']
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap'
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  height: '350'
})

const chartRef = ref<HTMLDivElement | null>(null)
let chart: ApexCharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  if (chart) {
    chart.destroy()
  }

  const chartOptions: ApexOptions = {
    ...props.options,
    series: props.series,
    chart: {
      ...props.options.chart,
      type: props.type,
      height: props.height,
    }
  }

  chart = new ApexCharts(chartRef.value, chartOptions)
  chart.render()
}

onMounted(() => {
  initChart()
})

watch(() => [props.options, props.series], () => {
  if (chart) {
    chart.updateOptions({
      ...props.options,
      series: props.series
    })
  }
}, { deep: true })
</script>

<template>
  <div ref="chartRef"></div>
</template>

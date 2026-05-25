<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ConsumptionPoint } from '@/types/lyncr'

const props = defineProps<{
  data: ConsumptionPoint[]
}>()

const width = 560
const height = 196
const padding = { top: 12, right: 12, bottom: 24, left: 44 }

const hoveredIndex = ref<number | null>(null)

const chart = computed(() => {
  if (props.data.length === 0) {
    return { points: [], linePath: '', areaPath: '', yTicks: [], innerH: 0, max: 0 }
  }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const values = props.data.map((d) => d.stones)
  const max = Math.max(...values) * 1.1
  const min = 0

  const points = props.data.map((d, i) => {
    const x = padding.left + (i / (props.data.length - 1)) * innerW
    const y = padding.top + innerH - ((d.stones - min) / (max - min)) * innerH
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${padding.top + innerH} L ${points[0]?.x ?? 0} ${padding.top + innerH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: padding.top + innerH - ratio * innerH,
    label: Math.round(max * ratio).toLocaleString(),
  }))

  return { points, linePath, areaPath, yTicks, innerH, max }
})

const activePoint = computed(() => {
  if (hoveredIndex.value === null) return null
  return chart.value.points[hoveredIndex.value] ?? null
})

function onMove(event: MouseEvent) {
  const svg = event.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * width
  const innerW = width - padding.left - padding.right
  const ratio = (x - padding.left) / innerW
  const index = Math.round(ratio * (props.data.length - 1))
  hoveredIndex.value = Math.max(0, Math.min(props.data.length - 1, index))
}

function onLeave() {
  hoveredIndex.value = null
}
</script>

<template>
  <div v-if="data.length === 0" class="flex items-center justify-center h-[196px]">
    <p class="text-sm text-zinc-500">暂无消耗数据</p>
  </div>
  <div v-else class="relative w-full">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full h-[196px] select-none"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <defs>
        <linearGradient id="stonesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stop-color="#007aff" stop-opacity="0.35" />
          <stop offset="95%" stop-color="#007aff" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g v-for="(tick, i) in chart.yTicks" :key="i">
        <line
          :x1="padding.left"
          :y1="tick.y"
          :x2="width - padding.right"
          :y2="tick.y"
          stroke="rgba(255,255,255,0.06)"
          stroke-dasharray="3 3"
        />
        <text
          :x="padding.left - 8"
          :y="tick.y + 4"
          text-anchor="end"
          class="fill-zinc-600 text-[10px] font-mono"
        >
          {{ tick.label }}
        </text>
      </g>

      <path :d="chart.areaPath" fill="url(#stonesGrad)" />
      <path
        :d="chart.linePath"
        fill="none"
        stroke="#007aff"
        stroke-width="2"
        stroke-linejoin="round"
      />

      <g v-for="(point, i) in chart.points" :key="i">
        <text
          v-if="i % 2 === 0 || i === chart.points.length - 1"
          :x="point.x"
          :y="height - 6"
          text-anchor="middle"
          class="fill-zinc-600 text-[10px]"
        >
          {{ point.date }}
        </text>
      </g>

      <template v-if="activePoint">
        <line
          :x1="activePoint.x"
          :y1="padding.top"
          :x2="activePoint.x"
          :y2="padding.top + chart.innerH"
          stroke="rgba(0,122,255,0.25)"
        />
        <circle
          :cx="activePoint.x"
          :cy="activePoint.y"
          r="4"
          fill="#007aff"
          stroke="#60a5fa"
          stroke-width="2"
        />
      </template>
    </svg>

    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="activePoint"
        class="absolute top-2 left-1/2 -translate-x-1/2 glass-card px-3 py-2 shadow-xl pointer-events-none"
      >
        <p class="text-xs text-zinc-500 mb-1">{{ activePoint.date }}</p>
        <div class="flex items-center gap-1.5">
          <span class="i-carbon-diamond text-amber-400 text-sm" />
          <span class="text-sm font-mono font-semibold text-amber-300">
            {{ activePoint.stones.toLocaleString() }}
          </span>
          <span class="text-xs text-zinc-500">灵石</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

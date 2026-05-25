<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const configs: Record<string, { dot: string; text: string; bg: string }> = {
  在线: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  离线: { dot: 'bg-zinc-500', text: 'text-zinc-400', bg: 'bg-zinc-500/10' },
  忙碌: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-400/10' },
}

const fallback = configs['离线']!
const config = configs[props.status] ?? fallback
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs"
    :class="[config.bg, config.text]"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="config.dot" />
    {{ status }}
  </span>
</template>

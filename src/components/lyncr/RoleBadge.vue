<script setup lang="ts">
const props = defineProps<{
  role: string
}>()

const configs: Record<string, string> = {
  管理员: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  开发者: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  分析师: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  观察者: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/25',
}

const badgeClass = configs[props.role] ?? 'text-zinc-400 bg-zinc-500/10 border-zinc-500/25'
</script>

<template>
  <span
    class="inline-flex px-2 py-0.5 rounded-md text-xs border font-medium"
    :class="badgeClass"
  >
    {{ role }}
  </span>
</template>

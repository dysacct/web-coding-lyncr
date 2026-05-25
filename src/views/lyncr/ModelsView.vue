<script setup lang="ts">
import { ref } from 'vue'
import type { ModelInfo } from '@/types/lyncr'

const models = ref<ModelInfo[]>([])
</script>

<template>
  <div class="space-y-5 animate-fade-in">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-white">模型列表</h2>
        <p class="text-sm text-zinc-500 mt-0.5">
          暂无可用模型
        </p>
      </div>
      <div class="flex items-center gap-1.5 text-xs text-zinc-500">
        <span class="i-carbon-diamond text-amber-400 text-sm" />
        <span>费率：灵石 / 千词</span>
      </div>
    </div>

    <div v-if="models.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="model in models"
        :key="model.id"
        class="group glass-card-hover p-5 relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
        <div class="relative">
          <div class="flex items-start justify-between mb-4 gap-2">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-xl bg-zinc-800/60 border border-white/5 flex items-center justify-center shrink-0"
              >
                <span :class="[model.icon, model.iconColor, 'text-xl']" />
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-white truncate">{{ model.name }}</h3>
                <p class="text-xs text-zinc-500">{{ model.subtitle }}</p>
              </div>
            </div>
            <span
              class="text-xs px-2 py-0.5 rounded-md font-medium border shrink-0"
              :class="model.tierClass"
            >
              {{ model.tier }}
            </span>
          </div>

          <p class="text-xs text-zinc-500 leading-relaxed mb-4">{{ model.desc }}</p>

          <div class="flex items-center justify-between pt-3.5 border-t border-white/5">
            <div class="flex items-center gap-1">
              <span class="i-carbon-diamond text-amber-400 text-sm" />
              <span class="text-sm font-mono font-semibold text-amber-300">{{ model.cost }}</span>
              <span class="text-xs text-zinc-500">/ 千词</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-zinc-500">{{ model.context }}</span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="
                  model.status === '可用'
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-amber-400/10 text-amber-400'
                "
              >
                {{ model.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="glass-card p-12 flex flex-col items-center justify-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-zinc-800/60 border border-white/5 flex items-center justify-center">
        <span class="i-carbon-chip text-zinc-500 text-xl" />
      </div>
      <p class="text-sm text-zinc-500">暂无模型数据，请连接 API 后查看</p>
    </div>
  </div>
</template>

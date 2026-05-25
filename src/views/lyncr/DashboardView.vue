<script setup lang="ts">
import { ref } from 'vue'
import ConsumptionChart from '@/components/lyncr/ConsumptionChart.vue'

const consumptionData = ref([])
</script>

<template>
  <div class="space-y-5 animate-fade-in">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-white">总览</h2>
        <p class="text-sm text-zinc-500 mt-0.5">控制台概览</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="glass-card-hover p-5 border-amber-400/20">
        <div class="flex items-start justify-between mb-4">
          <p class="text-xs text-zinc-500">灵石余额</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-400/10">
            <span class="i-carbon-diamond text-amber-400 text-base" />
          </div>
        </div>
        <div class="flex items-end gap-1.5">
          <span class="text-2xl font-bold font-mono text-white">---</span>
        </div>
        <div class="flex items-center gap-1 mt-2">
          <span class="text-xs text-zinc-500">暂无数据</span>
        </div>
      </div>

      <div class="glass-card-hover p-5 border-blue-400/20">
        <div class="flex items-start justify-between mb-4">
          <p class="text-xs text-zinc-500">本月消耗</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-400/10">
            <span class="i-carbon-chart-line text-blue-400 text-base" />
          </div>
        </div>
        <div class="flex items-end gap-1.5">
          <span class="text-2xl font-bold font-mono text-white">---</span>
        </div>
        <div class="flex items-center gap-1 mt-2">
          <span class="text-xs text-zinc-500">暂无数据</span>
        </div>
      </div>

      <div class="glass-card-hover p-5 border-cyan-400/20">
        <div class="flex items-start justify-between mb-4">
          <p class="text-xs text-zinc-500">团队成员</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-400/10">
            <span class="i-carbon-user-multiple text-cyan-400 text-base" />
          </div>
        </div>
        <div class="flex items-end gap-1.5">
          <span class="text-2xl font-bold font-mono text-white">---</span>
        </div>
        <div class="flex items-center gap-1 mt-2">
          <span class="text-xs text-zinc-500">暂无数据</span>
        </div>
      </div>

      <div class="glass-card-hover p-5 border-emerald-400/20">
        <div class="flex items-start justify-between mb-4">
          <p class="text-xs text-zinc-500">可用模型</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-400/10">
            <span class="i-carbon-chip text-emerald-400 text-base" />
          </div>
        </div>
        <div class="flex items-end gap-1.5">
          <span class="text-2xl font-bold font-mono text-white">---</span>
        </div>
        <div class="flex items-center gap-1 mt-2">
          <span class="text-xs text-zinc-500">暂无数据</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2 glass-card p-5">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h3 class="text-sm font-semibold text-white">灵石消耗趋势</h3>
            <p class="text-xs text-zinc-500 mt-0.5">单位：灵石/天</p>
          </div>
        </div>
        <ConsumptionChart :data="consumptionData" />
      </div>

      <div class="glass-card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-white">最近动态</h3>
        </div>
        <div class="py-8 text-center">
          <div class="w-10 h-10 rounded-full bg-zinc-800/60 border border-white/5 flex items-center justify-center mx-auto mb-3">
            <span class="i-carbon-information text-zinc-500 text-lg" />
          </div>
          <p class="text-sm text-zinc-500">暂无最近动态</p>
        </div>
      </div>
    </div>

    <div class="glass-card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-white">模型调用分布</h3>
        <span class="text-xs text-zinc-500">暂无数据</span>
      </div>
      <div class="py-8 text-center">
        <p class="text-sm text-zinc-500">暂无模型调用数据，请连接 API 后查看</p>
      </div>
    </div>
  </div>
</template>

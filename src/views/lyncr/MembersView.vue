<script setup lang="ts">
import { computed, ref } from 'vue'
import RoleBadge from '@/components/lyncr/RoleBadge.vue'
import StatusBadge from '@/components/lyncr/StatusBadge.vue'
import type { Member } from '@/types/lyncr'

const members = ref<Member[]>([])
const search = ref('')

const filteredMembers = computed(() =>
  members.value.filter(
    (m) =>
      m.name.includes(search.value) ||
      m.email.includes(search.value) ||
      m.role.includes(search.value),
  ),
)
</script>

<template>
  <div class="space-y-5 animate-fade-in">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-white">成员管理</h2>
        <p class="text-sm text-zinc-500 mt-0.5">共 {{ members.length }} 位成员</p>
      </div>
      <button
        type="button"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 transition-all text-sm font-medium"
      >
        <span class="i-carbon-user-follow text-sm" />
        邀请成员
      </button>
    </div>

    <div class="relative">
      <span
        class="i-carbon-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-base pointer-events-none"
      />
      <input
        v-model="search"
        type="text"
        placeholder="搜索成员名称、邮箱或角色…"
        class="w-full pl-10 pr-4 py-2.5 glass-input"
      />
    </div>

    <div class="glass-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-xs font-medium text-zinc-500 px-5 py-3.5 text-left">成员</th>
              <th class="text-xs font-medium text-zinc-500 px-5 py-3.5 text-left">角色</th>
              <th class="text-xs font-medium text-zinc-500 px-5 py-3.5 text-left">状态</th>
              <th class="text-xs font-medium text-zinc-500 px-5 py-3.5 text-right">灵石消耗</th>
              <th class="text-xs font-medium text-zinc-500 px-5 py-3.5 text-right">加入时间</th>
              <th class="text-xs font-medium text-zinc-500 px-5 py-3.5 w-12" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in filteredMembers"
              :key="member.id"
              class="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    :style="{
                      backgroundColor: `${member.color}22`,
                      border: `1px solid ${member.color}44`,
                    }"
                  >
                    <span :style="{ color: member.color }">{{ member.avatar }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ member.name }}</p>
                    <p class="text-xs text-zinc-500 truncate">{{ member.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <RoleBadge :role="member.role" />
              </td>
              <td class="px-5 py-4">
                <StatusBadge :status="member.status" />
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <span class="i-carbon-diamond text-amber-400 text-sm" />
                  <span class="text-sm font-mono font-medium text-white">
                    {{ member.stones.toLocaleString() }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-4 text-right">
                <span class="text-sm font-mono text-zinc-500">{{ member.joined }}</span>
              </td>
              <td class="px-5 py-4">
                <button
                  type="button"
                  class="text-zinc-500 hover:text-white transition-colors"
                >
                  <span class="i-carbon-overflow-menu-horizontal text-base" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredMembers.length === 0" class="py-12 text-center">
        <div class="w-10 h-10 rounded-full bg-zinc-800/60 border border-white/5 flex items-center justify-center mx-auto mb-3">
          <span class="i-carbon-user-multiple text-zinc-500 text-lg" />
        </div>
        <p class="text-sm text-zinc-500">暂无成员数据，请连接 API 后查看</p>
      </div>
    </div>
  </div>
</template>

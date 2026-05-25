<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import RedeemModal from '@/components/lyncr/RedeemModal.vue'
import type { RedeemState } from '@/types/lyncr'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, adminUser, logout, goToLogin } = useAuth()

const collapsed = ref(false)
const showRedeem = ref(false)
const redeemCode = ref('')
const redeemState = ref<RedeemState>('idle')

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: 'i-carbon-dashboard', to: '/dashboard' },
  { id: 'members', label: '成员管理', icon: 'i-carbon-user-multiple', to: '/members' },
  { id: 'models', label: '模型列表', icon: 'i-carbon-chip', to: '/models' },
  { id: 'settings', label: '设置', icon: 'i-carbon-settings', to: '/settings' },
]

const pageTitle = computed(() => (route.meta.title as string) || '仪表盘')

const displayName = computed(() => adminUser.value?.username || '用户')
const displayRole = computed(() => adminUser.value?.role || '用户')

function isActive(path: string) {
  return route.path.startsWith(path)
}

function handleRedeem() {
  if (!redeemCode.value.trim()) return
  redeemState.value = 'loading'
  setTimeout(() => {
    redeemState.value = redeemCode.value.includes('ERR') ? 'error' : 'success'
  }, 1200)
}

function closeRedeem() {
  showRedeem.value = false
  setTimeout(() => {
    redeemCode.value = ''
    redeemState.value = 'idle'
  }, 250)
}

function resetRedeem() {
  redeemCode.value = ''
  redeemState.value = 'idle'
}

function openRedeem() {
  showRedeem.value = true
}
</script>

<template>
  <div
    class="flex h-screen min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white select-none"
  >
    <div
      class="absolute w-96 h-96 rounded-full bg-blue-500/8 blur-3xl -top-20 -left-20 pointer-events-none"
    />
    <div
      class="absolute w-80 h-80 rounded-full bg-purple-500/8 blur-3xl bottom-0 right-0 pointer-events-none"
    />

    <aside
      class="relative z-10 flex flex-col shrink-0 border-r border-white/10 bg-zinc-950/70 backdrop-blur-2xl transition-all duration-300"
      :class="collapsed ? 'w-[68px]' : 'w-52'"
    >
      <div
        class="flex items-center gap-2.5 px-4 py-5 border-b border-white/10"
        :class="collapsed ? 'justify-center' : ''"
      >
        <div
          class="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0"
        >
          <span class="i-carbon-diamond text-blue-400 text-sm" />
        </div>
        <span
          v-if="!collapsed"
          class="text-sm font-bold tracking-[0.2em] text-white"
        >
          LYNCR
        </span>
      </div>

      <nav class="flex-1 p-2 space-y-0.5 mt-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          :title="collapsed ? item.label : undefined"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border"
          :class="[
            collapsed ? 'justify-center' : '',
            isActive(item.to)
              ? 'bg-blue-500/15 text-blue-300 border-blue-500/25'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border-transparent',
          ]"
          @click="router.push(item.to)"
        >
          <span
            :class="[
              item.icon,
              'text-base shrink-0',
              isActive(item.to) ? 'text-blue-400' : '',
            ]"
          />
          <span v-if="!collapsed" class="font-medium">{{ item.label }}</span>
          <span
            v-if="!collapsed && isActive(item.to)"
            class="i-carbon-chevron-right text-xs ml-auto text-blue-400/60"
          />
        </button>
      </nav>

      <div v-if="!collapsed && isLoggedIn" class="px-2 pb-2">
        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-amber-500/10 border border-amber-500/20 text-amber-400/90 hover:bg-amber-500/15 hover:text-amber-300 transition-all"
          @click="openRedeem"
        >
          <span class="i-carbon-password text-sm shrink-0" />
          <span class="font-medium">兑换码</span>
        </button>
      </div>

      <div
        class="px-2 pb-2 border-t border-white/10 pt-2"
        :class="collapsed ? 'flex justify-center' : ''"
      >
        <template v-if="isLoggedIn">
          <div
            class="flex items-center gap-2.5 px-1 py-2"
            :class="collapsed ? 'justify-center w-full' : ''"
          >
            <div
              class="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0"
            >
              <span class="text-[10px] font-bold text-blue-300">{{ displayName.charAt(0) }}</span>
            </div>
            <template v-if="!collapsed">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-white truncate">{{ displayName }}</p>
                <p class="text-[10px] text-zinc-500 truncate">{{ displayRole }}</p>
              </div>
              <button
                type="button"
                title="退出登录"
                class="flex items-center gap-1 px-2 py-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                @click="logout"
              >
                <span class="i-carbon-logout text-sm" />
              </button>
            </template>
            <button
              v-else
              type="button"
              title="退出登录"
              class="text-zinc-500 hover:text-rose-400 transition-colors"
              @click="logout"
            >
              <span class="i-carbon-logout text-sm" />
            </button>
          </div>
        </template>

        <template v-else>
          <button
            v-if="collapsed"
            type="button"
            title="登录"
            class="w-10 h-10 flex items-center justify-center rounded-xl glass-btn-primary"
            @click="goToLogin"
          >
            <span class="i-carbon-login text-sm" />
          </button>
          <button
            v-else
            type="button"
            class="w-full flex items-center justify-center gap-2 py-2.5 glass-btn-primary text-sm"
            @click="goToLogin"
          >
            <span class="i-carbon-login text-base" />
            登录
          </button>
        </template>
      </div>
    </aside>

    <div class="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 shrink-0 bg-zinc-950/50 backdrop-blur-xl"
      >
        <div class="flex items-center gap-3 min-w-0">
          <button
            type="button"
            class="text-zinc-500 hover:text-white transition-colors shrink-0"
            @click="collapsed = !collapsed"
          >
            <span class="i-carbon-menu text-base" />
          </button>
          <h1 class="text-sm font-semibold text-white truncate">
            {{ pageTitle }}
          </h1>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <template v-if="isLoggedIn">
            <div
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25"
            >
              <span class="i-carbon-diamond text-amber-400 text-sm" />
              <span class="text-xs font-mono font-semibold text-amber-300">{{ adminUser?.stones?.toLocaleString() || '0' }}</span>
              <span class="text-[11px] text-amber-400/60 hidden sm:inline">灵石</span>
            </div>
            <button
              type="button"
              title="退出登录"
              class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
              @click="logout"
            >
              <span class="i-carbon-logout text-sm" />
              退出
            </button>
            <button
              type="button"
              class="relative text-zinc-500 hover:text-white transition-colors p-1"
            >
              <span class="i-carbon-notification text-base" />
              <span
                class="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-blue-500"
              />
            </button>
          </template>
          <button
            v-else
            type="button"
            class="flex items-center gap-1.5 px-4 py-1.5 glass-btn-primary text-xs sm:text-sm"
            @click="goToLogin"
          >
            <span class="i-carbon-login text-sm" />
            登录
          </button>
        </div>
      </header>

      <main
        class="flex-1 overflow-y-auto p-4 sm:p-6 relative"
        style="
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        "
      >
        <div
          v-if="!isLoggedIn"
          class="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div
            class="w-full max-w-sm rounded-[28px] bg-zinc-900/50 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-8 text-center"
          >
            <div
              class="w-14 h-14 rounded-full bg-zinc-800/60 border border-white/10 flex items-center justify-center mx-auto mb-4"
            >
              <span class="i-carbon-user-avatar text-2xl text-zinc-500" />
            </div>
            <h3 class="text-base font-semibold text-white mb-1">您已退出登录</h3>
            <p class="text-sm text-zinc-500 mb-6">请重新登录以继续使用 LYNCR 控制台</p>
            <button
              type="button"
              class="w-full py-3 glass-btn-primary text-sm flex items-center justify-center gap-2"
              @click="goToLogin"
            >
              <span class="i-carbon-login text-base" />
              前往登录
            </button>
          </div>
        </div>

        <div
          class="min-h-full"
          :class="!isLoggedIn ? 'pointer-events-none opacity-40' : ''"
        >
          <router-view />
        </div>
      </main>
    </div>

    <RedeemModal
      :visible="showRedeem"
      :code="redeemCode"
      :state="redeemState"
      @update:code="redeemCode = $event"
      @submit="handleRedeem"
      @close="closeRedeem"
      @reset="resetRedeem"
    />
  </div>
</template>

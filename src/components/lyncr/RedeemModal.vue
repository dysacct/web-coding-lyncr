<script setup lang="ts">
import type { RedeemState } from '@/types/lyncr'

const props = defineProps<{
  visible: boolean
  code: string
  state: RedeemState
}>()

const emit = defineEmits<{
  (e: 'update:code', value: string): void
  (e: 'submit'): void
  (e: 'close'): void
  (e: 'reset'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:code', target.value.toUpperCase())
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/65 backdrop-blur-sm"
          @click="emit('close')"
        />

        <div
          class="relative z-10 w-full max-w-md rounded-[28px] bg-zinc-900/80 backdrop-blur-2xl border border-amber-400/20 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div
            class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
          />

          <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center"
              >
                <span class="i-carbon-password text-amber-400 text-base" />
              </div>
              <div>
                <h2 class="text-sm font-semibold text-white">兑换灵石</h2>
                <p class="text-xs text-zinc-500">输入兑换码激活灵石奖励</p>
              </div>
            </div>
            <button
              type="button"
              class="text-zinc-500 hover:text-white transition-colors p-1"
              @click="emit('close')"
            >
              <span class="i-carbon-close text-base" />
            </button>
          </div>

          <div class="p-6">
            <div
              v-if="state === 'idle' || state === 'loading'"
              class="space-y-4"
            >
              <div>
                <label class="text-xs font-medium text-zinc-500 mb-2 block">兑换码</label>
                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  :value="code"
                  :disabled="state === 'loading'"
                  class="w-full px-4 py-3 glass-input font-mono tracking-widest disabled:opacity-60"
                  @input="onInput"
                />
              </div>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!code.trim() || state === 'loading'"
                @click="emit('submit')"
              >
                <span
                  v-if="state === 'loading'"
                  class="i-carbon-renew animate-spin text-base"
                />
                <span v-else class="i-carbon-diamond text-base" />
                {{ state === 'loading' ? '验证中…' : '立即兑换' }}
              </button>
              <p class="text-xs text-zinc-600 text-center">
                兑换码区分大小写 · 每个兑换码仅可使用一次
              </p>
            </div>

            <div v-else-if="state === 'success'" class="text-center py-4">
              <div
                class="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center mx-auto mb-4"
              >
                <span class="i-carbon-checkmark-filled text-emerald-400 text-3xl" />
              </div>
              <h3 class="text-base font-semibold text-white mb-1">兑换成功！</h3>
              <p class="text-sm text-zinc-500">灵石已添加至您的账户</p>
              <div
                class="flex items-center justify-center gap-2 my-4 py-3 rounded-xl bg-amber-400/10 border border-amber-400/15"
              >
                <span class="i-carbon-diamond text-amber-400 text-xl" />
                <span class="text-2xl font-bold font-mono text-amber-300">+5,000</span>
                <span class="text-sm text-amber-400/70">灵石</span>
              </div>
              <button
                type="button"
                class="px-6 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
                @click="emit('close')"
              >
                完成
              </button>
            </div>

            <div v-else class="text-center py-4">
              <div
                class="w-14 h-14 rounded-full bg-rose-400/10 border border-rose-400/25 flex items-center justify-center mx-auto mb-4"
              >
                <span class="i-carbon-close-filled text-rose-400 text-3xl" />
              </div>
              <h3 class="text-base font-semibold text-white mb-1">兑换失败</h3>
              <p class="text-sm text-zinc-500 mb-5">
                兑换码无效或已被使用，请检查后重试
              </p>
              <button
                type="button"
                class="px-6 py-2 rounded-xl glass-input text-sm font-medium hover:bg-zinc-800/60 transition-all"
                @click="emit('reset')"
              >
                重新输入
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

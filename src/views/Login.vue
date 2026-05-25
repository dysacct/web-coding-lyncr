<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { sendCode as sendCodeApi, loginByPassword, loginByCode, register as registerApi } from '@/api/modules/auth'

const { login, loginAdmin } = useAuth()

const authMode = ref<'login' | 'register'>('login')
const loginType = ref<'password' | 'code' | 'qrcode'>('password')
const loginMethod = ref<'phone' | 'admin'>('phone')
const submitting = ref(false)

const formData = reactive({
  phone: '',
  password: '',
  code: '',
  registerCode: '',
  rememberMe: false,
  isAgreed: false,
  registerAgreed: false,
})

const adminForm = reactive({
  username: '',
  password: '',
})

const registerCountdown = ref(0)
const registerCountdownTimer = ref<ReturnType<typeof setInterval> | null>(null)

const countdown = ref(0)
const countdownTimer = ref<ReturnType<typeof setInterval> | null>(null)

const toastMessage = ref('')
const toastType = ref<'success' | 'info' | 'warning'>('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(title: string, icon: 'none' | 'success' | 'warning' = 'none') {
  toastMessage.value = title
  if (icon === 'success') toastType.value = 'success'
  else if (icon === 'warning') toastType.value = 'warning'
  else toastType.value = 'info'

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

function isValidPhone(phone: string) {
  return /^1\d{10}$/.test(phone)
}

function startCountdown(
  target: typeof countdown,
  timerRef: typeof countdownTimer,
) {
  target.value = 60
  if (timerRef.value) clearInterval(timerRef.value)
  timerRef.value = setInterval(() => {
    if (target.value > 0) {
      target.value--
    } else if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  }, 1000)
}

async function sendCode() {
  if (!formData.phone) {
    showToast('请输入手机号')
    return
  }
  if (!isValidPhone(formData.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (countdown.value > 0) return

  try {
    const data = await sendCodeApi(formData.phone)
    if (data.code === 0) {
      showToast('验证码已发送', 'success')
      startCountdown(countdown, countdownTimer)
    } else {
      showToast(data.message || '发送失败')
    }
  } catch {
    showToast('网络错误，请确认后端服务已启动')
  }
}

async function sendRegisterCode() {
  if (!formData.phone) {
    showToast('请输入手机号')
    return
  }
  if (!isValidPhone(formData.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (registerCountdown.value > 0) return

  try {
    const data = await sendCodeApi(formData.phone)
    if (data.code === 0) {
      showToast('验证码已发送', 'success')
      startCountdown(registerCountdown, registerCountdownTimer)
    } else {
      showToast(data.message || '发送失败')
    }
  } catch {
    showToast('网络错误，请确认后端服务已启动')
  }
}

async function handleLogin() {
  if (!formData.isAgreed) {
    showToast('请阅读并同意用户协议与隐私政策', 'warning')
    return
  }

  const isPassword = loginType.value === 'password'
  if (isPassword && (!formData.phone || !formData.password)) {
    showToast('请填写手机号和密码')
    return
  }
  if (!isPassword && (!formData.phone || !formData.code)) {
    showToast('请填写手机号和验证码')
    return
  }

  submitting.value = true
  try {
    const data = isPassword
      ? await loginByPassword(formData.phone, formData.password)
      : await loginByCode(formData.phone, formData.code)

    if (data.code === 0) {
      showToast(isPassword ? '密码登录成功' : '验证码登录成功', 'success')
      login(data.data?.token)
    } else {
      showToast(data.message || '登录失败')
    }
  } catch {
    showToast('网络错误，请确认后端服务已启动')
  } finally {
    submitting.value = false
  }
}

async function handleRegister() {
  if (!formData.registerAgreed) {
    showToast('请阅读并同意用户协议与隐私政策', 'warning')
    return
  }
  if (!formData.phone || !formData.registerCode) {
    showToast('请填写手机号和验证码')
    return
  }
  if (!isValidPhone(formData.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (formData.registerCode.length !== 6) {
    showToast('请输入6位验证码')
    return
  }

  submitting.value = true
  try {
    const data = await registerApi(formData.phone, formData.registerCode)
    if (data.code === 0) {
      showToast('注册成功', 'success')
      formData.registerCode = ''
      formData.code = ''
      formData.isAgreed = true
      authMode.value = 'login'
      loginType.value = 'code'
      login(data.data?.token)
    } else {
      showToast(data.message || '注册失败')
    }
  } catch {
    showToast('网络错误，请确认后端服务已启动')
  } finally {
    submitting.value = false
  }
}

async function handleAdminLogin() {
  if (!adminForm.username || !adminForm.password) {
    showToast('请输入用户名和密码')
    return
  }
  const ok = loginAdmin(adminForm.username, adminForm.password)
  if (!ok) {
    showToast('用户名或密码错误', 'warning')
  }
}

function switchMode(type: 'password' | 'code' | 'qrcode') {
  loginType.value = type
}

function switchAuthMode(mode: 'login' | 'register') {
  authMode.value = mode
  if (mode === 'login') {
    loginType.value = 'password'
  }
}

onUnmounted(() => {
  if (countdownTimer.value) clearInterval(countdownTimer.value)
  if (registerCountdownTimer.value) clearInterval(registerCountdownTimer.value)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <div
    class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4 select-none"
  >
    <div class="absolute w-70 h-70 rounded-full bg-blue-500/10 blur-3xl top-10 left-10 pointer-events-none" />
    <div class="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl bottom-10 right-10 pointer-events-none" />

    <div
      class="relative w-full max-w-[450px] rounded-[28px] bg-zinc-900/50 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-10 transition-all duration-300 hover:border-white/15"
    >
      <div class="text-center mb-8">
        <span class="text-3xl font-semibold tracking-tight text-white">
          {{ authMode === 'login' ? '欢迎登录' : '创建账号' }}
        </span>
        <p v-if="authMode === 'register'" class="text-sm text-zinc-500 mt-2 font-light">
          手机号验证码注册，快速开通
        </p>
      </div>

      <template v-if="authMode === 'register'">
        <div class="space-y-5 animate-fade-in animate-duration-200">
          <input
            v-model="formData.phone"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号"
            class="w-full glass-input px-5 py-3.5 text-base"
          />
          <div class="flex gap-3">
            <input
              v-model="formData.registerCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="请输入验证码"
              class="flex-1 glass-input px-5 py-3.5 text-base"
            />
            <button
              type="button"
              class="px-5 py-3.5 glass-btn-ghost text-sm active:scale-95 flex items-center justify-center min-w-[125px] shrink-0 whitespace-nowrap"
              @click="sendRegisterCode"
            >
              {{ registerCountdown > 0 ? `${registerCountdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="flex items-start gap-2.5 text-[13px] text-zinc-500 mt-6 px-1 select-none">
          <div
            class="mt-0.5 w-[18px] h-[18px] rounded border transition-all flex items-center justify-center shrink-0 cursor-pointer"
            :class="formData.registerAgreed ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 bg-black/20'"
            @click="formData.registerAgreed = !formData.registerAgreed"
          >
            <div v-if="formData.registerAgreed" class="w-2 h-2 bg-white rounded-full" />
          </div>
          <p class="leading-relaxed font-light">
            我已阅读并同意
            <span class="text-blue-400 hover:underline cursor-pointer">《用户协议》</span>
            与
            <span class="text-blue-400 hover:underline cursor-pointer">《隐私政策》</span>
          </p>
        </div>

        <button
          type="button"
          class="w-full mt-7 py-3.5 glass-btn-primary text-base shadow-lg shadow-blue-500/10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="submitting"
          @click="handleRegister"
        >
          {{ submitting ? '注册中...' : '立即注册' }}
        </button>

        <p class="text-center text-sm text-zinc-500 mt-6">
          已有账号？
          <span
            class="text-blue-400 hover:underline cursor-pointer"
            @click="switchAuthMode('login')"
          >
            去登录
          </span>
        </p>
      </template>

      <template v-else>

      <!-- Admin login -->
      <template v-if="loginMethod === 'admin'">
        <div class="space-y-5 animate-fade-in animate-duration-200">
          <input
            v-model="adminForm.username"
            type="text"
            placeholder="请输入用户名"
            class="w-full glass-input px-5 py-3.5 text-base"
          />
          <input
            v-model="adminForm.password"
            type="password"
            placeholder="请输入密码"
            class="w-full glass-input px-5 py-3.5 text-base"
          />
        </div>

        <button
          type="button"
          class="w-full mt-7 py-3.5 bg-[#007aff] hover:bg-blue-500 active:bg-blue-600 text-white font-medium rounded-xl text-base shadow-lg shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-center border-none"
          @click="handleAdminLogin"
        >
          管理员登录
        </button>

        <p class="text-center text-sm text-zinc-500 mt-6">
          <span
            class="text-blue-400 hover:underline cursor-pointer"
            @click="loginMethod = 'phone'"
          >
            返回手机登录
          </span>
        </p>
      </template>

      <!-- Phone login -->
      <template v-else>
      <div
        v-if="loginType !== 'qrcode'"
        class="p-1 bg-black/40 rounded-xl flex mb-7 border border-white/5"
      >
        <div
          class="flex-1 text-center py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200"
          :class="loginType === 'password' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'"
          @click="switchMode('password')"
        >
          密码登录
        </div>
        <div
          class="flex-1 text-center py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200"
          :class="loginType === 'code' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'"
          @click="switchMode('code')"
        >
          验证码登录
        </div>
      </div>

      <div v-if="loginType === 'password'" class="space-y-5 animate-fade-in animate-duration-200">
        <input
          v-model="formData.phone"
          type="tel"
          maxlength="11"
          placeholder="请输入手机号"
          class="w-full bg-zinc-800/40 border border-white/5 rounded-xl px-5 py-3.5 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all"
        />
        <input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          class="w-full bg-zinc-800/40 border border-white/5 rounded-xl px-5 py-3.5 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all"
        />
        
        <div class="flex items-center justify-between text-[13px] text-zinc-400 px-1 pt-1">
          <div 
            class="flex items-center gap-2.5 cursor-pointer select-none group"
            @click="formData.rememberMe = !formData.rememberMe"
          >
            <div 
              class="w-[18px] h-[18px] rounded border transition-all flex items-center justify-center shrink-0"
              :class="formData.rememberMe ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 bg-black/20 group-hover:border-zinc-500'"
            >
              <div v-if="formData.rememberMe" class="w-2 h-2 bg-white rounded-full" />
            </div>
            <span class="group-hover:text-zinc-300">记住密码</span>
          </div>
          <div class="text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer">忘记密码？</div>
        </div>
      </div>

      <div v-if="loginType === 'code'" class="space-y-5 animate-fade-in animate-duration-200">
        <input
          v-model="formData.phone"
          type="tel"
          maxlength="11"
          placeholder="请输入手机号"
          class="w-full bg-zinc-800/40 border border-white/5 rounded-xl px-5 py-3.5 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all"
        />
        <div class="flex space-x-3">
          <input
            v-model="formData.code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="验证码"
            class="flex-1 bg-zinc-800/40 border border-white/5 rounded-xl px-5 py-3.5 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all"
          />
          <button
            type="button"
            class="px-5 py-3.5 bg-zinc-800/60 hover:bg-zinc-800 border border-white/5 rounded-xl text-sm text-blue-400 font-medium active:scale-95 transition-all flex items-center justify-center min-w-[125px] shrink-0 whitespace-nowrap"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>
      </div>

      <div v-if="loginType === 'qrcode'" class="flex flex-col items-center justify-center py-4 animate-fade-in animate-duration-200">
        <div class="relative p-3 bg-white rounded-2xl shadow-2xl mb-5 group cursor-pointer">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://github.com/codercat"
            alt="微信扫码登录"
            class="w-[170px] h-[170px] transition-all duration-300 filter group-hover:blur-xs"
          />
          <div class="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="text-sm text-white font-medium mb-1">安全加密扫码</span>
            <span class="text-xs text-zinc-400">请使用微信扫描</span>
          </div>
        </div>
        <span class="text-sm text-zinc-500 flex items-center gap-2">
          <span class="i-carbon-logo-wechat text-emerald-500 text-base" />
          使用微信安全登录
        </span>
        <div
          class="mt-7 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center"
          @click="switchMode('password')"
        >
          <span class="i-carbon-chevron-left mr-1" />
          返回账号登录
        </div>
      </div>

      <div v-if="loginType !== 'qrcode'" class="flex items-start gap-2.5 text-[13px] text-zinc-500 mt-6 px-1 select-none">
        <div 
          class="mt-0.5 w-[18px] h-[18px] rounded border transition-all flex items-center justify-center shrink-0 cursor-pointer"
          :class="formData.isAgreed ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 bg-black/20'"
          @click="formData.isAgreed = !formData.isAgreed"
        >
          <div v-if="formData.isAgreed" class="w-2 h-2 bg-white rounded-full" />
        </div>
        <p class="leading-relaxed font-light">
          我已阅读并同意
          <span class="text-blue-400 hover:underline cursor-pointer">《用户协议》</span>
          与
          <span class="text-blue-400 hover:underline cursor-pointer">《隐私政策》</span>
        </p>
      </div>

      <button
        v-if="loginType !== 'qrcode'"
        type="button"
        class="w-full mt-7 py-3.5 bg-[#007aff] hover:bg-blue-500 active:bg-blue-600 text-white font-medium rounded-xl text-base shadow-lg shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-center border-none disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="submitting"
        @click="handleLogin"
      >
        {{ submitting ? '登录中...' : '立即登录' }}
      </button>

      <div v-if="loginType !== 'qrcode'" class="flex justify-center items-center mt-7 pt-5 border-t border-white/5">
        <div
          class="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 cursor-pointer transition-colors"
          @click="switchMode('qrcode')"
        >
          <span class="i-carbon-logo-wechat text-lg" />
          <span>微信扫码快速登录</span>
        </div>
      </div>

      <p v-if="loginType !== 'qrcode'" class="text-center text-sm text-zinc-500 mt-5">
        没有账号？
        <span
          class="text-blue-400 hover:underline cursor-pointer"
          @click="switchAuthMode('register')"
        >
          立即注册
        </span>
      </p>

      <p class="text-center text-xs text-zinc-600 mt-2">
        <span
          class="hover:text-blue-400 cursor-pointer transition-colors"
          @click="loginMethod = 'admin'"
        >管理员登录</span>
      </p>
      </template>
      </template>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="toastMessage"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl text-xs font-medium text-white shadow-2xl border border-white/5 backdrop-blur-md flex items-center gap-2"
        :class="
          toastType === 'success' ? 'bg-emerald-600/90' : 
          toastType === 'warning' ? 'bg-amber-600/90' : 'bg-zinc-800/90'
        "
      >
        <span v-if="toastType === 'success'" class="i-carbon-checkmark-filled text-sm" />
        <span v-if="toastType === 'warning'" class="i-carbon-warning-alt-filled text-sm" />
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>
import { ref, type Ref } from 'vue'
import type { Router } from 'vue-router'

const TOKEN_KEY = 'auth_token'

const isLoggedIn = ref(!!localStorage.getItem(TOKEN_KEY))

export interface AdminUser {
  username: string
  role: string
  stones: number
}

const adminUser: Ref<AdminUser | null> = ref(null)

let authRouter: Router | null = null

export function setAuthRouter(router: Router) {
  authRouter = router
}

export function useAuth() {
  function login(token?: string) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    isLoggedIn.value = true
    authRouter?.push('/dashboard')
  }

  function loginAdmin(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      const token = `admin_${Date.now()}`
      localStorage.setItem(TOKEN_KEY, token)
      isLoggedIn.value = true
      adminUser.value = { username: 'admin', role: '管理员', stones: 0 }
      authRouter?.push('/dashboard')
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    isLoggedIn.value = false
    adminUser.value = null
    authRouter?.push('/login')
  }

  function goToLogin() {
    authRouter?.push('/login')
  }

  function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  return {
    isLoggedIn,
    adminUser,
    login,
    loginAdmin,
    logout,
    goToLogin,
    getToken,
  }
}

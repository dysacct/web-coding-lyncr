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
    logout,
    goToLogin,
    getToken,
  }
}

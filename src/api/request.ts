import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import {
  computeSign,
  createNonce,
  createTimestamp,
  normalizeRequestBody,
} from './securitySign'
import { useRouter } from 'vue-router'

const router = useRouter()

/** 响应拦截器已解包为 data，与 Axios 默认类型区分 */
export interface RequestInstance {
  post<T = unknown>(url: string, data?: unknown): Promise<T>
  get<T = unknown>(url: string, config?: Parameters<typeof axios.get>[1]): Promise<T>
}

const instance = axios.create({
  baseURL: 'http://4000.s.sendi.wang:40008/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

function attachSecurityHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const { bodyStr, data } = normalizeRequestBody(config.data)
  config.data = data

  const timestamp = createTimestamp()
  const nonce = createNonce()
  const sign = computeSign(bodyStr, timestamp, nonce)

  config.headers.set('X-Timestamp', timestamp)
  config.headers.set('X-Nonce', nonce)
  config.headers.set('X-Sign', sign)

  return config
}

// 请求拦截 — 防重放签名 + 自动注入 token
instance.interceptors.request.use((config) => {
  attachSecurityHeaders(config)

  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// 响应拦截 — 统一解包 & 错误处理
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const code = error.response.code
      const serverMsg = error.response.data?.msg


      // 401 未授权，清除 token 并跳转登录
      if (code === 401) {
        localStorage.removeItem('auth_token')
        router.push('/login')
      }

      return Promise.reject(new Error(serverMsg))
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时'))
    }
    return Promise.reject(new Error('网络错误，请确认服务已启动'))
  },
)

export default instance as RequestInstance

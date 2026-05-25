import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截 — 自动注入 token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
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
      const status = error.response.status
      const serverMsg = error.response.data?.message
      const msg = serverMsg
        ? `[${status}] ${serverMsg}`
        : `请求失败 (${status})`
      return Promise.reject(new Error(msg))
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时'))
    }
    return Promise.reject(new Error('网络错误，请确认服务已启动'))
  },
)

export default instance

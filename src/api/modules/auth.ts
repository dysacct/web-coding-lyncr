import request from '../request'

export interface LoginParams {
  phone: string
  password?: string
  code?: string
}

export interface UserInfo {
  token: string
  userId: number
  nickname: string
}

/** 密码登录 */
export function loginByPassword(phone: string, password: string) {
  return request.post<any, UserInfo>('/v1/auth/login', { phone, password })
}

/** 验证码登录 */
export function loginByCode(phone: string, code: string) {
  return request.post<any, UserInfo>('/v1/auth/login', { phone, code })
}

/** 发送验证码 */
export function sendCode(phone: string) {
  return request.post('/v1/auth/send-captcha', { phone })
}

/** 注册 */
export function register(phone: string, code: string) {
  return request.post('/v1/auth/register', { phone, code })
}

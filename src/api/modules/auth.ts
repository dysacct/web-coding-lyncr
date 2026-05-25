import request from '../request'

/** 账号类型，与后端 constants 一致 */
export const ACCOUNT_TYPE = {
  phone: 'account_phone',
  email: 'account_email',
} as const

/** 验证码用途，与后端 constants 一致 */
export const CAPTCHA_PURPOSE = {
  register: 'purpose_register',
  login: 'purpose_login_captcha',
  findPassword: 'purpose_find_password',
  bindInfo: 'purpose_bind_info',
} as const

/** 用户登录请求体，对应后端 AuthLoginRequest */
export interface AuthLoginBody {
  type: (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]
  identifier: string
  credential: string
  turnstile_token?: string
}

/** 发送验证码请求体，对应后端 AuthSendCaptchaRequest */
export interface AuthSendCaptchaBody {
  type: (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]
  identifier: string
  purpose: (typeof CAPTCHA_PURPOSE)[keyof typeof CAPTCHA_PURPOSE]
  turnstile_token?: string
}

/** 用户注册请求体，对应后端 AuthRegisterRequest */
export interface AuthRegisterBody {
  type: (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]
  identifier: string
  credential: string
  confirm_credential: string
  captcha: string
  turnstile_token?: string
}

/** 站内统一响应 */
export interface ApiResult<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface UserLoginData {
  token: string
}

function login(body: AuthLoginBody) {
  return request.post<ApiResult<UserLoginData>>('/v1/auth/login', body)
}

/** 手机号 + 密码登录 */
export function loginByPassword(phone: string, password: string, turnstileToken?: string) {
  return login({
    type: ACCOUNT_TYPE.email,
    identifier: phone,
    credential: password,
    ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
  })
}

/** 手机号 + 验证码登录（credential 为 6 位验证码） */
export function loginByCode(phone: string, code: string, turnstileToken?: string) {
  return login({
    type: ACCOUNT_TYPE.phone,
    identifier: phone,
    credential: code,
    ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
  })
}

/** 发送验证码 */
export function sendCode(
  phone: string,
  purpose: (typeof CAPTCHA_PURPOSE)[keyof typeof CAPTCHA_PURPOSE] = CAPTCHA_PURPOSE.login,
  turnstileToken?: string,
) {
  const body: AuthSendCaptchaBody = {
    type: ACCOUNT_TYPE.phone,
    identifier: phone,
    purpose,
    ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
  }
  return request.post<ApiResult>('/v1/auth/send-captcha', body)
}

/** 用户注册 */
export function register(body: AuthRegisterBody) {
  return request.post<ApiResult<UserLoginData>>('/v1/auth/register', body)
}

/** 手机号注册（验证码 + 密码） */
export function registerByPhone(
  phone: string,
  captcha: string,
  password: string,
  turnstileToken?: string,
) {
  return register({
    type: ACCOUNT_TYPE.phone,
    identifier: phone,
    credential: password,
    confirm_credential: password,
    captcha,
    ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
  })
}

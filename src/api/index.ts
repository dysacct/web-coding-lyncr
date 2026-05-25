export {
  loginByPassword,
  loginByCode,
  sendCode,
  register,
  registerByPhone,
  ACCOUNT_TYPE,
  CAPTCHA_PURPOSE,
} from './modules/auth'
export type {
  AuthLoginBody,
  AuthSendCaptchaBody,
  AuthRegisterBody,
  ApiResult,
  UserLoginData,
} from './modules/auth'
export { default as request } from './request'

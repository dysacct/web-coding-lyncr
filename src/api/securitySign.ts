import CryptoJS from 'crypto-js'

const API_SECRET =
  import.meta.env.VITE_API_SECRET ?? 'LyncrWorkflowCanvasSecret2026'

/** 与 Go SecuritySignGuard 一致：MD5(body + timestamp + nonce + secret)，hex 小写 */
export function computeSign(
  bodyStr: string,
  timestamp: string,
  nonce: string,
  apiSecret: string = API_SECRET,
): string {
  const signSrc = bodyStr + timestamp + nonce + apiSecret
  return CryptoJS.MD5(signSrc).toString()
}

export function createTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString()
}

/** 32 位 hex，对应 16 字节随机数 */
export function createNonce(): string {
  const randomBytes = new Uint8Array(16)
  crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 提取与实际上传一致的 body 字符串。
 * 对象会先 JSON.stringify，并写回 data，保证签名与请求体字节一致。
 */
export function normalizeRequestBody(data: unknown): {
  bodyStr: string
  data: unknown
} {
  if (data === undefined || data === null) {
    return { bodyStr: '', data }
  }
  if (typeof data === 'string') {
    return { bodyStr: data, data }
  }
  if (typeof data === 'object' && !(data instanceof FormData) && !(data instanceof URLSearchParams)) {
    const bodyStr = JSON.stringify(data)
    return { bodyStr, data: bodyStr }
  }
  return { bodyStr: '', data }
}

import type { AxiosInstance, AxiosResponse } from 'axios'
import { AxiosHeaders } from 'axios'
import { useEnv } from '@/env'

const ZCAPTCHA_STATUS = 1090001
const ZCAPTCHA_TOKEN_HEADER = 'zcap-token'
const ZCAPTCHA_RETRY_MARK = 'zcaptchaRetried'
const ZCAPTCHA_CANCELLED_CODE = 'ZCAPTCHA_CANCELLED'

interface ZCaptchaVerifyResult {
  data?: {
    token?: string
  }
}

interface ZCaptchaChallengeData {
  serialId: string
  type: string
  issuedAt?: number
  expiresInSeconds?: number
  verifyData: Record<string, any>
}

interface ZCaptchaChallengeResponse {
  success?: boolean
  status: number
  data: ZCaptchaChallengeData
  message?: string
}

interface ZCaptchaApi {
  configure: (options?: Record<string, any>) => void
  show: (options?: { requestPath?: string, type?: ZCaptchaType }, responseData?: unknown) => Promise<ZCaptchaVerifyResult>
  clearToken: (requestPath?: string) => void
}

type ZCaptchaType = 'Click' | 'GIF' | 'PNG' | 'Slider'

let zcaptchaLoadPromise: Promise<void> | null = null
const ZCAPTCHA_READY_TIMEOUT = 10_000

function getWindowZCaptcha(): ZCaptchaApi | undefined {
  return (window as Window & { ZCaptcha?: ZCaptchaApi }).ZCaptcha
}

function waitForZCaptchaReady(timeout = ZCAPTCHA_READY_TIMEOUT) {
  if (getWindowZCaptcha()) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now()

    const check = () => {
      if (getWindowZCaptcha()) {
        resolve()
        return
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error('验证码组件初始化超时，请刷新页面后重试'))
        return
      }

      window.setTimeout(check, 16)
    }

    check()
  })
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function joinApiPath(baseURL: string, path: string) {
  const normalizedBaseURL = trimTrailingSlash(baseURL)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBaseURL}${normalizedPath}`
}

function getApiBaseURL() {
  const { API_URL } = useEnv()
  return trimTrailingSlash(String(API_URL || ''))
}

export function isZCaptchaEnabled() {
  const { ZCAPTCHA_ENABLED } = useEnv()
  return Boolean(ZCAPTCHA_ENABLED)
}

function getConfiguredZCaptchaType(): ZCaptchaType | undefined {
  const { ZCAPTCHA_TYPE } = useEnv()
  const normalizedType = String(ZCAPTCHA_TYPE || '').trim() as ZCaptchaType | ''
  if (normalizedType === 'Click' || normalizedType === 'GIF' || normalizedType === 'PNG' || normalizedType === 'Slider') {
    return normalizedType
  }
  return undefined
}

function getZCaptchaSdkURL() {
  return `${import.meta.env.BASE_URL}static/zcaptcha/zcaptcha.modern.min.js`
}

function getCaptchaCreateURL() {
  return joinApiPath(getApiBaseURL(), '/captcha/create')
}

function getCaptchaVerifyURL() {
  return joinApiPath(getApiBaseURL(), '/captcha/verify')
}

function isCaptchaChallengePayload(payload: unknown): payload is ZCaptchaChallengeResponse {
  return !!(
    payload
    && typeof payload === 'object'
    && 'status' in payload
    && Number(payload.status) === ZCAPTCHA_STATUS
    && 'data' in payload
    && payload.data
    && typeof payload.data === 'object'
    && 'serialId' in payload.data
    && 'verifyData' in payload.data
  )
}

function isLegacyCaptchaResponse(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const status = 'status' in payload ? Number(payload.status) : undefined
  const message = 'message' in payload ? String(payload.message || '') : ''
  return status === 2 && message.includes('请输入验证码')
}

function resolveCaptchaRequestPath(url?: string, baseURL?: string) {
  if (!url) {
    return window.location.pathname
  }

  if (url === '*') {
    return url
  }

  const normalizedBaseURL = baseURL
    ? new URL(baseURL, window.location.origin).toString()
    : window.location.origin
  return new URL(url, normalizedBaseURL).pathname
}

function configureZCaptcha() {
  if (!isZCaptchaEnabled()) {
    return
  }

  const zcaptcha = getWindowZCaptcha()
  if (!zcaptcha) {
    return
  }

  zcaptcha.configure({
    captchaCreateURI: getCaptchaCreateURL(),
    captchaSubmitURI: getCaptchaVerifyURL(),
    fetchImpl: (input, init) => {
      return window.fetch(input, {
        ...init,
        credentials: 'include',
      })
    },
  })
}

async function loadZCaptchaSdk() {
  if (!isZCaptchaEnabled()) {
    return
  }

  if (getWindowZCaptcha()) {
    configureZCaptcha()
    return
  }

  if (!zcaptchaLoadPromise) {
    const sdkURL = `${getZCaptchaSdkURL()}?_t=${Date.now()}`
    zcaptchaLoadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = sdkURL
      script.async = false
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`load ${sdkURL} failed`))
      document.head.appendChild(script)
    }).then(() => waitForZCaptchaReady()).finally(() => {
      zcaptchaLoadPromise = null
    })
  }

  await zcaptchaLoadPromise

  configureZCaptcha()
}

async function showZCaptcha(requestPath: string, challenge?: ZCaptchaChallengeResponse) {
  if (!isZCaptchaEnabled()) {
    throw new Error('新验证码未启用')
  }

  await loadZCaptchaSdk()
  const zcaptcha = getWindowZCaptcha()
  if (!zcaptcha) {
    throw new Error('验证码组件加载失败，请刷新页面后重试')
  }

  return zcaptcha.show({
    requestPath,
    // 仅在主动创建 challenge 时使用配置类型；如果后端已返回 challenge，则以响应里的 type 为准。
    type: getConfiguredZCaptchaType(),
  }, challenge)
}

export function clearZCaptchaToken(requestPath?: string) {
  getWindowZCaptcha()?.clearToken(requestPath)
}

function getCaptchaRetryToken(verifyResult: ZCaptchaVerifyResult | null | undefined) {
  return verifyResult?.data?.token || ''
}

function getCaptchaCancelMessage(error: unknown) {
  if (error instanceof Error && 'code' in error && error.code === ZCAPTCHA_CANCELLED_CODE) {
    return '已取消验证码校验'
  }
  return error instanceof Error ? error.message : '验证码校验失败，请稍后重试'
}

async function retryAxiosRequest(
  axiosInstance: AxiosInstance,
  response: AxiosResponse,
  token: string,
) {
  const nextHeaders = AxiosHeaders.from(response.config.headers || {})
  nextHeaders.set(ZCAPTCHA_TOKEN_HEADER, token)

  return axiosInstance.request({
    ...response.config,
    headers: nextHeaders,
    [ZCAPTCHA_RETRY_MARK]: true,
  })
}

async function tryHandleCaptchaChallenge(
  axiosInstance: AxiosInstance,
  response: AxiosResponse,
) {
  if (!isZCaptchaEnabled()) {
    return null
  }

  const { config, data } = response
  if (config[ZCAPTCHA_RETRY_MARK]) {
    return null
  }

  const isCaptchaChallenge = isCaptchaChallengePayload(data)
  const isLegacyCaptcha = isLegacyCaptchaResponse(data)
  if (!isCaptchaChallenge && !isLegacyCaptcha) {
    return null
  }

  const requestPath = resolveCaptchaRequestPath(config.url, config.baseURL)
  const verifyResult = await showZCaptcha(
    requestPath,
    isCaptchaChallenge ? data : undefined,
  )
  const token = getCaptchaRetryToken(verifyResult)
  if (!token) {
    throw new Error('验证码校验成功，但未获取到有效凭证')
  }

  return retryAxiosRequest(axiosInstance, response, token)
}

export function installZCaptchaAxiosInterceptor(
  axiosInstance: AxiosInstance,
  options: { showRequestError: (message: string) => void },
) {
  const { showRequestError } = options

  axiosInstance.interceptors.response.use(
    async (response) => {
      try {
        const captchaRetryResponse = await tryHandleCaptchaChallenge(axiosInstance, response)
        if (captchaRetryResponse) {
          return captchaRetryResponse
        }
      }
      catch (error) {
        const message = getCaptchaCancelMessage(error)
        const showDefaultError = response.config.showDefaultError !== false
        if (showDefaultError) {
          showRequestError(message)
        }
        return Promise.reject(new Error(message))
      }

      return response
    },
  )
}

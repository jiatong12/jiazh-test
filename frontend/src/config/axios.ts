import axios from 'axios'
import { ElNotification } from 'element-plus'
import { merge } from 'lodash-es'
import {
  installZCaptchaAxiosInterceptor,
} from '@/config/zcaptcha'
import { useEnv } from '@/env'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
// import config from '../config/index'
// import util from './util'

const { API_URL } = useEnv()

merge(axios.defaults, {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: API_URL,
  // 设置超时时间
  timeout: 30_000,
  // 跨域时候允许携带凭证
  withCredentials: true,
})

axios.interceptors.request.use(
  (config) => {
    return config
  },
  error => Promise.reject(error),
)

const DEFAULT_ERROR_MESSAGE = '网络请求失败，请稍后重试'
/**
 * HTTP状态码错误消息映射
 */
const STATUS_ERROR_MESSAGES = {
  400: '请求错误',
  403: '当前账号无权限访问',
  404: '您所访问的资源不存在',
  405: '请求方式错误',
  408: '请求超时，请检查网络连接后重试!',
  429: '请求过于频繁，请稍后再试',

  500: '服务异常，请稍后重试',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时，服务器响应时间过长',
}

// 根据 http 状态码获取默认 msg
function getErrorMessageByStatus(status: number): string {
  return STATUS_ERROR_MESSAGES[status] || DEFAULT_ERROR_MESSAGE
}

function isRecord(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object'
}

function getBizStatus(responseData: unknown): number | undefined {
  return isRecord(responseData) && 'status' in responseData
    ? Number(responseData.status)
    : undefined
}

function getBizMessage(responseData: unknown): string {
  if (!isRecord(responseData) || !('message' in responseData)) {
    return ''
  }
  return String(responseData.message || '')
}

function normalizeBizMessage(message: string): string {
  return message.replace(/\d\. (Error|Warning): /g, '')
}

// 用于存储当前显示的错误通知实例
let currentErrorNotification: any = null
/**
 * 显示请求错误提示（只显示最后一个错误）
 */
function showRequestError(message: string) {
  // 如果已有错误通知在显示，先关闭它
  if (currentErrorNotification) {
    currentErrorNotification.close()
  }

  // 显示新的错误通知
  currentErrorNotification = ElNotification.error({
    title: '请求错误',
    message,
    duration: 3_000,
    onClose: () => {
      // 通知关闭时清空引用
      currentErrorNotification = null
    },
  })
}

installZCaptchaAxiosInterceptor(axios, {
  showRequestError,
})

axios.interceptors.response.use(
  async (res) => {
    // HTTP 状态码为 200 的情况
    const {
      config: {
        responseType,
        method,
        showDefaultError = true,
        useBizStatus = false,
      },
    } = res

    // 如果是 post 请求，尝试更新用户的权限
    if (method === 'post' && useAuthStore().isLogin) {
      try {
        useUserStore().updatePriv()
      }
      catch {}
    }

    let responseData = res.data

    // 响应可能是文件的情况，如：下载、导入响应错误信息，将 responseData 处理归一化
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      const contentType = String(res.headers?.['content-type'] || '')
      if (responseType === 'blob' && responseData instanceof Blob) {
        if (responseData.type.includes('application/json')) {
          // json信息展示
          const text = await responseData.text()
          // 解析成响应体，继续下面的逻辑处理
          responseData = JSON.parse(text)
        }
        else {
          // 文件
          return res
        }
      }
      else if (
        responseType === 'arraybuffer'
        && responseData instanceof ArrayBuffer
      ) {
        if (contentType.includes('application/json')) {
          const text = new TextDecoder('utf-8').decode(
            new Uint8Array(responseData),
          )
          responseData = JSON.parse(text)
        }
        else {
          return res
        }
      }
    }

    // 不根据 status 自动判断是否成功
    if (useBizStatus) {
      return res
    }

    // 也许本来就请求的字符串
    if (
      res.request.responseType === 'text'
      && typeof responseData === 'string'
      && res.status === 200
    ) {
      return res
    }

    // 如果 status === 1，认为是成功
    if (getBizStatus(responseData) === 1) {
      // 为了兼容旧逻辑和符合 axios 调用直觉，还是返回 res
      return res
    }

    // 其他 status 值，认为是业务失败
    const message
      = normalizeBizMessage(getBizMessage(responseData)) || '请求失败'
    // 是否全局消息提示
    if (showDefaultError) {
      showRequestError(message)
    }

    return Promise.reject(new Error(message || '请求失败'))
  },
  async (error) => {
    // HTTP 状态码非 200 的情况（网络错误、超时等）
    let message = ''

    if (error.response) {
      // 服务器返回了错误状态码 (4xx, 5xx)
      switch (error.response.status) {
        case 401: {
          useAuthStore().unauthorizedHandler(error)
          return Promise.reject(
            new Error(error.response?.data?.message || '未授权'),
          )
        }
        default: {
          message = getErrorMessageByStatus(error.response.status)
        }
      }
    }
    else if (error.message.includes('timeout')) {
      message = '请求超时'
    }
    else if (error.message.includes('Network Error')) {
      message = '网络连接错误'
    }
    else {
      message = error.message
    }

    showRequestError(message)
    return Promise.reject(new Error(message))
  },
)

export default axios

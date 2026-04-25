import type { AxiosResponse } from 'axios'
import axios from 'axios'

// 定义响应数据类型
interface MultiRequestResponseData {
  [url: string]: any
}

interface MultiRequestResponse extends AxiosResponse {
  data: {
    data: MultiRequestResponseData
  }
}

// 定义选项参数类型
interface MultiRequestOptions {
  params?: Record<string, any>
  // [key: string]: any
}

// 定义缓存的响应数据结构
interface CachedResponse extends AxiosResponse {
  // headers: any
  // config: AxiosRequestConfig
  // status: number
  // data: any
}

class MultiRequest {
  private urls: string[] | null = null
  private response: Promise<MultiRequestResponse> | null = null

  /**
   * 添加需要批量请求的URL
   * @param url 请求地址
   * @param options 请求选项，包括查询参数等
   */
  public add(url: string, options?: MultiRequestOptions) {
    if (!this.urls) {
      this.urls = []
    }
    this.urls.push(this.appendQueryParams(url, options))
    return this
  }

  /**
   * 附加查询参数到URL
   * @param url 基础URL
   * @param options 选项参数
   * @returns 带查询参数的完整URL
   */
  private appendQueryParams(url: string, options?: MultiRequestOptions): string {
    if (!options?.params) {
      return url
    }

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value === undefined || value === null) {
        continue
      }
      searchParams.append(key, String(value))
    }

    const queryString = searchParams.toString()
    if (!queryString) {
      return url
    }

    const [pathPartRaw, hashPart = ''] = url.split('#', 2)
    const pathPart = pathPartRaw || url
    const separator = pathPart.includes('?') ? '&' : '?'
    return `${pathPart}${separator}${queryString}${hashPart ? `#${hashPart}` : ''}`
  }

  /**
   * 执行批量请求
   */
  public execute() {
    if (!this.urls) {
      return Promise.reject(new Error('urls 不能为空'))
    }

    return this.response = axios.post<MultiRequestResponse['data']>('/ui/multiRequest', { urls: this.urls }, { showDefaultError: false })
  }

  /**
   * 获取指定URL的响应数据
   * @param url 请求地址
   * @param options 请求选项
   * @returns 响应数据
   */
  public async get<T = any>(url: string, options?: MultiRequestOptions): Promise<AxiosResponse<T>> {
    url = this.appendQueryParams(url, options)

    if (this.response) {
      try {
        const mr = await this.response
        if (mr && mr.data && mr.data.data) {
          const data = mr.data.data[url]
          if (data) {
            const cachedResponse: CachedResponse = {
              headers: mr.headers,
              config: mr.config,
              status: mr.status,
              statusText: mr.statusText,
              data,
            }
            return cachedResponse as AxiosResponse<T>
          }
        }
      }
      catch (e) {
        console.error('MultiRequest get error:', e)
      }
    }

    // 如果批量请求中没有该URL，则直接发起单独请求
    return axios.get<T>(url)
  }

  /**
   * 清理缓存数据
   */
  public clear(): void {
    this.urls = null
    this.response = null
  }
}

export function useMultiRequest() {
  return new MultiRequest()
}

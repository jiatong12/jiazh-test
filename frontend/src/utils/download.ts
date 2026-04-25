interface DownloadFileByFormOptions {
  endpoint: string
  data: Record<string, unknown>
  queryParams?: Record<string, unknown>
  method?: 'post' | 'get' | 'POST' | 'GET'
  onError?: (message: string) => void
}

interface DownloadFileByUrlOptions {
  url: string
  fileName?: string
  queryParams?: Record<string, unknown>
  onError?: (message: string) => void
}

function appendQueryParams(endpoint: string, queryParams?: Record<string, unknown>) {
  if (!queryParams) { return endpoint }

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(queryParams)) {
    if (value == null) { continue }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item == null) { continue }
        searchParams.append(key, String(item))
      }
      continue
    }
    searchParams.append(key, String(value))
  }

  const queryString = searchParams.toString()
  if (!queryString) { return endpoint }

  const [pathPartRaw, hashPart = ''] = endpoint.split('#', 2)
  const pathPart = pathPartRaw || endpoint
  const separator = pathPart.includes('?') ? '&' : '?'
  return `${pathPart}${separator}${queryString}${hashPart ? `#${hashPart}` : ''}`
}

function parseIframeError(iframe: HTMLIFrameElement) {
  try {
    const doc = iframe.contentWindow?.document || iframe.contentDocument
    if (!doc) { return '' }

    const messageNode = doc.querySelector('JSONObject > message, JSONObject message, message')
    const message = messageNode?.textContent?.trim()
    if (message) { return message }

    const text = doc.documentElement?.textContent?.trim() || ''
    if (!text) { return '' }

    const parsed = JSON.parse(text)
    return parsed?.message || ''
  }
  catch {
    return ''
  }
}

/**
 * 通过隐藏 form + iframe 发起文件下载。
 * 适用场景:
 * 1. 资源需要鉴权（依赖当前站点 cookie/session）；
 * 2. 后端提供 GET/POST 表单下载接口并直接返回附件流。
 */
export function downloadFileByForm(options: DownloadFileByFormOptions) {
  const {
    endpoint,
    data,
    queryParams,
    method = 'POST',
    onError,
  } = options
  const normalizedMethod = method.toUpperCase() as 'POST' | 'GET'

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.name = `download_file_${Date.now()}`
  document.body.appendChild(iframe)

  const form = document.createElement('form')
  form.method = normalizedMethod
  form.action = appendQueryParams(endpoint, queryParams)
  form.target = iframe.name
  form.style.display = 'none'

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) { return }
    const element = document.createElement('input')
    element.type = 'hidden'
    element.name = key
    element.value = String(value)
    form.appendChild(element)
  })

  iframe.onload = () => {
    const message = parseIframeError(iframe)
    if (message) {
      onError?.(message)
    }
  }

  document.body.appendChild(form)
  form.submit()

  setTimeout(() => {
    if (iframe.parentNode) { document.body.removeChild(iframe) }
    if (form.parentNode) { document.body.removeChild(form) }
  }, 1000)
}

/**
 * 直接触发浏览器原生下载流程（由浏览器接管文件大小、下载速度、进度展示）。
 * 说明: 是否进入浏览器下载管理器取决于服务端响应头（如 Content-Disposition: attachment）。
 * 说明: fileName 仅为建议值，跨域资源可能被浏览器忽略。
 */
export function downloadFileByUrl(options: DownloadFileByUrlOptions) {
  const { url, fileName, queryParams, onError } = options
  try {
    const targetUrl = appendQueryParams(url, queryParams)
    const link = document.createElement('a')
    link.href = targetUrl
    if (fileName) {
      link.download = fileName
    }
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  catch (error) {
    onError?.(error instanceof Error ? error.message : '下载失败')
  }
}

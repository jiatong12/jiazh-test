function resolvePublicAsset(path: string) {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBaseUrl}${normalizedPath}`
}

// logo 和登录页配图属于项目定制资源，统一从 public 目录读取，避免被打进业务代码。
export const APP_LOGO_URL = resolvePublicAsset('branding/logo.svg')

// 登录页背景图需要支持项目交付后直接替换文件，不走 import 构建产物。
export const LOGIN_BG_URL = resolvePublicAsset('branding/login-bg.svg')

// 登录页插画经常按项目定制，统一从 public 目录读取。
export const LOGIN_ILLUSTRATION_URL = resolvePublicAsset('branding/login-illustration.svg')

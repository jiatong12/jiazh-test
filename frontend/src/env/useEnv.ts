// import { APP_CONF_ATTR_NAME } from ''
import { APP_CONF_ATTR_NAME } from '../../vite-config/index'
import { freezeDeep } from '../utils'
import { convertEnv } from './utils'

export const { envConfig, envVarConfig } = convertEnv(import.meta.env, { appNamespace: __APP_NAMESPACE__ })

// 开发和生产统一优先读取运行时配置，没有时再回退到构建时配置
let varConfig: typeof envVarConfig = envVarConfig
if (APP_CONF_ATTR_NAME in window) {
  // _app.config.js 执行后会把可热替换的运行时配置挂到 window 上。
  varConfig = (window as any)[APP_CONF_ATTR_NAME] ?? envVarConfig
}
else {
  console.warn(`window 上不存在 ${APP_CONF_ATTR_NAME} 属性`)
}

// 冻结，防止被修改
const config = {
  ...varConfig,
  ...envConfig,
}
freezeDeep(config)

/**
 * 如果一有 vite-inject-app-config 注入的全局配置就可以通过这里获取
 */
export function useEnv() {
  return config
}

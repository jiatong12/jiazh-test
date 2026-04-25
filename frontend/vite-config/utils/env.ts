import type { EnvConst } from '../types'

// todo 这里要注意看是否有空格和空字符的情况
const getBoolean = (value: string | undefined) => value === null || value === void 0 ? false : value === 'true'

// todo 这里要注意看是否有空格和空字符的情况
function getString(value: string | undefined) {
  return value ?? ''
}

/**
 * vite.config.ts 文件读取的配置
 * @param env
 */
export function loadAndConvertEnv(env: Record<string, string>) {
  const envConstConfig = Object.freeze({
    // 环境配置
    PUBLIC_PATH: getString(env.VITE_PUBLIC_PATH), // 公共基础路径
    DROP_CONSOLE: getBoolean(env.VITE_DROP_CONSOLE), // 打包时是否删除 console
    MOCK: getBoolean(env.VITE_MOCK), // 是否启用 Mock
    PROXY: Object.freeze(JSON.parse(env.VITE_PROXY || '[]')), // 开发环境跨域代理，支持配置多个
    DEVTOOLS: getBoolean(env.VITE_DEVTOOLS), // 是否开启devtools
    CACHE_VERSION: getString(env.VITE_CACHE_VERSION), // 缓存的版本，与本地不一致将清空 storage，一般不需要更改，不用 project.json 版本是为了避免每次更新都重置缓存
    INCLUDE_GUIDES: getBoolean(env.VITE_INCLUDE_GUIDES), // 是否打包指南模块
  } as const satisfies EnvConst)

  console.log('envConstConfig', env)

  return {
    envConstConfig,
  }
}

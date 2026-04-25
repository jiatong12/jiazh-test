// todo 这里要注意看是否有空格和空字符的情况
function getString(value: string | undefined) {
  return value ?? ''
}

function getBoolean(value: string | undefined) {
  return value === 'true'
}

interface ConvertEnvOptions {
  appNamespace: string
}

// function getNumber(value: string | undefined, fallback: number) {
//   return Number(value) || fallback
// }

// 环境变量配置，这里将 evn 改成入参是为了解决 vite 还没启动无法使用的问题
// 注意：获取值尽量避免用默认值，容易导致同一个配置不同地方读取的结果不一致
export function convertEnv(env: Record<string, string>, options: ConvertEnvOptions) {
  const { appNamespace } = options

  return {
    // 代码中会用到的配置，删除了部分 vite 打包相关配置
    envConfig: {
      // 命名空间统一跟随项目名，避免 env 和项目配置维护两份来源。
      APP_NAMESPACE: appNamespace,
      CACHE_VERSION: getString(env.VITE_CACHE_VERSION), // 缓存的版本，与本地不一致将清空 storage，一般不需要更改，不用 project.json 版本是为了避免每次更新都重置缓存
      DEMO_ACCOUNTS: Object.freeze(JSON.parse(env.VITE_DEMO_ACCOUNTS || '[]')) as { label: string, accountNo: string, password: string }[], // demo 账号
      INCLUDE_GUIDES: getBoolean(env.VITE_INCLUDE_GUIDES), // 是否打包指南模块
    } as const,
    // 打包后写入配置文件，可通过配置文件修改，避免再次打包
    envVarConfig: Object.freeze({
      API_URL: getString(env.VITE_GLOB_API_URL), // 接口地址
      APP_TITLE: getString(env.VITE_GLOB_APP_TITLE), // 标题
      PRIMARY_COLOR: getString(env.VITE_GLOB_PRIMARY_COLOR) || '#3182F3', // 默认主题色
      ZCAPTCHA_ENABLED: getBoolean(env.VITE_GLOB_ZCAPTCHA_ENABLED), // 是否启用新验证码拦截
      ZCAPTCHA_TYPE: getString(env.VITE_GLOB_ZCAPTCHA_TYPE), // 新验证码类型：Slider / Click / GIF / PNG
    } as const),
  }
}

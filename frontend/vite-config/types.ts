// 环境配置：如正式环境和测试环境配置不一样和一些常修改的配置
// 打包后写入配置文件

// 应用配置：比如这个应用用哪些插件，插件如何配置
// 动态配置：如主题

// 下划线转小驼峰 Uppercase
// type CameCase<Str> = Str extends `${infer First}_${infer Second}${infer Rest}` ? `${First}${Uppercase<Second>}${CameCase<Rest>}` : Str
// 删除指定前缀
type RemovePrefix<K, P extends string> = K extends `${P}${infer S}` ? S : K
// env 大写下划线属性转为小驼峰属性，并删除 VITE_GLOB_ 和 VITE_ 前缀
// type EnvConfigConvert<T extends Record<string, any>> = {
//   [K in keyof T as CameCase<Lowercase<string & RemovePrefix<RemovePrefix<K, 'VITE_GLOB_'>, 'VITE_'>>> ]: T[K];
// }
type EnvConfigConvert<T extends Record<string, any>> = {
  [K in keyof T as RemovePrefix<RemovePrefix<K, 'VITE_GLOB_'>, 'VITE_'> ]: T[K];
}
/**
 * 全局自定义环境变量的类型声明
 * VITE_GLOB_ 开头表示是项目在打包后，可以动态修改的配置（修改文件）
 */
interface Env {
  // 打包后写入配置文件，注意这些要在运行时读取值，而不是在构建时去读取
  // VITE_GLOB_API_URL: string // 接口地址
  // VITE_GLOB_APP_TITLE: string // 标题
  // VITE_GLOB_PRIMARY_COLOR: string // 默认主题色
  // VITE_DEMO_ACCOUNTS?: { label: string, accountNo: string, password: string }[] // demo 账号，仅构建时读取

  // 环境配置
  VITE_PUBLIC_PATH: string // 公共基础路径
  VITE_DROP_CONSOLE: boolean // 打包时是否删除 console
  VITE_MOCK: boolean // 是否启用 Mock
  VITE_PROXY?: [string, string][] // 开发环境跨域代理，支持配置多个
  VITE_DEVTOOLS: boolean // 是否开启devtools
  VITE_CACHE_VERSION: string // 缓存的版本，与本地不一致将清空 storage，一般不需要更改，不用 project.json 版本是为了避免每次更新都重置缓存
  VITE_INCLUDE_GUIDES: boolean // 是否打包指南模块（示例和文档）
}

// interface LibraryConfig {
//   /** 开启依赖分析 */
//   visualizer?: boolean
//   /** 依赖分析配置 */
//   visualizerOptions?: PluginVisualizerOptions
//   /** 开启 dts 输出 */
//   dts?: boolean | PluginOptions
// }

interface PrintPluginOptions {
  /**
   * 打印的数据
   */
  infoMap?: Record<string, string | undefined>
}

interface ArchiverPluginOptions {
  /**
   * 输出文件名
   * @default dist
   */
  name?: string
  /**
   * 输出目录
   * @default .
   */
  outputDir?: string
}

interface InjectAppLoadingOptions {
  // 命名空间
  // themeKey?: string
  primaryHslKey: string
  isDarkKey: string
  // 默认颜色，只支持 #xxxxxx 格式
  defaultPrimary: string
  // 默认是否是深色模式
  defaultIsDark: boolean
  // 加载模板
  loadingTemplate?: string
}

// 不可变的配置，过滤掉 VITE_GLOB_ 为前缀的变量
type EnvConstConfig = {
  [K in keyof Env as K extends `VITE_GLOB_${string}` ? never : K]: Env[K]
}

// // 可变的配置，过滤出 VITE_GLOB_ 为前缀的变量
// type EnvVarConfig = {
//   [K in keyof Env as K extends `VITE_GLOB_${string}` ? K : never]: Env[K]
// }

// 转成小驼峰，并去掉前缀
type EnvConst = EnvConfigConvert<EnvConstConfig>
// 打包后写入配置文件，注意这些要在运行时读取值，而不是在构建时去读取
// type EnvVar = EnvConfigConvert<EnvVarConfig>

type CustomViteOptions = EnvConst & {
  /** 是否构建模式 */
  isBuild?: boolean
  /** 构建模式 */
  mode?: string
}

// type LibraryOptions = LibraryConfig & {
//   /** 是否构建模式 */
//   isBuild?: boolean
//   /** 构建模式 */
//   mode?: string
// }

// type DefineApplicationOptions = (config?: ConfigEnv) => Promise<{
//   application?: ApplicationOptions
//   vite?: UserConfig
// }>

// type DefineLibraryOptions = (config?: ConfigEnv) => Promise<{
//   library?: LibraryOptions
//   vite?: UserConfig
// }>

// type DefineConfig = DefineApplicationOptions | DefineLibraryOptions

export type {
  ArchiverPluginOptions,
  CustomViteOptions,
  // CustomViteConfig,
  // DefineApplicationOptions,
  // DefineLibraryOptions,
  // DefineConfig,
  Env,
  EnvConst,
  // EnvVar,
  // LibraryConfig,
  InjectAppLoadingOptions,
  PrintPluginOptions,
}

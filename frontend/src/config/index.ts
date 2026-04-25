// ? 全局默认配置项
// ----------------- 系统相关 -----------------
// 首页地址（默认）
export const HOME_URL = '/home'

// 登录页地址（默认）
export const LOGIN_URL = '/login'

// 系统初始化
export const INSTALL_URL = '/install'
export const INSTALL_NAME = 'install'

// 许可证更新
export const LICENSE_URL = '/license'
export const LICENSE_NAME = 'license'

// 404
export const PAGE404_URL = '/404'

// 默认是否是深色模式
export const DEFAULT_IS_DARK = false

// 路由白名单地址（本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = ['/500']

// 路由模式固定为 hash，如需切换统一在此处调整
export const ROUTE_MODE = 'hash' as const

// 持久化 key (完整的需要通过 cache 的 getKey 获取)，用到 loading.html 中
export const PRIMARY_HSL_KEY = 'primary-hsl'
export const IS_DARK_KEY = 'is-dark'

// ----------------- 组件相关 -----------------
// 表格导出 excel
export const TABLE_EXPORT_EXCEL_CONFIG = {
  defaultCount: 1000, // 默认数量
  maxCount: 10_0000, // 最大数量
  defaultPageCount: 1, // 默认页面数量
}

// 默认情况下单行输入框长度限制
// 默认情况下多行输入框长度限制

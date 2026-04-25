// 业务成功状态码（与 axios 响应拦截器口径保持一致）
export const SUCCESS_STATUS = 1 as const
export type SuccessStatus = typeof SUCCESS_STATUS

// 请求响应参数（不包含data）
export interface Result<TStatus extends number = number> {
  // code: number
  // msg: string
  status: TStatus
  message: string
}

// 请求响应参数（包含data）
export interface ResultData<T = any, TStatus extends number = number> extends Result<TStatus> {
  data: T
}

// 业务成功响应（status 恒为 1）
export type SuccessResultData<T = any> = ResultData<T, SuccessStatus>

// 分页响应参数
export interface ResPage<T = any> {
  data: T[]
  total: number
  pageIndex: number
  pageSize: number
}

// 分页请求参数
export interface ReqPage {
  pageIndex: number
  pageSize: number
  orderBy?: string
  asc?: boolean
}

// export type PathsConfig = Record<string, { [key in 'get' | 'post']?: (...args: any) => any }>

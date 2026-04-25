import type { FakeConfig } from './_tools/route'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { filterEnabledRoutes } from './_tools/route'
import base from './modules/base/index'

export const allApiPathsConfig = filterEnabledRoutes(base)
export default defineFakeRoute(allApiPathsConfig)

type RoutePaths<T extends FakeConfig> = T[number]

// 根据方法过滤路径
type PathsByMethod<
  T extends FakeConfig,
  M extends string,
> = Extract<RoutePaths<T>, { method: M | Lowercase<M> | Uppercase<M> }>['url']

export type GetPaths = PathsByMethod<typeof allApiPathsConfig, 'get'>
export type PostPaths = PathsByMethod<typeof allApiPathsConfig, 'post'>
export type PutPaths = PathsByMethod<typeof allApiPathsConfig, 'put'>
export type PatchPaths = PathsByMethod<typeof allApiPathsConfig, 'patch'>
export type DeletePaths = PathsByMethod<typeof allApiPathsConfig, 'delete'>

/**
 * 根据 Path 和 Method 获取 API 返回类型
 * @example
 * type UserResponse = ApiResponseType<'/users/1', 'get'>;
 * // => { id: number; name: string }
 */
export type ApiResponseType<
  Path extends string,
  M extends string,
> = ReturnType<Extract<
  typeof allApiPathsConfig[number],
  { url: Path, method: M | Lowercase<M> | Uppercase<M> }
>['response']>

/**
 * 根据 Path 和 Method 获取 API 参数类型
 * @example
 * type UserResponseParams = ApiResponseParamsType<'/users/1', 'get'>;
 * // => { id: number; name: string }
 */
export type ApiResponseParamsType<
  Path extends string,
  M extends string,
> = Parameters<Extract<
  typeof allApiPathsConfig[number],
  { url: Path, method: M | Lowercase<M> | Uppercase<M> }
>['response']>[0]

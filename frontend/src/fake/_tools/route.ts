import type { FakeRouteConfig } from 'vite-plugin-fake-server/client'

type NativeFakeRoute = Exclude<FakeRouteConfig, readonly unknown[] | unknown[]>

export interface FakeRequestConfig<
  Body = unknown,
  Query extends Record<string, string | string[]> = Record<string, string | string[]>,
  Params extends Record<string, string | string[]> = Record<string, string | string[]>,
> {
  body: Body
  query: Query
  params: Params
}

export type FakeResponseHandler<
  Body = unknown,
  Query extends Record<string, string | string[]> = Record<string, string | string[]>,
  Params extends Record<string, string | string[]> = Record<string, string | string[]>,
> = (config: FakeRequestConfig<Body, Query, Params>) => unknown

export type FakeRouteItem = Omit<NativeFakeRoute, 'method' | 'response'>
  & {
    enabled?: boolean
    method: NonNullable<NativeFakeRoute['method']>
    response: FakeResponseHandler
  }

export type FakeConfig = readonly FakeRouteItem[]

type EnabledRoute<T> = T extends { enabled: false } ? never : T

export function filterEnabledRoutes<T extends FakeConfig>(routes: T): EnabledRoute<T[number]>[] {
  return routes.filter(route => route.enabled ?? true) as EnabledRoute<T[number]>[]
}

export function mergeFakeRoutes<T extends readonly FakeConfig[]>(...groups: T): T[number][number][] {
  return groups.flat() as T[number][number][]
}

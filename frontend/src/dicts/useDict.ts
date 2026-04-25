import type { Arrayable } from '@vueuse/core'
import type { MaybeRef } from 'vue'
import type { DictItem, DictOpts } from './types'
import type { DictCode } from '@/dicts/index'
import { isFunction, isString } from 'lodash-es'
import { computed, reactive, toRefs, unref, watch } from 'vue'
import { $$dicts } from '@/dicts/index'
import { useRequest } from '@/hooks/useRequest'
import { deepHandleDictItems } from './utils'

/**
 * 定义字典数据源类型别名，提高可读性
 * 如果是用函数获取数据，但会调用多次，希望不每次都去获取数据可以按下面的分开处理
 * const dictApi = axios.get(xxxx)
 * const dictFun = () => dictApi
 */
export type DictSource = DictCode | Record<string, any>[] | (() => Promise<Record<string, any>[]>) | void

/**
 * 字典数据管理 Hook
 * @param dict 字典数据源，支持以下类型：
 * 1. 响应式字典编码（DictCode）
 * 2. 静态字典数组
 * 3. 异步获取字典数据的函数
 * @param opts 配置
 * @returns 包含字典数据和加载状态的API响应对象
 */
export function useDict(dict: MaybeRef<DictSource>, opts?: MaybeRef<DictOpts & {
  ignoreDisabled?: boolean
  // 组件字典值
  value?: any
  // 值对应的字典项同步函数
  onSyncItem?: ((item: Arrayable<Record<string, any>>) => void) | void
}>) {
  // 解析字典数据源的工厂函数
  const resolveDictSource = (source: DictSource) => {
    // if (Array.isArray(source)) {
    //   return () => Promise.resolve(source).then(r => deepHandleDictItems(r || [], unref(opts)))
    // }
    if (isFunction(source)) {
      return () => source().then(r => deepHandleDictItems(r || [], unref(opts)))
    }
    if (isString(source)) {
      const ignoreDisabled = unref(opts)?.ignoreDisabled ?? false
      // 内部已经 deepHandleDictItems 处理过了
      return () => $$dicts.$getDict(source, ignoreDisabled) as Promise<Record<string, any>[]>
    }

    return () => Promise.resolve(source).then(r => deepHandleDictItems(r || [], unref(opts)))
  }

  // 计算属性维护当前字典解析函数
  const dictResolverFn = computed(() => {
    const rawValue = unref(dict)
    return resolveDictSource(rawValue)
  })

  // 使用统一的API调用封装
  const dictApi = useRequest(() => dictResolverFn.value() as Promise<DictItem[]>, () => [], { loadingDelay: 50 })

  // 自动监听字典源变化
  watch(
    () => unref(dict),
    () => dictApi.send(),
    { immediate: true },
  )

  /**
   * 获取字典项
   * @param value
   */
  function getDictItem<T extends string | number>(value: T | T[]): T extends any[] ? DictItem[] : DictItem | undefined {
    if (Array.isArray(value)) {
      const valueSet = new Set(value as any[]) // 明确断言为 any[] 以绕过类型限制
      return dictApi.result?.filter(e => valueSet.has(e.value)) || ([] as any)
    }

    return dictApi.result?.find(e => e.value === value) as any
  }

  watch(
    () => [unref(opts)?.value, dictApi.result?.length],
    (newVal) => {
      unref(opts)?.onSyncItem?.(getDictItem(newVal[0]))
    },
    // { immediate: true },
  )

  return reactive({
    ...toRefs(dictApi),
    getDictItem,
  })
}

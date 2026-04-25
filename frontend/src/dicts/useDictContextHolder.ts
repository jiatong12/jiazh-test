import type { DictConfig, DictItem } from './types'
import isString from 'lodash-es/isString'
import { useRequest } from '@/hooks/useRequest'
import { freezeDeep } from '@/utils'
import { deepHandleDictItems } from './utils'

/**
 * 字典请求状态类型
 */
const Status = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
} as const
type StatusType = (typeof Status)[keyof typeof Status]

/** 通用回调函数类型 */
type Callback = ((...args: any[]) => any)

/**
 * 字典项上下文对象接口
 * @interface
 */
interface DictItemContext {
  /** 当前字典请求状态 */
  status: StatusType
  /** 字典项数据数组 */
  value: DictItem[]
  /** 回调函数队列（用于处理并发请求） */
  callbacks: Callback[]
  /** 数据创建时间戳（用于实现缓存过期机制） */
  createTimestamp: number
  /** 最近一次失败时间戳（用于失败重试间隔控制） */
  errorTimestamp: number
}

/**
 * 过滤禁用字典项
 * @param {DictItem[]} dictDataList - 原始字典数据
 * @returns {DictItem[]} 过滤后的有效字典项
 */
function $findIgnoreDisabledList(dictDataList: DictItem[]): DictItem[] {
  return dictDataList.filter(item => !item.disabled)
}

/**
 * 根据值查找字典项
 * @param {DictItem[]} dictDataList - 字典数据源
 * @param {any} value - 要查找的值
 * @returns {DictItem|undefined} 匹配的字典项
 */
function $findDictItem(dictDataList: DictItem[], value: any) {
  return dictDataList.find(item => item.value === value)
}

/**
 * 根据值获取字典项标签
 * @param {DictItem[]} dictDataList - 字典数据源
 * @param {any} value - 要查找的值
 * @returns {string} 对应的标签文本（未找到返回空字符串）
 */
function $findLabel(dictDataList: DictItem[], value: any) {
  return $findDictItem(dictDataList, value)?.label || ''
}

/**
 * 字典上下文管理Hook
 * @template DictConf - 字典配置类型
 * @template DictGetKey - 字典键类型
 * @param {object} options - 配置选项
 * @param {DictConf} options.dictConfig - 字典配置对象
 * @param {(dictKey: DictGetKey) => Promise<DictItem[]>} options.getDictByCode - 字典获取方法
 * @returns {object} 字典上下文操作方法集合
 */
export function useDictContextHolder<DictConf extends DictConfig, DictGetKey extends keyof DictConf>(options: {
  dictConfig: DictConf
  getDictByCode: (dictKey: DictGetKey) => Promise<NonNullable<DictConf[DictGetKey]['data']> | DictItem[]>
}) {
  const { dictConfig, getDictByCode } = options
  let dict: { [key in DictGetKey]?: DictItemContext } = {}

  /**
   * 设置字典数据到缓存
   * @param {DictGetKey} dictCode - 字典编码
   * @param {any[]} dictList - 字典数据列表
   */
  function setDict(dictCode: DictGetKey, dictList: any[]): void {
    freezeDeep(dictList)
    dict[dictCode] = {
      status: Status.FULFILLED,
      callbacks: [],
      value: dictList,
      createTimestamp: Date.now(),
      errorTimestamp: 0,
    }
  }

  /**
   * 获取字典数据（带缓存机制）
   * @param {DictGetKey} dictCode - 字典编码
   * @param {boolean} [ignoreDisabled] - 是否过滤禁用项
   * @returns {Promise<DictItem[]>} 字典数据Promise
   */
  function getDict(dictCode: DictGetKey, ignoreDisabled: boolean = false): Promise<DictItem[]> {
    return new Promise((resolve) => {
      let dictInfo = dict[dictCode]

      if (dictInfo) {
        switch (dictInfo.status) {
          case Status.PENDING:
            // 正在请求中
            dictInfo.callbacks.push(resolve)
            return
          case Status.FULFILLED:
            // 已请求成功结果
            resolve(ignoreDisabled ? $findIgnoreDisabledList(dictInfo.value) : dictInfo.value)
            return
          default:
            if (dictInfo.errorTimestamp && Date.now() - dictInfo.errorTimestamp <= 5000) {
              dictInfo.errorTimestamp = Date.now()
              resolve(dictInfo.value)
              return
            }
            break
        }
      }

      dictInfo = dict[dictCode] = {
        status: Status.PENDING,
        callbacks: [resolve],
        value: [],
        createTimestamp: Date.now(),
        errorTimestamp: 0,
      }

      // 因为字典表只能是字符类型，但实际业务可能是数值类型，所以需要根据配置的 isNumber转换
      const isNumber = dictConfig[dictCode]?.isNumber

      getDictByCode(dictCode)
        .then((res) => {
          dictInfo!.status = Status.FULFILLED
          dictInfo!.value = deepHandleDictItems(res || [], {
            isNumber: !!isNumber,
          }) as unknown as DictItem[]
          dictInfo!.callbacks.forEach(cb => cb(dictInfo!.value))
        })
        .catch((e) => {
          dictInfo!.status = Status.REJECTED
          dictInfo!.errorTimestamp = Date.now()
          dictInfo!.callbacks.forEach(cb => cb([]))
          return Promise.reject(e)
        })
    })
  }

  /** 清空所有字典缓存 */
  function $clearDictCache(): void {
    dict = {}
  }

  /** 初始化字典缓存（加载配置中的静态字典） */
  function $initDictCache() {
    $clearDictCache()
    Object.entries(dictConfig).forEach(([k, v]) => {
      if (v.data?.length) {
        setDict(k as DictGetKey, v.data)
      }
    })
  }

  /**
   * 批量获取字典数据
   * @param {Array} dicts - 字典请求数组，支持混合格式：
   *   - 字符串：直接使用缓存机制获取
   *   - 对象：{ 字典编码: 静态数据数组 或 获取函数 }
   * @param {boolean} [ignoreDisabled] - 全局禁用项过滤开关
   * @returns {Promise<Record<DictGetKey, any[]>>} 字典数据集合
   * @example
   * $getDicts([
   *   'gender',
   *   { userStatus: () => fetchCustomStatus() }
   * ])
   */
  function $getDicts(
    dicts: (DictGetKey | Record<DictGetKey, any[] | (() => Promise<any[]>)>)[],
    ignoreDisabled: boolean = false,
  ) {
    return useRequest(() => {
      const result = {} as Record<DictGetKey, any[]>
      const reqList: Promise<any[]>[] = []

      dicts.forEach((e) => {
        if (isString(e)) {
          reqList.push(getDict(e, ignoreDisabled))
        }
        else {
          Object.entries(e).forEach(([k, v]) => {
            const key = k as DictGetKey
            if (Array.isArray(v)) {
              result[key] = v
            }
            else {
              reqList.push(v().then(r => result[key] = r))
            }
          })
        }
      })

      return Promise.all(reqList).then(() => result)
    })
  }

  // 初始化缓存
  $initDictCache()

  return freezeDeep({
    ...dictConfig,
    /** 原始字典配置 */
    $dictConfig: dictConfig,
    /** 初始化字典缓存 */
    $initDictCache,
    /** 清空字典缓存 */
    $clearDictCache,
    /** 获取单个字典 */
    $getDict: getDict,
    /** 批量获取字典 */
    $getDicts,
    /** 过滤禁用项工具函数 */
    $findIgnoreDisabledList,
    /** 字典项查找工具函数 */
    $findDictItem,
    /** 标签获取工具函数 */
    $findLabel,
  })
}

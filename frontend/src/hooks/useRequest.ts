import type { MaybeRef } from 'vue'
import { reactive, unref } from 'vue'
import { useLoadingDelay } from './useLoadingDelay'

export interface Opts {
  // 接口, 入参 params
  // api: (params: P | undefined) => Promise<R>;
  // 初始的 data 值，在首次响应前 data 值为初始值，未设置时为 undefined，最好用字面量吧，不要用变量
  // defaultValue?: () => R;

  // 可实现响应时间小于100ms时不展示 loading 动画，大于100ms时展示300ms的 loading 动画时间
  // 延时 loading 等待时间，默认 0，请求很快时，不触发 delayLoading
  loadingDelay?: number
  // 加载时间，默认 300
  loadingKeep?: number
}

// 唯一标识符
const USE_REQUEST_SYMBOL = Symbol('useRequest')

/**
 * 将 axios 对象封装，直接返回请求情况和成功失败结果，多次请求会让前面请求丢弃
 *
 * @author 石匀
 * @param request 接口
 * @param defaultValue 初始的 data 值，在首次响应前 data 值为初始值，未设置时为 undefined，最好用字面量吧，不要用变量
 * @param opts 配置
 * @returns 响应结果是 reactive 对象，相比 ref 感觉这样比较好减少命名麻烦，使用时用解构会导致失去响应，如果实在想用可以用 toRefs 后再解构
 */
export function useRequest<
  T extends (
    ...args: any[]
  ) => Promise<any>,
  R extends Awaited<ReturnType<T>>,
  DV extends () => R,
  SEND extends T,
>(
  request: MaybeRef<T>,
  defaultValue?: DV,
  opts: Opts = {},
) {
  const { loadingDelay = 0, loadingKeep = 300 } = opts

  // 使用 useLoadingDelay 管理 loading 状态
  const loadingState = useLoadingDelay({
    loadingDelay,
    loadingKeep,
  })

  const state = reactive({
    // 添加标识属性
    [USE_REQUEST_SYMBOL]: true,
    // 响应数据
    result: defaultValue?.(),
    // 通过 getter 保持与 useLoadingDelay 的响应式连接
    get delayLoading() { return loadingState.delayLoading },
    get immediateLoading() { return loadingState.immediateLoading },
    get loading() { return loadingState.loading },
    send: ((params) => {
      // 开始加载
      loadingState.start()

      // 调用接口
      const wrapApi = unref(request)(params as any)
        .then((_result) => {
          if (!isCurrentApi()) {
            return Promise.reject(new Error('因为多个并发请求，此请求已被取消'))
          }

          // 如果是 undefined、null 和空字符都会尝试设置 defaultValue
          return (state.result
            = (_result === undefined || _result === null || _result === '')
              && defaultValue
              ? defaultValue()
              : _result)
        })
        .catch((error) => {
          if (!isCurrentApi()) {
            return Promise.reject(new Error('因为多个并发请求，此请求已被取消'))
          }

          state.error = error || new Error('请求失败')
          // 异常时设置默认值，默认这样比较符合直觉，而不是上次参数请求的数据放到这次请求里面
          state.result = defaultValue?.()
          throw error
        })

      // 等待整个 Promise 链完成
      wrapApi.finally(() => {
        // 结束加载
        loadingState.end()
      })

      state.request = wrapApi

      function isCurrentApi() {
        return state.request && state.request === wrapApi
      }

      return wrapApi
    }) as SEND,
    // error: void 0,
    // promise: void 0,
    // 发送请求函数
    // send: () => Promise.resolve()
    setResult: (data) => {
      state.result = data
      // 重置状态
      state.error = void 0
    },
    setResultToDefaultValue: () => {
      state.setResult(defaultValue?.())
    },
  }) as {
    request?: Promise<R> // 实例对象，进过处理了的，内部经过了 then 和 finally 处理
    delayLoading: boolean // 延时加载，请求时不会立刻变成 true，会需要等待 loadingDelay 时间，请求很快是，可不触发 loading
    immediateLoading: boolean // 数据延时加载，和 delayLoading 不同，请求时会立刻变成 true
    error?: Error
    loading: boolean // 接口调用状态
    result?: R
    send: SEND // 发送请求，这里的 params 是方便在使用局部变量作为参数的情况
    setResult: (data: R | undefined) => void // 设置数据，会重置状态
    setResultToDefaultValue: () => void // 设置数据为默认值，会重置状态
  }

  return state
}

export type UseRequest = ReturnType<typeof useRequest>

// 检查对象是否为 useRequest 类型
export function isUseRequest(obj: any): obj is UseRequest {
  return obj && typeof obj === 'object' && USE_REQUEST_SYMBOL in obj
}

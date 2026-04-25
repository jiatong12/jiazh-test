// src/hooks/useLoadingDelay.ts
import { onScopeDispose, reactive } from 'vue'

export interface LoadingDelayOptions {
  /**
   * 延时 loading 等待时间，默认 0，请求很快时，不触发 delayLoading
   */
  loadingDelay?: number
  /**
   * 加载时间，默认 300ms
   */
  loadingKeep?: number
}

export interface LoadingDelayState {
  /**
   * 请求加载状态
   */
  loading: boolean
  /**
   * 延时加载状态
   */
  delayLoading: boolean
  /**
   * 立即加载状态（start调用时立即变为true）
   */
  immediateLoading: boolean
}

export interface UseLoadingDelayReturn extends LoadingDelayState {
  /**
   * 开始加载
   */
  start: () => void
  /**
   * 结束加载
   */
  end: () => void
}

/**
 * 处理延迟加载状态的 Hook
 *
 * @param options 配置选项
 * @returns loading状态和控制方法
 */
export function useLoadingDelay(options: LoadingDelayOptions = {}) {
  const { loadingDelay = 0, loadingKeep = 300 } = options
  let loadingDelayTimer: number | undefined
  let loadingKeepTimer: number | undefined

  const state = reactive<LoadingDelayState>({
    loading: false,
    delayLoading: false,
    immediateLoading: false,
  })

  const clearTimers = () => {
    if (loadingDelayTimer) {
      window.clearTimeout(loadingDelayTimer)
      loadingDelayTimer = undefined
    }
    if (loadingKeepTimer) {
      window.clearTimeout(loadingKeepTimer)
      loadingKeepTimer = undefined
    }
  }

  const start = () => {
    // 清除之前的定时器（即使已在加载中也应清除）
    clearTimers()

    state.loading = true
    state.immediateLoading = true

    // 延迟显示 loading
    if (loadingDelay > 0) {
      loadingDelayTimer = window.setTimeout(() => {
        if (state.loading) {
          state.delayLoading = true
        }
      }, loadingDelay)
    }
    else {
      // 如果没有延迟，则立即显示
      state.delayLoading = true
    }
  }

  const end = () => {
    // 使用 setTimeout 确保在微任务之后执行
    setTimeout(() => {
      // 即使 loading 已经是 false，也要确保状态一致性
      state.loading = false

      // 如果正在显示延迟加载指示器
      if (state.delayLoading) {
        // 如果设置了保持时间，则稍后隐藏
        if (loadingKeep > 0) {
          clearTimers()
          loadingKeepTimer = window.setTimeout(() => {
            state.delayLoading = false
            state.immediateLoading = false
          }, loadingKeep)
        }
        else {
          // 否则立即隐藏
          state.delayLoading = false
          state.immediateLoading = false
        }
      }
      else {
        // 如果未显示延迟加载指示器，直接重置 immediateLoading
        state.immediateLoading = false
      }
    }, 0)
  }

  // 组件销毁时清理定时器
  onScopeDispose(() => {
    clearTimers()
  })

  return Object.freeze({
    // 使用 computed 保持响应式
    get loading() { return state.loading },
    get delayLoading() { return state.delayLoading },
    get immediateLoading() { return state.immediateLoading },
    start,
    end,
  })
}

import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * @description 定义状态变量，并方便重置状态值
 * @param cb 获取初始值数据函数，一般不建议引用外部变量，除非初始化时需要保留值
 */
export function useResettableState<T>(
  cb: () => T,
) {
  const state = ref(cb()) as Ref<T>
  const resetState = () => {
    return state.value = cb()
  }

  return [state, resetState] as const
}

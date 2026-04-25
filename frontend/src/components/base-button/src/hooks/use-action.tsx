import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

import { throttle } from 'lodash-es'

interface Config {
  // 提交 API
  api: MaybeRef<() => Promise<any>>
  // 校验
  validate?: MaybeRef<(FormInstance['validate']) | undefined>
  // 操作名
  actionName?: MaybeRef<string | undefined>
  // // 同步loading，用来从外部知道是否是提交中
  // onSyncLoading?: (loading: boolean) => void
}

/**
 * 操作
 *
 * @param config
 */
export function useAction(config: Config) {
  const loading = ref(false)
  const actionName = computed(() => unref(config.actionName) ?? '操作')
  const onClick = computed(() => {
    return throttle(async () => {
      return Promise.resolve(unref(config.validate)?.()).then(() => {
        loading.value = true
        unref(config.api)()
          .then((res) => {
            loading.value = false

            ElMessage.success({ message: `${actionName.value}成功！` })
            // 继续往下抛
            return res
          })
          .catch((e) => {
            loading.value = false
            // 继续往下抛
            return Promise.reject(e)
          })
      })
    // .catch(() => {});
    }, 1000)
  })

  return reactive({
    loading,
    actionName,
    onClick,
  })
}

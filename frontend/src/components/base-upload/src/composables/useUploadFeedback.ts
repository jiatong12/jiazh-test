import type { UploadRequestOptions } from 'element-plus'
import { ElNotification } from 'element-plus'

export function useUploadFeedback() {
  function notifyWarning(message: string) {
    ElNotification({
      title: '温馨提示',
      message,
      type: 'warning',
    })
  }

  function notifySuccess(message: string) {
    ElNotification({
      title: '温馨提示',
      message,
      type: 'success',
    })
  }

  function notifyError(message: string) {
    ElNotification({
      title: '温馨提示',
      message,
      type: 'error',
    })
  }

  function notifyMissingApi(options: UploadRequestOptions, message: string) {
    notifyWarning(message)
    options.onError(new Error(message) as any)
  }

  return {
    notifyWarning,
    notifySuccess,
    notifyError,
    notifyMissingApi,
  }
}

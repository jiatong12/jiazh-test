import type { MessageType } from './index.types'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * @description 操作单条数据信息(二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法(必传)
 * @param {string} message 提示信息(必传)
 * @param {string} confirmType icon类型(不必传,默认为 warning)
 * @return Promise
 */
export function useHandleConfirm<R = any>(api: () => Promise<R>,
  message: string,
  confirmType: MessageType = 'warning') {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`是否${message}?`, '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: confirmType,
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = `正在处理...`
          api()
            .then((res) => {
              setTimeout(() => {
                done()
                ElMessage({
                  type: 'success',
                  message: `${message}成功!`,
                })
                resolve(res)
              }, 500)
            })
            .catch(() => {
              done()
              reject(new Error('操作失败'))
            })
            .finally(() => {
              setTimeout(() => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
              }, 300)
            })
        }
        else {
          done()
          reject(new Error('操作取消'))
        }
      },
    })
      .then(() => { })
      .catch(() => { })
  })
}

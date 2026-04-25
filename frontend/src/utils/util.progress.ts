import type { App, ComponentPublicInstance } from 'vue'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import ProgressDialog from '../modules/platform/_components/ProgressDialog.vue'

// 定义选项接口
interface ProgressOptions {
  taskID: string | number
  title?: string
  [key: string]: any // 允许其他属性
}

// 定义 ProgressDialog 实例的接口
interface ProgressDialogInstance extends ComponentPublicInstance {
  changeData: (data: any) => void
}

/**
 * 显示进度对话框并执行任务
 * @param options 进度对话框配置选项
 * @returns Promise，任务完成时resolve，失败时reject
 */
export default async function Progress(options: ProgressOptions): Promise<any> {
  // 验证必需参数
  if (!options.taskID) {
    throw new Error('任务ID不能为空！')
  }

  // 设置默认标题
  options.title = options.title || '任务正在进行中. . .'

  // 创建应用实例
  const app: App = createApp(ProgressDialog)
  app.use(ElementPlus)

  // 创建容器元素
  const container: HTMLDivElement = document.createElement('div')

  // 挂载组件实例
  const instance: ProgressDialogInstance = app.mount(container) as ProgressDialogInstance

  // 将容器添加到body中
  document.body.appendChild(container)

  // 初始化数据
  instance.changeData({
    ...options,
    show: true,
  })

  // 返回Promise以处理任务完成或失败
  return new Promise((resolve, reject) => {
    instance.changeData({
      callback: (flag: boolean, msg: string) => {
        try {
          // 根据任务结果resolve或reject
          if (flag) {
            resolve(msg)
          }
          else {
            reject(new Error(msg))
          }
        }
        finally {
          // 清理工作
          // 移除body上的弹窗类名
          document.body.className = document.body.className.replace(/el-popup-parent--hidden/, '')

          // 安全地移除容器元素
          if (container.parentElement) {
            container.parentElement.removeChild(container)
          }

          // 卸载应用实例
          app.unmount()
        }
      },
    })
  })
}

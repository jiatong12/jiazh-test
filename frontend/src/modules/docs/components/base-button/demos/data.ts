export interface ButtonSceneItem {
  key: string
  title: string
  description: string
}

export const buttonSceneItems: ButtonSceneItem[] = [
  {
    key: 'default',
    title: '默认按钮',
    description: '保持 ElButton 原生语义，适合列表工具栏和轻操作。',
  },
  {
    key: 'primary',
    title: '主按钮',
    description: 'BasePrimaryButton 直接固定为主按钮，减少重复声明 type=primary。',
  },
  {
    key: 'ripple-off',
    title: '关闭波纹',
    description: '需要更克制的视觉反馈时，可以显式关闭 ripple。',
  },
]

export function wait(ms = 900) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
  })
}

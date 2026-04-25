import type { Component } from 'vue'
import type { Props } from '../types'
import { defineComponent, h } from 'vue'
import './use-render-flicker.css'

// 主题映射颜色
const colorMap = {
  primary: 'var(--el-color-primary)',
  success: 'var(--el-color-success)',
  info: 'var(--el-color-info)',
  warning: 'var(--el-color-warning)',
  danger: 'var(--el-color-danger)',
}

/**
 * 圆点、方形闪烁动画组件
 * @param props 配置
 * @returns Component
 */
export function useRenderFlicker(props: Props = {}): Component {
  const rawColor = computed(() => {
    if (!props.color) {
      return 'var(--el-color-warning)'
    }
    return colorMap[props.color] ?? props.color
  })

  return defineComponent({
    render() {
      return h(
        'div',
        {
          class: 'point point-flicker',
          style: {
            '--point-width': props.width ?? '6px',
            '--point-height': props.height ?? '6px',
            '--point-background': rawColor.value,
            '--point-border-radius': props.radius ?? '50%',
            '--point-scale': props.scale ?? '2',
          },
        },
        {
          default: () => [],
        },
      )
    },
  })
}

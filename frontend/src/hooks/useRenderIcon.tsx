// import type { Component } from 'vue'
// import { Icon } from '@iconify/vue'

// /**
//  * 渲染 icon
//  * @param iconName
//  * @returns 图标
//  */
// export function useRenderIcon(iconName: string, style: Record<string, any> = {}): Component {
//   return (
//     <i style="
//       position: relative;
//       font-size: 1em;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       fill: currentColor;
//     "
//     >
//       <Icon icon={iconName} style={style}></Icon>
//     </i>
//   )
// }

import type { Component } from 'vue'

/**
 * 渲染 unocss icon
 * @param iconName
 * @returns 图标
 */
export function useRenderIcon(iconName: string, style: Record<string, any> = {}): Component {
  return <i class={iconName} style={style}></i> as Component
}

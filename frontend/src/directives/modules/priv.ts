// // import { useAuthStore } from "@/store/modules/auth";
// // import { useGlobalStore } from "@/store/modules/global";

// import type { Directive } from 'vue'
// import type { AuthCode } from '@/auths'
// import { usePrivilege } from '@/hooks/privilege'

// /**
//  * 设置元素的禁用状态
//  * @param el 元素
//  * @param disabled 是否禁用
//  */
// function setElementDisabled(el: HTMLElement, disabled: boolean): void {
//   // 统一添加/移除 CSS 类
//   if (disabled) {
//     el.setAttribute('disabled', 'true')
//     el.setAttribute('aria-disabled', 'true')
//     el.classList.add('is-disabled')
//   }
//   else {
//     el.removeAttribute('disabled')
//     el.removeAttribute('aria-disabled')
//     el.classList.remove('is-disabled')
//   }
//   // 对于原生支持 disabled 属性的元素
//   //   // 对于不支持 disabled 属性的元素，通过 CSS 控制
//   //   if (disabled) {
//   //     const { pointerEvents, opacity, cursor } = el.style
//   //     el.__temp_style_ = {
//   //       pointerEvents,
//   //       opacity,
//   //       cursor,
//   //     }
//   //     // 添加内联样式禁用交互
//   //     el.style.pointerEvents = 'none'
//   //     el.style.opacity = '0.5'
//   //     el.style.cursor = 'not-allowed'
//   //   }
//   //   else {
//   //     const { pointerEvents, opacity, cursor } = el.__temp_style_
//   //     // 移除内联样式
//   //     el.style.pointerEvents = pointerEvents
//   //     el.style.opacity = opacity
//   //     el.style.cursor = cursor
//   //   }
// }

// export default {
//   mounted(el, binding) {
//     const authCode = binding.value
//     if (!usePrivilege().hasPriv(authCode)) {
//       // 初始化时先禁用元素
//       setElementDisabled(el, true)
//     }
//   },

//   updated(el, binding) {
//     // 更新时也处理权限
//     const authCode = binding.value
//     if (!usePrivilege().hasPriv(authCode)) {
//       // 初始化时先禁用元素
//       setElementDisabled(el, true)
//     }
//   },
// } satisfies Directive<HTMLElement, AuthCode> as Directive<HTMLElement, AuthCode>

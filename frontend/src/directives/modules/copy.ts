import type { Directive, DirectiveBinding } from 'vue'
import { ElMessage } from 'element-plus'
/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
interface ElType extends HTMLElement {
  copyData: string | number
  __handleClick__: any
}

async function handleClick(this: any) {
  try {
    await navigator.clipboard.writeText(this.copyData)
    ElMessage.success('复制成功')
  }
  catch (err) {
    console.error('复制操作不被支持或失败: ', err)
  }
}

export default {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
    el.addEventListener('click', handleClick)
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  },
} as Directive<ElType, string>

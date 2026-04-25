<script setup lang='ts'>
import type { Options as TypeItOptions } from 'typeit'
// 打字机效果组件（配置项详情请查阅 https://www.typeitjs.com/docs/vanilla/usage#options）
import type { El } from 'typeit/dist/types'
import TypeIt from 'typeit'
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<Props>(), {})
interface Props {
  options: TypeItOptions
}

/**
 * 输出错误信息
 * @param message 错误信息
 */
function throwError(message: string) {
  throw new TypeError(message)
}

/**
 * 获取浏览器默认语言
 */
function getBrowserLanguage() {
  return navigator.language
}

const typedItRef = ref<Element | null>(null)
const typeIt = ref<TypeIt | null>(null)
onMounted(() => {
  const $typed = typedItRef.value!.querySelector('.type-it') as El

  if (!$typed) {
    const errorMsg = getBrowserLanguage() === 'zh-CN'
      ? '请确保有且只有一个具有class属性为 \'type-it\' 的元素'
      : 'Please make sure that there is only one element with a Class attribute with \'type-it\''
    throwError(errorMsg)
  }

  typeIt.value = new TypeIt($typed, props.options).go()
})

defineExpose({
  typeIt,
})
</script>

<template>
  <div ref="typedItRef">
    <slot>
      <span class="type-it" />
    </slot>
  </div>
</template>

<style lang='scss' scoped>

</style>

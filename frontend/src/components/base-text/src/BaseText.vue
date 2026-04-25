/**
 * 文字
 */
<script lang="tsx" setup>
import type { ModeType } from '@/components/commonDef'
import { ElText } from 'element-plus'
import { h } from 'vue'
import { modeType } from '@/components/commonDef'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

const type = ref()
const color = ref()
watch(() => props.color, (val) => {
  type.value = void 0
  color.value = void 0
  if (modeType.includes(val as unknown as ModeType)) {
    type.value = val
  }
  else {
    color.value = val
  }
}, { immediate: true })

const { componentRef, componentExposed } = useComponentExposed(ElText, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component
    :is="h(ElText, { ...$attrs, ...$props, ref: componentRef }, $slots)"
    :style="{ color }"
  />
</template>

<style lang="scss" scoped>
</style>

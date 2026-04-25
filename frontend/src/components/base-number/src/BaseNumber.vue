/**
 * 数值输入
 */
<script lang="tsx" setup>
import { ElInputNumber } from 'element-plus'
import { h } from 'vue'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

defineProps(propsDef)
const { componentRef, componentExposed } = useComponentExposed(ElInputNumber, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<!-- ps: 这里 class 不要写到 h 中的属性中，外部定义 class 会将其覆盖，不会合并 -->
<template>
  <component
    :is="h(ElInputNumber, { controlsPosition: 'right', ...$attrs, ...$props, ref: componentRef }, $slots)"
    class="base-number"
  />
</template>

<style lang="scss" scoped>
.base-number {
  width: 100%;

  :deep(.el-input__inner) {
    text-align: left; /* 或者 right, center 根据需要 */
  }

  // :global(.el-input__inner) {
  //   text-align: left; /* 或者 right, center 根据需要 */
  // }
}
</style>

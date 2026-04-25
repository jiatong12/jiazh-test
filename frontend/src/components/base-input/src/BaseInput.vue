/**
 * 单行输入框
 */
<script lang="tsx" setup>
import { ElInput } from 'element-plus'
import { h } from 'vue'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

defineProps(propsDef)
const { componentRef, componentExposed } = useComponentExposed(ElInput, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component :is="h(ElInput, { ...$attrs, ...$props, ref: componentRef }, $slots)" />
</template>

<style lang="scss" scoped>
</style>

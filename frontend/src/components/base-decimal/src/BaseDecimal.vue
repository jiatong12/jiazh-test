/**
 * 数值输入
 */
<script lang="tsx" setup>
import { h } from 'vue'
import { BaseNumber } from '@/components/base-number'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

defineProps(propsDef)

const { componentRef, componentExposed } = useComponentExposed(BaseNumber, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component
    :is="h(BaseNumber, { ...$attrs, ...$props, ref: componentRef }, $slots)"
  />
</template>

<style lang="scss" scoped>
</style>

/**
 * 主按钮
 */
<script lang="ts" setup>
import { h } from 'vue'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import BaseButton from './BaseButton.vue'
import { primaryPropsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

defineProps(primaryPropsDef)
const { componentRef, componentExposed } = useComponentExposed(BaseButton, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component :is="h(BaseButton, { ...$attrs, ...$props, type: 'primary', ref: componentRef }, $slots)" />
</template>

<style lang="scss" scoped>
</style>

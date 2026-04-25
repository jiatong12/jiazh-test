/**
 * 基础按钮
 */
<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { h } from 'vue'
import { $$auths } from '@/auths'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

// 自定义属性和事件建议都放到 props 中，别将事件另外定义，放一起还方便定义和管理
const props = defineProps(propsDef)

const disabled = computed(() => props.disabled || !!(props.priv && !$$auths.hasPriv(props.priv as any)))

const { componentRef, componentExposed } = useComponentExposed(ElButton, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component :is="h(ElButton, { ...$attrs, ...$props, disabled, ref: componentRef }, $slots)" v-ripple="ripple" />
</template>

<style lang="scss" scoped>
</style>

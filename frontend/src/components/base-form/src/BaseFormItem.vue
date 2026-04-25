<!-- 不要放其他逻辑，对 FormItemInner 包装一层，主要为了实现 watchRerender 刷新效果，如果 InnerFormItem 有接口加载等功能也能重新触发 -->
<script lang="ts" setup>
import { h } from 'vue'
import { $$auths } from '@/auths'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './baseFormItemDef'
import FormItemInner from './components/FormItemInner.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

// 变化触发重新渲染
const key = computed(() => `${props.prop}-${props.watchRerender ?? ''}`)

const isReadonly = computed(() => props.isReadonly || !!(props.priv && !$$auths.hasPriv(props.priv as any)))
const { componentRef, componentExposed } = useComponentExposed(FormItemInner, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component
    :is="h(FormItemInner, { ...$attrs, ...$props, isReadonly, ref: componentRef }, $slots)"
    :key="key"
  />
</template>

<style lang="scss" scoped>

</style>

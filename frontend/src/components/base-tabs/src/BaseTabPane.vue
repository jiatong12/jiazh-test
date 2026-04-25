/**
 * tab-pane 二次封装
 */
<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { h } from 'vue'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { useStore } from './context'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  // 覆盖原来的 lazy，将默认值设置为 undefined，让内部可以判断是否传了此字段
  lazy: {
    type: Boolean,
    default: undefined,
  },
  name: {
    type: String,
  },
})

const { nameList, lazy: parentLazy } = useStore()
const lazy = computed(() => {
  // 如果用户传入了 lazy，则使用用户传入的值
  // 否则使用父组件的 lazy 值
  return props.lazy !== undefined ? props.lazy : parentLazy.value
})

/* 维护父组件的 nameList */
watch(() => props.name, (newVal, oldVal) => {
  if (oldVal === null || oldVal === undefined) {
    if (newVal) {
      nameList.value.push(newVal)
    }
  }
  else {
    if (newVal !== null && newVal !== undefined) {
      const index = nameList.value.indexOf(oldVal)
      nameList.value.splice(index, 1, newVal)
    }
  }
}, { immediate: true })

onUnmounted(() => {
  const index = nameList.value.indexOf(props.name!)
  if (index !== -1) {
    nameList.value.splice(index, 1)
  }
})

const { componentRef, componentExposed } = useComponentExposed(ElTabPane, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component
    :is="h(ElTabPane, { ...$attrs, ...$props }, $slots)"
    :ref="componentRef"
    :lazy="lazy"
  />
</template>

<style lang="scss" scoped>
</style>

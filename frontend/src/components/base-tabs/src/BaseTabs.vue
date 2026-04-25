/**
 * tabs 二次封装
 * 添加 lazy 字段，可默认给 base-tab-pane 设置 lazy
 * 添加拓展函数，自动切换到第一个可用 tab
 */
<script lang="ts" setup>
import { ElTabs } from 'element-plus'
import { h } from 'vue'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { setupStore } from './context'

defineOptions({
  inheritAttrs: false,
})

/* 属性 */
const props = defineProps({
  // 懒加载，默认为 true 优化性能
  lazy: {
    type: Boolean,
    default: true,
  },
})

const attrs = useAttrs()

/* 计算是否有 onUpdate:modelValue 事件，如果没有就禁用 tab 切换 */
const hasUpdateModelValue = computed(() => !!attrs['onUpdate:modelValue'])

/* 透传属性 */
const nameList = ref<(string | number)[]>([])
setupStore(nameList, toRef(props, 'lazy'))

const { componentRef, componentExposed } = useComponentExposed(ElTabs, {
  // 自定义暴露属性
  /*
    校正值
    如果出现 tab-pane 中不存在 modelValue，调用此接口自动将其赋值为 tabs 内的第一个
  */
  validateAndSetModelValue() {
    // 如果子节点中不存在就设置为第一个
    !nameList.value.includes((attrs as any).modelValue!) && (attrs as any)['onUpdate:modelValue']?.(nameList.value?.[0])
  },
})
defineExpose(componentExposed)
</script>

<template>
  <component
    :is="h(ElTabs, { ...$attrs, ref: componentRef }, $slots)"
    :class="{ 'disable-tab-switching': !hasUpdateModelValue }"
  />
</template>

<style lang="scss" scoped>
 .disable-tab-switching :deep(.el-tabs__header) {
  // 禁止点击
  pointer-events: none;
}
</style>

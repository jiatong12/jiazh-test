/**
 * 树形选择
 * 不用远程加载（不能复显）
 */
<script lang="ts" setup>
import { ElSkeleton, ElSkeletonItem, ElTreeSelect } from 'element-plus'
import { h } from 'vue'
import { useDict } from '@/dicts/useDict'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

const dictApi = useDict(
  toRef(props, 'dict'),
  reactive({
    labelField: toRef(props, 'labelField'),
    valueField: toRef(props, 'valueField'),
    disabledField: toRef(props, 'disabledField'),
    orderField: toRef(props, 'orderField'),
    colorField: toRef(props, 'colorField'),
    ignoreDisabled: toRef(props, 'ignoreDisabled'),
    isNumber: toRef(props, 'isNumber'),

    value: toRef(props, 'modelValue'),
    onSyncItem: toRef(props, 'onSyncItem'),
  }),
)

const { componentRef, componentExposed } = useComponentExposed(ElTreeSelect, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <ElSkeleton
    animated
    :loading="dictApi.delayLoading"
    :rows="1"
    style="height:var(--el-component-size)"
  >
    <template #template>
      <ElSkeletonItem variant="rect" style="height:100%" />
    </template>
    <template #default>
      <component
        :is="h(ElTreeSelect, { ...$attrs, ref: componentRef }, $slots)"
        :data="dictApi.result"
        :model-value="props.modelValue"
        filterable
        @update:model-value="props['onUpdate:modelValue']"
      />
    </template>
  </ElSkeleton>
</template>

<style lang="scss" scoped>
</style>

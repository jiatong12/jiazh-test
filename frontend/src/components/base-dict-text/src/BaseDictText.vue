/**
 * 翻译成文本
 */
<script lang="tsx" setup>
import { ElSkeleton, ElSkeletonItem, ElText } from 'element-plus'
import { useDict } from '@/dicts/useDict'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

const dictApi = useDict(toRef(props, 'dict'),
  reactive({
    labelField: toRef(props, 'labelField'),
    valueField: toRef(props, 'valueField'),
    disabledField: toRef(props, 'disabledField'),
    orderField: toRef(props, 'orderField'),
    colorField: toRef(props, 'colorField'),
    ignoreDisabled: toRef(props, 'ignoreDisabled'),
    isNumber: toRef(props, 'isNumber'),
  }),
)
const valueData = computed(() => dictApi.result?.find(e => e.value === props.value))

const { componentRef, componentExposed } = useComponentExposed(ElText, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <div>
    <ElSkeleton
      animated
      :loading="dictApi.delayLoading"
      :rows="1"
      style="height:var(--el-component-size)"
    >
      <template #template>
        <ElSkeletonItem variant="text" style="height:100%" />
      </template>
      <template #default>
        <ElText :ref="componentRef" v-bind="$attrs">
          {{ valueData?.label ?? props.value ?? '' }}
        </ElText>
      </template>
    </ElSkeleton>
  </div>
</template>

<style lang="scss" scoped>
</style>

/**
 * 翻译成徽标
 */
<script setup lang="ts">
import { ElSkeleton, ElSkeletonItem } from 'element-plus'
import { computed, useAttrs } from 'vue'
import { BaseBadge } from '@/components/base-badge'
import { useDict } from '@/dicts/useDict'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)
const attrs = useAttrs()

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
  }),
)

const valueData = computed(() => dictApi.result?.find(e => e.value === props.value))

const { componentRef, componentExposed } = useComponentExposed(BaseBadge, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <ElSkeleton
    animated
    :loading="dictApi.delayLoading"
    :rows="1"
    style="height:1em"
  >
    <template #template>
      <ElSkeletonItem variant="rect" style="height:100%" />
    </template>
    <template #default>
      <BaseBadge
        :ref="componentRef"
        :color="valueData?.color"
        :flicker="props.flicker"
        :on-click="props.onClick"
        v-bind="attrs"
      >
        {{ valueData?.label ?? props.value }}
      </BaseBadge>
    </template>
  </ElSkeleton>
</template>

<style lang="scss" scoped>
</style>

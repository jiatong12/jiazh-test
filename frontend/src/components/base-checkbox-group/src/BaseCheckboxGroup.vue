/**
 * 多选
 */
<script setup lang="ts">
import { ElCheckbox, ElCheckboxGroup, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useAttrs } from 'vue'
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
    value: toRef(props, 'modelValue'),
    onSyncItem: toRef(props, 'onSyncItem'),
  }),
)

const { componentRef, componentExposed } = useComponentExposed(ElCheckboxGroup, {
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
      <ElSkeletonItem variant="rect" class="w-full" />
    </template>
    <template #default>
      <ElCheckboxGroup
        :ref="componentRef"
        v-bind="attrs"
        :disabled="props.disabled"
        :model-value="props.modelValue"
        @update:model-value="props['onUpdate:modelValue']"
      >
        <ElCheckbox
          v-for="e in dictApi.result"
          :key="e.value"
          :value="e.value"
          :label="e.label"
          :disabled="e.disabled"
        />
      </ElCheckboxGroup>
    </template>
  </ElSkeleton>
</template>

<style lang="scss" scoped>
</style>

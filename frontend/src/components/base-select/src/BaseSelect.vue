/** * 选择 */
<script lang="ts" setup>
import { ElOption, ElSelect, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { useDict } from '@/dicts/useDict'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './baseSelectDef'

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

const { componentRef, componentExposed } = useComponentExposed(ElSelect, {
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
      <ElSelect
        :ref="componentRef"
        filterable
        :model-value="props.modelValue"
        v-bind="$attrs"
        @update:model-value="props['onUpdate:modelValue']"
      >
        <ElOption
          v-for="e in dictApi.result"
          :key="e.value"
          :value="e.value"
          :label="e.label"
          :disabled="e.disabled"
        />
      </ElSelect>
    </template>
  </ElSkeleton>
</template>

<style lang="scss" scoped></style>

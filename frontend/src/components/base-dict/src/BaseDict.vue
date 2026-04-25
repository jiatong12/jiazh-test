/**
 * 字典，用来实现数据获取，内容展示自定义
 */
<script lang="ts" setup>
import { useDict } from '@/dicts/useDict'
import { propsDef } from './def'

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
const dictItems = computed<DictItem[] | undefined>(() => {
  const value = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  return dictApi.getDictItem(value) as any
})
</script>

<template>
  <slot :dict-api="dictApi" :dict-items="dictItems" :model-value="props.modelValue" :on-update:model-value="props['onUpdate:modelValue']" />
</template>

<style lang="scss" scoped>
</style>

/**
 * 字典翻译成标签
 */
<script setup lang="ts">
import { ElSkeleton, ElSkeletonItem, ElSpace } from 'element-plus'
import { computed, unref } from 'vue'
import { BaseTag } from '@/components/base-tag'
import { useDict } from '@/dicts/useDict'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

const typeSet = new Set(['success', 'warning', 'info', 'primary', 'danger'])

/**
 * 语义色转 ElTag type，自定义色码走 color
 * @param color 颜色
 * @returns 类型
 */
function colorToType(color: string | undefined): any {
  return (color && typeSet.has(color)) ? color : void 0
}

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

const options = computed(() => dictApi.result?.map(e => ({
  ...e,
  type: colorToType(e.color),
  tagColor: colorToType(e.color) ? void 0 : e.color,
})) ?? [])

const values = computed(() => {
  const value = props.value
  if (value === null || value === undefined) {
    return []
  }
  else {
    return Array.isArray(value) ? value : [value]
  }
})

const checkedList = computed(() => unref(options).filter(e => unref(values).includes(e.value)))
</script>

<template>
  <ElSkeleton
    animated
    :loading="dictApi.delayLoading"
    :rows="1"
    style="height:1em"
  >
    <template #template>
      <ElSkeletonItem variant="text" style="height:100%" />
    </template>
    <template #default>
      <ElSpace>
        <BaseTag
          v-for="e in checkedList"
          :key="e.value"
          :type="e.type"
          :color="e.tagColor"
          v-bind="$attrs"
        >
          {{ e.label }}
        </BaseTag>
      </ElSpace>
    </template>
  </ElSkeleton>
</template>

<style lang="scss" scoped>
</style>

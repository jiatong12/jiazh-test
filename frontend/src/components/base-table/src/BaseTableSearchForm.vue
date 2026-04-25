<!-- 表格搜索表单 -->
<script setup lang="ts">
import type { PropType } from 'vue'
import { propsDef } from './baseTableSearchFormDef'
import { setupStore } from './tableSearchFormContext'

defineOptions({
  inheritAttrs: false,
})

const modelValue = defineModel('modelValue', { type: Object as PropType<Record<string, any>>, default: () => ({} as any) })

const props = defineProps(propsDef)

const formRef = useTemplateRef('formRef')

setupStore(modelValue, formRef as any, toRef(props, 'loading'), toRef(props, 'handleSearch'))

const cols = computed(() => {
  if (!props.col && !props.cols) {
    // 默认布局
    return { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 } as const
  }

  return props.cols
})

defineExpose({
  formRef,
})
</script>

<template>
  <div class="base-table-search-form">
    <ElForm
      ref="formRef"
      class="w-full"
      :model="modelValue"
      :label-width="labelWidth"
      v-bind="$attrs"
      @submit.prevent
      @keyup.enter="handleSearch"
    >
      <BaseRow :gutter="[20, 10]" :col="col" :cols="cols">
        <slot :model="modelValue" />
      </BaseRow>
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
.base-table-search-form {
  width: 100%;

  box-sizing: border-box;
  padding: 15px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.03),
    0 1px 2px -1px rgba(0, 0, 0, 0.08);
}
</style>

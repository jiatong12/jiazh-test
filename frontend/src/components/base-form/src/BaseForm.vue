<script lang="ts" setup>
import { useLeaveGuard } from '@/hooks/useLeaveGuard'
import { propsDef } from './baseFormDef'
import { setupStore } from './context'
import { useForm } from './hooks/useForm'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)
const datasource = toRef(props, 'datasource')
const immediate = toRef(props, 'immediate')

const formRef = useTemplateRef('formRef')
const formApis = useForm({ datasource, immediate, formRef: formRef as any })
const { delayLoading, model, loading, hasChange } = formApis

setupStore(model, formRef as any, loading)

const leaveCheck = props.enabledLeaveCheck ? useLeaveGuard(() => hasChange.value).leaveCheck : () => Promise.resolve()
const isDescriptions = computed(() => props.displayMode === 'descriptions')
const formGutter = computed(() => (isDescriptions.value ? 0 : props.gutter))
// Descriptions 模式需要具体的 labelWidth
const formLabelWidth = computed(() => props.labelWidth ?? (isDescriptions.value ? undefined : 'auto'))
const labelSuffix = computed(() => isDescriptions.value ? undefined : '：')

defineExpose({
  formRef,
  validate: (...args: any) => formRef.value!.validate(...args),
  ...formApis,
  leaveCheck,
})
</script>

<template>
  <ElForm
    ref="formRef"
    v-loading="loading || delayLoading"
    class="base-form"
    :class="{
      'base-form-center': center,
      'base-form--descriptions': isDescriptions,
    }"
    :model="model"
    :label-width="formLabelWidth"
    :label-suffix="labelSuffix"
    v-bind="$attrs"
    @submit.prevent
  >
    <div v-if="$slots.header" class="base-form-header">
      <slot name="header" />
    </div>
    <BaseRow :col="col" :cols="cols" :gutter="formGutter">
      <slot :model="model" />
    </BaseRow>
    <div v-if="$slots.footer" class="base-form-footer">
      <slot name="footer" />
    </div>
  </ElForm>
</template>

<style lang="scss" scoped>
.base-form-center {
  margin-left: auto;
  margin-right: auto;
}
.base-form {
  width: v-bind(width);
}
.base-form--descriptions {
  background: var(--el-fill-color-light);
  > :deep(.el-row) {
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 1px solid var(--el-border-color-lighter);
    border-right: 1px solid var(--el-border-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
    > .el-col {
      padding: 0;
      border-right: 1px solid var(--el-border-color-lighter);
      border-bottom: 1px solid var(--el-border-color-lighter);
      box-sizing: border-box;

      .el-form-item {
        margin-bottom: 0;
        width: 100%;
        display: flex;
        align-items: stretch;
        box-sizing: border-box;
      }
      .el-form-item__label-wrap {
        display: flex;
        align-items: stretch;
        height: 100%;
        align-self: stretch;
      }
      .el-form-item__label {
        color: var(--el-text-color-regular);
        font-weight: 600;
        padding: 8px 11px;
        border-right: 1px solid var(--el-border-color-lighter);
        display: flex;
        align-items: center;
        margin-right: 0;
        height: 100%;
      }
      .el-form-item__content {
        color: var(--el-text-color-primary);
        padding: 8px 11px;
        display: flex;
        align-items: center;
        flex: 1 1 auto;
        min-width: 0;
        margin-left: 0;
        background: var(--el-bg-color);
      }
    }
  }
}
.base-form-header {
  margin-bottom: 10px;
}
.base-form-footer {
  text-align: right;
}
</style>

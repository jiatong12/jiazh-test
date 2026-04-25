<script lang="ts" setup>
import type { WidgetConfig } from '../types'
import { get, set } from 'lodash-es'
import { propsDef } from '../baseFormItemDef'
import { useStore } from '../context'
import { useFormWidget } from '../hooks/use-form-widgets'
import { useFormItemVerify } from '../hooks/useFormItemVerify'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

const { model, formRef, loading } = useStore()
const { getRules } = useFormItemVerify(props)

const modelValue = computed(() => {
  const key = props.prop as string
  if (!key) {
    return null
  }
  return get(model.value, key)
})

function setModelValue(val) {
  const key = props.prop as string
  if (!key) {
    return
  }
  set(model.value, key, val)
}

// 数据变化清空数据
watch(
  () => props.watchClear, () => {
  // 加载状态时，不触发监听
    if (loading.value) {
      return
    }
    // nextTick 避免设置默认值时覆盖了
    nextTick(() => {
      setModelValue(null)
      setTimeout(() => {
      // 不触发校验
        formRef.value.clearValidate(props.prop)
      })
    })
  },
  { deep: true },
)

// 数据变化，触发表单校验
watch(
  () => props.watchValidate, () => {
  // 加载状态时，不触发监听
    if (loading.value) {
      return
    }

    formRef.value.validateField(props.prop)
  },
  { deep: true },
)

const { getWidget, getReadonlyWidget } = useFormWidget()

const config = computed<WidgetConfig>(() => {
  return {
    dict: props.dict,
    modelValue: modelValue.value,
    setModelValue,

    widget: props.widget,
    widgetProps: props.widgetProps,
    isReadonly: props.isReadonly,
    // readonlyWidget: props.readonlyWidget,
    // readonlyWidgetProps: props.readonlyWidgetProps,
    readonlyEmpty: props.readonlyEmpty,
  }
})

function WidgetRender() {
  if (props.isReadonly) {
    return getReadonlyWidget(config.value)
  }
  else {
    return getWidget(config.value)
  }
}

// const rules = computed(() => {
//   if (!props.required) {
//     return props.rules as any
//   }
//   return [...(Array.isArray(props.rules) ? props.rules : (props.rules ? [props.rules] : [])), { required: true, message: '不能为空', trigger: ['blur', 'change'] }]
// })
</script>

<template>
  <ElFormItem :label="label" :prop="prop" :rules="getRules" :required="required" v-bind="$attrs">
    <template #label="{ label }">
      <slot name="label" :label="label">
        {{ props.label ? label : '' }}
      </slot>
      <BaseHelp v-if="help">
        {{ help }}
      </BaseHelp>
    </template>
    <slot :model-value="modelValue" :on-update:model-value="setModelValue">
      <WidgetRender />
    </slot>
  </ElFormItem>
</template>

<style lang="scss" scoped>

</style>

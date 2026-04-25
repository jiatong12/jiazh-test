<script lang="ts" setup>
import type { WidgetConfig } from '../types/search.types'
import { get, set } from 'lodash-es'
import { propsDef } from '../baseTableSearchFormItemDef'
import { useSearchFormWidget } from '../hooks/useSearchFormWidget'
import { useStore } from '../tableSearchFormContext'

const props = defineProps(propsDef)

const { modal, formRef, loading, handleSearch } = useStore()

const attrs = useAttrs()
const prop = toRef(attrs, 'prop') as Ref<string | undefined>

const modelValue = computed(() => {
  const key = prop.value as string
  if (!key) {
    return null
  }

  if (key.includes(',')) {
    const result = key.split(',').filter(Boolean).map(k => get(modal.value, k))
    /* 如果集合内有非空的值就保留结构，如果全是空就返回 null */
    const isEmpty = !result?.some(e => e !== null && e !== void 0)
    return isEmpty ? null : result
  }
  else {
    return get(modal.value, key)
  }
})

function setModelValue(val) {
  const key = prop.value as string
  if (!key) {
    return
  }

  if (key.includes(',')) {
    return key.split(',').filter(Boolean).map((k, i) => set(modal.value, k, val?.[i] ?? null))
  }
  else {
    set(modal.value, key, val)
  }
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
        formRef.value.clearValidate(prop.value)
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

    formRef.value.validateField(prop.value)
  },
  { deep: true },
)

const { getWidget } = useSearchFormWidget()

const config = computed<WidgetConfig>(() => {
  return {
    dict: props.dict,
    modelValue: modelValue.value,
    setModelValue,

    widget: props.widget,
    widgetProps: props.widgetProps,
    handleSearch: handleSearch.value,
  }
})

function WidgetRender() {
  return getWidget(config.value)
}
</script>

<template>
  <ElFormItem>
    <template #label>
      <slot name="label">
        {{ $attrs.label }}
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
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item__content > * {
  width: 100%;
}

// 去除时间选择器上下 padding
.el-range-editor.el-input__wrapper {
  padding: 0 10px;
}
</style>

<script setup lang="ts">
import { formContextKey, formItemContextKey } from 'element-plus'
import { useDict } from '@/dicts/useDict'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const props = defineProps(propsDef)

const formContext = inject(formContextKey, void 0)
const formItemContext = inject(formItemContextKey, void 0)
const mergedDisabled = computed(() => props.disabled || !!formContext?.disabled)

function triggerFormValidate() {
  if (formItemContext?.prop) {
    formContext?.validateField([formItemContext.prop as string])
  }
}

const value = computed({
  get() {
    return props.modelValue ?? void 0
  },
  set(newVal) {
    props['onUpdate:modelValue']?.(newVal)
    props.onChange?.(newVal)
    triggerFormValidate()
  },
})

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

const itemAll = computed(() => {
  return { label: '全部', value: void 0, disabled: mergedDisabled.value || props.readonly }
})

const _options = computed(() => {
  return dictApi.result ?? []
})

const options = computed(() => {
  if (props.showAll) {
    return [itemAll.value, ..._options.value]
  }
  else {
    return _options.value
  }
})

/**
 * @description 选择筛选项
 * @return void
 */
function select(data: any) {
  if (mergedDisabled.value || props.readonly || data.disabled) {
    return
  }

  const val = data.value
  let modelValue = value.value
  if (!props.multiple) {
    // * 单选
    const nextValue = modelValue === val ? void 0 : val
    if (Object.is(modelValue, nextValue)) {
      // 数据无改变
      return
    }
    modelValue = nextValue
  }
  else {
    // * 多选
    // 是否点击的是全选
    const isAll = props.showAll && val === void 0
    if (isAll) {
      // 只能选中，无法进行取消
      modelValue = val
    }
    else {
      if (Array.isArray(modelValue)) {
        const nextValue = [...modelValue]
        // 现在是否是选中操作
        const index = nextValue.indexOf(val)
        const checked = index === -1
        if (checked) {
          nextValue.push(val)
        }
        else {
          nextValue.splice(index, 1)
        }
        modelValue = nextValue.length ? nextValue : void 0
      }
      else {
        modelValue = [val]
      }
    }
  }

  value.value = modelValue
}

const isChecked = computed(() => {
  const modalValue = value.value
  if (props.multiple) {
    // 处理 "全部" 选项的特殊逻辑
    if (Array.isArray(modalValue)) {
      return item => modalValue?.includes(item.value)
    }
    else if (modalValue === null || modalValue === void 0) {
      return item => item.value === void 0
    }
    else {
      // 非数组非空的其他类型
      return () => false
    }
  }

  // 单选模式
  return item => modalValue === item.value
})
</script>

<template>
  <div class="base-select-tag" v-bind="attrs">
    <ElSkeleton animated :loading="dictApi.delayLoading || props.loading" :rows="1" style="height:var(--el-component-size)">
      <template #template>
        <ElSkeletonItem variant="rect" class="w-full" />
      </template>
      <span v-if="!_options.length" class="select-filter-notData">无可选数据 ~</span>
      <ElSpace v-else wrap>
        <ElCheckTag
          v-for="item in options"
          :key="item.value"
          :type="props.type"
          :disabled="mergedDisabled || props.readonly || item.disabled"
          :checked="isChecked(item)"
          @click="select(item)"
        >
          <slot :row="item">
            <span>{{ item.label }}</span>
          </slot>
        </ElCheckTag>
      </ElSpace>
    </ElSkeleton>
  </div>
</template>

<style scoped lang="scss">
@import url('./index.scss');
</style>

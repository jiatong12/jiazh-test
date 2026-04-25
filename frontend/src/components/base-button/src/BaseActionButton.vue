/**
 * 操作按钮
 */
<script lang="ts" setup>
import { h } from 'vue'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import BasePrimaryButton from './BasePrimaryButton.vue'
import { actionPropsDef } from './def'
import { useAction } from './hooks/use-action'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(actionPropsDef)

const actionConfig = useAction({
  api: toRef(props, 'api'),
  validate: toRef(props, 'validate'),
  actionName: toRef(props, 'actionName'),
})

const { componentRef, componentExposed } = useComponentExposed(BasePrimaryButton, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <component
    :is="h(BasePrimaryButton, {}, $slots)"
    :ref="componentRef"
    v-bind="{ ...$attrs, ...$props }"
    :loading="actionConfig.loading"
    @click="actionConfig.onClick"
  >
    <slot>
      {{ actionConfig.actionName }}
    </slot>
  </component>
</template>

<style lang="scss" scoped>
</style>

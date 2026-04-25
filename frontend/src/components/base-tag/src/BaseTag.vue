<!-- 统一标签封装，兼容语义色与自定义色的按钮式展示。 -->
<script setup lang="ts">
import type { ModeType } from '@/components/commonDef'
import { ElTag } from 'element-plus'
import { computed } from 'vue'
import { modeType } from '@/components/commonDef'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { hexToRgba, normalizeHexColor } from '@/utils/color'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(propsDef)

const semanticTypeSet = new Set(modeType)

const semanticType = computed<ModeType | undefined>(() => {
  if (props.type) {
    return props.type as ModeType
  }
  if (props.color && semanticTypeSet.has(props.color as ModeType)) {
    return props.color as ModeType
  }
  return void 0
})

const customColor = computed(() => {
  if (!props.color || semanticTypeSet.has(props.color as ModeType)) {
    return null
  }
  return props.color.trim()
})

const normalizedCustomColor = computed(() => {
  return customColor.value ? normalizeHexColor(customColor.value) : null
})

const customStyle = computed(() => {
  if (!customColor.value) {
    return void 0
  }

  if (normalizedCustomColor.value) {
    return {
      '--base-tag-text-color': normalizedCustomColor.value,
      '--base-tag-border-color': hexToRgba(normalizedCustomColor.value, 0.32).rgba,
      '--base-tag-bg-color': hexToRgba(normalizedCustomColor.value, 0.10).rgba,
    }
  }

  return {
    '--base-tag-text-color': customColor.value,
    '--base-tag-border-color': `color-mix(in srgb, ${customColor.value} 32%, transparent)`,
    '--base-tag-bg-color': `color-mix(in srgb, ${customColor.value} 10%, transparent)`,
  }
})

const { componentRef, componentExposed } = useComponentExposed(ElTag, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <ElTag
    :ref="componentRef"
    class="base-tag"
    :class="{ 'is-custom-color': !!customColor }"
    :type="semanticType"
    :effect="customColor ? 'plain' : props.effect"
    :style="customStyle"
    v-bind="$attrs"
    @click="props.onClick"
  >
    <slot />
  </ElTag>
</template>

<style scoped lang="scss">
.base-tag {
  &.is-custom-color {
    --el-tag-text-color: var(--base-tag-text-color);
    --el-tag-border-color: var(--base-tag-border-color);
    --el-tag-bg-color: var(--base-tag-bg-color);
  }
}
</style>

<!-- 徽标 -->
<script lang="ts" setup>
import { BaseFlicker } from '@/components/base-flicker'

interface Props {
  width?: string // 可选 string 宽
  height?: string // 可选 string 高
  radius?: number | string // 可选 number | string 传0为方形、传50%或者不传为圆形
  color?: string // 可选 string 闪烁颜色
  flicker?: boolean
  onClick?: (...args) => any
}
const props = withDefaults(defineProps<Props>(), {
  flicker: false,
})

const scale = computed(() => props.flicker ? void 0 : 0)
</script>

<template>
  <span class="base-badge" @click="onClick">
    <BaseFlicker v-bind="props" :scale="scale" class="base-badge-spacing" />
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.base-badge {
  // 可以根据需要添加样式
}

.base-badge-spacing {
  margin-left: 0.375em;
  margin-right: 0.375em;
}
</style>

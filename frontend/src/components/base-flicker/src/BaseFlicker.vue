<!-- 圆点、方形闪烁 -->
<script setup lang="ts">
import type { Props } from './types'
import { useRenderFlicker } from './hooks/useRenderFlicker'

const props = defineProps<Props>()
</script>

<template>
  <component :is="useRenderFlicker(props)" />
</template>

<script setup lang='ts'>
import { useRenderIcon } from '@/hooks/useRenderIcon'

interface Props {
  name: string
}
const props = withDefaults(defineProps<Props>(), {})
function Render() {
  return useRenderIcon(props.name)
}
</script>

<template>
  <Render />
</template>

<style lang='scss' scoped>
</style>

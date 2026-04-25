<!-- 💥 这里是一次性加载 LayoutComponents -->
<script setup lang="ts">
import type { Component } from 'vue'
import type { LayoutType } from '@/store/modules/global'
import { computed } from 'vue'
import { useGlobalStore } from '@/store/modules/global'
import ThemeDrawer from './components/theme-drawer/index.vue'
import LayoutClassic from './layout-classic/index.vue'
import LayoutColumns from './layout-columns/index.vue'
import LayoutTransverse from './layout-transverse/index.vue'
import LayoutVertical from './layout-vertical/index.vue'

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns,
}

const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)
</script>

<template>
  <component :is="LayoutComponents[layout]" v-if="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}

:deep(.el-scrollbar__bar.is-vertical) {
  // display: none !important;
}
</style>

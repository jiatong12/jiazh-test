<!-- 💥 这里是异步加载 LayoutComponents -->
<script setup lang="ts">
import type { Component } from 'vue'
import type { LayoutType } from '@/store/modules/global'
import { computed, defineAsyncComponent } from 'vue'
import { BaseLoading } from '@/components/base-loading'
import { useGlobalStore } from '@/store/modules/global'
import ThemeDrawer from './components/theme-drawer/index.vue'

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: defineAsyncComponent(() => import('./layout-vertical/index.vue')),
  classic: defineAsyncComponent(() => import('./layout-classic/index.vue')),
  transverse: defineAsyncComponent(() => import('./layout-transverse/index.vue')),
  columns: defineAsyncComponent(() => import('./layout-columns/index.vue')),
}

const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)
</script>

<template>
  <Suspense>
    <template #default>
      <component :is="LayoutComponents[layout]" />
    </template>
    <template #fallback>
      <BaseLoading />
    </template>
  </Suspense>
  <ThemeDrawer />
</template>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>

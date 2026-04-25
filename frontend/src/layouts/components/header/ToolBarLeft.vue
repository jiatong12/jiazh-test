<script setup lang="ts">
import { useGlobalStore } from '@/store/modules/global'
import Breadcrumb from './components/breadcrumb.vue'
import CollapseIcon from './components/CollapseIcon.vue'
import Favorites from './components/favorites.vue'
import Refresh from './components/refresh.vue'

const globalStore = useGlobalStore()
</script>

<template>
  <div class="tool-bar-lf">
    <CollapseIcon id="collapseIcon" />
    <Refresh id="refresh" />
    <Favorites id="favorites" />
    <Breadcrumb v-show="globalStore.breadcrumb" id="breadcrumb" />
  </div>
</template>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  color: var(--el-header-text-color);
}
</style>

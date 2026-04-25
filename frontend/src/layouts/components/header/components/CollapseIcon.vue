<script setup lang="tsx">
import { useGlobalStore } from '@/store/modules/global'

const globalStore = useGlobalStore()
const changeCollapse = () => globalStore.isCollapse = !globalStore.isCollapse
</script>

<template>
  <ElIcon class="collapse-icon" @click="changeCollapse">
    <component :is="$$renderIcon(globalStore.isCollapse ? 'i-ep:expand' : 'i-ep:fold')" />
  </ElIcon>
</template>

<style scoped lang="scss">
.collapse-icon {
  // margin-right: 20px;
  width: 46px;
  height: 100%;
  font-size: 20px;
  color: var(--el-header-text-color);
  cursor: pointer;
}
</style>

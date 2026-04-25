<script setup lang="ts">
import mittBus from '@/utils/mittBus'

function openDrawer() {
  mittBus.emit('openThemeDrawer')
}
</script>

<template>
  <div class="theme-setting">
    <BaseIcon name="i-lucide:settings" class="iconfont" @click="openDrawer" />
  </div>
</template>

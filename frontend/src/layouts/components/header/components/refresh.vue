<script setup lang="ts">
import { useTabsStore } from '@/store/modules/tabs'

const tabsStore = useTabsStore()
// refresh current page
// 刷新 loading，这里是用的 setTimeout 固定时间，用来实现刷新 loading动画
const isRefreshLoading = ref(false)
let timeoutKey: number
function refresh() {
  tabsStore.refreshCurrentPage()
  isRefreshLoading.value = true
  window.clearTimeout(timeoutKey)
  timeoutKey = window.setTimeout(() => {
    window.clearTimeout(timeoutKey)
    isRefreshLoading.value = false
  }, 500)
}
</script>

<template>
  <ElIcon class="refresh refresh-in-animation">
    <BaseIcon :class="{ 'refresh-loading': isRefreshLoading }" name="i-ri:refresh-line" @click="refresh" />
  </ElIcon>
</template>

<style scoped lang="scss">
@keyframes refresh-animation {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.refresh {
  display: block;
  width: 46px;
  height: 100%;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
}

// 刷新出现时动画
.refresh-in-animation {
  animation: refresh-animation 0.2s infinite;
  animation-iteration-count: 1;
}

// 刷新加载动画
.refresh-loading {
  animation: spin 1s linear infinite;
}
</style>

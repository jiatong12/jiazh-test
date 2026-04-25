<script setup lang="ts">
import screenfull from 'screenfull'
import { useGlobalStore } from '@/store/modules/global'

const props = withDefaults(defineProps<{
  elementRef?: HTMLElement
}>(), {
  elementRef: () => window.document.body,
})

const globalStore = useGlobalStore()

const isFullscreen = ref(globalStore.isFullscreen)

const FULL_SCREEN = 'base-full-screen'

watch(() => globalStore.isFullscreen, (val) => {
  nextTick(() => {
    if (!val) {
      if (isFullscreen.value) {
        handleElementFullScreen()
      }
      isFullscreen.value = false
    }
  })
})

/** 是否全屏状态 */
/** 保存原始的 overflow 样式，用于退出全屏时恢复 */
const originalOverflow = ref('')

// const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

/**
 * 切换全屏状态
 * 进入全屏时会隐藏页面滚动条，退出时恢复原状态
 */
function handleElementFullScreen() {
  // 全屏元素，不管系统全屏操作成功还是失败
  const el = props.elementRef
  if (!el) { return }

  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    // 进入全屏：保存原始样式并隐藏滚动条
    originalOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    el.classList.add(FULL_SCREEN)
    globalStore.isFullscreen = true
  }
  else {
    // 退出全屏：恢复原始样式
    document.body.style.overflow = originalOverflow.value
    el.classList.remove(FULL_SCREEN)
    globalStore.isFullscreen = false
  }
}

/**
 * 切换全屏状态
 * 进入全屏时会隐藏页面滚动条，退出时恢复原状态
 */
function handleFullScreen() {
  // 为了避免全屏时元素弹框元素不展示，这里只全屏 body
  screenfull.toggle().finally(() => {
    handleElementFullScreen()
  })
}

/** 组件卸载时清理资源 */
onUnmounted(() => {
  // 如果组件在全屏状态下被卸载，恢复页面滚动状态
  if (isFullscreen.value) {
    document.body.style.overflow = originalOverflow.value
    const el = props.elementRef
    if (el) {
      el.classList.remove(FULL_SCREEN)
    }
  }
})

defineExpose({ handleFullScreen })
</script>

<!-- todo: 'mingcute:fullscreen-line',
exit: 'mingcute:fullscreen-exit-line', -->

<!-- 'lucide:shrink' : 'lucide:expand'"  -->
<template>
  <BaseIcon :name="globalStore.isFullscreen ? 'i-lucide:minimize' : 'i-lucide:maximize'" class="iconfont" @click.stop="handleFullScreen" />
</template>

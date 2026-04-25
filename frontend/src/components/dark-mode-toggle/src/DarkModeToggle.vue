<script setup lang="tsx">
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/store/modules/global'

const globalStore = useGlobalStore()

const { toggleDarkMode } = useTheme()

/**
 * 主题切换动画
 * @param e 鼠标点击事件
 */
function themeAnimation(e: any) {
  const x = e.clientX
  const y = e.clientY
  // 计算鼠标点击位置距离视窗的最大圆半径
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  // 设置CSS变量
  document.documentElement.style.setProperty('--x', `${x}px`)
  document.documentElement.style.setProperty('--y', `${y}px`)
  document.documentElement.style.setProperty('--r', `${endRadius}px`)

  if (document.startViewTransition) {
    document.startViewTransition(() => toggleDarkMode())
  }
  else {
    toggleDarkMode()
  }
}
</script>

<template>
  <div class="dark-mode-toggle">
    <BaseIcon :name="globalStore.isDark ? 'i-line-md:sunny-outline-to-moon-loop-transition' : 'i-line-md:moon-alt-to-sunny-outline-loop-transition'" @click="themeAnimation" />
  </div>
</template>

<style lang="scss">
// 定义基础变量
$bg-animation-color-light: #000;
$bg-animation-color-dark: #fff;
$bg-animation-duration: 0.5s;

html {
  --bg-animation-color: $bg-animation-color-light;

  &.dark {
    --bg-animation-color: $bg-animation-color-dark;
  }

  // View transition styles
  &::view-transition-old(*) {
    animation: none;
  }

  &::view-transition-new(*) {
    animation: clip $bg-animation-duration ease-in both;
  }

  &::view-transition-old(root) {
    z-index: 1;
  }

  &::view-transition-new(root) {
    z-index: 9999;
  }

  &.dark {
    &::view-transition-old(*) {
      animation: clip $bg-animation-duration ease-in reverse both;
    }

    &::view-transition-new(*) {
      animation: none;
    }

    &::view-transition-old(root) {
      z-index: 9999;
    }

    &::view-transition-new(root) {
      z-index: 1;
    }
  }
}

// 定义动画
@keyframes clip {
  from {
    clip-path: circle(0% at var(--x) var(--y));
  }

  to {
    clip-path: circle(var(--r) at var(--x) var(--y));
  }
}

// body 相关样式
body {
  background-color: var(--bg-animation-color);
}
</style>

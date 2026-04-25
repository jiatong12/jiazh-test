<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BaseQrCode } from '@/components/base-qrcode'
import { useGlobalStore } from '@/store/modules/global'
import { getCssVar } from '@/utils/color'
import { useStore } from '../context'
import Motion from '../utils/motion'

const { swatchLogin } = useStore()
const globalStore = useGlobalStore()
const { primary, isDark } = storeToRefs(globalStore)

const qrData = '模拟测试'
const qrSize = 224

const themeColors = computed(() => {
  // 依赖主题状态，确保主题切换时自动重算二维码配色
  void primary.value
  void isDark.value

  const primaryColor = getCssVar('--el-color-primary').trim()
  const lightColor = getCssVar('--el-color-primary-light-3').trim()

  return {
    primary: primaryColor,
    primaryLight: lightColor,
  }
})

const centerLogoSvgDataUrl = computed(() => {
  const { primary: primaryColor, primaryLight } = themeColors.value

  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="loginQrGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${primaryLight}"/>
      <stop offset="1" stop-color="${primaryColor}"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="white"/>
  <circle cx="60" cy="60" r="44" fill="url(#loginQrGrad)"/>
  <text
    x="60"
    y="60"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="white"
    font-size="30"
    font-family="Segoe UI, PingFang SC, sans-serif"
    font-weight="700"
  >
    ZV
  </text>
</svg>
`)}`
})

const qrHostStyle = computed(() => {
  const { primary, primaryLight } = themeColors.value
  return {
    '--qr-primary': primary,
    '--qr-primary-light': primaryLight,
  }
})
</script>

<template>
  <div>
    <Motion class="mb-10 mt-2">
      <div class="qrcode-wrap">
        <div class="qrcode-host" :style="qrHostStyle">
          <BaseQrCode
            :value="qrData"
            :size="qrSize"
            preset="login"
            theme-aware
            :logo="{
              src: centerLogoSvgDataUrl,
              size: 0.22,
              margin: 6,
              saveAsBlob: false,
              crossOrigin: 'anonymous',
            }"
          />
        </div>
      </div>
    </Motion>
    <Motion :delay="100">
      <ElDivider>
        <div class="divider">
          扫码后点击“确认”，即可完成登录
        </div>
      </ElDivider>
    </Motion>
    <Motion :delay="150">
      <BaseButton class="mt-4 w-full" @click="swatchLogin()">
        返回
      </BaseButton>
    </Motion>
  </div>
</template>

<style lang="scss" scoped>
.qrcode-wrap {
  display: flex;
  justify-content: center;
}

.qrcode-host {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border: 1px solid color-mix(in oklab, var(--qr-primary-light) 65%, white);
  border-radius: 18px;
  background:
    radial-gradient(circle at 24% 16%, rgb(255 255 255 / 88%), transparent 56%),
    linear-gradient(145deg, var(--el-bg-color) 0%, color-mix(in oklab, var(--qr-primary-light) 28%, white) 100%);
  box-shadow:
    0 8px 28px -10px color-mix(in oklab, var(--qr-primary) 45%, transparent),
    0 14px 32px -16px rgb(0 0 0 / 16%);
  transition: all 0.3s ease;
  animation: qr-float 4s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    z-index: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(
      120deg,
      color-mix(in oklab, var(--qr-primary-light) 68%, white) 0%,
      color-mix(in oklab, var(--qr-primary) 56%, white) 50%,
      color-mix(in oklab, var(--qr-primary-light) 68%, white) 100%
    );
    opacity: 0.24;
  }

  &:hover {
    border-color: color-mix(in oklab, var(--qr-primary) 45%, white);
    box-shadow:
      0 12px 34px -10px color-mix(in oklab, var(--qr-primary) 58%, transparent),
      0 16px 36px -14px rgb(0 0 0 / 18%);
    transform: translateY(-2px);
  }

  :deep(svg),
  :deep(canvas) {
    position: relative;
    z-index: 1;
    display: block;
    border-radius: 14px;
    box-shadow: 0 8px 18px -14px rgb(0 0 0 / 20%);
  }
}

.divider {
  font-size: 12px;
  color: var(--zv-text-color-secondary);
}

@keyframes qr-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }
}
</style>

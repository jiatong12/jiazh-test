<script setup lang="ts">
// 保留 public 目录资源可替换的前提下，使用运行时内联让 SVG 继续支持 currentColor / CSS 变量着色。
const svgCache = new Map<string, string>()
const svgRequestCache = new Map<string, Promise<string>>()

const props = defineProps<{
  src: string
  alt?: string
  showPlaceholder?: boolean
}>()

const svgContent = ref('')
const loadFailed = ref(false)
const isLoaded = ref(false)

// src 变化时用 token 丢弃过期响应，避免慢请求覆盖新图。
let currentLoadToken = 0

async function loadSvgContent(src: string) {
  if (svgCache.has(src)) {
    return svgCache.get(src)!
  }

  const pendingRequest = svgRequestCache.get(src)

  if (pendingRequest) {
    return pendingRequest
  }

  // 同一资源的并发请求复用同一个 Promise，避免重复拉取。
  const request = fetch(src)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const text = await response.text()
      const document = new DOMParser().parseFromString(text, 'image/svg+xml')

      // 这里只接受 SVG 内容，避免把错误资源直接注入到页面。
      if (document.documentElement.tagName.toLowerCase() !== 'svg') {
        throw new Error('Invalid SVG content')
      }

      svgCache.set(src, text)
      return text
    })
    .finally(() => {
      svgRequestCache.delete(src)
    })

  svgRequestCache.set(src, request)

  return request
}

watch(
  () => props.src,
  async (src) => {
    const loadToken = ++currentLoadToken
    svgContent.value = ''
    loadFailed.value = false
    isLoaded.value = false

    if (!src) {
      return
    }

    try {
      const content = await loadSvgContent(src)

      if (loadToken !== currentLoadToken) {
        return
      }

      svgContent.value = content
      // 等内容进 DOM 后再切换到可见态，减少首屏突兀感。
      requestAnimationFrame(() => {
        if (loadToken === currentLoadToken) {
          isLoaded.value = true
        }
      })
    }
    catch (error) {
      if (loadToken !== currentLoadToken) {
        return
      }

      loadFailed.value = true
      console.warn('InlineSvg load failed:', error)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="inline-svg"
    :class="{ 'is-loaded': isLoaded, 'is-failed': loadFailed }"
  >
    <div
      v-if="svgContent"
      class="inline-svg__content"
      v-html="svgContent"
    />
    <img v-else-if="loadFailed" class="inline-svg__fallback" :src="src" :alt="alt || ''">
    <div v-else-if="showPlaceholder !== false" class="inline-svg__placeholder" aria-hidden="true" />
  </div>
</template>

<style lang="scss" scoped>
.inline-svg {
  display: block;
  width: 100%;
  opacity: 0;
  transition: opacity 0.24s ease;
}

.inline-svg.is-loaded,
.inline-svg.is-failed {
  opacity: 1;
}

.inline-svg__content,
.inline-svg__fallback,
.inline-svg__placeholder {
  display: block;
  width: 100%;
}

.inline-svg__placeholder {
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    0 12px 32px rgba(36, 61, 109, 0.08);
}

.inline-svg__content :deep(svg),
.inline-svg__fallback {
  display: block;
  width: 100%;
  height: auto;
}
</style>

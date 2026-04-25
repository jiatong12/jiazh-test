<script setup lang="ts">
import axios from 'axios'
import { useResizeObserver } from '@vueuse/core'

const CJK_START = 0x4E00
const CJK_END = 0x9FFF
const SHIFT = 1000
const RANGE = CJK_END - CJK_START + 1

function decrypt(encrypted: string): string {
  if (!encrypted)
    return ''
  let result = ''
  for (const ch of encrypted) {
    const code = ch.codePointAt(0)!
    if (code >= CJK_START && code <= CJK_END) {
      const offset = code - CJK_START
      const shifted = (offset - SHIFT + RANGE) % RANGE
      result += String.fromCodePoint(CJK_START + shifted)
    }
    else {
      result += ch
    }
  }
  return result
}

const visible = ref(false)
const loading = ref(false)
const contentData = ref<any>(null)
const plainText = ref('')

const canvasRef = useTemplateRef('canvasRef')
const wrapRef = useTemplateRef('wrapRef')

function renderCanvas() {
  const canvas = canvasRef.value
  const wrap = wrapRef.value
  if (!canvas || !wrap || !plainText.value)
    return

  const dpr = window.devicePixelRatio || 1
  const width = wrap.clientWidth - 32 // padding
  if (width <= 0)
    return

  const ctx = canvas.getContext('2d')!
  const fontSize = 16
  const lineHeight = fontSize * 1.8
  const font = `${fontSize}px "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif`

  ctx.font = font

  // Word wrap
  const lines: string[] = []
  for (const paragraph of plainText.value.split('\n')) {
    if (paragraph === '') {
      lines.push('')
      continue
    }
    let currentLine = ''
    for (const ch of paragraph) {
      const testLine = currentLine + ch
      const metrics = ctx.measureText(testLine)
      if (metrics.width > width && currentLine) {
        lines.push(currentLine)
        currentLine = ch
      }
      else {
        currentLine = testLine
      }
    }
    if (currentLine)
      lines.push(currentLine)
  }

  const height = Math.max(lines.length * lineHeight + 32, 60)

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  ctx.font = font
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--el-text-color-primary').trim() || '#303133'
  ctx.textBaseline = 'top'

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, 16 + i * lineHeight)
  }
}

function open(id: number) {
  loading.value = true
  visible.value = true
  contentData.value = null
  plainText.value = ''

  axios.get(`/ui/cs/contents/${id}`).then(({ data }) => {
    if (data.status === 1) {
      const row = Array.isArray(data.data) ? data.data[0] : data.data
      const encrypted = row.encryptedContent || row.EncryptedContent || ''
      contentData.value = {
        title: row.title || row.Title,
        categoryName: row.categoryName || row.CategoryName,
        status: row.status ?? row.Status,
        addUser: row.addUser || row.AddUser,
        addTime: row.addTime || row.AddTime,
      }
      plainText.value = decrypt(encrypted)
      nextTick(renderCanvas)
    }
  }).finally(() => {
    loading.value = false
  })
}

function handleClose() {
  visible.value = false
  contentData.value = null
  plainText.value = ''
}

useResizeObserver(wrapRef, () => {
  renderCanvas()
})

defineExpose({ open })
</script>

<template>
  <BaseDrawer v-model="visible" title="内容详情" size="600px" @close="handleClose">
    <div v-loading="loading" class="content-detail">
      <template v-if="contentData">
        <div class="detail-header">
          <h2>{{ contentData.title }}</h2>
          <div class="detail-meta">
            <ElTag :type="contentData.status === 1 ? 'success' : 'info'" size="small">
              {{ contentData.status === 1 ? '已发布' : '草稿' }}
            </ElTag>
            <span v-if="contentData.categoryName" class="meta-item">分类：{{ contentData.categoryName }}</span>
            <span class="meta-item">{{ contentData.addUser }} · {{ contentData.addTime }}</span>
          </div>
        </div>

        <ElDivider content-position="left">内容展示</ElDivider>
        <div ref="wrapRef" class="canvas-wrap">
          <canvas ref="canvasRef" />
        </div>
      </template>
    </div>
  </BaseDrawer>
</template>

<style scoped lang="scss">
.content-detail {
  padding: 0 10px;
}

.detail-header {
  margin-bottom: 16px;

  h2 {
    margin: 0 0 8px;
    font-size: 18px;
  }
}

.detail-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.canvas-wrap {
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  overflow-x: auto;
}
</style>

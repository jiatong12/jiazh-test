<script setup lang="ts">
import axios from 'axios'

const visible = ref(false)
const loading = ref(false)
const contentData = ref<any>(null)

const FONT_LOADED_KEY = 'cs-font-loaded'

function ensureFontLoaded() {
  if (document.fonts.check('16px ObfuscatedContent')) return
  if (document.querySelector('style[data-cs-font]')) return
  const style = document.createElement('style')
  style.setAttribute('data-cs-font', 'true')
  style.textContent = `
    @font-face {
      font-family: 'ObfuscatedContent';
      src: url('/api/front/cs/font') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `
  document.head.appendChild(style)
}

function open(id: number) {
  loading.value = true
  visible.value = true
  contentData.value = null
  ensureFontLoaded()

  axios.get(`/ui/cs/contents/${id}`).then(({ data }) => {
    if (data.status === 1) {
      const row = Array.isArray(data.data) ? data.data[0] : data.data
      contentData.value = {
        title: row.title || row.Title,
        originalContent: row.originalContent || row.OriginalContent,
        encryptedContent: row.encryptedContent || row.EncryptedContent,
        categoryName: row.categoryName || row.CategoryName,
        status: row.status ?? row.Status,
        addUser: row.addUser || row.AddUser,
        addTime: row.addTime || row.AddTime,
      }
    }
  }).finally(() => {
    loading.value = false
  })
}

function handleClose() {
  visible.value = false
  contentData.value = null
}

function handleCopy(e: ClipboardEvent) {
  e.preventDefault()
  e.clipboardData?.setData('text/plain', '')
}

function handleContextMenu(e: Event) {
  e.preventDefault()
}

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

        <ElDivider content-position="left">安全展示（使用混淆字体，无法直接复制）</ElDivider>
        <div
          class="encrypted-content"
          @copy="handleCopy"
          @contextmenu="handleContextMenu"
        >
          {{ contentData.encryptedContent }}
        </div>

        <ElDivider content-position="left">原文内容（仅管理可见）</ElDivider>
        <div class="original-content">
          {{ contentData.originalContent }}
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

.encrypted-content {
  padding: 16px;
  font-family: 'ObfuscatedContent', serif;
  font-size: 16px;
  line-height: 1.8;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  white-space: pre-wrap;
  word-break: break-all;
}

.original-content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

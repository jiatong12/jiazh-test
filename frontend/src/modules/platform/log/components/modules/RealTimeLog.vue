<script setup lang="ts">
import axios from 'axios'
import { nextTick, onUnmounted, ref } from 'vue'

// 单独定义响应式变量
const textLog = ref('')
const lastID = ref(0)
const isAuto = ref(true)
const intervalId = ref<number>()

// methods
async function loadLog(isAutoParam?: boolean) {
  if (isAutoParam && !isAuto.value) {
    return
  }

  try {
    const res = await axios.get('/ui/logs/realtimelog', {
      params: {
        lastid: lastID.value,
      },
    })

    lastID.value = res.data.lastid
    textLog.value += res.data.log

    nextTick(() => {
      const textarea = document.getElementById('realTimeLogTextArea')
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight
      }
    })
  }
  catch (error) {
    console.error('Failed to load log:', error)
  }
}

function refreshClickHandler() {
  loadLog()
}

function autoChangeHandler() {
  if (!isAuto.value && intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = void 0
    return
  }

  getRealTimeLog()
}

function getRealTimeLog() {
  if (isAuto.value) {
    if (lastID.value === 0) {
      loadLog()
    }

    if (intervalId.value) {
      clearInterval(intervalId.value)
    }

    intervalId.value = setInterval(() => {
      loadLog(true)
    }, 2000)
  }
  else {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = void 0
    }
    loadLog()
  }
}

// 清理定时器
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})

// 初始化
getRealTimeLog()
</script>

<template>
  <div class="real-time-log-container">
    <div class="real-time-log-header">
      <ElCheckbox v-model="isAuto" class="auto-refresh-checkbox" @change="autoChangeHandler">
        自动刷新
      </ElCheckbox>
      <BaseButton class="refresh-button" @click="refreshClickHandler">
        <BaseIcon name="i-ant-design:reload-outlined" />
        刷新
      </BaseButton>
    </div>

    <div class="real-time-log-content">
      <textarea
        id="realTimeLogTextArea"
        v-model="textLog"
        class="log-textarea"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.real-time-log-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.real-time-log-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
}

.auto-refresh-checkbox {
  margin-right: 10px;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.real-time-log-content {
  flex: 1;
  overflow: hidden;
}

.log-textarea {
  height: 100%;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  color: var(--menu-item-color);
  border: 1px solid var(--el-border-color);
  font-family: monospace;
  resize: none;
  box-sizing: border-box;
}
</style>

<script setup lang="ts">
import axios from 'axios'
import { onUnmounted, reactive, toRefs } from 'vue'
import util from '@/utils/util'

// 定义 props
interface Props {
  modelValue?: boolean
  taskID?: number | string
  title?: string
  successMessage?: string
  callback?: (flag: boolean, message?: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  taskID: 0,
  title: '任务正在进行中...',
  successMessage: '',
  callback: () => {},
})

// 定义 emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// 定义数据状态
const dataState = reactive({
  progressPercent: 0,
  progressCurrentInfo: '任务正在进行中...',
  intervalId: void 0 as number | undefined,
})

const { progressPercent, progressCurrentInfo } = toRefs(dataState)

// 方法定义
function dialogOpen() {
  // 重置状态
  dataState.progressPercent = 0
  dataState.progressCurrentInfo = '任务正在进行中...'

  // 清除可能存在的旧定时器
  if (dataState.intervalId) {
    clearInterval(dataState.intervalId)
  }

  // 创建新的轮询定时器
  dataState.intervalId = window.setInterval(async () => {
    try {
      if (!props.taskID) {
        console.warn('Task ID is not provided')
        return
      }

      const progress = await axios.get(`/ui/framework/longtimetasks/${props.taskID}`, { showDefaultError: false })
      const data = progress.data.data

      if (data.errorFlag) {
        // 处理错误情况
        emit('update:modelValue', false)
        clearInterval(dataState.intervalId)
        dataState.intervalId = void 0

        const errorMessage = data.currentInfo || data.errors
        ElMessageBox({
          title: '提示',
          type: 'error',
          message: errorMessage.toString(),
          dangerouslyUseHTMLString: true,
        })
        props.callback(false, errorMessage)
      }
      else if (data.completeFlag) {
        // 处理完成情况
        dataState.progressPercent = 100
        emit('update:modelValue', false)
        clearInterval(dataState.intervalId)
        dataState.intervalId = void 0

        const successMessage = props.successMessage || data.currentInfo
        ElMessage({
          message: successMessage,
          showClose: true,
          type: 'success',
          duration: 2000,
        })
        props.callback(true, successMessage)
      }
      else {
        // 更新进度
        dataState.progressPercent = data.percent
        dataState.progressCurrentInfo = data.currentInfo
      }
    }
    catch (error) {
      console.error('获取任务进度失败:', error)
      emit('update:modelValue', false)
      clearInterval(dataState.intervalId)
      dataState.intervalId = void 0

      const errorMessage = '获取任务进度失败'
      util.showMessage(errorMessage)

      props.callback(false, errorMessage)
    }
  }, 1000)
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (dataState.intervalId) {
    clearInterval(dataState.intervalId)
    dataState.intervalId = void 0
  }
})

// 处理对话框关闭
function handleClose() {
  emit('update:modelValue', false)
  if (dataState.intervalId) {
    clearInterval(dataState.intervalId)
    dataState.intervalId = void 0
  }
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :title="title"
    class="progress-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="dialogOpen"
    @close="handleClose"
  >
    <div class="progress-content">
      <div class="progress-info">
        {{ progressCurrentInfo }}
      </div>
      <div class="progress-bar">
        <ElProgress
          :text-inside="true"
          :stroke-width="18"
          :percentage="progressPercent"
          status="success"
        />
      </div>
    </div>
  </ElDialog>
</template>

<style scoped>
.progress-dialog .el-dialog {
  width: 550px;
}

.progress-content {
  padding: 20px 0;
}

.progress-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.progress-bar {
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  .progress-dialog .el-dialog {
    width: 90%;
  }
}
</style>

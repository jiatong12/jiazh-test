<script setup lang="ts">
import { useIdle } from '@vueuse/core'
import axios from 'axios'
import { ref } from 'vue'
import util from '@/utils/util'
import MessageDrawer from './components/MessageDrawer.vue'

const MessageRef = useTemplateRef('MessageRef')

// 请求后端接口间隔 开发环境 120秒 生产环境 20秒
const requestInterval = import.meta.env.DEV ? 120_000 : 20_000
// 用户未操作标记为空闲时间（ms）
const idleTimeout = 200_000
const { idle } = useIdle(idleTimeout)
watch(idle, (newVal) => {
  if (newVal) {
    // console.log('用户空闲')
    stop()
  }
  else {
    // console.log('用户活跃')
    start()
  }
})

const unreadCount = ref()
const unreadText = computed(() => (unreadCount.value > 99 ? '99+' : unreadCount.value) || void 0)

async function unread(quiet = false) {
  // 全局轮训次数计数器默认值为10，除当前接口请求外其他接口请求都会重置此变量
  if (idle.value) {
    return
  }

  const res = await axios.get('/ui/message/unread')
  const count = res.data.data.count
  const hasPrevious = unreadCount.value !== undefined
  const previousCount = Number(unreadCount.value || 0)
  unreadCount.value = count
  const hasNewMessage = hasPrevious && count > previousCount
  if (!quiet && hasNewMessage) {
    util.showMessage('有新的短消息', 'warning')
  }
}

let unreadTimer: number | undefined
function start() {
  stop()
  unread()
  unreadTimer = setInterval(() => {
    // 每20秒查询一次未读消息
    unread()
  }, requestInterval)
}
function stop() {
  if (unreadTimer) {
    clearInterval(unreadTimer)
    unreadTimer = void 0
  }
}

onMounted(() => {
  start()
})
onUnmounted(() => {
  stop()
})
</script>

<template>
  <div>
    <ElBadge :value="unreadText">
      <BaseIcon name="i-lucide:bell" class="bell-button iconfont" @click="MessageRef?.open()" />
    </ElBadge>
    <MessageDrawer ref="MessageRef" />
  </div>
</template>

<style scoped lang="scss">
.bell-button {
  &:hover {
    animation: bell-ring 1s both;
  }
}

@keyframes bell-ring {
  0%,
  100% {
    transform-origin: top;
  }

  15% {
    transform: rotateZ(10deg);
  }

  30% {
    transform: rotateZ(-10deg);
  }

  45% {
    transform: rotateZ(5deg);
  }

  60% {
    transform: rotateZ(-5deg);
  }

  75% {
    transform: rotateZ(2deg);
  }
}

.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}

.message-list {
  display: flex;
  flex-direction: column;

  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;

      .message-title {
        margin-bottom: 5px;
      }

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>

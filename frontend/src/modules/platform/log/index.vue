<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

import { useRequest } from '@/hooks/useRequest'
import APIAccessLog from './components/modules/APIAccessLog.vue'
import ContentOperate from './components/modules/ContentOperateLog.vue'
import CronLog from './components/modules/CronLog.vue'
import DownLog from './components/modules/DownLog.vue'
import InterfaceReqLogs from './components/modules/InterfaceReqLogs.vue'
import ModuleLog from './components/modules/ModuleLog.vue'
import PublishTask from './components/modules/PublishTaskLog.vue'
import RealTimeLog from './components/modules/RealTimeLog.vue'
import SecurityLog from './components/modules/SecurityLog.vue'
import SMSLog from './components/modules/SMSLog.vue'
import SQLLog from './components/modules/SqlLog.vue'
import TemplateLog from './components/modules/TemplateLog.vue'
import UserLog from './components/modules/UserLog.vue'
import UserLoginLog from './components/modules/UserLoginLog.vue'
import UserOperateLog from './components/modules/UserOperateLog.vue'

const defaultProps = {
  children: 'children',
  label: 'name',
}
const currentLog = ref<any>({})

const CompMap = {
  RealTimeLog,
  SQLLog,
  SecurityLog,
  CronLog,
  UserLog,
  UserLoginLog,
  DownLog,
  UserOperateLog,
  ContentOperate,
  PublishTask,
  ModuleLog,
  TemplateLog,
  APIAccessLog,
  SMSLog,
  InterfaceReqLogs,
}

// methods
function renderContent(createElement, { node, data }) {
  const className = !data.ID || data.ID === 'System' ? 'i-fa-folder' : 'i-fa-file-text-o'
  const icon = createElement('i', { class: className })
  const label = createElement('span', ` ${node.label}`)
  return createElement('span', [icon, label])
}

function handleNodeClick(data) {
  currentLog.value = !data || data.ID === 'System' ? currentLog.value : data
}

const treeRequest = useRequest(() => axios.get('/ui/logs/tree').then(r => r.data.data), () => [])
treeRequest.send().then((tree) => {
  if (tree.length > 0 && tree[0].children.length > 0) {
    currentLog.value = tree[0].children[0]
  }
})
</script>

<template>
  <ElRow v-loading="treeRequest.immediateLoading" :gutter="10" class="h-full">
    <ElCol :span="4" class="h-full">
      <ElTree
        class="card h-full overflow-y-auto"
        :data="treeRequest.result"
        :props="defaultProps"
        :current-node-key="currentLog.ID"
        node-key="ID"
        :render-content="renderContent"
        :default-expand-all="true"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      />
    </ElCol>
    <ElCol :span="20" class="h-full">
      <component :is="CompMap[currentLog.ID]" :key="currentLog.ID" class="card" />
    </ElCol>
  </ElRow>
</template>

<style lang="scss" scoped>
</style>

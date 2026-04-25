<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'ID',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showHeader: false,
  showPagination: true,
  datasource: params => axios.get('/ui/contentlogs/publishTaskLogs', { params }).then(r => r.data),
  columns: [
    { prop: 'ID', label: 'ID' },
    { prop: 'subID', label: 'SubID' },
    { prop: 'catalog', label: '栏目列表' },
    { prop: 'statusName', label: '发布任务状态' },
    { prop: 'percent', label: '百分比' },
    { prop: 'message', label: '消息' },
    { prop: 'serverAddress', label: '服务器ip' },
    { prop: 'lastTime', label: '最后更新时间', width: '160' },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable v-bind="tableConfig" />
  </div>
</template>

<style scoped lang="scss">
</style>

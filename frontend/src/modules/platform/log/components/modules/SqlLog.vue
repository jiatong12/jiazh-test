<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'

const subTypeOptions = [
  { label: '执行速度较慢的SQL', value: 'slow' },
  { label: 'SQL错误信息', value: 'error' },
  { label: 'SQL执行超时', value: 'timeout' },
]

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'logID',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  datasource: params => axios.get('/ui/logs/sqllog', { params }).then(r => r.data),
  columns: [
    { prop: 'addTime', label: '时间', width: '160' },
    { prop: 'userName', label: '用户名', width: '100' },
    { prop: 'IP', label: 'IP地址', width: '160' },
    { prop: 'costtime', label: '耗时（ms）', width: '120', align: 'center' },
    { prop: 'logMessage', label: '原始消息' },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="类型" prop="subType" widget="select" :dict="subTypeOptions" />
          <BaseTableSearchFormItem label="用户名" prop="userName" />
          <BaseTableSearchFormItem label="IP" prop="IP" />
          <BaseTableSearchFormItem label="原始消息" prop="message" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

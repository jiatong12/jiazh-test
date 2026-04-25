<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'

const subTypeOptions = [
  { label: '所有类型', value: '' },
  { label: '委托管理', value: 'entrust' },
  { label: '越权访问', value: 'privCheck' },
  { label: 'SQL注入/畸形参数', value: 'verify' },
  { label: '跨站脚本攻击', value: 'xss' },
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
  datasource: params => axios.get('/ui/logs/securitylog', { params }).then(r => r.data),
  columns: [
    { prop: 'addTime', label: '时间', width: '160' },
    { prop: 'userName', label: '用户名', width: '100' },
    { prop: 'IP', label: 'IP地址', width: '160' },
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

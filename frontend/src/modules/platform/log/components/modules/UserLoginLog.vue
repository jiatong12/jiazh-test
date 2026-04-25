<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  datasource: params => axios.get('/ui/logs/userloginlog', { params }).then(r => r.data),
  columns: [
    { prop: 'addTime', label: '时间', width: '160' },
    { prop: 'userName', label: '用户名' },
    { prop: 'IP', label: 'IP地址' },
    { prop: 'logMessage', label: '原始消息' },
    { prop: 'LogMessageName', label: '备注' },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="用户名" prop="userName" />
          <BaseTableSearchFormItem label="时间范围" prop="startTime,endTime" widget="dateTimeRange" :widget-props="{ valueFormat: 'x' }" />
          <BaseTableSearchFormItem label="IP" prop="IP" />
          <BaseTableSearchFormItem label="原始消息" prop="message" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import { useTableSetup } from '@/components/base-table'

const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showIndex: false,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 10,
  columns: [
    { prop: 'requestTime', label: '请求时间', width: '160' },
    { prop: 'name', label: '接口名称' },
    { prop: 'URL', label: '请求路径' },
    { prop: 'userName', label: '用户名' },
  ],
  datasource(params) {
    return axios.get('/ui/logs/apiaccesslog', { params }).then((r) => {
      const result = r.data
      result.data = result.data.map((e) => {
        e.requestTime = dayjs(e.requestTime).format('YYYY-MM-DD HH:mm')
        return e
      })
      return result
    })
  },
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="接口名称" prop="name" />
          <BaseTableSearchFormItem label="时间范围" prop="startTime,endTime" widget="dateTimeRange" :widget-props="{ valueFormat: 'x', defaultTime: ['00:00:00', '23:59:59'].map(d => dayjs(d, 'HH:mm:ss').toDate()) }" />
          <BaseTableSearchFormItem label="用户名" prop="userName" />
          <BaseTableSearchFormItem label="IP" prop="IP" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

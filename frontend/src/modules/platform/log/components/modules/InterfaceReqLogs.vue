<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import { useTableSetup } from '@/components/base-table'

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showIndex: false,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 10,
  datasource: (params) => {
    return axios.get('/ui/socialmedialogs/interface', { params }).then((r) => {
      const result = r.data
      result.data = result.data.map((e) => {
        e.addTime = dayjs(e.addTime).format('YYYY-MM-DD HH:mm')
        return e
      })
      return result
    })
  },
  columns: [
    { prop: 'addTime', label: '添加时间', width: '160' },
    { prop: 'mName', label: '媒体账号' },
    { prop: 'reqResultName', label: '请求结果' },
    { prop: 'reqUrl', label: '请求路径' },
    { prop: 'errorMessge', label: '错误信息' },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="请求路径" prop="reqUrl" />
          <BaseTableSearchFormItem label="错误日志" prop="query" />
          <BaseTableSearchFormItem label="时间范围" prop="startDate,endDate" widget="dateTimeRange" :widget-props="{ valueFormat: 'x', defaultTime: ['00:00:00', '23:59:59'].map(d => dayjs(d, 'HH:mm:ss').toDate()) }" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

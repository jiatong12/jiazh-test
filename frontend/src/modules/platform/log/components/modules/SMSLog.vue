<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import { useTableSetup } from '@/components/base-table'

const typeOptions = [
  { label: '成功', value: 1 },
  { label: '失败', value: 0 },
]

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 10,
  datasource: (params) => {
    return axios.get('/ui/sms/logs', { params }).then((r) => {
      const result = r.data
      result.data = result.data.map((e) => {
        e.sendTime = dayjs(e.sendTime).format('YYYY-MM-DD HH:mm')
        return e
      })
      return result
    })
  },
  columns: [
    { prop: 'sendTime', label: '发送时间', width: '140' },
    { prop: 'mobile', label: '手机号', width: '140' },
    { prop: 'state', label: '请求结果', width: '100', align: 'center', widget: 'tag', dict: [{ label: '成功', value: 1, color: 'success' }, { label: '失败', value: 0, color: 'danger' }] },
    { prop: 'content', label: '发送内容', width: '150' },
    { prop: 'message', label: '详细信息' },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="手机号" prop="mobile" />
          <BaseTableSearchFormItem label="状态" prop="type" widget="select" :dict="typeOptions" />
          <BaseTableSearchFormItem label="时间范围" prop="startDate,endDate" widget="dateTimeRange" :widget-props="{ valueFormat: 'x', defaultTime: ['00:00:00', '23:59:59'].map(d => dayjs(d, 'HH:mm:ss').toDate()) }" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
// import ContentLogDialog from '../ContentLogDialog.vue'

const catalogTrees = () => axios.get('/ui/catalog/getcontentcatalogtree').then(res => res.data.data)
const actionResultOptions = [
  { label: '成功', value: 'S' },
  { label: '失败', value: 'F' },
]

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'ID',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  datasource: params => axios.get('/ui/contentlogs/operateLogs', { params }).then(r => r.data),
  columns: [
    { prop: 'catalogName', label: '栏目' },
    { prop: 'contentTitle', label: '内容' },
    { prop: 'actionName', label: '操作类型' },
    { prop: 'actionDetail', label: '操作明细' },
    { prop: 'addUser', label: '用户名' },
    { prop: 'addTime', label: '时间', width: '160' },
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
          <BaseTableSearchFormItem label="栏目名称" prop="catalogID" widget="treeSelect" :widget-props="{ labelField: 'name', valueField: 'innerCode', checkStrictly: true }" :dict="catalogTrees" />
          <BaseTableSearchFormItem label="时间范围" prop="startTime,endTime" widget="dateTimeRange" :widget-props="{ valueFormat: 'x' }" />
          <BaseTableSearchFormItem label="内容名称或ID" prop="content" />
          <BaseTableSearchFormItem label="操作结果" prop="actionResult" widget="select" :dict="actionResultOptions" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

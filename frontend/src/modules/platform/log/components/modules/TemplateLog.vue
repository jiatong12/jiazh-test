<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'

const catalogTrees = () => axios.get('/ui/catalog/getcontentcatalogtree').then(res => res.data.data)

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  datasource: params => axios.get('/ui/contentlogs/templateLogs', { params }).then(r => r.data),
  columns: [
    { prop: 'addTime', label: '时间', width: '160' },
    { prop: 'addUser', label: '用户名' },
    { prop: 'name', label: '栏目名称' },
    { prop: 'templateType', label: '模板类型' },
    { prop: 'templateName', label: '模板名称' },
    { prop: 'actionName', label: '操作类型' },
    { prop: 'actionDetail', label: '操作明细' },
    { prop: 'actionResultName', label: '操作结果' },
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
          <BaseTableSearchFormItem label="时间范围" prop="startDate,endDate" widget="dateTimeRange" :widget-props="{ valueFormat: 'x' }" />
          <BaseTableSearchFormItem label="模板类型" prop="templateType" />
          <BaseTableSearchFormItem label="模板名称" prop="templateName" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

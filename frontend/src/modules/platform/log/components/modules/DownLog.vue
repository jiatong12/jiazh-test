<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import util from '@/utils/util'

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'fileName',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  datasource: params => axios.get('/ui/logs/downlog', { params }).then(r => r.data),
  columns: [
    { prop: 'fileName', label: '文件名' },
    { prop: 'fileSize', label: '大小' },
    { prop: 'lastModifyTime', label: '最后修改时间', width: '160' },
  ],
  rowActions: [
    {
      name: '下载',
      handle({ row }) {
        util.downloadFile(`/ui/logs/downloads?fileName=${row.fileName}&filePath=${row.filePath}`, row.fileName)
      },
    },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <!-- 表格 -->
    <BaseTable
      v-bind="tableConfig"
    >
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="文件名" prop="fileName" />
          <BaseTableSearchFormItem label="修改时间" prop="startTime,endTime" widget="dateTimeRange" :widget-props="{ valueFormat: 'x' }" />
        </BaseTableSearchForm>
      </template>

      <template #fileSize_default="{ row }">
        {{ row.fileSize }} bytes
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
</style>

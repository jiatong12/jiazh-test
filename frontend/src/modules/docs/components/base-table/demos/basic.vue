<script setup lang="ts">
import { ElInput, ElMessage } from 'element-plus'
import { useTableSetup } from '@/components/base-table'
import { getBaseTableDemoList, projectCategoryDict, projectShelfStatusDict } from './data'

const tableRef = useTemplateRef<any>('tableRef')

const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showIndex: true,
  showPagination: true,
  showHeader: true,
  pageSize: 5,
  actionsWidth: '160px',
  defaultSearchFormState: () => ({
    keyword: '',
    category: '',
    shelfStatus: '',
  }),
  datasource: params => getBaseTableDemoList(params),
  columns: [
    {
      label: '模块名称',
      prop: 'name',
      minWidth: 220,
      widget: 'link',
      widgetClick({ row }) {
        ElMessage.success(`查看 ${row.name}`)
      },
    },
    { label: '业务分类', prop: 'category', width: '120', align: 'center', widget: 'text', dict: projectCategoryDict },
    { label: '维护团队', prop: 'owner', minWidth: 180 },
    { label: '发布状态', prop: 'shelfStatus', width: '110', align: 'center', widget: 'tag', dict: projectShelfStatusDict },
    { label: '更新时间', prop: 'updatedAt', minWidth: 180, align: 'center' },
  ],
  headerActions: [
    {
      name: '新增',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        ElMessage.success('文档示例中通常在这里打开新增弹层')
        tableRef.value?.searchFirstPage()
      },
    },
  ],
  rowActions: [
    {
      name: '查看',
      handle({ row }) {
        ElMessage.success(`打开 ${row.name} 的详情`)
      },
    },
    {
      name: '编辑',
      handle({ row }) {
        ElMessage.success(`打开 ${row.name} 的编辑弹层`)
      },
    },
    {
      name: '删除',
      type: 'danger',
      confirmTitle: '确认删除该记录？',
      handle({ row }) {
        ElMessage.success(`已删除 ${row.name}`)
        tableRef.value?.search()
      },
    },
  ],
})
</script>

<template>
  <BaseTable ref="tableRef" v-bind="tableConfig">
    <template #simpleSearch="{ searchFirstPage, searchFormState }">
      <ElInput
        v-model="searchFormState.keyword"
        placeholder="请输入模块名称或维护团队"
        clearable
        :suffix-icon="$$renderIcon('i-ep:search')"
        @clear="searchFirstPage"
        @keyup.enter="searchFirstPage"
      />
    </template>

    <template #searchForm="scope">
      <BaseTableSearchForm
        v-model="scope.searchFormState"
        :handle-search="scope.searchFirstPage"
      >
        <BaseTableSearchFormItem label="业务分类" prop="category" widget="select" :dict="projectCategoryDict" />
        <BaseTableSearchFormItem label="发布状态" prop="shelfStatus" widget="select" :dict="projectShelfStatusDict" />
      </BaseTableSearchForm>
    </template>
  </BaseTable>
</template>

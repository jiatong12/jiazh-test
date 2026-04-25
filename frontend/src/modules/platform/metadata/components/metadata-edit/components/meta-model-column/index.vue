<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import MetaModelColumnForm from './components/MetaModelColumnForm.vue'

const props = defineProps<{
  modelId: number
  tabName: string
}>()

const tableRef = useTemplateRef('tableRef')
const metaModelColumnFormRef = useTemplateRef('metaModelColumnFormRef')

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'code',
  showCard: false,
  showIndex: true,
  showSelection: false,
  showSearchAction: false,
  showPagination: false,
  actionsWidth: '120px',
  datasource: () => axios.get(`/ui/metamodels/${props.modelId}/columns`).then(r => r.data.data),
  columns: [
    { prop: 'code', label: '代码', minWidth: '120' },
    { prop: 'name', label: '名称', minWidth: '120' },
    { prop: 'dataType', label: '数据类型', width: '120' },
    { prop: 'controlType', label: '控件类型', width: '120' },
    {
      prop: 'mandatoryFlag',
      label: '必填',
      width: '100',
      align: 'center',
      dict: [
        { value: 'Y', label: '是', color: 'success' },
        { value: 'N', label: '否', color: 'danger' },
      ],
    },
  ],
  headerActions: [
    {
      name: '添加字段',
      priv: 'Platform.Metadata.Save',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        metaModelColumnFormRef.value?.openAdd(props.modelId)
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: 'Platform.Metadata.Save',
      handle({ row }) {
        metaModelColumnFormRef.value?.openEdit(props.modelId, row.code)
      },
    },
    {
      name: '删除',
      priv: 'Platform.Metadata.Save',
      confirmTitle: '确定删除吗，删除后无法恢复。是否继续删除？',
      handle({ row }) {
        useHandleConfirm(
          () => axios.delete(`/ui/metamodels/${props.modelId}/columns/${row.code}`),
          '删除字段',
        ).then(() => {
          tableRef.value?.search()
        })
      },
    },
  ],
})
</script>

<template>
  <div class="flex-column-layout">
    <BaseTable ref="tableRef" v-bind="tableConfig" />
    <MetaModelColumnForm ref="metaModelColumnFormRef" @add-success="tableRef?.searchFirstPage()" @edit-success="tableRef?.search()" />
  </div>
</template>

<script setup lang="ts">
import type { TableColumnConfig, TableHeaderActionBtn, TableRowActionBtn } from '@/components/base-table'
import axios from 'axios'
import { watch } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import MetaModelDataForm from './components/MetaModelDataForm.vue'

const props = defineProps<{
  modelId: number
  tabName: string
}>()

const tableRef = useTemplateRef('tableRef')
const metaModelDataFormRef = useTemplateRef('metaModelDataFormRef')

// 监听 tabName 变化，加载数据
watch(() => props.tabName, (val) => {
  if (val === 'data') {
    tableRef.value?.search()
  }
})

// 数据源
const datasource = params => axios.get(`/ui/metamodels/${props.modelId}/datas`, { params }).then(r => r.data)

// 字段列表
const fieldsRequest = useRequest(() => axios.get(`/ui/metamodels/${props.modelId}/columns`).then(r => r.data.data), () => [])
fieldsRequest.send()

// 表格列（基础列）
const baseColumns = ref<TableColumnConfig[]>([
  { prop: 'PKValue', label: 'PK值', minWidth: '120' },
])

// 动态生成的字段列
const fieldColumns = computed(() => {
  return fieldsRequest.result.map(field => ({
    prop: `content.${field.code}`,
    label: field.name,
    minWidth: '120',
  }))
})

// 合并所有列
const columns = computed<TableColumnConfig[]>(() => {
  return [...baseColumns.value, ...fieldColumns.value]
})

// 表格头部操作按钮
const headerActions: TableHeaderActionBtn[] = [
  {
    name: '添加数据',
    priv: 'Platform.Metadata.AddData',
    icon: 'i-mdi:plus-thick',
    type: 'primary',
    handle() {
      metaModelDataFormRef.value?.openAdd(props.modelId)
    },
  },
]

// 表格行操作按钮
const rowActions: TableRowActionBtn[] = [
  {
    name: '编辑',
    priv: 'Platform.Metadata.EditData',
    handle({ row }) {
      metaModelDataFormRef.value?.openEdit(props.modelId, row.PKValue)
    },
  },
  {
    name: '删除',
    priv: 'Platform.Metadata.DeleteData',
    confirmTitle: '确定删除吗，删除后无法恢复。是否继续删除？',
    handle({ row }) {
      const id = props.modelId
      axios.delete(`/ui/metamodels/${id}/datas/${row.PKValue}`).then(() => {
        tableRef.value?.search()
      })
    },
  },
]
</script>

<template>
  <div class="flex-column-layout">
    <BaseTable
      ref="tableRef"
      v-model:columns="columns"
      row-key="PKValue"
      :show-card="false"
      :datasource="datasource"
      :show-index="true"
      :show-selection="false"
      :show-search-action="false"
      :show-pagination="true"
      :page-size="10"
      actions-width="120px"
      :header-actions="headerActions"
      :row-actions="rowActions"
    />
    <MetaModelDataForm ref="metaModelDataFormRef" @add-success="tableRef?.searchFirstPage()" @edit-success="tableRef?.search()" />
  </div>
</template>

<style scoped lang="scss">
</style>

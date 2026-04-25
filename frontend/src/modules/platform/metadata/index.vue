<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import MetadataEdit from './components/metadata-edit/index.vue'
import MetadataAdd from './components/MetadataAdd.vue'

const tableRef = useTemplateRef('tableRef')
const metadataAddRef = useTemplateRef('metadataAddRef')
const metadataEditRef = useTemplateRef('metadataEditRef')

const metadataTypesApi = axios.get('/ui/metamodels/types').then(r => (r.data.data ?? []).map(e => ({ label: e.name, value: e.ID })))
const metadataTypes = () => metadataTypesApi

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'ID',
  showCard: true,
  showSelection: true,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  actionsWidth: '140px',
  datasource: params => axios.get('/ui/metamodels', { params }).then(r => r.data),
  columns: [
    { prop: 'name', label: '元数据名称', minWidth: '200' },
    { prop: 'code', label: '代码', minWidth: '150' },
    { prop: 'ownerType', label: '类型', minWidth: '150', dict: metadataTypes },
  ],
  headerActions: [
    {
      name: '新建元数据',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      priv: 'Platform.Metadata.Add',
      handle() {
        metadataAddRef.value?.open()
      },
    },
    {
      name: '删除',
      priv: 'Platform.Metadata.Delete',
      icon: 'i-ep:delete',
      disabled({ isSelected }) {
        return !isSelected
      },
      handle({ selectedKeys }) {
        useHandleConfirm(() => axios.delete(`/ui/metamodels/${selectedKeys.join(',')}`), '删除').then(() => {
          tableRef.value?.search()
        })
      },
    },
  ],
  rowActions: [
    {
      name: '类似创建',
      priv: 'Platform.Metadata.Add',
      handle({ row }) {
        metadataAddRef.value?.open(row)
      },
    },
    {
      name: '编辑',
      priv: 'Platform.Metadata.Save',
      handle({ row }) {
        metadataEditRef.value?.open(row.ID)
      },
    },
  ],
})
</script>

<template>
  <div class="h-full">
    <!-- 表格 -->
    <BaseTable ref="tableRef" v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="关键字" prop="key" />
          <BaseTableSearchFormItem label="类型" prop="typeId" widget="select" :dict="metadataTypes" />
        </BaseTableSearchForm>
      </template>
    </BaseTable>
    <MetadataAdd ref="metadataAddRef" />
    <MetadataEdit ref="metadataEditRef" />
  </div>
</template>

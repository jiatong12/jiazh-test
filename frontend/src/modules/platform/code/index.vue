<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import CodeItem from './components/code-item/index.vue'
import CodeAdd from './components/CodeAdd.vue'
import CodeEdit from './components/CodeEdit.vue'

const addRef = useTemplateRef('addRef')
const editRef = useTemplateRef('editRef')
const codeItemRef = useTemplateRef('codeItemRef')
const tableRef = useTemplateRef('tableRef')

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: true,
  showSelection: true,
  showSearchAction: true,
  showPagination: true,
  pageSize: 15,
  actionsWidth: '200px',
  datasource: params => axios.get('/ui/codes', { params }).then(r => r.data),
  columns: [
    { prop: 'codeType', label: '代码类别', minWidth: '120' },
    { prop: 'codeName', label: '代码名称', minWidth: '120' },
    { prop: 'isFixed', label: '固定配置项目', width: '120', align: 'center', widget: 'tag', dict: [{ label: '是', value: true, color: 'success' }, { label: '否', value: false, color: 'danger' }] },
    { prop: 'memo', label: '备注', minWidth: '120' },
  ],
  headerActions: [
    {
      name: '新增',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      priv: 'Platform.Code.Add',
      handle() {
        addRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: 'Platform.Code.Edit',
      disabled({ row }) {
        return row.isFixed
      },
      handle({ row }) {
        editRef.value?.open(row.codeType)
      },
    },
    {
      name: '编辑代码项',

      disabled({ row }) {
        return row.isFixed
      },
      handle({ row }) {
        codeItemRef.value?.open(row.codeType, row.allowAddItem)
      },
    },
    {
      name: '删除',
      priv: 'Platform.Code.Delete',
      confirmTitle: '确认删除？',
      disabled({ row }) {
        return row.isFixed
      },
      handle({ row }) {
        useHandleConfirm(() => axios.delete(`/ui/codes/${row.codeType}`), '删除').then(() => {
          tableRef.value?.search()
        })
      },
    },
  ],
})
</script>

<template>
  <div class="h-full">
    <!-- 表格 -->
    <BaseTable
      ref="tableRef"
      v-bind="tableConfig"
    >
      <template #simpleSearch="{ searchFirstPage, searchFormState }">
        <ElInput v-model.trim="searchFormState.searchCodeType" placeholder="请输入代码类别或名称" clearable :suffix-icon="$$renderIcon('i-ep:search')" @clear="searchFirstPage" />
      </template>
      <template #roles_default="{ row }">
        {{ row.roles?.map(e => e.name).join(', ') }}
      </template>
    </BaseTable>
    <CodeAdd ref="addRef" @submit-success="tableRef?.searchFirstPage()" />
    <CodeEdit ref="editRef" @submit-success="tableRef?.search()" />
    <CodeItem ref="codeItemRef" />
  </div>
</template>

<style scoped lang="scss">
</style>

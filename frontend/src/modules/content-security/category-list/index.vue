<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import BaseTable from '@/components/base-table/src/BaseTable.vue'
import util from '@/utils/util'
import CategoryForm from './components/CategoryForm.vue'

const tableRef = useTemplateRef('tableRef')
const formRef = useTemplateRef('formRef')

const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: true,
  showIndex: true,
  showSearchAction: false,
  showPagination: false,
  actionsWidth: '160px',
  columns: [
    { prop: 'categoryName', label: '分类名称', minWidth: '200' },
    { prop: 'orderFlag', label: '排序号', width: '100' },
    { prop: 'addUser', label: '创建人', width: '120' },
    { prop: 'addTime', label: '创建时间', width: '170' },
  ],
  datasource() {
    return axios.get('/ui/cs/categories').then(r => r.data)
  },
  headerActions: [
    {
      name: '新增',
      priv: 'cs/category:add',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        formRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: 'cs/category:edit',
      handle({ row }) {
        formRef.value?.open(row.id ?? row.ID)
      },
    },
    {
      name: '删除',
      priv: 'cs/category:delete',
      confirmTitle: '确认删除该分类？',
      handle({ row }) {
        axios.delete(`/ui/cs/categories/${row.id ?? row.ID}`).then((res) => {
          util.showResponseMessage(res)
          tableRef.value?.search()
        })
      },
    },
  ],
})
</script>

<template>
  <div class="page-wrap">
    <BaseTable ref="tableRef" v-bind="tableConfig" />
    <CategoryForm ref="formRef" @submit-success="tableRef?.search()" />
  </div>
</template>

<style scoped lang="scss">
.page-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  gap: 10px;
}
</style>

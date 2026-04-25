<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import BaseTable from '@/components/base-table/src/BaseTable.vue'
import util from '@/utils/util'
import ContentForm from './components/ContentForm.vue'
import ContentDetail from './components/ContentDetail.vue'

const tableRef = useTemplateRef('tableRef')
const formRef = useTemplateRef('formRef')
const detailRef = useTemplateRef('detailRef')

const categoryList = ref<any[]>([])

function loadCategories() {
  axios.get('/ui/cs/categories').then(({ data }) => {
    if (data.status === 1) {
      categoryList.value = data.data || []
    }
  })
}
loadCategories()

const statusOptions = [
  { label: '草稿', value: 0 },
  { label: '已发布', value: 1 },
]

const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: true,
  showIndex: true,
  showSearchAction: true,
  showPagination: true,
  pageSize: 20,
  actionsWidth: '200px',
  columns: [
    { prop: 'title', label: '标题', minWidth: '180' },
    { prop: 'categoryName', label: '分类', width: '120' },
    {
      prop: 'status',
      label: '状态',
      width: '100',
      dict: statusOptions,
    },
    { prop: 'addUser', label: '创建人', width: '100' },
    { prop: 'addTime', label: '创建时间', width: '170' },
  ],
  datasource(params) {
    return axios.get('/ui/cs/contents', { params }).then(r => r.data)
  },
  headerActions: [
    {
      name: '新增',
      priv: 'cs.content:add',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        formRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '查看',
      handle({ row }) {
        detailRef.value?.open(row.id ?? row.ID)
      },
    },
    {
      name: '编辑',
      priv: 'cs/content:edit',
      handle({ row }) {
        formRef.value?.open(row.id ?? row.ID)
      },
    },
    {
      name: '删除',
      priv: 'cs/content:delete',
      confirmTitle: '确认删除该内容？',
      handle({ row }) {
        axios.delete(`/ui/cs/contents/${row.id ?? row.ID}`).then((res) => {
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
    <BaseTable ref="tableRef" v-bind="tableConfig">
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <template #default="{ model }">
            <BaseTableSearchFormItem label="关键字" prop="keyword" />
            <BaseTableSearchFormItem label="分类" prop="categoryID">
              <ElSelect v-model="model.categoryID" placeholder="全部分类" clearable @change="scope.searchFirstPage">
                <ElOption v-for="cat in categoryList" :key="cat.id" :label="cat.categoryName" :value="cat.id" />
              </ElSelect>
            </BaseTableSearchFormItem>
            <BaseTableSearchFormItem label="状态" prop="status">
              <ElSelect v-model="model.status" placeholder="全部状态" clearable @change="scope.searchFirstPage">
                <ElOption v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </ElSelect>
            </BaseTableSearchFormItem>
          </template>
        </BaseTableSearchForm>
      </template>
    </BaseTable>
    <ContentForm ref="formRef" :category-list="categoryList" @submit-success="tableRef?.searchFirstPage()" />
    <ContentDetail ref="detailRef" />
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

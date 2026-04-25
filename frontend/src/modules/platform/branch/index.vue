<script setup lang="ts">
import axios from 'axios'
import { $$auths } from '@/auths'
import { useTableSetup } from '@/components/base-table'
import util from '@/utils/util'
import BranchAdd from './components/BranchAdd.vue'
import BranchEdit from './components/BranchEdit.vue'

const tableRef = useTemplateRef('tableRef')
const branchAddRef = useTemplateRef('branchAddRef')
const branchEditRef = useTemplateRef('branchEditRef')

function findTree(tree: any[], find: (item: any) => boolean) {
  const result: any[] = []
  for (const item of tree) {
    const children = item.children ? findTree(item.children, find) : item.children
    const exist = find(item)
    if (exist || children?.length) {
      result.push({ ...item, children })
    }
  }
  return result
}

function handleEdit(row) {
  branchEditRef.value?.open(row.branchInnerCode, row.parentInnerCode)
}

const EDIT_PRIV = 'Platform.Branch.Edit||Platform.Branch.SetPrivRange'
const hasEditPriv = computed(() => $$auths.hasPriv(EDIT_PRIV))
// 使用 useTableSetup 创建表格配置
const tableConfig = useTableSetup({
  rowKey: 'branchInnerCode',
  showCard: true,
  showSearchAction: false,
  showPagination: false,
  actionsWidth: '160px',
  columns: [
    { prop: 'name', label: '名称', minWidth: '200' },
    { prop: 'branchCode', label: '编号' },
    { prop: 'managers', label: '机构主管', minWidth: '200' },
    { prop: 'phone', label: '电话', width: '120' },
    { prop: 'fax', label: '传真' },
  ],
  datasource: async (params) => {
    const name = params.name ?? ''

    return axios.get('/ui/branches', { params: { showManage: 'Y' } }).then(({ data }) => {
      if (!name) {
        return data.data
      }
      return findTree(data.data as any[], item => item.name.includes(name))
    })
  },
  headerActions: [
    {
      name: '新增',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      priv: 'Platform.Branch.Add',
      handle() {
        branchAddRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: EDIT_PRIV,
      handle({ row }) {
        handleEdit(row)
      },
    },
    {
      name: '删除',
      priv: 'Platform.Branch.Delete',
      confirmTitle: '确认删除？',
      async handle({ row }) {
        const isHasAdmin = row.treeLevel === 1
        if (isHasAdmin) {
          ElNotification({
            title: '不能删除',
            message: '不能删除，根机构!',
            type: 'warning',
            duration: 2000,
          })
          return
        }

        axios.delete(`/ui/branches/${row.branchInnerCode}`).then(({ data }) => {
          util.showResponseMessage(data)
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
      default-expand-all
    >
      <template #simpleSearch="{ searchFirstPage, searchFormState }">
        <ElInput
          v-model.trim="searchFormState.name"
          placeholder="请输入机构名称"
          clearable
          :suffix-icon="$$renderIcon('i-ep:search')"
          @clear="searchFirstPage"
        />
      </template>

      <template #name_default="{ row }">
        <ElLink v-if="hasEditPriv" type="primary" @click="handleEdit(row)">
          {{ row.name }}
        </ElLink>
        <template v-else>
          {{ row.name }}
        </template>
      </template>
      <template #managers_default="{ row }">
        {{ row.managers?.map(e => e.realName).join('，') }}
      </template>
    </BaseTable>
    <BranchAdd ref="branchAddRef" @submit-success="tableRef?.searchFirstPage()" />
    <BranchEdit ref="branchEditRef" @submit-success="tableRef?.search()" />
  </div>
</template>

<style scoped lang="scss">
</style>

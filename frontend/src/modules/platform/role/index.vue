<script setup lang="ts">
import axios from 'axios'
import { $$auths } from '@/auths'
import { useTableSetup } from '@/components/base-table'
import BaseTable from '@/components/base-table/src/BaseTable.vue'
import util from '@/utils/util'
import RoleAdd from './components/RoleAdd.vue'
import RoleEdit from './components/RoleEdit.vue'

const tableRef = useTemplateRef('tableRef')
const roleAddRef = useTemplateRef('roleAddRef')
const roleEditRef = useTemplateRef('roleEditRef')

const EDIT_PRIV = 'Member.Role.Edit'
const hasEditPriv = computed(() => $$auths.hasPriv(EDIT_PRIV))
// 使用 useTableSetup 创建表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: true,
  showIndex: true,
  showSearchAction: true,
  showPagination: true,
  pageSize: 10,
  actionsWidth: '160px',
  columns: [
    { prop: 'name', label: '角色名称', minWidth: '120' },
    { prop: 'branch', label: '所属机构', minWidth: '120' },
  ],
  datasource(params) {
    return axios.get('/ui/roles', { params }).then(r => r.data)
  },
  headerActions: [
    {
      name: '新增',
      priv: 'Member.Role.Add',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        roleAddRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: EDIT_PRIV,
      handle({ row }) {
        roleEditRef.value?.open(row.roleCode)
      },
    },
    {
      name: '删除',
      priv: 'Member.Role.Delete',
      confirmTitle: '确认删除？',
      handle({ row }) {
        if (!row || !row.roleCode) {
          return
        }
        axios.delete(`/ui/roles/${row.roleCode}`).then((res) => {
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
    <!-- 表格 -->
    <BaseTable
      ref="tableRef"
      v-bind="tableConfig"
    >
      <template #simpleSearch="{ searchFirstPage, searchFormState }">
        <ElInput v-model="searchFormState.roleName" placeholder="请输入角色名称" clearable @clear="searchFirstPage" />
        <BizSelectBranches v-model="searchFormState.branchInnercode" @change="searchFirstPage" @clear="searchFirstPage" />
      </template>

      <template #name_default="{ row }">
        <ElLink v-if="hasEditPriv" type="primary" @click="roleEditRef?.open(row.roleCode)">
          {{ row.name }}
        </ElLink>
        <template v-else>
          {{ row.name }}
        </template>
      </template>
    </BaseTable>
    <RoleAdd ref="roleAddRef" @submit-success="tableRef?.searchFirstPage()" />
    <RoleEdit ref="roleEditRef" @submit-success="tableRef?.search()" />
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

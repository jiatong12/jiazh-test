<script setup lang="ts">
import axios from 'axios'
import { $$auths } from '@/auths'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import { useUserStore } from '@/store/modules/user'
import UserAdd from './components/UserAdd.vue'
import UserEdit from './components/UserEdit.vue'

const addRef = useTemplateRef('addRef')
const editRef = useTemplateRef('editRef')
const tableRef = useTemplateRef('tableRef')

const userStore = useUserStore()
const isSecurityRole = computed(() => userStore.userInfo?.roleType === 'security')

function datasource(params) {
  return axios.get('/ui/users', { params })
}

function disableOrEnableHandler(row: any) {
  const action = row.status ? '停用' : '启用'
  const { userName, status } = row
  const handle = status ? () => axios.put(`/ui/users/disable/${userName}`).then(res => res.data) : () => axios.put(`/ui/users/enable/${userName}`).then(res => res.data)
  useHandleConfirm(() => handle(), `${action}【${row.userName}】用户`).then(() => {
    row.status = !row.status
  })
}

const EDIT_PRIV = 'Platform.User.Edit||Platform.User.SetPriv'
const hasEditPriv = computed(() => $$auths.hasPriv(EDIT_PRIV))
// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'userName',
  showCard: true,
  showSelection: true,
  showSearchAction: true,
  showPagination: true,
  pageSize: 10,
  actionsWidth: '100px',
  datasource,
  columns: [
    { prop: 'userName', label: '用户名', minWidth: '120' },
    { prop: 'realName', label: '真实姓名', minWidth: '120' },
    { prop: 'status', label: '用户状态', width: '120', align: 'center', widget: 'badge', dict: [{ label: '启用', value: true, color: 'success' }, { label: '停用', value: false, color: 'danger' }] },
    { prop: 'branch.name', label: '所属机构', width: '120' },
    { prop: 'roles', label: '所属角色', minWidth: '120' },
    { prop: 'lastModifyPassTime', label: '最后修改密码时间', width: '180' },
  ],
  headerActions: [
    {
      name: '新增',
      priv: 'Platform.User.Add',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      show() {
        return !isSecurityRole.value
      },
      handle() {
        addRef.value?.open()
      },
    },
    {
      name: '删除',
      priv: 'Platform.User.Delete',
      icon: 'i-ep:delete',
      confirmTitle: '确认删除？',
      disabled({ isSelected }) {
        return !isSelected
      },
      show() {
        return !isSecurityRole.value
      },
      handle({ selectedKeys }) {
        useHandleConfirm(() => axios.delete(`/ui/users/${selectedKeys.join(',')}`), '删除').then(() => {
          tableRef.value?.search()
        })
      },
    },
    {
      name: '通知修改密码',
      priv: 'Platform.User.LastLoginUpdatePwd',
      icon: 'i-mdi:plus-thick',
      disabled({ isSelected }) {
        return !isSelected
      },
      show() {
        return !isSecurityRole.value
      },
      handle({ selectedKeys }) {
        const ids = selectedKeys.join(',')
        useHandleConfirm(() => axios.post(
          '/ui/message', {
            toUser: `${ids}`,
            subject: '密码长时间未修改通知',
            content: '您的密码由于长时间未修改，请您及时修改密码！',
          }),
        `用户：${selectedKeys.join('、')
        }，下次登录时修改密码`)
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: EDIT_PRIV,
      handle({ row }) {
        editRef.value?.openWithData(row)
      },
    },
  ],
})

const statusDict = [{ label: '启用', value: true, color: 'success' }, { label: '停用', value: false, color: 'danger' }]
const hasEnablePriv = row => row.status ? $$auths.hasPriv('Platform.User.Disable') : $$auths.hasPriv('Platform.User.Enable')
</script>

<template>
  <div class="h-full">
    <!-- 表格 -->
    <BaseTable
      ref="tableRef"
      v-bind="tableConfig"
    >
      <template #searchForm="scope">
        <BaseTableSearchForm
          v-model="scope.searchFormState"
          :handle-search="scope.searchFirstPage"
        >
          <template #default="{ model }">
            <BaseTableSearchFormItem label="用户名" prop="userName" />
            <BaseTableSearchFormItem label="真实姓名" prop="realName" />
            <BaseTableSearchFormItem label="所属机构" prop="branchInnerCode">
              <BizSelectBranches v-model="model.branchInnerCode" @change="scope.searchFirstPage" @clear="scope.searchFirstPage" />
            </BaseTableSearchFormItem>
            <BaseTableSearchFormItem label="用户状态" prop="status" />
            <BaseTableSearchFormItem label="密码变更时间" prop="changePasswordType" />
          </template>
        </BaseTableSearchForm>
      </template>

      <template #userName_default="{ row }">
        <ElLink v-if="hasEditPriv" type="primary" @click="editRef?.openWithData(row)">
          {{ row.userName }}
        </ElLink>
        <template v-else>
          {{ row.userName }}
        </template>
      </template>

      <template #roles_default="{ row }">
        {{ row.roles?.map(e => e.name).join(', ') }}
      </template>

      <template #status_default="{ row }">
        <ElSwitch v-if="!isSecurityRole && hasEnablePriv(row.status)" :model-value="row.status" inline-prompt active-text="启用" inactive-text="停用" @click="disableOrEnableHandler(row)" />
        <template v-else>
          <BaseDictTag :value="row.status" :dict="statusDict" />
        </template>
      </template>
    </BaseTable>
    <UserAdd ref="addRef" @submit-success="tableRef?.searchFirstPage()" />
    <UserEdit ref="editRef" @submit-success="tableRef?.search()" />
  </div>
</template>

<style scoped lang="scss">
</style>

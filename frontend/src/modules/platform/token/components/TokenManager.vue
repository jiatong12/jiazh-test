<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { $$auths } from '@/auths'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import TokenAdd from './TokenAdd.vue'
import TokenEdit from './TokenEdit.vue'
import TokenLock from './TokenLock.vue'

const tableRef = useTemplateRef('tableRef')
const tokenAddRef = useTemplateRef('tokenAddRef')
const tokenEditRef = useTemplateRef('tokenEditRef')
const tokenLockRef = useTemplateRef('tokenLockRef')

const optionsStatus = ref([
  {
    value: 'Y',
    label: '启用',
  },
  {
    value: 'N',
    label: '停用',
  },
])

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'userName',
  showCard: true,
  showIndex: true,
  showSelection: false,
  showPagination: true,
  pageSize: 15,
  actionsWidth: '180px',
  datasource: params => axios.get('/ui/tokensetting', { params }).then(r => r.data),
  columns: [
    { prop: 'appKey', label: '应用key', minWidth: '35%' },
    { prop: 'appSecret', label: '应用Secret', minWidth: '35%' },
    { prop: 'status', label: '状态', minWidth: '10%', align: 'center' },
    { prop: 'userName', label: '所属用户', minWidth: '15%' },
  ],
  headerActions: [
    {
      name: '新建',
      priv: 'Platform.Token.Add',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        tokenAddRef.value?.open()
      },
    },
    {
      name: '已锁定列表',
      priv: 'Platform.Token.UnLock',
      icon: 'i-ep:lock',
      handle() {
        tokenLockRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: 'Platform.Token.Edit',
      handle({ row }) {
        tokenEditRef.value?.open(row.userName)
      },
    },
    {
      name: '删除',
      priv: 'Platform.Token.Delete',
      confirmTitle: '确定删除？',
      handle({ row }) {
        const { userName } = row
        axios.delete(`/ui/tokensetting/${userName}`).then(() => {
          tableRef.value?.search()
        })
      },
    },
    {
      name: '重置密钥',
      priv: 'Platform.Token.Reset',
      confirmTitle: '确定重置秘钥？',
      handle({ row }) {
        const { userName } = row
        axios.delete(`/ui/tokensetting/${userName}/secrets`).then(() => {
          tableRef.value?.search()
        })
      },
    },
  ],
})

function disableOrEnableClickHandler(row: any) {
  const { userName, status } = row
  const statusName = status === 'Y' ? '停用' : '启用'
  const handle = status === 'Y' ? () => axios.put(`/ui/tokensetting/disable/${userName}`) : () => axios.put(`/ui/tokensetting/enable/${userName}`)
  useHandleConfirm(() => handle(), `${statusName}令牌`).then(() => {
    tableRef.value?.search()
  })
}

const statusDict = [{ label: '启用', value: 'Y', color: 'success' }, { label: '停用', value: 'N', color: 'danger' }]
const hasEditPriv = computed(() => $$auths.hasPriv('Platform.Token.Edit'))
</script>

<template>
  <div class="h-full">
    <!-- 表格 -->
    <BaseTable
      ref="tableRef"
      v-bind="tableConfig"
    >
      <template #searchForm="scope">
        <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage">
          <BaseTableSearchFormItem label="用户名" prop="userName" />
          <BaseTableSearchFormItem label="状态" prop="status" widget="select" :dict="optionsStatus" />
        </BaseTableSearchForm>
      </template>

      <template #status_default="{ row }">
        <ElSwitch v-if="hasEditPriv" :model-value="row.status" inline-prompt active-value="Y" active-text="启用" inactive-value="N" inactive-text="停用" @click="disableOrEnableClickHandler(row)" />
        <template v-else>
          <BaseDictTag :value="row.status" :dict="statusDict" />
        </template>
      </template>

      <template #userName_default="{ row }">
        <span>
          <a
            v-if="row.isDelUser !== 'Y'"
            :title="row.userName"
            href="javascript:void(0)"
            @click.stop="tokenEditRef?.open(row.userName)"
          >
            {{ row.userName }}
          </a>
          <s v-else title="用户已删除">{{ row.userName }}</s>
        </span>
      </template>
    </BaseTable>

    <TokenEdit ref="tokenEditRef" @submit-success="tableRef?.searchFirstPage()" />
    <TokenAdd ref="tokenAddRef" @submit-success="tableRef?.searchFirstPage()" />
    <TokenLock ref="tokenLockRef" />
  </div>
</template>

<style scoped>
.pane-btns {
  text-align: right;
}
.tree-class {
  width: 180px;
}
</style>

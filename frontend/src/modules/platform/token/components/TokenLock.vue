<script lang="ts" setup>
import type { TableColumnConfig, TableHeaderActionBtn } from '@/components/base-table'
import axios from 'axios'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import { useRequest } from '@/hooks/useRequest'

// 基础状态
const visible = ref(false)

const tableRef = useTemplateRef('tableRef')

const configRequest = useRequest(() => axios.get('/ui/token/locks/config').then(r => r.data?.authMode), () => 'N')
const loading = toRef(configRequest, 'delayLoading')
const authMode = toRef(configRequest, 'result')
const userNameColumn = computed(() => authMode.value === 'Y' ? '应用key' : '用户名')

/**
 * 打开
 */
function open(): void {
  configRequest.send()
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

const datasource = params => axios.get('/ui/token/locks', { params }).then(r => r.data)

const headerActions: TableHeaderActionBtn[] = [
  {
    name: '全部解锁',
    priv: 'Platform.Token.UnLock',
    icon: 'i-mdi:unlocked-outline',
    type: 'primary',
    handle() {
      useHandleConfirm(() => axios.put('/ui/token/locks/unlock/all'), `全部解锁`).then(() => {
        tableRef.value?.searchFirstPage()
      })
    },
  },
  {
    name: '解锁',
    priv: 'Platform.Token.UnLock',
    icon: 'i-mdi:unlocked-outline',
    disabled({ isSelected }) {
      return !isSelected
    },
    handle({ selectedKeys }) {
      useHandleConfirm(() => axios.put('/ui/token/locks/unlock', { key: selectedKeys.join(',') }), `解锁`).then(() => {
        tableRef.value?.search()
      })
    },
  },
]

const columns = ref<TableColumnConfig[]>([
  reactive({ prop: 'key', label: userNameColumn, minWidth: '120' }),
  { prop: 'lockTime', label: '锁定时间', minWidth: '120' },
  { prop: 'autoUnlockTime', label: '自动解锁时间', minWidth: '120' },
])

defineExpose({ open })
</script>

<template>
  <BaseDialog
    v-model="visible"
    title="查看已锁定列表"
    width="80%"
  >
    <BaseTable
      ref="tableRef"
      v-model:columns="columns"
      v-loading="loading"
      row-key="id"
      :datasource="datasource"
      :show-index="true"
      :show-selection="true"
      :show-search-action="true"
      :show-pagination="true"
      :page-size="10"
      :header-actions="headerActions"
    >
      <template #simpleSearch="{ searchFirstPage, searchFormState }">
        <ElInput v-model="searchFormState.key" :placeholder="`请输入${userNameColumn}`" clearable :suffix-icon="$$renderIcon('i-ep:search')" @clear="searchFirstPage" />
      </template>
    </BaseTable>

    <template #footer>
      <BaseButton @click="handleCancel">
        关闭
      </BaseButton>
    </template>
  </BaseDialog>
</template>

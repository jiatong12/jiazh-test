<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import MessageAddDialog from './MessageAddDialog.vue'
import MessageDetailDialog from './MessageDetailDialog.vue'
import MessageHistoryDrawer from './MessageHistoryDrawer.vue'
import MessageReplyDialog from './MessageReplyDialog.vue'

const userType = ref('FromUser')

// 定义组件引用
const tableRef = useTemplateRef('tableRef')
const messageDetailDialogRef = useTemplateRef('messageDetailDialogRef')
const messageHistoryDrawerRef = useTemplateRef('messageHistoryDrawerRef')
const messageReplyDialogRef = useTemplateRef('messageReplyDialogRef')
const messageDialogRef = useTemplateRef('messageDialogRef')

const tableConfig = useTableSetup({
  rowKey: 'ID',
  immediate: false,
  showSelection: true,
  actionsWidth: '120px',
  datasource(params) {
    return axios.get('/ui/message', { params: { sortField: 'addTime', ...params } }).then(r => r.data)
  },
  columns: [
    { prop: 'readFlag', label: '', width: '50', align: 'center' },
    { prop: 'subject', label: '标题' },
    { prop: 'fromUser', label: '发送人', width: '120' },
    { prop: 'addTime', label: '发送时间', width: '160' },
  ],
  headerActions: [
    {
      name: '新建',
      type: 'primary',
      icon: 'i-fa-plus',
      handle() {
        messageDialogRef.value?.open()
      },
    },
    {
      name: '删除',
      icon: 'i-fa-remove',
      type: 'danger',
      disabled({ isSelected }) {
        return !isSelected
      },
      handle({ selectedKeys }) {
        useHandleConfirm(() => axios.delete(`/ui/message/${selectedKeys}?userType=ToUser`), `删除`).then(() => {
          tableRef.value?.searchFirstPage()
        })
      },
    },
    {
      name: '标记为已读',
      icon: 'i-fa-bookmark',
      disabled({ isSelected }) {
        return !isSelected
      },
      handle({ selectedKeys }) {
        useHandleConfirm(() => axios.put(`/ui/message/${selectedKeys}/setreadflag`), `所选的消息标记为已读`).then(() => {
          tableRef.value?.searchFirstPage()
        })
      },
    },
    {
      name: '已发消息',
      icon: 'i-fa-send',
      handle() {
        messageHistoryDrawerRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '查看',
      handle({ row }) {
        messageDetailDialogRef.value?.open({ ...row }, userType.value)
      },
    },
    {
      name: '回复',
      disabled({ row }) {
        return row.fromUser === 'SYSTEM'
      },
      handle({ row }) {
        messageReplyDialogRef.value?.open({ ...row })
      },
    },
  ],
})

const visible = ref(false)
function open() {
  visible.value = true
  nextTick(() => {
    tableRef.value?.searchFirstPage()
  })
}

function handleCancel() {
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <div>
    <BaseDrawer v-model="visible" title="短消息列表" size="900px">
      <BaseTable ref="tableRef" v-bind="tableConfig">
        <template #readFlag_default="{ row }">
          <BaseIcon :name="row.readFlag ? 'i-fa-envelope-open-o' : 'i-fa-envelope'" />
        </template>
      </BaseTable>

      <template #footer>
        <BaseButton @click="handleCancel">
          关 闭
        </BaseButton>
      </template>
    </BaseDrawer>

    <MessageAddDialog ref="messageDialogRef" @submit-success="tableRef?.searchFirstPage()" />
    <MessageReplyDialog ref="messageReplyDialogRef" />
    <MessageHistoryDrawer ref="messageHistoryDrawerRef" />
    <MessageDetailDialog ref="messageDetailDialogRef" />
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import MessageDetailDialog from './MessageDetailDialog.vue'

// 响应式数据
const userType = ref('FromUser')

// 组件引用
const tableRef = useTemplateRef('tableRef')
const messageDetailDialogRef = useTemplateRef('messageDetailDialogRef')

const tableConfig = useTableSetup({
  rowKey: 'ID',
  showSelection: true,
  immediate: false,
  datasource(params) {
    return axios.get('/ui/message/sendlist', { params: { sortField: 'addTime', ...params } }).then(r => r.data)
  },
  columns: [
    { prop: 'default', label: '', width: '50', align: 'center' },
    { prop: 'subject', label: '标题', minWidth: '160px' },
    { prop: 'toUser', label: '接收人', minWidth: '160px' },
    { prop: 'addTime', label: '发送时间', width: '160px' },
  ],
  headerActions: [
    {
      name: '删除',
      type: 'danger',
      disabled({ isSelected }) {
        return !isSelected
      },
      handle({ selectedKeys }) {
        useHandleConfirm(() => axios.delete(`/ui/message/${selectedKeys}?userType=${userType.value}`), `删除`).then(() => {
          tableRef.value?.searchFirstPage()
        })
      },
    },
  ],
})

const visible = ref(false)
// 方法
function open() {
  visible.value = true
  nextTick(() => {
    tableRef.value?.searchFirstPage()
  })
}
function handleCancel() {
  visible.value = false
}

function lookMsgHistoryDbClick(row) {
  messageDetailDialogRef.value?.open({ ...row }, userType.value)
}

defineExpose({ open })
</script>

<template>
  <div>
    <BaseDrawer v-model="visible" title="已发消息" size="900px">
      <BaseTable
        ref="tableRef"
        size="small"
        v-bind="tableConfig"
        @row-dblclick="lookMsgHistoryDbClick"
      >
        <template #default_default>
          <BaseIcon name="i-fa-envelope-o" />
        </template>
      </BaseTable>

      <template #footer>
        <BaseButton @click="handleCancel">
          关闭
        </BaseButton>
      </template>
    </BaseDrawer>

    <!-- 双击查看消息详情 -->
    <MessageDetailDialog ref="messageDetailDialogRef" />
  </div>
</template>

<style scoped>
</style>

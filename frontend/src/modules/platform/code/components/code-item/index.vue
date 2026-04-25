<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import CodeItemAdd from './components/CodeItemAdd.vue'
import CodeItemEdit from './components/CodeItemEdit.vue'

const dialogRef = useTemplateRef('dialogRef')
const addRef = useTemplateRef('addRef')
const editRef = useTemplateRef('editRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

const codeType = ref('')
const allowAddItem = ref(true)

/**
 * 打开，并根据参数初始化表单
 * @param _codeType 初始表单的数据
 */
function open(_codeType: string, _allowAddItem: boolean): void {
  codeType.value = _codeType
  allowAddItem.value = _allowAddItem
  submitLoading.value = false
  visible.value = true
}

const tableRef = useTemplateRef('tableRef')

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'id',
  showIndex: true,
  showSearchAction: true,
  showPagination: false,
  actionsWidth: '120px',
  datasource: () => axios.get(`/ui/codes/${codeType.value}/items`).then(r => r.data.data),
  columns: [
    { prop: 'codeValue', label: '值', minWidth: '120', align: 'center' },
    { prop: 'codeName', label: '名称', minWidth: '120' },
    { prop: 'codeType', label: '代码类别', minWidth: '120' },
    { prop: 'isFixed', label: '固定配置项目', width: '120', align: 'center', widget: 'tag', dict: [{ label: '是', value: true, color: 'success' }, { label: '否', value: false, color: 'danger' }] },
    { prop: 'memo', label: '备注', minWidth: '120' },
  ],
  headerActions: [
    {
      name: '新增',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      priv: 'Platform.Code.Add',
      disabled() {
        return !allowAddItem.value
      },

      handle() {
        addRef.value?.open(codeType.value)
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
        editRef.value?.open(row.codeType, row.codeValue)
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

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="代码项列表"
    width="80%"
  >
    <!-- 表格 -->
    <BaseTable
      ref="tableRef"
      v-bind="tableConfig"
    >
      <template #roles_default="{ row }">
        {{ row.roles?.map(e => e.name).join(', ') }}
      </template>
    </BaseTable>
    <CodeItemAdd ref="addRef" @submit-success="tableRef?.searchFirstPage()" />
    <CodeItemEdit ref="editRef" @submit-success="tableRef?.search()" />
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

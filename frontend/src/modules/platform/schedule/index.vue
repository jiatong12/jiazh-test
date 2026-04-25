<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import ScheduleAdd from './components/ScheduleAdd.vue'
import ScheduleEdit from './components/ScheduleEdit.vue'

const tableRef = useTemplateRef('tableRef')
const addRef = useTemplateRef('addRef')
const editRef = useTemplateRef('editRef')

// 使用 useTableSetup 创建表格配置
const tableConfig = useTableSetup({
  rowKey: 'ID',
  showCard: true,
  showSelection: false,
  showSearchAction: true,
  showPagination: false,
  pageSize: 10,
  actionsWidth: '200px',
  columns: [
    { prop: 'typeCodeName', label: '类型', width: '100px' },
    { prop: 'sourceIDName', label: '名称', width: '250px' },
    {
      prop: 'isUsing',
      label: '是否启用',
      width: '100px',
      widget: 'tag',
      align: 'center',
      dict: [{ label: '是', value: 'Y', color: 'success' }, { label: '否', value: 'N', color: 'danger' }],
    },
    { prop: 'nextRunTime', label: '下次执行时间', width: '200px' },
    { prop: 'description', label: '任务描述' },
  ],
  datasource: () => axios.get('/ui/schedules').then(r => r.data.data),
  headerActions: [
    {
      name: '添加',
      priv: 'Platform.Schedule.Add',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        addRef.value?.open()
      },
    },
  ],
  rowActions: [
    {
      name: '编辑',
      priv: 'Platform.Schedule.Edit',
      handle({ row }) {
        editRef.value?.open(row.ID)
      },
    },
    {
      name: '删除',
      priv: 'Platform.Schedule.Delete',
      confirmTitle: '确认删除？',
      disabled({ row }) {
        return row.typeCode === 'SYSTEM'
      },
      handle({ row }) {
        axios.delete(`/ui/schedules/deleted`, row).then(() => {
          tableRef.value?.search()
        })
      },
    },
    {
      name: '手动执行',
      priv: 'Platform.Schedule.ManualExecute',
      confirmTitle: '确定要手动执行该任务吗？',
      handle({ row }) {
        axios.post(`/ui/schedules/executed`, row).then(() => {
          tableRef.value?.search()
        })
      },
    },
  ],
})
</script>

<template>
  <div class="flex-column-layout h-full">
    <BaseTable
      ref="tableRef"
      class="flex-height-fill"
      v-bind="tableConfig"
    />
    <ScheduleAdd ref="addRef" @submit-success="tableRef?.searchFirstPage()" />
    <ScheduleEdit ref="editRef" @submit-success="tableRef?.search()" />
  </div>
</template>

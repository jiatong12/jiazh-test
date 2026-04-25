<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import util from '@/utils/util'
import ViewFile from './components/ViewFile.vue'

const tableRef = useTemplateRef('tableRef')
const viewFileRef = useTemplateRef('viewFileRef')

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'file',
  showCard: true,
  showSelection: true,
  showSearchAction: true,
  showPagination: false,
  pageSize: 10,
  actionsWidth: '220px',
  datasource: () => axios.get('/ui/backups').then(r => r.data.data),
  columns: [
    { prop: 'file', label: '文件名', minWidth: '50%' },
    { prop: 'size', label: '大小', minWidth: '25%' },
    { prop: 'lastChangeDate', label: '最后修改时间', minWidth: '25%' },
  ],
  headerActions: [
    {
      name: '备份数据',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      priv: 'Platform.Backup.Backup',
      handle() {
        useHandleConfirm(() => {
          return axios.post('/ui/backups').then((res) => {
            return axios.get(`/ui/framework/longtimetasks/${res.data.taskID}`).then((r) => {
              util.showProgress(res.data.taskID, r.data.data.currentInfo)
            })
          })
        }, `备份数据库吗`).then(() => {
          tableRef.value?.searchFirstPage()
        })
      },
    },
    {
      name: '删除',
      icon: 'i-ep:delete',
      priv: 'Platform.Backup.Delete',
      disabled({ isSelected }) {
        return !isSelected
      },
      handle({ selectedKeys }) {
        useHandleConfirm(() => axios.delete(`/ui/backups/`, { params: { ids: selectedKeys.join() } }), `删除`).then(() => {
          tableRef.value?.searchFirstPage()
        })
      },
    },
  ],
  rowActions: [
    {
      name: '恢复数据',
      priv: 'Platform.Backup.Restore',
      handle({ row }) {
        useHandleConfirm(() => {
          return axios.put('/ui/backups/restored', { file: row.file }).then((res) => {
            return axios.get(`/ui/framework/longtimetasks/${res.data.taskID}`).then((r) => {
              util.showProgress(res.data.taskID, r.data.data.currentInfo)
            })
          })
        }, `恢复数据库吗`).then(() => {
          tableRef.value?.searchFirstPage()
        })
      },
    },
    {
      name: '查看文件',
      priv: 'Platform.Backup.Info',
      async handle({ row }) {
        viewFileRef.value?.open(row.file)
      },
    },
    {
      name: '下载',
      priv: 'Platform.Backup.Download',
      show({ row }) {
        return row.hasFileDownloadPriv
      },
      handle({ row }) {
        window.location.href = `${axios.defaults.baseURL}/api/backups/download/file?fileName=${row.file}`
      },
    },
  ],
})
</script>

<template>
  <div class="h-full">
    <BaseTable
      ref="tableRef"
      v-bind="tableConfig"
      class="flex-height-fill"
    />
    <ViewFile ref="viewFileRef" />
  </div>
</template>

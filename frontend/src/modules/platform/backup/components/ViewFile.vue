<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useTableSetup } from '@/components/base-table'

const dialogRef = useTemplateRef('dialogRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)
const activeName = ref('')

const file = ref('')

const formDatasource = () => axios.get('/ui/backups/infos', { params: { file: file.value } }).then(r => r.data)

/**
 * 打开，并根据参数初始化表单
 */
function open(_file: string): void {
  submitLoading.value = false
  file.value = _file
  activeName.value = 'info'
  visible.value = true
}

// 使用 useTableSetup 优化表格配置
const tableConfig = useTableSetup({
  rowKey: 'file',
  showIndex: true,
  showPagination: false,
  datasource: () => axios.get('/ui/backups/tables', { params: { file: file.value } }).then(r => r.data.data),
  columns: [
    { prop: 'name', label: '表名' },
    { prop: 'size', label: '存储体积', width: '130' },
    { prop: 'total', label: '数据行数', width: '130' },
    { prop: 'batchcount', label: '批处理次数', width: '130' },
  ],
})

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    :title="file"
    width="800px"
  >
    <ElTabs v-model="activeName" style="height: 500px;">
      <ElTabPane label="Info" name="info">
        <BaseForm :datasource="formDatasource" :col="1">
          <BaseFormItem label="文件名称" prop="file" widget="text" />
          <BaseFormItem label="文件大小" prop="size" widget="text" />
          <BaseFormItem label="数据行数" prop="total" widget="text" />
          <BaseFormItem label="备份开始时间" prop="startTime" widget="text" />
          <BaseFormItem label="备份结束时间" prop="endTime" widget="text" />
          <BaseFormItem label="任务执行日志" prop="tasklog" widget="textarea" :widget-props="{ rows: 10 }" />
        </BaseForm>
      </ElTabPane>
      <ElTabPane label="Tables" name="tables" class="h-full">
        <BaseTable v-bind="tableConfig" />
      </ElTabPane>
    </ElTabs>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

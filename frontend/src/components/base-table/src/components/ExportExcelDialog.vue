<script setup lang="ts">
import type { TableColumnConfig } from '../types/table.types'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { TABLE_EXPORT_EXCEL_CONFIG } from '@/config'
import { useEnv } from '@/env'
import { downloadFileByForm } from '@/utils/download'

const { API_URL } = useEnv()

const visible = ref(false)

const { defaultCount, defaultPageCount, maxCount: maxCountConfig } = TABLE_EXPORT_EXCEL_CONFIG

// 使用 formData 统一管理表单数据
const formData = reactive({
  // type: 'page' as 'count' | 'all' | 'page', // 导出模式
  type: 'page' as 'count' | 'page', // 导出模式
  maxCount: defaultCount, // 指定条数
  pageCount: defaultPageCount,
  fieldNameList: [] as string[],
  fields: [] as (any[]),
})

// const exportExcelParams = ref({
//   url: ``,
//   params: {},
//   body: {},
//   method: 'get',
//   fields: [{
//     field: 'title',
//     name: '名称',
//     enums: [],
//   }],
//   mode: { type: '' },
//   dataPath: 'data',
//   exportFileName: 'excel',
// })

interface Params {
  requestConfig?: any
  columns?: TableColumnConfig[]
  dataPath?: string
  exportFileName?: string
  pageSize?: number
  pageBeginIndex?: number
  total?: number
}

let params: Params

function toExcelFormValue(value: unknown) {
  if (value == null) { return '' }
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function toExcelFormData(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, toExcelFormValue(value)]),
  )
}

function handleConfirm() {
  // 参数
  const { requestConfig, dataPath, exportFileName, pageSize } = params!
  const pageBeginIndex = (params!.pageBeginIndex || 0) - 1
  const { type, fields, maxCount, pageCount } = formData
  let mode
  switch (type) {
    case 'count':
      mode = { type, maxCount }
      break
    case 'page':
      mode = { type, pageSize, pageBeginIndex, pageEndIndex: pageBeginIndex + pageCount - 1 }
      break
    // case 'all':
    //   // 因为还是要限制最大数量，这里用 count
    //   mode = { type: 'count', maxCount: maxCountConfig }
    //   break
    default:
      mode = { type }
      break
  }

  const requestBody = {
    // url: ``,
    // params: {},
    // body: {},
    // method: 'get',
    ...requestConfig,
    fields: toValue(fields),
    mode,
    dataPath: dataPath || 'data',
    exportFileName: exportFileName || 'excel',
  }
  downloadFileByForm({
    endpoint: `${API_URL}/ui/export/excel`,
    data: toExcelFormData(requestBody),
    onError: message => ElMessage.error(message || '导出失败'),
  })

  visible.value = false
}

function handleCancel() {
  visible.value = false
}

const exportColumns = ref<{ value: string, label: string }[]>([])

// const total = ref(0)
// const allModeTitle = computed(() => total.value > maxCountConfig ? maxCountConfig : '全部记录')
function open(_params: Params) {
  params = _params
  // total.value = params.total ?? 0
  const { columns } = params
  exportColumns.value = (columns ?? []).filter(e => !e.hideExportExcel).map(({ prop, exportExcelProp, label }) => {
    return { value: exportExcelProp || prop, label }
  })
  formData.fieldNameList = (columns ?? []).filter(e => !e.hideExportExcel && !e.hideColumn).map(e => e.prop)

  visible.value = true
}

const fieldsProps = {
  onSyncItem(items) {
    formData.fields = items.map(({ value, label }) => ({ field: value, name: label }))
  },
}

defineExpose({ open })
</script>

<template>
  <BaseDialog v-model="visible" title="导出 Excel" width="600px" @close="handleCancel">
    <BaseForm :datasource="formData" :enabled-leave-check="false" label-width="100px">
      <template #default="{ model }">
        <BaseFormItem label="导出模式" prop="type">
          <template #default="scope">
            <ElRadioGroup class="type-radio-group" :model-value="scope.modelValue" @update:model-value="scope['onUpdate:modelValue']">
              <ElRadio value="page">
                <span class="radio-prefix">当前页面起共</span>
                <BaseNumber v-model="model.pageCount" class="count-input" :controls="false" />
                <span class="radio-unit">页</span>
              </ElRadio>
              <ElRadio value="count">
                <span class="radio-prefix">指定条数</span>
                <BaseNumber v-model="model.maxCount" class="count-input" :controls="false" :max="maxCountConfig" />
                <span class="radio-unit">条</span>
              </ElRadio>
              <!-- <ElRadio value="all">
                <span class="radio-prefix">{{ allModeTitle }}</span>
              </ElRadio> -->
            </ElRadioGroup>
          </template>
        </BaseFormItem>
        <BaseFormItem label="导出字段" prop="fieldNameList" widget="checkboxGroup" :dict="exportColumns" :widget-props="fieldsProps" />
      </template>
    </BaseForm>
    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton type="primary" @click="handleConfirm">
        确认
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.type-radio-group {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;

  :deep(.el-radio) {
    margin: 0;
    width: 100%;
    padding: 5px 12px;
    background-color: var(--el-fill-color-blank);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
    height: auto;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  :deep(.el-radio + .el-radio) {
    border-top: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-radio.is-checked) {
    background-color: var(--el-color-primary-light-9);
  }

  :deep(.el-radio__label) {
    flex: 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    // line-height: 1.5;
    color: var(--el-text-color-regular);
    justify-content: flex-start;
    padding: 2px 0;
  }

  .radio-prefix {
    min-width: 7em;
    display: inline-flex;
    align-items: center;
  }

  .radio-unit {
    color: var(--el-text-color-secondary);
  }

  .count-input {
    width: 110px;
    margin: 0 8px;
  }
}
</style>

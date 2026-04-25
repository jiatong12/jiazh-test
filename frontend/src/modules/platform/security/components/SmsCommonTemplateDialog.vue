<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'

interface SmsTemplateOption {
  /** 模板编码。 */
  code?: string
  /** 模板名称。 */
  name?: string
  /** 模板类型名称。 */
  templateTypeName?: string
  /** 所属平台名称。 */
  platformIDName?: string
  /** 添加时间。 */
  addTime?: string
}

const props = withDefaults(defineProps<{
  show: boolean
  value?: string
}>(), {
  value: '',
})

const emit = defineEmits<{
  (event: 'update:show', value: boolean): void
  (event: 'callback', value: SmsTemplateOption): void
}>()

const dataLoading = ref(false)
const confirmLoading = ref(false)
const searchName = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref<SmsTemplateOption[]>([])
const selectedCode = ref('')
const selectedRow = ref<SmsTemplateOption>()

const dialogVisible = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

/** 兼容不同返回结构，尽量提取模板列表和总数。 */
function resolveTemplateResponse(responseData: any) {
  const container = responseData?.data ?? responseData

  if (Array.isArray(container)) {
    return {
      rows: container,
      total: container.length,
      isPaged: false,
    }
  }

  const rows
    = container?.list
      || container?.rows
      || container?.records
      || container?.items
      || []

  return {
    rows: Array.isArray(rows) ? rows : [],
    total: Number(container?.total ?? container?.totalCount ?? container?.recordCount ?? 0),
    isPaged: Number(container?.total ?? container?.totalCount ?? container?.recordCount ?? 0) > 0,
  }
}

/** 加载模板列表；如果接口未分页，则在前端做一次本地分页。 */
async function loadTemplates(page = currentPage.value) {
  dataLoading.value = true
  try {
    const response = await axios.get('/ui/sms/template/commons', {
      params: {
        name: searchName.value,
        pageIndex: page,
        pageSize: pageSize.value,
      },
      useBizStatus: true,
    })
    const { rows, total: responseTotal, isPaged } = resolveTemplateResponse(response.data)

    if (isPaged) {
      tableData.value = rows
      total.value = responseTotal
    }
    else {
      total.value = rows.length
      const start = (page - 1) * pageSize.value
      tableData.value = rows.slice(start, start + pageSize.value)
    }

    currentPage.value = page
    selectedRow.value = tableData.value.find(item => item.code === selectedCode.value)
  }
  finally {
    dataLoading.value = false
  }
}

/** 执行搜索，并将分页重置到第一页。 */
function handleSearch() {
  loadTemplates(1)
}

/** 切换表格选中项时，同步当前选中的模板对象。 */
function handleRowClick(row: SmsTemplateOption) {
  selectedRow.value = row
  selectedCode.value = row.code || ''
}

/** 确认选择模板，没有选中项时直接提示。 */
function handleConfirm() {
  if (!selectedRow.value) {
    ElMessage.warning('请选择一个短信模板')
    return
  }

  confirmLoading.value = true
  try {
    emit('callback', selectedRow.value)
    dialogVisible.value = false
  }
  finally {
    confirmLoading.value = false
  }
}

watch(
  () => props.value,
  (value) => {
    selectedCode.value = value || ''
  },
  { immediate: true },
)

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      loadTemplates(1)
    }
  },
)
</script>

<template>
  <ElDialog v-model="dialogVisible" title="选择通用短信模板" width="800px">
    <div class="sms-template-dialog__toolbar">
      <ElInput
        v-model.trim="searchName"
        placeholder="请输入模板名称"
        clearable
        @keyup.enter="handleSearch"
      />
      <BaseButton type="primary" @click="handleSearch">
        查询
      </BaseButton>
    </div>

    <ElTable
      v-loading="dataLoading"
      :data="tableData"
      border
      highlight-current-row
      class="sms-template-dialog__table"
      @row-click="handleRowClick"
    >
      <ElTableColumn label="" width="60" align="center">
        <template #default="{ row }">
          <ElRadio v-model="selectedCode" :value="row.code" @change="handleRowClick(row)">
            &nbsp;
          </ElRadio>
        </template>
      </ElTableColumn>
      <ElTableColumn type="index" width="60" label="#" />
      <ElTableColumn prop="name" label="模板名称" min-width="220" />
      <ElTableColumn prop="templateTypeName" label="模板类型" min-width="140" />
      <ElTableColumn prop="platformIDName" label="所属平台" min-width="160" />
      <ElTableColumn prop="addTime" label="添加时间" min-width="180" />
    </ElTable>

    <div class="sms-template-dialog__pagination">
      <ElPagination
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="loadTemplates"
      />
    </div>

    <template #footer>
      <BaseButton @click="dialogVisible = false">
        取消
      </BaseButton>
      <BaseButton type="primary" :loading="confirmLoading" @click="handleConfirm">
        确定
      </BaseButton>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.sms-template-dialog__toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.sms-template-dialog__table {
  width: 100%;
}

.sms-template-dialog__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

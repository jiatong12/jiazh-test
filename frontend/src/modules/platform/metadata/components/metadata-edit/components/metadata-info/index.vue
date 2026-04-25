<script setup lang="ts">
import type { TableColumnConfig, TableHeaderActionBtn, TableRowActionBtn } from '@/components/base-table'
import axios from 'axios'
import { useHandleConfirm } from '@/hooks/useHandleConfirm'
import { useRequest } from '@/hooks/useRequest'
import util from '@/utils/util'
import MetaColumnGroupForm from './components/MetaColumnGroupForm.vue'

const props = defineProps<{
  modelId: number
  tabName: string
}>()

// const tableRef = useTemplateRef('tableRef')
const formRef = useTemplateRef('formRef')
const metaColumnGroupFormRef = useTemplateRef('metaColumnGroupFormRef')

// 表单数据
const saveSubmitLoading = ref(false)

const metadataTypes = () => axios.get('/ui/metamodels/types').then(r => r.data.data)
const datasourceRequest = useRequest(() => axios.get(`/ui/metamodels/${props.modelId}`).then(r => r.data.data), () => ({ modelSchema: [] }))
const loading = toRef(datasourceRequest, 'delayLoading')
datasourceRequest.send()
// 保存元数据信息
async function saveMetadataClickHandler() {
  formRef.value?.validate()?.then(() => {
    saveSubmitLoading.value = true
    axios.put(`/ui/metamodels/${props.modelId}`, datasourceRequest.result).then(({ data }) => {
      util.showResponseMessage(data)
    }).finally(() => {
      saveSubmitLoading.value = false
    })
  })
}

// 表格列配置
const columns = ref<TableColumnConfig[]>([
  { prop: 'name', label: '名称', minWidth: '120' },
  { prop: 'code', label: '代码', minWidth: '120' },
])

// 表格头部操作按钮
const headerActions: TableHeaderActionBtn[] = [
  {
    name: '添加字段分组',
    priv: 'Platform.Metadata.Save',
    icon: 'i-mdi:plus-thick',
    type: 'primary',
    handle() {
      metaColumnGroupFormRef.value?.openAdd(props.modelId)
    },
  },
]

// 表格行操作按钮
const rowActions: TableRowActionBtn[] = [
  {
    name: '编辑',
    priv: 'Platform.Metadata.Save',
    handle({ row }) {
      metaColumnGroupFormRef.value?.openEdit(props.modelId, row.code)
    },
  },
  {
    name: '删除',
    priv: 'Platform.Metadata.Save',
    confirmTitle: '确定删除吗，删除后无法恢复。是否继续删除？',
    handle({ row }) {
      useHandleConfirm(
        () => axios.delete(`/ui/metamodels/${props.modelId}/groups/${row.code}`),
        '删除字段分组',
      ).then(() => {
        const index = datasourceRequest.result.modelSchema.findIndex((item: any) => item.code === row.code)
        if (index !== -1) {
          datasourceRequest.result.modelSchema.splice(index, 1)
        }
      })
    },
  },
]
</script>

<template>
  <div v-loading="loading" class="flex-column-layout">
    <div class="card mb-3">
      <BaseButton priv="Platform.Metadata.Save" type="primary" :loading="saveSubmitLoading" :icon="$$renderIcon('i-mdi:floppy')" @click="saveMetadataClickHandler">
        保存
      </BaseButton>
    </div>

    <BaseForm ref="formRef" :datasource="datasourceRequest.result" :col="2" label-width="120px">
      <BaseCol :col="1">
        <h4 class="detail-panel-title mb-3">
          基本信息
        </h4>
      </BaseCol>

      <BaseFormItem label="元数据模型" prop="name" />
      <BaseFormItem
        label="代码" prop="code"
        :rules="[
          { required: true, message: '请输入代码' },
          { pattern: /^[\w\.]{0,38}$/, message: '请输入字母、数字、下划线、点且长度不超过38个字符' },
        ]"
      />

      <BaseFormItem label="备注" prop="memo" />
      <BaseFormItem label="类型" prop="ownerType" widget="text" :dict="metadataTypes" :widget-props="{ labelField: 'name', valueField: 'ID' }" />

      <BaseFormItem label="所属ID" prop="ownerID" widget="text" />
      <BaseFormItem label="物理表名" prop="targetTable" widget="text" />
    </BaseForm>

    <div class="mt-3">
      <BaseTable
        v-model:columns="columns"
        row-key="code"
        :datasource="datasourceRequest.result.modelSchema"
        :show-index="true"
        :show-selection="false"
        :show-search-action="false"
        :show-pagination="false"
        actions-width="120"
        :header-actions="headerActions"
        :row-actions="rowActions"
      />
    </div>
    <MetaColumnGroupForm ref="metaColumnGroupFormRef" @add-success="datasourceRequest.send()" @edit-success="datasourceRequest.send()" />
  </div>
</template>

<style scoped lang="scss">
.detail-panel-title {
  color: black;
  font-weight: bold;
  padding: 15px 0;
}
</style>

<script setup lang="ts">
import axios from 'axios'
import { useResettableState } from '@/hooks/useResettableState'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const visible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const editId = ref<number>(0)

const [formData, resetFormData] = useResettableState(() => ({
  categoryName: '',
  orderFlag: null as number | null,
}))

function open(id?: number) {
  isEdit.value = !!id
  editId.value = id || 0
  submitLoading.value = false
  resetFormData()

  if (id) {
    axios.get(`/ui/cs/categories/${id}`).then(({ data }) => {
      if (data.status === 1) {
        const row = Array.isArray(data.data) ? data.data[0] : data.data
        if (row) {
          formData.value.categoryName = row.categoryName
          formData.value.orderFlag = row.orderFlag
        }
      }
    })
  }
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  submitLoading.value = true
  const request = isEdit.value
    ? axios.put(`/ui/cs/categories/${editId.value}`, formData.value)
    : axios.post('/ui/cs/categories', formData.value)

  request.then(({ data }) => {
    emit('submitSuccess')
    handleCancel()
    util.showResponseMessage({ data })
  }).finally(() => {
    submitLoading.value = false
  })
}

defineExpose({ open })
</script>

<template>
  <BaseDialog v-model="visible" :title="isEdit ? '编辑分类' : '新增分类'" width="500px">
    <BaseForm :datasource="formData" :col="1" label-width="100px">
      <template #default="{ model }">
        <BaseFormItem label="分类名称" prop="categoryName" :verify="['NotNull']" />
        <BaseFormItem label="排序号" prop="orderFlag">
          <ElInputNumber v-model="model.orderFlag" :min="0" controls-position="right" />
        </BaseFormItem>
      </template>
    </BaseForm>
    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">保存</ElButton>
    </template>
  </BaseDialog>
</template>

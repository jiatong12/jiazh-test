<script setup lang="ts">
import axios from 'axios'
import { useResettableState } from '@/hooks/useResettableState'
import util from '@/utils/util'

const props = defineProps<{
  categoryList: any[]
}>()

const emit = defineEmits(['submitSuccess'])
const visible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const editId = ref<number>(0)

const [formData, resetFormData] = useResettableState(() => ({
  title: '',
  originalContent: '',
  categoryID: null as number | null,
  status: 0,
}))

function open(id?: number) {
  isEdit.value = !!id
  editId.value = id || 0
  submitLoading.value = false
  resetFormData()

  if (id) {
    axios.get(`/ui/cs/contents/${id}/edit`).then(({ data }) => {
      if (data.status === 1) {
        const row = Array.isArray(data.data) ? data.data[0] : data.data
        formData.value.title = row.title || row.Title
        formData.value.originalContent = row.originalContent || row.OriginalContent
        formData.value.categoryID = row.categoryID || row.CategoryID || null
        formData.value.status = row.status ?? row.Status ?? 0
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
    ? axios.put(`/ui/cs/contents/${editId.value}`, formData.value)
    : axios.post('/ui/cs/contents', formData.value)

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
  <BaseDialog v-model="visible" :title="isEdit ? '编辑内容' : '新增内容'" width="700px">
    <BaseForm :datasource="formData" :col="1" label-width="100px">
      <template #default="{ model }">
        <BaseFormItem label="标题" prop="title" :verify="['NotNull']" />
        <BaseFormItem label="分类" prop="categoryID">
          <ElSelect v-model="model.categoryID" placeholder="请选择分类" clearable>
            <ElOption v-for="cat in props.categoryList" :key="cat.id" :label="cat.categoryName" :value="cat.id" />
          </ElSelect>
        </BaseFormItem>
        <BaseFormItem label="状态" prop="status">
          <ElRadioGroup v-model="model.status">
            <ElRadio :value="0">草稿</ElRadio>
            <ElRadio :value="1">已发布</ElRadio>
          </ElRadioGroup>
        </BaseFormItem>
        <BaseFormItem label="内容" prop="originalContent" :verify="['NotNull']">
          <ElInput v-model="model.originalContent" type="textarea" :rows="8" placeholder="请输入内容" />
        </BaseFormItem>
      </template>
    </BaseForm>
    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">保存</ElButton>
    </template>
  </BaseDialog>
</template>

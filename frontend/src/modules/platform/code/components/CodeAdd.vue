<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

// 表单数据
const [formData, resetFormData] = useResettableState(() => ({
  codeType: '',
  codeName: '',
  memo: '',
}))

/**
 * 打开，并根据参数初始化表单
 * @param data 初始表单的数据
 */
function openWithData(data: Record<string, any>): void {
  submitLoading.value = false
  // 重置
  resetFormData()
  // 合并
  formData.value = { ...formData.value, ...cloneDeep(data) }
  visible.value = true
}

function open(): void {
  openWithData({})
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.post('/ui/codes', formData.value).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const rules: FormRules = {
  codeType: [
    { required: true, message: '请输入类别', trigger: 'blur' },
    {
      pattern: /^[-.$\w]{0,40}$/,
      message: '请输入字母、数字、下划线、点且长度不超过40个字符',
      trigger: ['blur', 'change'],
    },
  ],
  codeName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    {
      pattern: /^[-.\w\u4E00-\u9FA5]{0,2000}$/,
      message: '请输入汉字、字母、数字、点且长度不超过2000个字符',
      trigger: ['blur', 'change'],
    },
  ],
}

defineExpose({ open, openWithData, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="新增代码类别"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="rules"
      :col="1"
      label-width="100px"
    >
      <BaseFormItem label="代码类别" prop="codeType" />
      <BaseFormItem label="代码名称" prop="codeName" />
      <BaseFormItem label="备注" prop="memo" />
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.Code.Add" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

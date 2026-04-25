<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
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
 * 打开
 */
function open(_codeType: string): void {
  submitLoading.value = false
  // 重置
  resetFormData()
  // 合并
  formData.value.codeType = _codeType
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.post(`/ui/codes/${formData.value.codeType}/items`, formData.value).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const rules: FormRules = {
  codeType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
  codeName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    {
      pattern: /^[-.\w\u4E00-\u9FA5]{0,2000}$/,
      message: '请输入汉字、字母、数字、点且长度不超过2000个字符',
      trigger: ['blur', 'change'],
    },
  ],
  codeValue: [
    { required: true, message: '请输入值', trigger: 'blur' },
    {
      pattern: /^[-.\w\u4E00-\u9FA5]{0,40}$/,
      message: '请输入汉字、字母、数字、点且长度不超过40个字符',
      trigger: ['blur', 'change'],
    },
  ],
}

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="新增代码项"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="rules"
      :col="1"
      label-width="100px"
    >
      <BaseFormItem label="代码" prop="codeType" widget="text" />
      <BaseFormItem label="值" prop="codeValue" />
      <BaseFormItem label="名称" prop="codeName" />
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

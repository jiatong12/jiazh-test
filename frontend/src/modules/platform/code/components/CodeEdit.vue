<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { ref } from 'vue'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

const codeType = ref('')
// 表单数据
const datasource = () => axios.get(`/ui/codes/${codeType.value}`).then(r => r.data.data)

/**
 * 打开，并根据参数初始化表单
 * @param _codeType 初始表单的数据
 */
function open(_codeType: string): void {
  codeType.value = _codeType
  submitLoading.value = false
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.post('/ui/codes', formRef.value?.model).then(({ data }) => {
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

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="编辑代码类别"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="datasource"
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
      <BaseButton priv="Platform.Code.Edit" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import { pinyin } from 'pinyin-pro'
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
  ID: void 0,
  name: '',
  code: '',
  ownerType: '',
  memo: '',
  ownerID: '0',
}))

/**
 * 打开
 */
function open(data?: Record<string, any>): void {
  submitLoading.value = false
  // 重置
  resetFormData()
  // 合并
  formData.value = { ...formData.value, ...cloneDeep(data), ID: void 0 }
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.post('/ui/metamodels', formData.value).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

/**
 * 根据名称初始化
 */
function initCodeByName() {
  if (formData.value.code?.trim()) {
    return
  }
  formData.value.code = pinyin(formData.value.name, { pattern: 'first', toneType: 'none' }).replace(/\s/g, '')
}

const rules: FormRules = {
  userName: [{ required: true, message: '不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '不能为空', trigger: 'blur' }, { pattern: /^[\\w.]{0,38}$/, message: '请输入字母、数字、下划线、点且长度不超过38个字符', trigger: 'blur' }],
  ownerType: [{ required: true, message: '不能为空', trigger: 'change' }],
}

const ownerType = () => axios.get('/ui/metamodels/types').then(r => (r.data.data ?? []).map(e => ({ label: e.name, value: e.ID })))

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="新建元数据模型"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="rules"
      :col="1"
    >
      <BaseFormItem label="元数据模型名称" prop="name" widget="input" :widget-props="{ onChange: initCodeByName }" help="富有意义的可读的名称" />
      <BaseFormItem label="代码" prop="code" help="程序逻辑中将使用此代码存取元数据" />
      <BaseFormItem label="类型" prop="ownerType" widget="select" :dict="ownerType" help="系统元数据只支持机构(代码=branch)和用户(代码=user)" />
      <BaseFormItem label="备注" prop="memo" widget="textarea" help="关于此模型的其他说明信息" />
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.Metadata.Save" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

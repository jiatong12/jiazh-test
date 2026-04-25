<script setup lang="ts">
import type { FormRules } from 'element-plus'
import axios from 'axios'
import RoleSelect from './RoleSelectDialog.vue'
import UserSelect from './UserSelectDialog.vue'

const emit = defineEmits(['submitSuccess'])

// 响应式数据
const formRef = useTemplateRef('formRef')

// 表单验证规则
const rules: FormRules = {
  subject: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { min: 1, max: 2000, message: '长度在 1 到 2000 个字符', trigger: 'blur' },
  ],
}

const visible = ref(false)
const data = ref<any>({})
const submitLoading = ref(false)
function submit() {
  // 验证接收人和接收角色不能都为空
  if (!data.value.toUser && !data.value.toRole) {
    ElMessage.info('接收用户和接收角色不能都为空！')
  }

  formRef.value?.validate().then(() => {
    submitLoading.value = false
    axios.post('/ui/message', data.value).then(() => {
      emit('submitSuccess')
      handleCancel()
    }).finally(() => {
      submitLoading.value = true
    })
  })
}

function open() {
  data.value = {}
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <BaseDialog v-model="visible" title="新建消息" width="600px">
    <BaseForm ref="formRef" :datasource="data" :rules="rules" :enabled-leave-check="false">
      <BaseFormItem prop="toUser" label="接收人">
        <UserSelect v-model="data.toUser" />
      </BaseFormItem>
      <BaseFormItem prop="toRole" label="接收角色">
        <RoleSelect v-model="data.toRole" />
      </BaseFormItem>
      <BaseFormItem prop="subject" label="标题" />
      <BaseFormItem prop="content" label="内容" widget="textarea" />
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取 消
      </BaseButton>
      <BasePrimaryButton :loading="submitLoading" @click="submit">
        确定
      </BasePrimaryButton>
    </template>
  </BaseDialog>
</template>

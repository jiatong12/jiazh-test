<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const emit = defineEmits(['submitSuccess'])
const formRef = useTemplateRef('formRef')

// 表单验证规则
const rules = {
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { min: 1, max: 2000, message: '长度在 1 到 2000 个字符', trigger: 'blur' },
  ],
}

const visible = ref(false)
const data = ref<any>({})
function submitApi() {
  return axios.post('/ui/message/reply', data.value).then(() => {
    emit('submitSuccess')
    handleCancel()
  })
}
/**
 * 打开，并根据参数初始化表单
 * @param _data 初始表单的数据
 */
function open(_data): void {
  data.value = {
    toUser: _data.toUser,
    subject: `回复：${_data.subject}`,
    content: '',
  }
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <BaseDialog v-model="visible" title="回复" width="450px">
    <BaseForm ref="formRef" :datasource="data" :rules="rules" label-width="100px">
      <BaseFormItem prop="toUser" label="接收人" is-readonly />
      <BaseFormItem prop="subject" label="标题" is-readonly />
      <BaseFormItem prop="content" label="内容" widget="textarea" />
    </BaseForm>

    <template #footer>
      <div class="dialog-footer">
        <BaseButton @click="handleCancel">
          取 消
        </BaseButton>
        <BaseActionButton :api="submitApi" :validate="formRef?.validate">
          确定
        </BaseActionButton>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
</style>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { uploadImageApi } from './data'

const formRef = ref<FormInstance>()
const formModel = reactive({
  avatar: '',
  photos: ['/branding/login-bg.svg'],
  username: '',
})

const rules = reactive({
  avatar: [{ required: true, message: '请上传用户头像' }],
  photos: [{ required: true, message: '请上传用户照片' }],
  username: [{ required: true, message: '请填写用户姓名' }],
})

function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('表单校验通过')
    }
  })
}

function resetForm() {
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="base-upload-form-demo">
    <BaseCard title="表单联动">
      <ElAlert
        class="mb-4"
        title="上传成功后会主动触发表单校验；父表单 disabled 时，上传组件也会自动进入禁用态。"
        type="info"
        :closable="false"
        show-icon
      />

      <ElForm ref="formRef" label-width="92px" :rules="rules" :model="formModel">
        <ElFormItem label="用户头像" prop="avatar">
          <BaseUploadImage
            v-model="formModel.avatar"
            width="135px"
            height="135px"
            :file-size="3"
            :api="uploadImageApi"
          />
        </ElFormItem>
        <ElFormItem label="用户照片" prop="photos">
          <BaseUploadImages
            v-model="formModel.photos"
            :limit="3"
            height="130px"
            width="130px"
            border-radius="50%"
            :api="uploadImageApi"
          />
        </ElFormItem>
        <ElFormItem label="用户姓名" prop="username">
          <ElInput v-model="formModel.username" placeholder="请输入用户姓名" clearable />
        </ElFormItem>
        <ElFormItem>
          <BaseButton @click="resetForm">
            重置
          </BaseButton>
          <BaseButton type="primary" @click="submitForm">
            提交
          </BaseButton>
        </ElFormItem>
      </ElForm>
    </BaseCard>
  </div>
</template>

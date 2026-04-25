<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'
import { PasswordCrypto } from '@/utils/passwordCrypto'
import util from '@/utils/util'

const emit = defineEmits<{
  (e: 'submitSuccess'): void
}>()
const formRef = useTemplateRef('formRef')

const [formData, resetFormData] = useResettableState(() => ({
  userName: '',
  oldPassword: '',
  password: '',
  repeatPassword: '',
}))

const visible = ref(false)
const title = ref('')

const passwordLimit = ref({
  max: 18,
  min: 5,
})

const formRules = {
  oldPassword: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (value.length < passwordLimit.value.min || value.length > passwordLimit.value.max) {
          callback(new Error(`必须是 ${passwordLimit.value.min}-${passwordLimit.value.max} 位的字符`))
        }
        else {
          callback()
        }
      },
      trigger: 'blur change',
    },
  ],
  repeatPassword: [
    {
      required: true,
      message: '请重复输入一次密码',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (value !== formData.value.password) {
          callback(new Error('两次输入密码不一致!'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

async function initializePasswordLimit() {
  const res = await axios.get('/ui/users/initpwdcheck')
  passwordLimit.value = {
    max: res.data.maxLen,
    min: res.data.minLen,
  }
}

// 新增 open 方法用于打开对话框
function open(_title: string, _userName: string) {
  title.value = _title

  resetFormData()
  formData.value.userName = _userName

  initializePasswordLimit()

  visible.value = true
}

function handleCancel() {
  visible.value = false
}

const submitLoading = ref(false)
async function handleConfirm() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    const userName = formData.value.userName
    axios.put('/ui/users/changeloginpassword', {
      userName,
      oldPassword: PasswordCrypto.encrypt(formData.value.oldPassword, userName),
      password: PasswordCrypto.encrypt(formData.value.password, userName),
    }).then(({ data }) => {
      if (data.data?.status === 1) {
        emit('submitSuccess')
        handleCancel()
      }
      util.showResponseMessage(data.data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

defineExpose({
  open,
})
</script>

<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="formRules"
      label-width="100px"
      @keydown.enter="handleConfirm"
    >
      <BaseFormItem label="用户名" prop="userName" data="username-input" is-readonly />
      <BaseFormItem label="旧密码" prop="oldPassword" data="old-password-input" widget="input" :widget-props="{ type: 'password' }" />
      <BaseFormItem label="密码" prop="password" data="password-input" widget="input" :widget-props="{ type: 'password' }" />
      <BaseFormItem label="确认密码" prop="repeatPassword" data="repeat-password-input" widget="input" :widget-props="{ type: 'password' }" />
    </BaseForm>
    <template #footer>
      <ElButton @click="handleCancel">
        取 消
      </ElButton>
      <ElButton type="primary" :disabled="submitLoading" :loading="submitLoading" @click="handleConfirm">
        确 定
      </ElButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

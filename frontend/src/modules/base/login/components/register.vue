<script setup lang="ts">
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useStore } from '../context'
import Motion from '../utils/motion'
import { updateRules } from '../utils/rule'
import { useVerifyCode } from '../utils/verifyCode'

const { swatchLogin } = useStore()

const checked = ref(false)
const loading = ref(false)
const ruleForm = reactive({
  username: '',
  phone: '',
  verifyCode: '',
  password: '',
  repeatPassword: '',
})
const ruleFormRef = ref<FormInstance>()
const { isDisabled, text } = useVerifyCode()
const repeatPasswordRule: FormItemRule[] = [
  {
    validator: (_rule, value, callback) => {
      if (value === '') {
        callback('请输入确认密码')
      }
      else if (ruleForm.password !== value) {
        callback('两次密码不一致!')
      }
      else {
        callback()
      }
    },
    trigger: 'blur',
  },
]

async function onUpdate(formEl: FormInstance | undefined) {
  loading.value = true
  if (!formEl) { return }
  await formEl.validate().then(() => {
    if (checked.value) {
      // 模拟请求，需根据实际开发进行修改
      window.setTimeout(() => {
        ElMessage.success('注册成功')
        loading.value = false
      }, 2000)
    }
    else {
      loading.value = false
      ElMessage.warning('请勾选隐私政策')
    }
  }).finally(() => {
    loading.value = false
  })
}

function onBack() {
  useVerifyCode().end()
  swatchLogin()
}
</script>

<template>
  <ElForm
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="updateRules"
  >
    <Motion>
      <ElFormItem
        :rules="[
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
          },
        ]"
        prop="username"
      >
        <BaseInput
          v-model="ruleForm.username"
          clearable
          placeholder="账号"
          :prefix-icon="$$renderIcon('i-lucide:user-round')"
        />
      </ElFormItem>
    </Motion>

    <Motion :delay="100">
      <ElFormItem prop="phone">
        <BaseInput
          v-model="ruleForm.phone"
          clearable
          placeholder="手机号码"
          :prefix-icon="$$renderIcon('i-lucide:smartphone')"
        />
      </ElFormItem>
    </Motion>

    <Motion :delay="150">
      <ElFormItem prop="verifyCode">
        <div class="w-full flex-justify-between">
          <BaseInput
            v-model="ruleForm.verifyCode"
            clearable
            placeholder="短信验证码"
            :prefix-icon="$$renderIcon('i-ri:shield-keyhole-line')"
          />
          <BaseButton
            :disabled="isDisabled"
            class="ml-2"
            @click="useVerifyCode().start(ruleFormRef, 'phone')"
          >
            {{ text.length > 0 ? `${text}秒后重新获取` : '获取验证码' }}
          </BaseButton>
        </div>
      </ElFormItem>
    </Motion>

    <Motion :delay="200">
      <ElFormItem prop="password">
        <BaseInput
          v-model="ruleForm.password"
          clearable
          placeholder="密码"
          :prefix-icon="$$renderIcon('i-lucide:lock-keyhole')"
        />
      </ElFormItem>
    </Motion>

    <Motion :delay="250">
      <ElFormItem :rules="repeatPasswordRule" prop="repeatPassword">
        <BaseInput
          v-model="ruleForm.repeatPassword"
          clearable
          placeholder="确认密码"
          :prefix-icon="$$renderIcon('i-lucide:lock-keyhole')"
        />
      </ElFormItem>
    </Motion>

    <Motion :delay="300">
      <ElFormItem>
        <ElCheckbox v-model="checked">
          我已仔细阅读并接受
        </ElCheckbox>
        <BaseButton link>
          《隐私政策》
        </BaseButton>
      </ElFormItem>
    </Motion>

    <Motion :delay="350">
      <ElFormItem>
        <BasePrimaryButton
          class="w-full"
          :loading="loading"
          @click="onUpdate(ruleFormRef)"
        >
          确定
        </BasePrimaryButton>
      </ElFormItem>
    </Motion>

    <Motion :delay="400">
      <ElFormItem>
        <BaseButton class="w-full" @click="onBack">
          返回
        </BaseButton>
      </ElFormItem>
    </Motion>
  </ElForm>
</template>

<script setup lang="tsx">
import type { FormInstance, FormItemRule } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import axios from 'axios'
import { debounce } from 'lodash-es'
import { reactive, ref } from 'vue'
import { useEnv } from '@/env'
import PasswordModifyDialog from '@/modules/base/login/components/PasswordModifyDialog.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useStore } from '../../context'
import Motion from '../../utils/motion'
// import { operates, thirdParty } from './constants'

// const { swatchPage, swatchForget } = useStore()
// const { swatchForget } = useStore()
const { swatchPhone } = useStore()

const authStore = useAuthStore()

const passwordModifyDialogRef = useTemplateRef('passwordModifyDialogRef')
const loginFormRef = ref<FormInstance>()
const loginRules = ({
  userName: [{ required: true, message: '不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '不能为空', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
}) satisfies Record<string, FormItemRule[]>

const loading = ref(false)
const loginForm = reactive({
  userName: '',
  password: '',
  verifyCode: '',
})
// const imgCode = ref('')
// const loginDay = ref(7)
// const checked = ref(false)

// login
function onLogin(formEl: FormInstance | undefined) {
  if (!formEl) { return }
  formEl.validate().then(() => {
    loading.value = true
    authStore.loginByAccount({ ...loginForm }).then((res) => {
      const { editPwdModal, editPwdModalTitle } = res
      if (editPwdModal) {
        passwordModifyDialogRef.value?.open(editPwdModalTitle, loginForm.userName)
      }
    }).finally(() => {
      loading.value = false
    })
  })
}

// 防抖
const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  { leading: true },
)
// 监听回车
useEventListener(document, 'keypress', ({ code }) => {
  if (code === 'Enter' && !loading.value) { immediateDebounce(loginFormRef.value) }
})

/* demo 账号 */
const { DEMO_ACCOUNTS } = useEnv()
function onClickDemoAccount(accountInfo: any) {
  // 设置账号
  loginForm.userName = accountInfo.accountNo
  loginForm.password = accountInfo.password
  // 登录
  immediateDebounce(loginFormRef.value)
}

/* 验证码 */
const authCodeURL = ref('')
function refreshAuthCodeURL() {
  authCodeURL.value = `${axios.defaults.baseURL}/ui/authCode.png?t=${Date.now()}`
}
refreshAuthCodeURL()
</script>

<template>
  <ElForm
    ref="loginFormRef"
    :model="loginForm"
    :rules="loginRules"
  >
    <Motion :delay="100">
      <!-- <BaseIcon name="i-svg-spinners:wind-toy" />
      <BaseIcon name="i-svg-spinners:blocks-wave" />
      <BaseIcon name="i-line-md:compass-filled-loop" /> -->
      <ElFormItem
        :rules="[
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
          },
        ]"
        prop="userName"
      >
        <BaseInput
          v-model="loginForm.userName"
          clearable
          placeholder="账号"
          :prefix-icon="$$renderIcon('i-lucide:user-round')"
        />
      </ElFormItem>
    </Motion>

    <Motion :delay="150">
      <ElFormItem prop="password">
        <BasePassword
          v-model="loginForm.password"
          clearable
          placeholder="密码"
          :prefix-icon="$$renderIcon('i-lucide:lock-keyhole')"
        />
      </ElFormItem>
    </Motion>

    <Motion v-if="authStore.showVerifyCode" :delay="200">
      <ElFormItem prop="verifyCode">
        <BaseInput
          v-model="loginForm.verifyCode"
          clearable
          placeholder="验证码"
          :prefix-icon="$$renderIcon('i-ri:shield-keyhole-line')"
          class="verify-code"
        >
          <template #prepend>
            <img :src="authCodeURL" height="28" @click="refreshAuthCodeURL">
          </template>
        </BaseInput>
      </ElFormItem>
    </Motion>

    <Motion :delay="250">
      <ElFormItem>
        <div class="login-options-container">
          <span v-if="authStore.showPhoneLoginEntry" class="login-options-tip">
            支持手机验证码快捷登录
          </span>
          <BaseButton v-if="authStore.showPhoneLoginEntry" link class="login-switch-button" @click="swatchPhone()">
            <BaseIcon name="i-lucide:smartphone" class="login-switch-button__icon" />
            <span>手机登录</span>
            <BaseIcon name="i-lucide:arrow-right" class="login-switch-button__arrow" />
          </BaseButton>
          <!-- <ElCheckbox v-model="checked">
            <span class="auto-login-container">
              <select
                v-model="loginDay"
                :style="{
                  width: loginDay < 10 ? '10px' : '16px',
                }"
                class="login-day-select"
              >
                <option value="1">1</option>
                <option value="7">7</option>
                <option value="30">30</option>
              </select>
              <span class="auto-login-label">
                天内免登录
                <BaseHelp>勾选并登录后，规定天数内无需输入用户名和密码会自动登录系统</BaseHelp>
              </span>
            </span>
          </ElCheckbox> -->

          <!-- <BasePrimaryButton
            link
            @click="swatchForget()"
          >
            忘记密码？
          </BasePrimaryButton> -->
        </div>
        <BasePrimaryButton
          class="login-button"
          :loading="loading"
          @click="onLogin(loginFormRef)"
        >
          登录
        </BasePrimaryButton>
      </ElFormItem>
    </Motion>

    <!-- <Motion :delay="300">
      <ElFormItem>
        <div class="operate-buttons-container">
          <BaseButton
            v-for="(item, index) in operates"
            :key="index"
            class="operate-button"
            @click="swatchPage(item.mode)"
          >
            {{ item.title }}
          </BaseButton>
        </div>
      </ElFormItem>
    </Motion> -->

    <!-- <Motion :delay="350">
      <ElFormItem>
        <ElDivider>
          <span class="divider-text">
            第三方登录
          </span>
        </ElDivider>
        <div class="third-party-container">
          <span
            v-for="(item, index) in thirdParty"
            :key="index"
            :title="item.title"
            class="third-party-icon-wrapper"
          >
            <BaseIcon :name="item.icon" class="third-party-icon" />
          </span>
        </div>
      </ElFormItem>
    </Motion> -->

    <Motion v-if="DEMO_ACCOUNTS?.length" :delay="400">
      <ElFormItem>
        <ElDivider>
          <span class="divider-text">
            演示账号一键登录
          </span>
        </ElDivider>
        <div class="demo-accounts-container">
          <div class="demo-accounts-wrapper">
            <ElButtonGroup>
              <BaseButton
                v-for="item in DEMO_ACCOUNTS"
                :key="item.accountNo"
                :value="item.accountNo"
                class="demo-account-button"
                @click="onClickDemoAccount(item)"
              >
                {{ item.label }}
              </BaseButton>
            </ElButtonGroup>
          </div>
        </div>
      </ElFormItem>
    </Motion>
    <PasswordModifyDialog ref="passwordModifyDialogRef" />
  </ElForm>
</template>

<style scoped>
.login-options-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 32px;
}

.login-options-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.login-switch-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 6px 12px;
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 999px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 13px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.login-switch-button:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}

.login-switch-button__icon,
.login-switch-button__arrow {
  font-size: 14px;
}

.login-switch-button__arrow {
  opacity: 0.72;
  transition: opacity 0.2s ease;
}

.login-switch-button:hover .login-switch-button__arrow {
  opacity: 0.9;
}

.auto-login-container {
  display: flex;
  align-items: center;
}

.login-day-select {
  outline: none;
  border: none;
  background: none;
  appearance: none;
}

.auto-login-label {
}

.login-button {
  margin-top: 16px;
  width: 100%;
}

.operate-buttons-container {
  height: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.operate-button {
  margin-top: 16px;
  width: 100%;
}

.divider-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.third-party-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.third-party-icon-wrapper {
}

.third-party-icon {
  cursor: pointer;
  font-size: 18px;
  color: var(--el-text-color-secondary);
}

.third-party-icon:hover {
  color: var(--el-color-primary);
}

.demo-accounts-container {
  width: 100%;
}

.demo-accounts-wrapper {
  margin-left: 16px; /* ml-4 转换 */
}

.verify-code .el-input-group__prepend {
  padding: 0;
}
</style>

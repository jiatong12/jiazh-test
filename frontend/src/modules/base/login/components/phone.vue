<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { isMobile } from '@/utils/validate/validate'
import { useStore } from '../context'
import Motion from '../utils/motion'
import { phoneRules } from '../utils/rule'
import PasswordModifyDialog from './PasswordModifyDialog.vue'

const authStore = useAuthStore()
const { swatchLogin } = useStore()

const passwordModifyDialogRef = useTemplateRef('passwordModifyDialogRef')
const loading = ref(false)
const smsImageCodeVisible = ref(false)
const smsImageCode = ref('')
const smsAuthCodeRenderSrc = ref('')
const smsAuthCodeLoading = ref(false)
let smsAuthCodeRequestId = 0
const ruleForm = reactive({
  phone: '',
  verifyCode: '',
})
const ruleFormRef = ref<FormInstance>()

const sendButtonDisabled = computed(() => {
  return authStore.smsSendCounter > 0 || authStore.smsSending
})

onMounted(() => {
  // 进入手机号登录页时先预热一次短信配置，避免首次点“获取验证码”才发现需要图形验证码。
  void authStore.initPhoneLogin()
})

async function validatePhoneField() {
  if (!ruleFormRef.value) {
    return false
  }

  try {
    await ruleFormRef.value.validateField('phone')
    return true
  }
  catch {
    return false
  }
}

async function handlePhoneBlur() {
  const mobile = ruleForm.phone.trim()
  if (!mobile || !isMobile(mobile) || authStore.smsSendCounter > 0) {
    return
  }

  // 失焦预热只负责拿当前手机号的发送限制和验证码要求，不直接触发发送。
  await authStore.initPhoneLogin(mobile)
}

async function handleSendVerifyCode() {
  if (sendButtonDisabled.value) {
    return
  }

  const isValid = await validatePhoneField()
  if (!isValid) {
    return
  }

  const mobile = ruleForm.phone.trim()
  const canContinue = await authStore.initPhoneLogin(mobile)
  if (!canContinue) {
    return
  }

  // 图形验证码要求由短信通道动态决定，前端只按后端开关决定是否弹窗。
  if (authStore.smsNeedAuthCode) {
    await openSmsImageCodeDialog()
    return
  }

  await authStore.sendPhoneVerifyCode({
    mobile,
  })
}

async function handleConfirmImageCode() {
  if (!smsImageCode.value.trim()) {
    ElMessage.warning('请输入图形验证码！')
    return
  }

  // 图形验证码只用于放行短信发送，不参与最终登录接口。
  const success = await authStore.sendPhoneVerifyCode({
    mobile: ruleForm.phone.trim(),
    authCode: smsImageCode.value.trim(),
  })

  if (success) {
    handleCloseImageCodeDialog()
  }
}

function handleCloseImageCodeDialog() {
  smsImageCodeVisible.value = false
  smsImageCode.value = ''
}

/**
 * 先在内存中加载验证码图片，再切换到界面显示。
 * 这样即使后端或浏览器层面出现短时间内多次地址刷新，用户也只会看到最终结果，不会看到连续闪烁的中间态。
 */
function loadSmsAuthCodeImage() {
  smsAuthCodeLoading.value = true
  authStore.refreshSmsAuthCode()
  const nextSrc = authStore.smsAuthCodeURL
  const requestId = ++smsAuthCodeRequestId

  return new Promise<void>((resolve) => {
    const image = new Image()
    const finalize = () => {
      // 只接纳最后一次请求的结果，避免前一次慢响应把已经准备好的新图覆盖掉。
      if (requestId === smsAuthCodeRequestId) {
        smsAuthCodeRenderSrc.value = nextSrc
        smsAuthCodeLoading.value = false
      }
      resolve()
    }

    image.onload = finalize
    image.onerror = finalize
    image.src = nextSrc
  })
}

/** 打开图形验证码弹窗前，先把图片准备好，避免弹窗打开时连续换图。 */
async function openSmsImageCodeDialog() {
  smsImageCodeVisible.value = false
  await loadSmsAuthCodeImage()
  smsImageCodeVisible.value = true
}

/** 点击图片手动刷新时，仍复用同一套预加载逻辑，保证刷新体验稳定。 */
async function handleRefreshSmsAuthCode() {
  await loadSmsAuthCodeImage()
}

async function onLogin(formEl: FormInstance | undefined) {
  if (!formEl) {
    return
  }

  await formEl.validate()
  loading.value = true

  try {
    const res = await authStore.loginByPhone({
      mobile: ruleForm.phone.trim(),
      code: ruleForm.verifyCode.trim(),
    })

    // 手机号登录和账号密码登录共用改密分支，避免登录方式不同导致后续流程分叉。
    if (res?.editPwdModal) {
      passwordModifyDialogRef.value?.open(
        res.editPwdModalTitle,
        res.editPwdModalUserName || ruleForm.phone.trim(),
      )
    }
  }
  finally {
    loading.value = false
  }
}

function onBack() {
  handleCloseImageCodeDialog()
  swatchLogin()
}
</script>

<template>
  <ElForm ref="ruleFormRef" :model="ruleForm" :rules="phoneRules">
    <Motion>
      <ElFormItem prop="phone">
        <BaseInput
          v-model="ruleForm.phone"
          clearable
          placeholder="手机号码"
          :prefix-icon="$$renderIcon('i-lucide:smartphone')"
          @blur="handlePhoneBlur"
        />
      </ElFormItem>
    </Motion>

    <Motion :delay="100">
      <ElFormItem prop="verifyCode">
        <div class="phone-login-verify">
          <BaseInput
            v-model="ruleForm.verifyCode"
            clearable
            placeholder="短信验证码"
            :prefix-icon="$$renderIcon('i-ri:shield-keyhole-line')"
          />
          <BaseButton
            :disabled="sendButtonDisabled"
            class="phone-login-verify__button"
            @mousedown.prevent
            @click="handleSendVerifyCode"
          >
            {{
              authStore.smsSendCounter > 0
                ? `${authStore.smsSendCounter}s后重新获取`
                : authStore.smsSending ? '正在发送' : '获取验证码'
            }}
          </BaseButton>
        </div>
      </ElFormItem>
    </Motion>

    <Motion :delay="150">
      <ElFormItem>
        <BasePrimaryButton
          class="w-full"
          :loading="loading"
          @click="onLogin(ruleFormRef)"
        >
          登录
        </BasePrimaryButton>
      </ElFormItem>
    </Motion>

    <Motion :delay="200">
      <ElFormItem>
        <BaseButton class="w-full" @click="onBack">
          返回
        </BaseButton>
      </ElFormItem>
    </Motion>

    <PasswordModifyDialog ref="passwordModifyDialogRef" />
  </ElForm>

  <BaseDialog
    v-model="smsImageCodeVisible"
    title="校验验证码"
    width="420px"
    append-to-body
    :show-fullscreen="false"
    @closed="handleCloseImageCodeDialog"
  >
    <div class="phone-login-auth-code">
      <BaseInput
        v-model="smsImageCode"
        clearable
        placeholder="请输入图形验证码"
        @keydown.enter="handleConfirmImageCode"
      />
      <div class="phone-login-auth-code__image-wrapper">
        <div v-if="smsAuthCodeLoading" class="phone-login-auth-code__image-placeholder">
          验证码加载中
        </div>
        <img
          v-else
          class="phone-login-auth-code__image"
          :src="smsAuthCodeRenderSrc"
          alt="图形验证码"
          @click="handleRefreshSmsAuthCode"
        >
      </div>
    </div>
    <template #footer>
      <ElButton @click="handleCloseImageCodeDialog">
        取 消
      </ElButton>
      <ElButton type="primary" :loading="authStore.smsSending" @click="handleConfirmImageCode">
        确 定
      </ElButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.phone-login-verify {
  display: flex;
  width: 100%;
  gap: 8px;

  .phone-login-verify__button {
    flex-shrink: 0;
  }
}

.phone-login-auth-code {
  display: flex;
  align-items: center;
  gap: 12px;

  .phone-login-auth-code__image {
    width: 120px;
    height: 40px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
    object-fit: cover;
  }

  .phone-login-auth-code__image-wrapper {
    width: 120px;
    height: 40px;
    flex-shrink: 0;
  }

  .phone-login-auth-code__image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>

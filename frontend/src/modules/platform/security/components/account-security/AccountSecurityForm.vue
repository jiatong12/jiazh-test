<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { onMounted, ref } from 'vue'
import SmsCommonTemplateDialog from '../SmsCommonTemplateDialog.vue'
import AccountSecuritySection from './AccountSecuritySection.vue'
import PasswordCheckSection from './PasswordCheckSection.vue'
import PasswordNoticeSection from './PasswordNoticeSection.vue'
import PasswordPolicySection from './PasswordPolicySection.vue'
import PasswordRuleSection from './PasswordRuleSection.vue'
import { useAccountSecurityForm } from './useAccountSecurityForm'

const formRef = ref<FormInstance>()
const smsTemplateDialogVisible = ref(false)

const {
  securityRequest,
  securityForm,
  expirationNoticeItems,
  showNoticeTip,
  submitLoading,
  smsTemplateName,
  handleFieldChange,
  handleChangePwdNoticeFieldChange,
  handleInputNumberChange,
  handleSmsTemplateSelect,
  saveAccountSecurity,
  initPageData,
} = useAccountSecurityForm()

/** 打开短信模板选择弹窗。 */
function openSmsTemplateDialog() {
  smsTemplateDialogVisible.value = true
}

/** 保存账户安全配置。 */
function handleSaveClick() {
  saveAccountSecurity(formRef.value)
}

onMounted(() => {
  initPageData()
})
</script>

<template>
  <div v-loading="securityRequest.loading || submitLoading" class="account-security-form">
    <div class="account-security-form__toolbar">
      <BasePrimaryButton
        priv="Platform.AccountSecurity.Save"
        :loading="submitLoading"
        :icon="$$renderIcon('i-lucide:save')"
        @click="handleSaveClick"
      >
        保存
      </BasePrimaryButton>
    </div>

    <ElRow>
      <ElCol :span="24">
        <ElForm
          ref="formRef"
          :model="securityForm"
          label-position="left"
          label-width="380px"
          class="platform-security-form"
          @submit.prevent
        >
          <AccountSecuritySection title="账户安全配置">
            <ElFormItem label="是否启用账户安全配置：" prop="isOpenThreeSecurity">
              <ElSwitch v-model="securityForm.isOpenThreeSecurity" />
            </ElFormItem>
          </AccountSecuritySection>

          <PasswordRuleSection
            v-if="securityForm.isOpenThreeSecurity"
            :model="securityForm"
            :on-field-change="handleFieldChange"
            :on-input-number-change="handleInputNumberChange"
          />
          <PasswordCheckSection
            v-if="securityForm.isOpenThreeSecurity"
            :model="securityForm"
            :on-field-change="handleFieldChange"
            :on-input-number-change="handleInputNumberChange"
          />
          <PasswordNoticeSection
            v-if="securityForm.isOpenThreeSecurity"
            :model="securityForm"
            :show-notice-tip="showNoticeTip"
            :expiration-notice-items="expirationNoticeItems"
            :sms-template-name="smsTemplateName"
            :on-open-sms-template-dialog="openSmsTemplateDialog"
            :on-field-change="handleFieldChange"
            :on-change-pwd-notice-field-change="handleChangePwdNoticeFieldChange"
            :on-input-number-change="handleInputNumberChange"
          />
          <PasswordPolicySection
            v-if="securityForm.isOpenThreeSecurity"
            :model="securityForm"
            :on-field-change="handleFieldChange"
          />
        </ElForm>
      </ElCol>
    </ElRow>

    <SmsCommonTemplateDialog
      v-model:show="smsTemplateDialogVisible"
      :value="securityForm.changePwdNotice.sms.template"
      @callback="handleSmsTemplateSelect"
    />
  </div>
</template>

<style scoped lang="scss">
.account-security-form__toolbar {
  margin-bottom: 12px;
}

.account-security-form :deep(.platform-security-form .el-form-item__label) {
  text-indent: 60px !important;
}

.account-security-form :deep(.security-tip) {
  color: var(--el-text-color-placeholder);
}

.account-security-form :deep(.security-unit) {
  margin-left: 8px;
}
</style>

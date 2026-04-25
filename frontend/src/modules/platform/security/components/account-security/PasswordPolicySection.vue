<script setup lang="ts">
import type { SecurityFormModel } from './accountSecurity.types'
import AccountSecuritySection from './AccountSecuritySection.vue'

defineProps<{
  /** 账户安全表单模型。 */
  model: SecurityFormModel
  /** 普通字段变更处理函数。 */
  onFieldChange: (
    field: keyof SecurityFormModel,
    value: unknown,
  ) => void
}>()
</script>

<template>
  <AccountSecuritySection title="修改密码策略">
    <ElFormItem label="后台重置密码后下次登录是否强制修改密码：" prop="nextLoginUpdatePwd">
      <ElSwitch
        :model-value="model.nextLoginUpdatePwd"
        @update:model-value="onFieldChange('nextLoginUpdatePwd', $event)"
      />
    </ElFormItem>
  </AccountSecuritySection>
</template>

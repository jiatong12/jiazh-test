<script setup lang="ts">
import type { NumericSecurityField, SecurityFormModel } from './accountSecurity.types'
import AccountSecuritySection from './AccountSecuritySection.vue'

defineProps<{
  /** 账户安全表单模型。 */
  model: SecurityFormModel
  /** 普通字段变更处理函数。 */
  onFieldChange: (
    field: keyof SecurityFormModel,
    value: unknown,
  ) => void
  /** 数值字段变更处理函数。 */
  onInputNumberChange: (
    field: NumericSecurityField,
    value: string | number | null | undefined,
    fallbackValue: number,
  ) => void
}>()
</script>

<template>
  <AccountSecuritySection title="密码校检配置">
    <ElFormItem label="一天内密码错误次数超过最大重试次数锁定账号：" prop="specifyOverTimeLock">
      <ElSwitch
        :model-value="model.specifyOverTimeLock"
        @update:model-value="onFieldChange('specifyOverTimeLock', $event)"
      />
    </ElFormItem>
    <ElFormItem label="密码错误最大重试次数：" prop="maxLoginCount">
      <ElInputNumber
        :model-value="model.maxLoginCount"
        :min="0"
        :max="999"
        :precision="0"
        :disabled="!model.specifyOverTimeLock"
        placeholder="密码错误最大重试次数"
        @update:model-value="onInputNumberChange('maxLoginCount', $event, 0)"
        @input="onInputNumberChange('maxLoginCount', $event, 0)"
        @change="onInputNumberChange('maxLoginCount', $event, 0)"
      />
    </ElFormItem>
    <ElFormItem>
      <span class="security-tip">
        注：登录密码最大校检次数不设置或设置为 0 则不进行校验
      </span>
    </ElFormItem>
    <ElFormItem label="超过密码错误最大重试次数处理方式：" prop="overLoginCountType">
      <ElSelect
        :model-value="model.overLoginCountType"
        :disabled="!model.specifyOverTimeLock"
        placeholder="超过密码错误最大重试次数处理方式"
        style="width: 160px"
        @update:model-value="onFieldChange('overLoginCountType', $event)"
      >
        <ElOption value="" label="不处理" />
        <ElOption value="A" label="锁定账号" />
        <ElOption value="B" label="指定时间内禁止登录" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem label="禁止登录时长：" prop="lockTime">
      <ElInputNumber
        :model-value="model.lockTime"
        :min="0"
        :precision="0"
        :disabled="model.overLoginCountType !== 'B' || !model.specifyOverTimeLock"
        placeholder="禁止登录时长"
        @update:model-value="onInputNumberChange('lockTime', $event, 0)"
        @input="onInputNumberChange('lockTime', $event, 0)"
        @change="onInputNumberChange('lockTime', $event, 0)"
      />
      <span class="security-unit">单位：（秒）</span>
    </ElFormItem>
    <ElFormItem>
      <span class="security-tip">
        注：账户锁定时间设置为 0 或为空时则不锁定，最长锁定时间为 100 天
      </span>
    </ElFormItem>
  </AccountSecuritySection>
</template>

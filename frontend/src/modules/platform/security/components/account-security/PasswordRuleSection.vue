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
  <AccountSecuritySection title="密码规则配置">
    <ElFormItem label="密码最小长度：" prop="passwordMinLength">
      <ElInputNumber
        :model-value="model.passwordMinLength"
        :min="0"
        :max="99"
        :precision="0"
        placeholder="密码最小长度"
        @update:model-value="onInputNumberChange('passwordMinLength', $event, 6)"
      />
    </ElFormItem>
    <ElFormItem label="密码最大长度：" prop="passwordMaxLength">
      <ElInputNumber
        :model-value="model.passwordMaxLength"
        :min="1"
        :max="99"
        :precision="0"
        placeholder="密码最大长度"
        @update:model-value="onInputNumberChange('passwordMaxLength', $event, 30)"
      />
    </ElFormItem>
    <ElFormItem label="密码字符要求：" prop="passwordCharacterSpecification">
      <ElSelect
        :model-value="model.passwordCharacterSpecification"
        placeholder="请选择密码字符要求"
        style="width: 410px"
        @update:model-value="onFieldChange('passwordCharacterSpecification', $event)"
      >
        <ElOption value="A" label="无要求" />
        <ElOption value="B" label="必须同时包含字母和数字" />
        <ElOption value="C" label="必须同时包含大写字母、小写字母、数字" />
        <ElOption value="D" label="必须同时包含大写字母、小写字母、特殊字符、数字" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem label="密码中不能包含的用户信息：" prop="notIncludeUserInfo">
      <ElCheckboxGroup
        :model-value="model.notIncludeUserInfo"
        @update:model-value="onFieldChange('notIncludeUserInfo', $event)"
      >
        <ElCheckbox value="UserName">
          用户名
        </ElCheckbox>
        <ElCheckbox value="RealName">
          用户真实姓名
        </ElCheckbox>
        <ElCheckbox value="Email">
          电子邮箱
        </ElCheckbox>
        <ElCheckbox value="Mobile">
          手机
        </ElCheckbox>
        <ElCheckbox value="Tel">
          联系电话
        </ElCheckbox>
      </ElCheckboxGroup>
    </ElFormItem>
    <ElFormItem label="是否开启密码重复性检查：" prop="isOpenRecentlyCheck">
      <ElSwitch
        :model-value="model.isOpenRecentlyCheck"
        @update:model-value="onFieldChange('isOpenRecentlyCheck', $event)"
      />
    </ElFormItem>
    <ElFormItem label="重复性检查记录数：" prop="repeatCount">
      <ElInputNumber
        :model-value="model.repeatCount"
        :min="0"
        :max="999"
        :precision="0"
        :disabled="!model.isOpenRecentlyCheck"
        placeholder="重复性检查记录数"
        @update:model-value="onInputNumberChange('repeatCount', $event, 0)"
        @input="onInputNumberChange('repeatCount', $event, 0)"
        @change="onInputNumberChange('repeatCount', $event, 0)"
      />
    </ElFormItem>
    <ElFormItem>
      <span class="security-tip">
        注：重复性检查记录数设置为空或 0 时则不检查
      </span>
    </ElFormItem>
  </AccountSecuritySection>
</template>

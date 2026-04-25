<script setup lang="ts">
import { ref } from 'vue'
import AccountSecurityForm from './components/account-security/AccountSecurityForm.vue'
import SmsFormSetting from './components/SmsFormSetting.vue'

const currentActiveName = ref('accountSetting')
const smsOpenTips
  = '开启后，保留原有短信验证规则配置，同时可额外配置登录方式；若启用双重认证，用户名密码登录后还需要短信二次认证。'
</script>

<template>
  <div class="security-page h-full">
    <div class="card security-page__content">
      <ElTabs v-model="currentActiveName">
        <ElTabPane label="账户密码配置" name="accountSetting">
          <AccountSecurityForm />
        </ElTabPane>

        <ElTabPane label="短信验证和登录配置" name="userSms">
          <SmsFormSetting :open-tips="smsOpenTips" />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.security-page {
  display: flex;
  flex-direction: column;
}

.security-page__content {
  padding: 18px 20px 24px;
}
</style>

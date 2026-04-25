<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HOME_URL } from '@/config'

const router = useRouter()
</script>

<template>
  <div class="not-container">
    <img src="@/assets/images/403.png" class="not-img" alt="403">
    <div class="not-detail">
      <h2>403</h2>
      <h4>抱歉，您无权访问该页面~</h4>
      <div>
        <BasePrimaryButton @click="router.back">
          返回上一页
        </BasePrimaryButton>
        <BasePrimaryButton @click="router.replace(HOME_URL)">
          首页
        </BasePrimaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url('./index.scss');
</style>

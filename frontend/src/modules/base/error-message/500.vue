<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HOME_URL } from '@/config'

const router = useRouter()
</script>

<template>
  <div class="not-container">
    <img src="@/assets/images/500.png" class="not-img" alt="500">
    <div class="not-detail">
      <h2>500</h2>
      <h4>抱歉，您的网络不见了~</h4>
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

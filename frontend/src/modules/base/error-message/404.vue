<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HOME_URL } from '@/config'

const router = useRouter()
</script>

<template>
  <div class="not-container">
    <img src="@/assets/images/404.png" class="not-img" alt="404">
    <div class="not-detail">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~</h4>
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

<!-- 纵向布局 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { APP_LOGO_URL } from '@/config/app-assets'
import { useEnv } from '@/env'
import ToolBarLeft from '@/layouts/components/header/ToolBarLeft.vue'
import ToolBarRight from '@/layouts/components/header/ToolBarRight.vue'
import Main from '@/layouts/components/main/index.vue'
import SubMenu from '@/layouts/components/menu/SubMenu.vue'
import Tabs from '@/layouts/components/tabs/index.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store/modules/global'

const { APP_TITLE } = useEnv()

const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const accordion = computed(() => globalStore.accordion)
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
</script>

<template>
  <ElContainer class="layout">
    <ElAside>
      <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flex-center">
          <img class="logo-img" :src="APP_LOGO_URL" alt="logo">
          <span v-show="!isCollapse" class="logo-text">{{ APP_TITLE }}</span>
        </div>
        <ElScrollbar>
          <ElMenu
            :router="true"
            :default-active="activeMenu"
            :collapse="isCollapse"
            :unique-opened="accordion"
            :collapse-transition="false"
          >
            <SubMenu :menu-list="menuList" />
          </ElMenu>
        </ElScrollbar>
      </div>
    </ElAside>
    <ElContainer>
      <ElHeader>
        <ToolBarLeft />
        <ToolBarRight />
      </ElHeader>
      <Tabs v-show="globalStore.tabs" />
      <Main />
    </ElContainer>
  </ElContainer>
</template>

<style scoped lang="scss">
@import url('./index.scss');
</style>

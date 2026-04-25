<!-- 横向布局 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { APP_LOGO_URL } from '@/config/app-assets'
import { useEnv } from '@/env'
import ToolBarRight from '@/layouts/components/header/ToolBarRight.vue'
import Main from '@/layouts/components/main/index.vue'
import SubMenu from '@/layouts/components/menu/SubMenu.vue'
import Tabs from '@/layouts/components/tabs/index.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store/modules/global'
import { openExternal } from '@/utils/openExternal'

const { APP_TITLE } = useEnv()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

function handleClickMenu(subItem: Menu.MenuOptions) {
  if (subItem.meta.isLink) {
    openExternal(subItem.meta.isLink)
    return
  }
  router.push(subItem.path)
}
</script>

<template>
  <ElContainer class="layout">
    <ElHeader>
      <div class="logo flex-center">
        <img class="logo-img" :src="APP_LOGO_URL" alt="logo">
        <span class="logo-text">{{ APP_TITLE }}</span>
      </div>
      <!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能，不要放 menu 里面会影响布局 -->
      <ElMenu mode="horizontal" :router="true" :default-active="activeMenu">
        <template v-for="subItem in menuList" :key="subItem.path">
          <ElSubMenu v-if="subItem.children?.length" :key="subItem.path" :index="`${subItem.path}el-sub-menu`">
            <template #title>
              <BaseIcon class="menu-icon m-r-2 font-size-4" :name="subItem.meta.icon" />
              <span>{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :menu-list="subItem.children" />
          </ElSubMenu>
          <ElMenuItem v-else :key="`${subItem.path}el-menu-item`" :index="subItem.path" @click="handleClickMenu(subItem)">
            <BaseIcon class="menu-icon m-r-2 font-size-4" :name="subItem.meta.icon" />
            <template #title>
              <span>{{ subItem.meta.title }}</span>
            </template>
          </ElMenuItem>
        </template>
      </ElMenu>
      <ToolBarRight />
    </ElHeader>
    <Tabs v-show="globalStore.tabs" />
    <Main />
  </ElContainer>
</template>

<style scoped lang="scss">
@import url('./index.scss');
</style>

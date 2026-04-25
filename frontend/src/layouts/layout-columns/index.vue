<!-- 分栏布局 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const accordion = computed(() => globalStore.accordion)
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

const subMenuList = ref<Menu.MenuOptions[]>([])
const splitActive = ref('')
watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) { return }
    splitActive.value = route.path
    const menuItem = menuList.value.filter((item: Menu.MenuOptions) => {
      return route.path === item.path || `/${route.path.split('/')[1]}` === item.path
    })

    if (menuItem[0]?.children?.length) {
      (subMenuList.value = menuItem[0].children)
      return
    }
    subMenuList.value = []
  },
  {
    deep: true,
    immediate: true,
  },
)

// change SubMenu
function changeSubMenu(item: Menu.MenuOptions) {
  splitActive.value = item.path
  if (item.children?.length) {
    (subMenuList.value = item.children)
    return
  }
  subMenuList.value = []
  router.push(item.path)
}
</script>

<template>
  <ElContainer class="layout">
    <div class="aside-split">
      <div class="logo flex-center">
        <img class="logo-img" :src="APP_LOGO_URL" alt="logo">
      </div>
      <ElScrollbar>
        <div class="split-list">
          <div
            v-for="item in menuList"
            :key="item.path"
            class="split-item"
            :class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
            @click="changeSubMenu(item)"
          >
            <ElTooltip
              :content="item.meta.title "
              placement="right"
            >
              <ElIcon>
                <BaseIcon :name="item.meta.icon" />
              </ElIcon>
            </ElTooltip>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <ElAside class="aside-box" :class="{ 'not-aside': !subMenuList.length }" :style="{ width: isCollapse ? '65px' : '210px' }">
      <div class="logo flex-center">
        <span v-show="subMenuList.length" class="logo-text">{{ isCollapse ? APP_TITLE[0] : APP_TITLE }}</span>
      </div>
      <ElScrollbar>
        <ElMenu
          :router="true"
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="accordion"
          :collapse-transition="false"
        >
          <SubMenu :menu-list="subMenuList" custom-class="sub-menu" />
        </ElMenu>
      </ElScrollbar>
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

@keyframes one-in {
  from {
    // padding-left: 30%;
    transform: translateX(100%);
    // transform: translateY(30px) skewY(10deg);
  }

  to {
    // padding-left: 0%;
    transform: 0;
  }
}

// 菜单动画
:deep() .sub-menu {
  animation: one-in 0.2s infinite;
  animation-iteration-count: 1;
}
</style>

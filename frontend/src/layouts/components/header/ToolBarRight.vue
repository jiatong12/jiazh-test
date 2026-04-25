<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import PrimaryColor from '../theme-drawer/components/PrimaryColor.vue'
import AssemblySize from './components/AssemblySize.vue'
import Avatar from './components/avatar.vue'
import Fullscreen from './components/fullscreen.vue'
// import Language from './components/language.vue'
import Message from './components/message/index.vue'
import SearchMenu from './components/SearchMenu.vue'
import ThemeSetting from './components/ThemeSetting.vue'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo?.userName)
</script>

<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <SearchMenu />
      <AssemblySize />
      <!-- <Language id="language" /> -->
      <PrimaryColor size="small" />
      <ThemeSetting />
      <DarkModeToggle class="iconfont" />
      <Message />
      <Fullscreen />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;

  .header-icon {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 16px;

    > * {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--el-header-text-color);
    }
  }

  .username {
    margin: 0 15px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>

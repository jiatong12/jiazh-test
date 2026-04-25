<script setup lang="ts">
import { useRoute } from 'vue-router'
// import { useGlobalStore } from '@/store/modules/global'
import { useTabsStore } from '@/store/modules/tabs'

const props = withDefaults(
  defineProps<{
    trigger?: 'click' | 'contextmenu'
    path?: string
    isClose?: boolean
  }>(),
  {
    trigger: 'click',
  },
)

const route = useRoute()
const tabsStore = useTabsStore()
// const globalStore = useGlobalStore()

// refresh current page
// 刷新 loading，这里是用的 setTimeout 固定时间，用来实现刷新 loading动画
const isRefreshLoading = ref(false)
let timeoutKey: number
function refresh() {
  tabsStore.refreshCurrentPage()
  isRefreshLoading.value = true
  window.clearTimeout(timeoutKey)
  timeoutKey = window.setTimeout(() => {
    window.clearTimeout(timeoutKey)
    isRefreshLoading.value = false
  }, 500)
}

// // maximize current page
// function maximize() {
//   globalStore.maximize = true
// }

// Close Current
// function closeCurrentTab() {
//   if (route.meta.isAffix) { return }
//   tabsStore.removeTabs(route.fullPath)
// }

// Close All
function closeAllTab() {
  tabsStore.closeTabsOnSide()
}

const options = computed(() => {
  const { path /* isClose */ } = props
  // 当前活跃的的 path
  const active = route.path
  // 点击 tab 的下标
  const index = tabsStore.tabsMenuList.findIndex(e => e.path === path)
  // 是点击的当前活跃的 tab
  const isActive = path === active
  return [
    {
      label: '关闭其他',
      icon: 'i-lucide:fold-horizontal',
      // 存在可关闭 tab 或者唯一一个可关闭 tab 是点击的 tab
      disabled: !tabsStore.closableTabsMenuList.length || (tabsStore.closableTabsMenuList.length === 1 && tabsStore.closableTabsMenuList[0]?.path === path),
      onClick: () => {
        tabsStore.closeTabsOnSide(path)
      },
    },
    {
      label: '关闭全部',
      icon: 'i-lucide:arrow-right-left',
      // 存在可关闭 tab
      disabled: !tabsStore.closableTabsMenuList.length,
      onClick: closeAllTab,
    },
    {
      label: '关闭左侧',
      icon: 'i-lucide:arrow-left-to-line',
      // 左边存在可关闭 tab
      disabled: !tabsStore.tabsMenuList.some((e, i) => i < index && e.close),
      onClick: () => {
        tabsStore.closeTabsOnSide(path, 'left')
      },
      divided: true,
    },
    {
      label: '关闭右侧',
      icon: 'i-lucide:arrow-right-to-line',
      // 右边存在可关闭 tab
      disabled: !tabsStore.tabsMenuList.some((e, i) => i > index && e.close),
      onClick: () => {
        tabsStore.closeTabsOnSide(path, 'right')
      },

    },
    // {
    //   label: '最大化',
    //   icon: 'i-lucide:fullscreen',
    //   disabled: !isActive,
    //   onClick: maximize,
    //   divided: true,
    // },
    {
      label: '重新加载',
      icon: 'i-lucide:rotate-cw',
      disabled: !isActive,
      onClick: refresh,
    },
    // {
    //   label: '关闭当前',
    //   icon: 'i-lucide:x',
    //   // 存在可关闭 tab
    //   disabled: !isClose,
    //   onClick: closeCurrentTab,
    // },
  ]
})
</script>

<template>
  <ElDropdown :trigger="trigger" :teleported="true">
    <slot />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in options" :key="item.label" :disabled="item.disabled" :divided="item.divided" @click="item.onClick">
          <BaseIcon :name="item.icon" />{{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss">
</style>

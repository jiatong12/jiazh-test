<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { h, onBeforeUnmount, ref, watch } from 'vue'
import Footer from '@/layouts/components/footer/index.vue'
import { useGlobalStore } from '@/store/modules/global'
import { isRouteCache, useTabsStore } from '@/store/modules/tabs'
// import Maximize from './components/maximize.vue'

// import Tabs from '@/layouts/components/Tabs/index.vue'

const globalStore = useGlobalStore()
const { isCollapse, layout, footer } = storeToRefs(globalStore)

const tabsStore = useTabsStore()

// 解决详情页 keep-alive 问题
const wrapperMap = new Map()
watch(() => tabsStore.tabsMenuPathList.length, () => {
  const tabsPathSets = new Set(tabsStore.tabsMenuPathList)
  // 删除不存在的 key
  for (const [key] of wrapperMap) {
    if (!tabsPathSets.has(key)) {
      wrapperMap.delete(key)
    }
  }
})

// 是否初始化
// let initPage = true
function createComponentWrapper(component, route) {
  if (!component) { return }
  // const isInit = initPage
  // if (initPage) {
  //   initPage = false
  // }

  // isTabActive.value = false

  // if ((isTabActive.value)) {
  //   tabsStore.keepAliveTempExclude = ''
  // }

  // 初始化页面时，有缓存的就用缓存的方式渲染
  // if (route.meta.isKeepAlive) {
  // if ((isTabActive.value || isInit)) {
  //   tabsStore.keepAliveTempExclude = ''
  // }
  // else {
  //   tabsStore.keepAliveTempExclude = route.fullPath
  // }

  /* 缓存 */
  const wrapperName = route.fullPath
  let wrapper = wrapperMap.get(wrapperName)

  // if (!isTabActive.value) {
  //   // debugger
  //   return h({ name: wrapperName, render: () => h(component) })
  // }

  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) }
    wrapperMap.set(wrapperName, wrapper)
  }

  return h(wrapper)
  // }
  // else {
  //   tabsStore.keepAliveTempExclude = route.fullPath
  //   /*  不缓存 name都设置为空 */
  //   return h({ render: () => h(component) })
  // }
}

// 因为 transition 组件导致 createComponentWrapper 会调用两次，所以只能放到这里来重置数据
function onBeforeEnter() {
  // window._mark = false
  isRouteCache.value = false
  nextTick(() => {
    tabsStore.keepAliveTempExclude = ''
  })
}

// // 监听当前页面是否最大化，动态添加 class
// watch(
//   () => maximize.value,
//   () => {
//     const app = document.getElementById('app') as HTMLElement
//     if (maximize.value) { app.classList.add('main-maximize') }
//     else { app.classList.remove('main-maximize') }
//   },
//   { immediate: true },
// )

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => layout.value,
  () => {
    const body = document.body as HTMLElement
    body.setAttribute('class', layout.value)
  },
  { immediate: true },
)

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0)
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth
  if (!isCollapse.value && screenWidth.value < 1200) { globalStore.isCollapse = true }
  if (isCollapse.value && screenWidth.value > 1200) { globalStore.isCollapse = false }
}, 100)
window.addEventListener('resize', listeningWindow, false)
onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow)
})
</script>

<template>
  <!-- <Maximize v-show="maximize" /> -->
  <!-- <Tabs v-show="tabs" /> -->
  <ElMain>
    <!--  :duration="{ enter: 800, leave: 800 }" -->
    <!-- 动画要注意，在清理 keep-alive 缓存后 enter和leave同时执行导致的卡顿，如果enter在leave后再执行，就可以得到流畅的动画效果 -->
    <RouterView v-slot="{ Component, route }">
      <Transition appear name="fade-transform" mode="out-in" @before-enter="onBeforeEnter">
        <KeepAlive :include="tabsStore.keepAliveIncludeList" :exclude="tabsStore.keepAliveTempExclude">
          <component :is="createComponentWrapper(Component, route)" v-if="tabsStore.isRouterShow" :key="route.fullPath" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </ElMain>
  <ElFooter v-show="footer">
    <Footer />
  </ElFooter>
</template>

<style lang="scss">
// .v-enter-active,
// .v-leave-active {
//   transition: all 0.2s ease;
// }

// .v-enter-active {
//   transition-delay: 0.2s;
// }

// .v-enter-from,
// .v-leave-to {
//   transform: scale(0, 0);
// }
</style>

<style scoped lang="scss">
.el-main {
  --el-main-padding: 20px;

  box-sizing: border-box;
  overflow-x: hidden;

  // background: linear-gradient(to bottom right, var(--el-color-primary-light-6), var(--el-bg-color-page));
  // background: linear-gradient(135deg, transparent 15px, sienna 15px) no-repeat top left/22px 22px,
  //   linear-gradient(135deg, transparent 15px, bisque 15px);
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-light);
}

.el-footer {
  height: auto;
  padding: 0;
}
</style>

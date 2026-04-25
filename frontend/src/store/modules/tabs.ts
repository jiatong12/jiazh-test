import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { HOME_URL } from '@/config'
import router from '@/router'
import { getUrlWithParams } from '@/utils/route'

export interface TabsMenuProps {
  close: boolean
  icon: string
  isKeepAlive: boolean
  name: string
  path: string
  title: string
}

// 页面本来就开启了缓存情况下，是否使用缓存，就一个普通变量，不用 ref 是为了避免响应影响渲染
// tab、历史记录切换、面包屑切换，有缓存的保持缓存
export const isRouteCache = {
  value: false,
}

export const useTabsStore = defineStore('tabs', () => {
  // ----------------- 状态管理 -----------------
  /** 用来实现刷新页面 */
  const isRouterShow = ref<boolean>(true)

  /** 用来实现刷新的时候排除缓存 */
  const keepAliveTempExclude = ref<string>('')

  /** 标签页列表 */
  const tabsMenuList = ref<TabsMenuProps[]>([])

  /** 收藏的标签页 */
  const tabCollection = ref<TabsMenuProps[]>([])

  // ----------------- 计算属性 -----------------
  /** 可关闭的标签页列表 */
  const closableTabsMenuList = computed(() =>
    tabsMenuList.value.filter(e => e.close),
  )

  /** 当前路由 ID */
  const id = computed(() => router.currentRoute.value.fullPath)

  /** 需要缓存的标签页路径列表 */
  const keepAliveIncludeList = computed(() =>
    tabsMenuList.value.filter(e => e.isKeepAlive).map(e => e.path),
  )

  /** 标签页路径列表 */
  const tabsMenuPathList = computed(() =>
    tabsMenuList.value.map(e => e.path),
  )

  // ----------------- 标签页操作 -----------------
  /** 添加标签页 */
  async function addTabs(tabItem: TabsMenuProps) {
    if (!tabsMenuList.value.some(item => item.path === tabItem.path)) {
      tabsMenuList.value.push(tabItem)
    }
  }

  /** 删除标签页 */
  async function removeTabs(tabPath: string, isCurrent: boolean = true) {
    if (isCurrent) {
      tabsMenuList.value.forEach((item, index) => {
        if (item.path !== tabPath) {
          return
        }
        const nextTab = tabsMenuList.value[index + 1] || tabsMenuList.value[index - 1]
        if (!nextTab) {
          return
        }
        return router.push(nextTab.path).then((arg) => {
          // 处理 onBeforeRouteLeave 中的  next(false)
          if (arg instanceof Error) { throw arg }

          tabsMenuList.value = tabsMenuList.value.filter(
            item => item.path !== tabPath,
          )
        })
      })
    }
    else {
      tabsMenuList.value = tabsMenuList.value.filter(
        item => item.path !== tabPath,
      )
    }
  }

  /** 设置标签页 */
  async function setTabs(tabsMenuList_: TabsMenuProps[]) {
    tabsMenuList.value = tabsMenuList_
  }

  /** 设置标签页标题 */
  async function setTabsTitle(title: string) {
    tabsMenuList.value.forEach((item) => {
      if (item.path === getUrlWithParams()) {
        item.title = title
      }
    })
  }

  // ----------------- 刷新与缓存 -----------------
  /** 清理当前页面缓存 */
  async function clearPageCache(
    callback: () => void,
    path?: string,
    isKeepAlive?: boolean,
    isClear: boolean = true,
  ) {
    isKeepAlive ??= router.currentRoute.value.meta.isKeepAlive as boolean
    path ??= id.value

    isKeepAlive && isClear && (keepAliveTempExclude.value = path)
    await callback()
    nextTick(() => {
      isKeepAlive && isClear && (keepAliveTempExclude.value = '')
    })
  }

  /** 刷新当前页面 */
  function refreshCurrentPage() {
    setTimeout(() => {
      clearPageCache(() => {
        isRouterShow.value = false
        nextTick(() => {
          isRouterShow.value = true
        })
      })
    }, 0)
  }

  // ----------------- 标签页关闭相关 -----------------
  /** 关闭侧边标签 */
  async function closeTabsOnSide(path?: string, type?: 'left' | 'right') {
    const currentIndex = tabsMenuList.value.findIndex(
      item => item.path === path,
    )
    let tabsMenuList_: TabsMenuProps[] = [] // 初始化为空数组

    if (path === undefined) {
      tabsMenuList_ = tabsMenuList.value.filter(item => !item.close)
    }
    else {
      if (currentIndex !== -1) {
        let range: [number, number]
        if (type) {
          range = type === 'left'
            ? [0, currentIndex]
            : [currentIndex + 1, tabsMenuList.value.length]
        }
        else {
          range = [0, tabsMenuList.value.length]
        }
        tabsMenuList_ = tabsMenuList.value.filter((item, index) => {
          return (
            index < range[0]!
            || index >= range[1]!
            || !item.close
            || item.path === path
          )
        })
      }
    }

    if (!path) {
      return router.push(HOME_URL).then((arg) => {
        // 处理 onBeforeRouteLeave 中的  next(false)
        if (arg instanceof Error) { throw arg }

        tabsMenuList.value = tabsMenuList_
      })
    }
    else if (tabsMenuList_.some(item => item.path === id.value)) {
      tabsMenuList.value = tabsMenuList_
    }
    else {
      return router.push(path).then((arg) => {
        // 处理 onBeforeRouteLeave 中的  next(false)
        if (arg instanceof Error) { throw arg }

        tabsMenuList.value = tabsMenuList_
      })
    }
  }

  // ----------------- 收藏操作 -----------------
  /** 添加收藏 */
  function addToCollection() {
    if (tabCollection.value.some(e => e.path === id.value)) {
      ElMessage.info('此标签已收藏过')
      return
    }
    tabCollection.value.push(
      tabsMenuList.value.find(e => e.path === id.value)!,
    )
  }

  /** 删除收藏 */
  function removeCollection(item: TabsMenuProps) {
    tabCollection.value = tabCollection.value.filter(
      e => e.path !== item.path,
    )
  }

  return {
    isRouterShow,
    keepAliveTempExclude,
    tabsMenuList,
    tabCollection,
    closableTabsMenuList,
    id,
    keepAliveIncludeList,
    tabsMenuPathList,
    addTabs,
    removeTabs,
    setTabs,
    setTabsTitle,
    clearPageCache,
    refreshCurrentPage,
    closeTabsOnSide,
    addToCollection,
    removeCollection,
  }
}, {
  persist: {
    pick: ['tabsMenuList', 'tabCollection'],
  },
})

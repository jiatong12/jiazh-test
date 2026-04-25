<script setup lang="ts">
import type { TabPaneName, TabsPaneContext } from 'element-plus'
import Sortable from 'sortablejs'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store/modules/global'
import { isRouteCache, useTabsStore } from '@/store/modules/tabs'
import More from './components/more.vue'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const globalStore = useGlobalStore()
const authStore = useAuthStore()

const tabsMenuValue = ref(route.fullPath)
const tabsMenuList = computed(() => tabsStore.tabsMenuList)
const tabsIcon = computed(() => globalStore.tabsIcon)

onMounted(() => {
  tabsDrop()
  initTabs()
})

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) { return }
    tabsMenuValue.value = route.fullPath
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: !route.meta.isAffix,
      isKeepAlive: route.meta.isKeepAlive as boolean,
    }
    tabsStore.addTabs(tabsParams)
  },
  { immediate: true },
)

// 初始化需要固定的 tabs
function initTabs() {
  authStore.flatMenuListGet.forEach((item) => {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        close: !item.meta.isAffix,
        isKeepAlive: item.meta.isKeepAlive,
      }
      tabsStore.addTabs(tabsParams)
    }
  })
}

// tabs 拖拽排序
function tabsDrop() {
  Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
    draggable: '.el-tabs__item',
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const tabsList = [...tabsStore.tabsMenuList]
      const currRow = tabsList.splice(oldIndex as number, 1)[0]!
      tabsList.splice(newIndex as number, 0, currRow)
      tabsStore.setTabs(tabsList)
    },
  })
}

// 切换标签之前的钩子函数
function beforeLeave(activeName: TabPaneName) {
  // return true
  const fullPath = activeName as string

  // 阖免重复导航
  if (fullPath === route.fullPath) {
    return Promise.resolve(true)
  }

  // 跳转成功才切换 tab
  return router.push(fullPath)
    .then((arg) => {
      // 处理 onBeforeRouteLeave 中的  next(false)
      if (arg instanceof Error) { throw arg }
      return arg
    })
    // .catch(() => {
    //   debugger
    // })
}

function onTabClick(_tabItem: TabsPaneContext) {
  isRouteCache.value = true
  // window._mark = true
  // const fullPath = _tabItem.props.name as string
  // router.push(fullPath)
}

// Remove Tab
function tabRemove(fullPath: TabPaneName) {
  tabsStore.removeTabs(fullPath as string, fullPath === route.fullPath)
}

// tab 风格
const tabsStyleClass = computed(() => `tabs-${globalStore.tabStyleType}`)
</script>

<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <ElTabs :class="tabsStyleClass" :model-value="tabsMenuValue" type="card" :before-leave="beforeLeave" @tab-click="onTabClick" @tab-remove="tabRemove">
        <ElTabPane v-for="item in tabsMenuList" :key="item.path" :label="item.title" :name="item.path" :closable="item.close">
          <template #label>
            <!-- 右键显示自定义菜单，双击刷新 -->
            <More :path="item.path" :is-close="item.close" trigger="contextmenu">
              <span class="tab-label flex flex-align-center" @dblclick="'refresh'">
                <BaseIcon v-if="item.icon && tabsIcon" class="tabs-icon" :name="item.icon" />
                <span> {{ item.title }}</span>
              </span>
            </More>
          </template>
        </ElTabPane>
      </ElTabs>
      <More :path="route.fullPath" :is-close="!route.meta.isAffix" trigger="click">
        <ElButton class="more-button">
          <BaseIcon name="i-ri:arrow-down-s-fill" />
        </ElButton>
      </More>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs-box {
  background-color: var(--el-bg-color);

  .tabs-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    /* 基础样式 */
    :deep(.el-tabs) {
      flex: 1;
      min-width: 0;

      .el-tabs__header {
        box-sizing: border-box;
        height: 40px;
        padding: 0 10px;
        margin: 0;
        border-bottom: 0;

        .el-tabs__nav-wrap {
          .el-tabs__nav {
            display: flex;
            border: none;

            .el-tabs__item {
              border: none;
              .tabs-icon {
                margin: 1.5px 2px 0 0;
                font-size: 15px;
              }
            }
          }
        }
      }
    }

    /* 谷歌风格 */
    :deep(.tabs-chrome.el-tabs--card) {
      > .el-tabs__header {
        .el-tabs__nav {
          .el-tabs__item {
            position: relative;
            margin-top: 6px;
            margin-right: 4px;
            height: 34px;
            overflow: visible;
            padding: 0 18px;
            border-radius: 10px;
            background-color: transparent;
            transition:
              background-color 0.3s ease,
              color 0.3s ease;

            &::before,
            &::after {
              position: absolute;
              bottom: 0;
              width: 20px;
              height: 20px;
              content: '';
              border-radius: 50%;
              opacity: 0;
              pointer-events: none;
              box-shadow: 0 0 0 30px transparent;
              transition:
                opacity 0.3s ease,
                box-shadow 0.3s ease;
            }

            &::before {
              left: -20px;
              clip-path: inset(50% -10px 0 50%);
            }

            &::after {
              right: -20px;
              clip-path: inset(50% 50% 0 -10px);
            }

            &.is-active {
              background-color: var(--el-color-primary-light-9);
              .tab-label {
                color: var(--zv-primary);
              }

              &::before,
              &::after {
                opacity: 1;
                box-shadow: 0 0 0 30px var(--el-color-primary-light-9);
              }
            }

            &:hover:not(.is-active) {
              background-color: var(--el-color-primary-light-9);
              .tabs-icon {
                color: var(--zv-primary);
              }
            }
          }
        }
      }
    }

    /* 下划线风格 */
    :deep(.tabs-underline) {
      .el-tabs__header {
        .el-tabs__nav-wrap {
          .el-tabs__nav {
            .el-tabs__item {
              margin-right: 8px;

              .is-icon-close {
                margin-top: 1px;
              }

              &::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 0;
                content: '';

                transition:
                  all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
                  border 0s,
                  color 0.1s,
                  font-size 0s;
              }

              &:hover,
              &.is-active {
                width: 100%;
                color: var(--el-color-primary);

                .tab-label {
                  color: var(--el-color-primary);
                }

                &::before {
                  width: 100%;
                  border-bottom: 2px solid var(--el-color-primary);
                }
              }
            }
          }
        }
      }
    }

    .more-button {
      width: 26px;
      height: 26px;
      padding: 0;
      margin-right: 10px;
      border-radius: 4px;
      // border-radius: var(--el-border-radius-base);
      font-size: 1.25em;
    }
  }
}
</style>

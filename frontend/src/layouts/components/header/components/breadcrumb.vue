<script setup lang="tsx">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HOME_URL } from '@/config'
import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store/modules/global'
// import { isRouteCache } from '@/store/modules/tabs'

const route = useRoute()
// const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const breadcrumbList = computed(() => {
  let breadcrumbData = authStore.breadcrumbListGet[route.matched[route.matched.length - 1]!.path] ?? []
  // 🙅‍♀️不需要首页面包屑可删除以下判断
  if (breadcrumbData[0].path !== HOME_URL) {
    breadcrumbData = [{ path: HOME_URL, meta: { icon: 'i-mdi:house-outline', title: '首页' } }, ...breadcrumbData]
  }
  return breadcrumbData
})

// Click Breadcrumb
// function onBreadcrumbClick(item: Menu.MenuOptions, index: number) {
//   isRouteCache.value = true
//   if (index !== breadcrumbList.value.length - 1) { router.push(item.path) }
// }
</script>

<template>
  <div class="mask-image breadcrumb-box" :class="[!globalStore.breadcrumbIcon && 'no-icon']">
    <!-- <ElBreadcrumb :separator-icon="$$renderIcon('lucide:chevron-right')"> -->
    <ElBreadcrumb>
      <TransitionGroup name="breadcrumb">
        <ElBreadcrumbItem v-for="(item) in breadcrumbList" :key="item.path">
          <div
            class="el-breadcrumb__inner "
          >
            <BaseIcon v-if="item.meta.icon && globalStore.breadcrumbIcon" class="breadcrumb-icon" :name="item.meta.icon" />
            <span class="breadcrumb-title">{{ item.meta.title }}</span>
          </div>
        </ElBreadcrumbItem>
      </TransitionGroup>
    </ElBreadcrumb>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-left: 10px;
  overflow: hidden;

  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      // &.is-link {
      //   color: var(--el-header-text-color);

      //   &:hover {
      //     color: var(--el-color-primary);
      //   }
      // }

      .breadcrumb-icon {
        margin-right: 6px;
        font-size: 16px;
      }

      .breadcrumb-title {
        // margin-top: 2px;
      }
    }
    // &:last-child .el-breadcrumb__inner,
    // &:last-child .el-breadcrumb__inner:hover {
    //   color: var(--el-header-text-color-regular);
    // }
  }
}
</style>

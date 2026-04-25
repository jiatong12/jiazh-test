<script setup lang="ts">
// ps: 这里为了避免样式出现问题，不设置根节点
// customClass 这里主要为了实现在没根节点时，不报警告的情况下实现菜单动画
import { openExternal } from '@/utils/openExternal'

defineProps<{ menuList: Menu.MenuOptions[], customClass?: string }>()

// const router = useRouter()

function handleClickMenu(subItem: Menu.MenuOptions) {
  if (subItem.meta.isLink) {
    openExternal(subItem.meta.isLink)
    // return
  }
  // router.push(subItem.path)
}
</script>

<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <ElSubMenu v-if="subItem.children?.length" :index="subItem.path" :class="customClass">
      <template #title>
        <ElIcon v-if="subItem.meta.icon">
          <BaseIcon class="menu-icon" :name="subItem.meta.icon" />
        </ElIcon>
        <BaseOverflowTooltip placement="top-start" class="menu-title" :line-clamp="1">
          {{ subItem.meta.title }}
        </BaseOverflowTooltip>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </ElSubMenu>
    <!-- 外连接不激活菜单 -->
    <ElMenuItem v-else v-ripple :index="subItem.meta.isLink ? void 0 : subItem.path" :class="customClass" @click="handleClickMenu(subItem)">
      <ElIcon v-if="subItem.meta.icon">
        <BaseIcon class="menu-icon" :name="subItem.meta.icon" />
      </ElIcon>
      <template #title>
        <BaseOverflowTooltip placement="top-start" class="menu-title" :line-clamp="1">
          {{ subItem.meta.title }}
        </BaseOverflowTooltip>
      </template>
    </ElMenuItem>
  </template>
</template>

<style lang="scss">
// 鼠标方上去图标变大
@mixin haverIcon {
  &:hover {
    .menu-icon {
      transform: scale(1.2);
    }
  }
}

// 选中菜单
@mixin activeMenu {
  // color: #fff !important;
  // background: linear-gradient(
  //   72.47deg,
  //   var(--el-color-primary) 22.16%,
  //   var(--el-color-primary-light-3) 76.47%
  // ) !important;
  // background-color: var(--el-color-primary) !important;
  // border-bottom: 2px solid var(--el-menu-active-color);
  // background-color: var(--el-color-primary-light-9) !important;
  background-color: var(--el-menu-active-bg-color) !important;
}

.menu-icon {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-property: transform;
  font-size: 1rem;
}

.menu-title {
  font-size: 14px;
  vertical-align: middle;
}

.el-sub-menu__title,
.el-menu-item {
  height: 46px !important;
  margin: 5px 0 !important;
  // border-bottom: 2px solid transparent;
  // border-radius: 4px !important;
}

// 子菜单
.el-sub-menu {
  .el-sub-menu__title {
    @include haverIcon();

    &:hover {
      color: var(--el-menu-hover-text-color) !important;
      background-color: transparent !important;
    }
  }

  // 选中的子菜单标题样式
  &.is-active {
    > .el-sub-menu__title {
      color: var(--el-menu-active-color) !important;
    }

    .el-sub-menu__title {
      border-bottom-color: transparent;
    }
  }
}

// 收起来的样式
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      @include activeMenu();
    }
  }
}

.el-menu {
  // padding: 0 5px !important;
}

.el-menu-item {
  @include haverIcon();

  &:hover {
    color: var(--el-menu-hover-text-color);
  }

  &.is-active {
    @include activeMenu();
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      content: '';
      background: var(--el-menu-active-color);
    }
  }
}

.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
// transverse 模式菜单超过页面高度，让页面出现滚动条导致宽度减少，el-menu 计算出现一直闪动问题
.transverse {
  overflow-y: scroll;
}

// 悬浮子菜单过高时，只允许弹层内部滚动，避免折叠侧栏或横向菜单把页面整体撑开。
.el-menu--popup-container {
  max-height: calc(100vh - 24px);
  overflow: hidden;
}
.el-menu--popup-container > .el-menu--popup {
  max-height: calc(100vh - 24px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>

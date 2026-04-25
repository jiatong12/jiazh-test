import type { ThemeType } from '@/hooks/index.types'

type Group = 'aside' | 'header' | 'menu'
// 各主题中样式配置
const theme: Record<ThemeType, Record<Group, { [key: string]: string }>> = {
  light: {
    aside: {
      '--el-aside-logo-text-color': '#303133',
      '--el-aside-border-color': '#e4e7ed',
    },
    header: {
      '--el-header-logo-text-color': '#303133',
      '--el-header-bg-color': '#ffffff',
      '--el-header-text-color': '#303133',
      '--el-header-text-color-regular': '#606266',
      '--el-header-border-color': '#e4e7ed',
    },
    menu: {
      '--el-menu-bg-color': '#ffffff',
      '--el-menu-hover-bg-color': 'var(--el-color-primary-light-9)',
      '--el-menu-active-bg-color': 'var(--el-color-primary-light-9)',
      '--el-menu-text-color': '#333333',
      '--el-menu-active-color': 'var(--el-color-primary)',
      '--el-menu-hover-text-color': '#333333',
      '--el-menu-horizontal-sub-item-height': '50px',
    },
  },
  inverted: {
    aside: {
      '--el-aside-logo-text-color': '#dadada',
      '--el-aside-border-color': '#414243',
    },
    header: {
      '--el-header-logo-text-color': '#dadada',
      '--el-header-bg-color': '#282c34',
      '--el-header-text-color': '#e5eaf3',
      '--el-header-text-color-regular': '#cfd3dc',
      '--el-header-border-color': '#414243',
    },
    menu: {
      '--el-menu-bg-color': '#282c34',
      '--el-menu-hover-bg-color': '#191a20',
      '--el-menu-active-bg-color': '#191a20',
      '--el-menu-text-color': '#bdbdc0',
      '--el-menu-active-color': 'var(--el-color-primary)',
      '--el-menu-hover-text-color': '#ffffff',
      '--el-menu-horizontal-sub-item-height': '50px',
    },
  },
  dark: {
    aside: {
      '--el-aside-logo-text-color': '#dadada',
      '--el-aside-border-color': '#414243',
    },
    header: {
      '--el-header-logo-text-color': '#dadada',
      '--el-header-bg-color': '#141414',
      '--el-header-text-color': '#e5eaf3',
      '--el-header-text-color-regular': '#cfd3dc',
      '--el-header-border-color': '#414243',
    },
    menu: {
      '--el-menu-bg-color': '#141414',
      '--el-menu-hover-bg-color': '#000000',
      '--el-menu-active-bg-color': '#000000',
      '--el-menu-text-color': '#bdbdc0',
      '--el-menu-active-color': 'var(--el-color-primary)',
      '--el-menu-hover-text-color': '#ffffff',
      '--el-menu-horizontal-sub-item-height': '50px',
    },

  },
}
export default theme

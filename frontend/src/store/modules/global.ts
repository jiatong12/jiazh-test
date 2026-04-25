import { defineStore } from 'pinia'
import screenfull from 'screenfull'
import { DEFAULT_IS_DARK, IS_DARK_KEY, PRIMARY_HSL_KEY } from '@/config'
import { useEnv } from '@/env/useEnv'
import { setCache } from '@/utils/cache'
import { hexToHsl } from '@/utils/color'

export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns'
export type AssemblySizeType = 'large' | 'default' | 'small'
export type LanguageType = 'zh' | 'en'

export const tabStyleTypeList = [
  { label: '谷歌', value: 'chrome' },
  { label: '下划线', value: 'underline' },
] as const
export type TabStyleType = typeof tabStyleTypeList[number]['value']

export interface GlobalState {
  layout: LayoutType
  assemblySize: AssemblySizeType
  language: LanguageType
  // maximize: boolean
  primary: string
  primaryHsl: string
  isDark: boolean
  isGrey: boolean
  isWeak: boolean
  asideInverted: boolean
  headerInverted: boolean
  isCollapse: boolean
  accordion: boolean
  breadcrumb: boolean
  breadcrumbIcon: boolean
  tabs: boolean
  tabsIcon: boolean
  footer: boolean
  isFullscreen: boolean
  tabStyleType: TabStyleType
}

export const useGlobalStore = defineStore('global', () => {
  const { PRIMARY_COLOR } = useEnv()
  const isFullscreen = ref(screenfull.isFullscreen)
  screenfull.on('change', () => {
    isFullscreen.value = screenfull.isFullscreen
  })

  const result: GlobalState = reactive({
    // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
    layout: 'classic',
    // element 组件大小
    assemblySize: 'default',
    // 当前系统语言
    language: 'zh',
    // 当前页面是否全屏
    // maximize: false,
    // 主题颜色
    primary: PRIMARY_COLOR,
    primaryHsl: '',
    // 深色模式
    isDark: DEFAULT_IS_DARK,
    // 灰色模式
    isGrey: false,
    // 色弱模式
    isWeak: false,
    // 侧边栏反转
    asideInverted: false,
    // 头部反转
    headerInverted: false,
    // 折叠菜单
    isCollapse: false,
    // 菜单手风琴
    accordion: true,
    // 面包屑导航
    breadcrumb: true,
    // 面包屑导航图标
    breadcrumbIcon: true,
    // 标签页
    tabs: true,
    // 标签页图标
    tabsIcon: true,
    // 页脚版权信息
    footer: false,
    // 是否全屏，同时只能全屏一个元素
    isFullscreen,
    // tab 风格
    tabStyleType: 'chrome',
  })

  // hsl 格式的主题颜色，用到 loading.html 中
  watch(() => result.primary, (val) => {
    result.primaryHsl = hexToHsl(val).join(' ')
    setCache(PRIMARY_HSL_KEY, result.primaryHsl, true)
  }, { immediate: true })

  // 是否是暗黑模式，用到 loading.html 中
  watch(() => result.isDark, () => {
    setCache(IS_DARK_KEY, result.isDark, true)
  }, { immediate: true })

  return toRefs(result)
}, {
  persist: true,
})

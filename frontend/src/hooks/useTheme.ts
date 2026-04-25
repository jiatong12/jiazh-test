import type { GreyOrWeakType, ThemeType } from './index.types'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useEnv } from '@/env/useEnv'
import { useGlobalStore } from '@/store/modules/global'
import { useTabsStore } from '@/store/modules/tabs'
import themeConfig from '@/theme/index'
import { getCssVar, getDarkColor, getLightColor, hexToHsl, hexToRgb, normalizeHexColor, resolveHexColorByAvoids } from '../utils/color'

const ELEMENT_SEMANTIC_COLOR_VARS = [
  '--el-color-success',
  '--el-color-warning',
  '--el-color-danger',
  '--el-color-info',
] as const

// 主题色只做小范围色相偏移，尽量保持用户选择的主观观感。
const PRIMARY_HUE_OFFSETS = [0, 8, -8, 16, -16, 24, -24, 32, -32, 40, -40]

interface ResolvePrimaryResult {
  color: string
  adjusted: boolean
}

function getElementSemanticColors() {
  return ELEMENT_SEMANTIC_COLOR_VARS
    .map(cssVar => normalizeHexColor(getCssVar(cssVar)))
    .filter((color): color is string => Boolean(color))
}

function resolvePrimaryColorByElementSemantic(primaryColor: string): ResolvePrimaryResult {
  // 宽阈值，采用 DeltaE2000
  const minDistance = 16
  const semanticColors = getElementSemanticColors()
  const result = resolveHexColorByAvoids(primaryColor, semanticColors, {
    minDistance,
    hueOffsets: PRIMARY_HUE_OFFSETS,
  })
  return { color: result.color, adjusted: result.adjusted }
}

/**
 * @description 全局主题 hooks
 */
export function useTheme() {
  const { PRIMARY_COLOR } = useEnv()
  const globalStore = useGlobalStore()
  const { primary, isDark, isGrey, isWeak, layout, asideInverted, headerInverted } = storeToRefs(globalStore)

  // 修改主题颜色
  const changePrimary = (val: string | null, refresh = true) => {
    if (!val) {
      val = PRIMARY_COLOR
      ElMessage.success(`主题颜色已重置为 ${PRIMARY_COLOR}`)
    }

    const resolvedPrimary = resolvePrimaryColorByElementSemantic(val)
    if (resolvedPrimary.adjusted && resolvedPrimary.color !== val) {
      ElMessage.warning(`主题颜色与语义色过近，已自动调整为 ${resolvedPrimary.color}`)
    }
    val = resolvedPrimary.color

    // 计算主题颜色变化
    document.documentElement.style.setProperty('--el-color-primary', val)
    const colorPrimaryRgb = hexToRgb(val).join(',')
    document.documentElement.style.setProperty('--el-color-primary-rgb', colorPrimaryRgb)
    // 主题颜色，用在 loading.html 中
    const colorPrimaryHsl = hexToHsl(val).join(' ')
    document.documentElement.style.setProperty('--el-color-primary-hsl', colorPrimaryHsl)

    document.documentElement.style.setProperty(
      '--el-color-primary-dark-2',
      isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`,
    )
    for (let i = 1; i <= 9; i++) {
      const primaryColor = isDark.value ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`
      document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
    }
    globalStore.primary = val

    // 刷新当前页面，让 echarts 组件获取最新的颜色
    refresh && useTabsStore().refreshCurrentPage()
  }

  // 灰色和弱色切换
  const changeGreyOrWeak = (type: GreyOrWeakType, value: boolean) => {
    const body = document.body as HTMLElement
    if (!value) { return body.removeAttribute('style') }
    const styles: Record<GreyOrWeakType, string> = {
      grey: 'filter: grayscale(1)',
      weak: 'filter: invert(80%)',
    }
    body.setAttribute('style', styles[type])
    if (type === 'grey') {
      globalStore.isWeak = false
    }
    else {
      globalStore.isGrey = false
    }
  }

  // 设置菜单样式
  const setMenuTheme = () => {
    let type: ThemeType = 'light'
    if (layout.value === 'transverse' && headerInverted.value) { type = 'inverted' }
    if (layout.value !== 'transverse' && asideInverted.value) { type = 'inverted' }
    if (isDark.value) { type = 'dark' }
    const theme = themeConfig[type!].menu
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value)
    }
  }

  // 设置侧边栏样式
  const setAsideTheme = () => {
    let type: ThemeType = 'light'
    if (asideInverted.value) { type = 'inverted' }
    if (isDark.value) { type = 'dark' }
    const theme = themeConfig[type!].aside
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value)
    }
    setMenuTheme()
  }

  // 设置头部样式
  const setHeaderTheme = () => {
    let type: ThemeType = 'light'
    if (headerInverted.value) { type = 'inverted' }
    if (isDark.value) { type = 'dark' }
    const theme = themeConfig[type!].header
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value)
    }
    setMenuTheme()
  }

  const applyThemeSettings = (refresh = true) => {
    const html = document.documentElement as HTMLElement
    if (isDark.value) { html.setAttribute('class', 'dark') }
    else { html.setAttribute('class', '') }
    changePrimary(primary.value, refresh)
    setAsideTheme()
    setHeaderTheme()
  }
  // 切换暗黑模式 ==> 同时修改主题颜色、侧边栏、头部颜色
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    applyThemeSettings()
  }

  // init theme
  const initTheme = () => {
    applyThemeSettings(false)
    if (isGrey.value) { changeGreyOrWeak('grey', true) }
    if (isWeak.value) { changeGreyOrWeak('weak', true) }
  }

  return {
    initTheme,
    toggleDarkMode,
    changePrimary,
    changeGreyOrWeak,
    setAsideTheme,
    setHeaderTheme,
  }
}

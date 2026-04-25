// 默认生成 10 个系列色，覆盖大多数图表场景。
const DEFAULT_SIZE = 10
// 字典默认分配 12 个颜色候选，覆盖常见状态数量。
const DEFAULT_DICT_SIZE = 12
// 限制最大数量，避免过多颜色导致视觉负担。
const MAX_SIZE = 20
// 前 6 个颜色优先保证区分度。
const FRONT_PRIORITY_COUNT = 6
// 前置颜色最小色差阈值。
const FRONT_MIN_DISTANCE = 0.3
// 后续颜色最小色差阈值。
const NORMAL_MIN_DISTANCE = 0.2
// 阈值逐步放宽，保证在严格条件下也能生成完整色盘。
const RELAX_STEPS = [0, 0.03, 0.06, 0.1, 0.14] as const
// 避免和 config 形成循环依赖，作为通用工具层兜底主色。
const DEFAULT_PRIMARY_FALLBACK = '#3182F3'

interface HslColor {
  h: number
  s: number
  l: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeHexColor(value: string) {
  const color = value.trim()
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toUpperCase()
  }
  const shortMatched = /^#([0-9a-f]{3})$/i.exec(color)
  if (!shortMatched) {
    return null
  }
  const [r = '0', g = '0', b = '0'] = (shortMatched[1] ?? '').split('')
  return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
}

function hexToHsl(hex: string): HslColor {
  const normalized = normalizeHexColor(hex) ?? DEFAULT_PRIMARY_FALLBACK
  const cleanHex = normalized.replace('#', '')
  const r = Number.parseInt(cleanHex.substring(0, 2), 16) / 255
  const g = Number.parseInt(cleanHex.substring(2, 4), 16) / 255
  const b = Number.parseInt(cleanHex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h *= 60
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function calculateColorDistance(a: HslColor, b: HslColor) {
  const hueDiffRaw = Math.abs(a.h - b.h)
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw) / 180
  const satDiff = Math.abs(a.s - b.s) / 100
  const lightDiff = Math.abs(a.l - b.l) / 100
  return hueDiff * 0.72 + satDiff * 0.18 + lightDiff * 0.1
}

function getMinDistance(target: HslColor, selected: HslColor[]) {
  return selected.reduce((min, item) => {
    return Math.min(min, calculateColorDistance(target, item))
  }, Number.POSITIVE_INFINITY)
}

function buildCandidates(base: HslColor, total: number) {
  const count = Math.max(total * 6, 36)
  // 黄金角可让色相分布更均匀，减少扎堆。
  const goldenAngle = 137.508
  const satOffsets = [0, 10, -8, 6, -6, 12, -10, 8, -4, 4]
  const lightOffsets = [0, -9, 8, -6, 10, -8, 6, -4, 12, -10]

  // 先约束主色的 S/L 基线，避免候选过灰或过亮。
  const baseS = clamp(base.s, 54, 76)
  const baseL = clamp(base.l, 40, 60)

  return Array.from({ length: count }, (_, index) => {
    if (index === 0) {
      return { ...base }
    }
    const satOffset = satOffsets[index % satOffsets.length] ?? 0
    const lightOffset = lightOffsets[index % lightOffsets.length] ?? 0
    return {
      h: Math.round((base.h + index * goldenAngle) % 360),
      s: clamp(baseS + satOffset, 48, 82),
      l: clamp(baseL + lightOffset, 34, 70),
    }
  })
}

function toHslCss({ h, s, l }: HslColor) {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

/**
 * 基于主色生成主题色盘。
 * 前几色优先高区分，后续颜色兼顾数量与观感。
 */
export function generateThemeColorPalette(
  primaryColor: string,
  size = DEFAULT_SIZE,
) {
  const base = hexToHsl(primaryColor)
  const total = clamp(Math.round(size), 1, MAX_SIZE)
  if (total === 1) {
    return [toHslCss(base)]
  }

  const candidates = buildCandidates(base, total)
  const selected: HslColor[] = [{ ...base }]

  for (let i = 1; i < total; i += 1) {
    // 前置颜色用更高阈值，保证主图例更易区分。
    const baseThreshold
      = i < FRONT_PRIORITY_COUNT ? FRONT_MIN_DISTANCE : NORMAL_MIN_DISTANCE
    let chosen: HslColor | null = null

    for (const relax of RELAX_STEPS) {
      // 逐步放宽阈值，避免严格条件下选不出颜色。
      const threshold = Math.max(0.08, baseThreshold - relax)
      let bestScore = -1
      let best: HslColor | null = null

      for (const candidate of candidates) {
        const minDistance = getMinDistance(candidate, selected)
        if (minDistance < threshold) {
          continue
        }
        // 主评分看与已选色最小距离，副评分平衡与主色关系及明度舒适度。
        const hueFromBase
          = Math.min(
            Math.abs(candidate.h - base.h),
            360 - Math.abs(candidate.h - base.h),
          ) / 180
        const lightBalance = 1 - Math.abs(candidate.l - 52) / 52
        const score
          = minDistance * 0.78 + hueFromBase * 0.12 + lightBalance * 0.1
        if (score > bestScore) {
          bestScore = score
          best = candidate
        }
      }

      if (best) {
        chosen = best
        break
      }
    }

    if (!chosen) {
      // 兜底: 若放宽后仍未命中，选择当前“最不相似”的候选。
      chosen = candidates.reduce(
        (best, candidate) => {
          if (!best) {
            return candidate
          }
          return getMinDistance(candidate, selected)
            > getMinDistance(best, selected)
            ? candidate
            : best
        },
        null as HslColor | null,
      ) ?? { ...base }
    }

    selected.push(chosen)
  }

  return selected.map(toHslCss)
}

/**
 * 基于主色生成 ECharts 色盘。
 * 与全局主题色盘算法同源。
 */
export function generateEchartsColorPalette(
  primaryColor: string,
  size = DEFAULT_SIZE,
) {
  return generateThemeColorPalette(primaryColor, size)
}

/**
 * 读取当前主题主色（CSS 变量）。
 * 在非浏览器环境中返回传入兜底色。
 */
export function getThemePrimaryColor(fallback = DEFAULT_PRIMARY_FALLBACK) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback
  }
  const rawColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--el-color-primary',
  )
  return (
    normalizeHexColor(rawColor)
    ?? normalizeHexColor(fallback)
    ?? DEFAULT_PRIMARY_FALLBACK
  )
}

/**
 * 生成字典候选色（后端字典未返回 color 时按顺序分配）。
 * 与 ECharts 使用同一主题色盘算法。
 */
export function generateDictColorCandidates(size = DEFAULT_DICT_SIZE) {
  const primaryColor = getThemePrimaryColor(DEFAULT_PRIMARY_FALLBACK)
  return generateThemeColorPalette(primaryColor, size)
}

import { ElMessage } from 'element-plus'

export interface HslColor {
  h: number
  s: number
  l: number
}

interface LabColor {
  l: number
  a: number
  b: number
}

const DEFAULT_HUE_OFFSETS = [0, 8, -8, 16, -16, 24, -24, 32, -32, 40, -40]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * 获取CSS变量值（别名函数）
 * @param name CSS变量名
 * @returns CSS变量值
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

/**
 * 验证hex颜色格式
 * @param hex hex颜色值
 * @returns 是否为有效的hex颜色
 */
function isValidHexColor(hex: string): boolean {
  const cleanHex = hex.trim().replace(/^#/, '')
  return /^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(cleanHex)
}

/**
 * 规范化 Hex 输入，仅接受 #RGB/#RRGGBB，统一返回 #RRGGBB。
 */
export function normalizeHexColor(value: string): string | null {
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

/**
 * @description hex颜色转rgb颜色
 * @param {string} str 颜色值字符串
 * @returns {string} 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
  if (!isValidHexColor(str)) {
    throw new Error('Invalid hex color format')
  }
  let hexs: any = ''
  const reg = /^#?[0-9A-F]{6}$/i
  if (!reg.test(str)) { return ElMessage.warning('输入错误的hex') }
  str = str.replace('#', '')
  hexs = str.match(/../g)
  for (let i = 0; i < 3; i++) { hexs[i] = Number.parseInt(hexs[i], 16) }
  return hexs
}

/**
 * 将hex颜色转换为RGBA
 * @param hex hex颜色值 (支持 #FFF 或 #FFFFFF 格式)
 * @param opacity 透明度 (0-1)
 * @returns 包含RGB值和RGBA字符串的对象
 */
export function hexToRgba(hex: string, opacity: number) {
  if (!isValidHexColor(hex)) {
    throw new Error('Invalid hex color format')
  }
  // 移除可能存在的 # 前缀并转换为大写
  let cleanHex = hex.trim().replace(/^#/, '').toUpperCase()

  // 如果是缩写形式（如 FFF），转换为完整形式
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map(char => char.repeat(2))
      .join('')
  }

  // 解析 RGB 值
  const [red, green, blue] = cleanHex.match(/\w\w/g)!.map(x => Number.parseInt(x, 16))

  // 确保 opacity 在有效范围内
  const validOpacity = Math.max(0, Math.min(1, opacity))

  // 构建 RGBA 字符串
  const rgba = `rgba(${red}, ${green}, ${blue}, ${validOpacity.toFixed(2)})`

  return { red, green, blue, rgba }
}

/**
 * @description rgb颜色转Hex颜色
 * @param {*} r 代表红色
 * @param {*} g 代表绿色
 * @param {*} b 代表蓝色
 * @returns {string} 返回处理后的颜色值
 */
export function rgbToHex(r: any, g: any, b: any) {
  const reg = /^\d{1,3}$/
  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) { return ElMessage.warning('输入错误的rgb颜色值') }
  const hexs = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length === 1) { hexs[i] = `0${hexs[i]}` }
  }
  return `#${hexs.join('')}`
}

/**
 * @description 加深颜色值
 * @param {string} color 颜色值字符串
 * @param {number} level 加深的程度，限0-1之间
 * @returns {string} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
  const reg = /^#?[0-9A-F]{6}$/i
  if (!reg.test(color)) { return ElMessage.warning('输入错误的hex颜色值') }
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) { rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level)) }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * @description 变浅颜色值
 * @param {string} color 颜色值字符串
 * @param {number} level 加深的程度，限0-1之间
 * @returns {string} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
  const reg = /^#?[0-9A-F]{6}$/i
  if (!reg.test(color)) { return ElMessage.warning('输入错误的hex颜色值') }
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) { rgb[i] = Math.round(255 * level + rgb[i] * (1 - level)) }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * @description hex颜色转hsl颜色
 * @param {string} hex 颜色值字符串
 * @returns {Array<number>} 返回处理后的hsl颜色值 [h, s, l]
 */
export function hexToHsl(hex: string): [number, number, number] {
  const reg = /^#?[0-9A-F]{6}$/i
  if (!reg.test(hex)) {
    return [0, 0, 0]
  }

  // 移除#前缀并转换为RGB
  hex = hex.replace('#', '')
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0; let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h = h * 60
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

/**
 * @description hsl颜色转hex颜色
 * @param {number} h 色相（0-360）
 * @param {number} s 饱和度（0-100）
 * @param {number} l 亮度（0-100）
 * @returns {string} hex 颜色
 */
export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360
  const sat = clamp(s, 0, 100) / 100
  const lig = clamp(l, 0, 100) / 100

  if (sat === 0) {
    const gray = Math.round(lig * 255)
    return `#${gray.toString(16).padStart(2, '0').repeat(3)}`.toUpperCase()
  }

  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - lig * sat
  const p = 2 * lig - q

  const hueToRgb = (tRaw: number) => {
    let t = tRaw
    if (t < 0) {
      t += 1
    }
    if (t > 1) {
      t -= 1
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
      return q
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }
    return p
  }

  const hBase = hue / 360
  const r = Math.round(hueToRgb(hBase + 1 / 3) * 255)
  const g = Math.round(hueToRgb(hBase) * 255)
  const b = Math.round(hueToRgb(hBase - 1 / 3) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
}

/**
 * @description 计算两个 HSL 颜色的距离
 */
export function calculateHslColorDistance(a: HslColor, b: HslColor) {
  const hueDiffRaw = Math.abs(a.h - b.h)
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw) / 180
  const satDiff = Math.abs(a.s - b.s) / 100
  const lightDiff = Math.abs(a.l - b.l) / 100
  return hueDiff * 0.72 + satDiff * 0.18 + lightDiff * 0.1
}

function toRadians(degree: number) {
  return degree * (Math.PI / 180)
}

function toLabColor(hexColor: string): LabColor {
  const normalizedHex = normalizeHexColor(hexColor)
  if (!normalizedHex) {
    return { l: 0, a: 0, b: 0 }
  }

  const cleanHex = normalizedHex.replace('#', '')
  const red = Number.parseInt(cleanHex.substring(0, 2), 16) / 255
  const green = Number.parseInt(cleanHex.substring(2, 4), 16) / 255
  const blue = Number.parseInt(cleanHex.substring(4, 6), 16) / 255

  const linearize = (value: number) => {
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  }

  const r = linearize(red)
  const g = linearize(green)
  const b = linearize(blue)

  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) * 100
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) * 100

  const refX = 95.047
  const refY = 100
  const refZ = 108.883

  const normalize = (value: number, ref: number) => {
    const t = value / ref
    return t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + (16 / 116)
  }

  const fx = normalize(x, refX)
  const fy = normalize(y, refY)
  const fz = normalize(z, refZ)

  return {
    l: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}

/**
 * @description 计算两个颜色的 CIEDE2000 感知色差
 */
function calculateDeltaE2000(a: LabColor, b: LabColor) {
  const kL = 1
  const kC = 1
  const kH = 1

  const c1 = Math.sqrt((a.a ** 2) + (a.b ** 2))
  const c2 = Math.sqrt((b.a ** 2) + (b.b ** 2))
  const cBar = (c1 + c2) / 2
  const cBarPow7 = cBar ** 7
  const g = 0.5 * (1 - Math.sqrt(cBarPow7 / (cBarPow7 + (25 ** 7))))

  const a1Prime = (1 + g) * a.a
  const a2Prime = (1 + g) * b.a
  const c1Prime = Math.sqrt((a1Prime ** 2) + (a.b ** 2))
  const c2Prime = Math.sqrt((a2Prime ** 2) + (b.b ** 2))

  const hPrime = (x: number, y: number) => {
    if (x === 0 && y === 0) {
      return 0
    }
    const hue = Math.atan2(y, x) * (180 / Math.PI)
    return hue >= 0 ? hue : hue + 360
  }

  const h1Prime = hPrime(a1Prime, a.b)
  const h2Prime = hPrime(a2Prime, b.b)

  const deltaLPrime = b.l - a.l
  const deltaCPrime = c2Prime - c1Prime

  let deltaHPrime = 0
  if (c1Prime * c2Prime !== 0) {
    const hDiff = h2Prime - h1Prime
    if (Math.abs(hDiff) <= 180) {
      deltaHPrime = hDiff
    }
    else if (hDiff > 180) {
      deltaHPrime = hDiff - 360
    }
    else {
      deltaHPrime = hDiff + 360
    }
  }

  const deltaBigHPrime = 2 * Math.sqrt(c1Prime * c2Prime) * Math.sin(toRadians(deltaHPrime / 2))
  const lBarPrime = (a.l + b.l) / 2
  const cBarPrime = (c1Prime + c2Prime) / 2

  let hBarPrime = 0
  if (c1Prime * c2Prime === 0) {
    hBarPrime = h1Prime + h2Prime
  }
  else {
    const hDiff = Math.abs(h1Prime - h2Prime)
    const hSum = h1Prime + h2Prime
    if (hDiff <= 180) {
      hBarPrime = hSum / 2
    }
    else if (hSum < 360) {
      hBarPrime = (hSum + 360) / 2
    }
    else {
      hBarPrime = (hSum - 360) / 2
    }
  }

  const t = 1
    - 0.17 * Math.cos(toRadians(hBarPrime - 30))
    + 0.24 * Math.cos(toRadians(2 * hBarPrime))
    + 0.32 * Math.cos(toRadians((3 * hBarPrime) + 6))
    - 0.2 * Math.cos(toRadians((4 * hBarPrime) - 63))

  const deltaTheta = 30 * Math.exp(-(((hBarPrime - 275) / 25) ** 2))
  const rC = 2 * Math.sqrt((cBarPrime ** 7) / ((cBarPrime ** 7) + (25 ** 7)))
  const sL = 1 + ((0.015 * ((lBarPrime - 50) ** 2)) / Math.sqrt(20 + ((lBarPrime - 50) ** 2)))
  const sC = 1 + (0.045 * cBarPrime)
  const sH = 1 + (0.015 * cBarPrime * t)
  const rT = -Math.sin(toRadians(2 * deltaTheta)) * rC

  const lTerm = deltaLPrime / (kL * sL)
  const cTerm = deltaCPrime / (kC * sC)
  const hTerm = deltaBigHPrime / (kH * sH)

  return Math.sqrt((lTerm ** 2) + (cTerm ** 2) + (hTerm ** 2) + (rT * cTerm * hTerm))
}

/**
 * @description 根据避让色自动修正主色
 * @param sourceColor 原始主题色
 * @param avoidColors 需要避让的颜色（hex）
 * @param options 配置
 * @param options.minDistance 最小色差阈值（DeltaE2000）
 * @param options.hueOffsets 色相偏移候选序列
 */
export function resolveHexColorByAvoids(
  sourceColor: string,
  avoidColors: string[],
  options?: {
    minDistance?: number
    hueOffsets?: number[]
  },
) {
  const normalizedSource = normalizeHexColor(sourceColor)
  if (!normalizedSource) {
    return { color: sourceColor, adjusted: false }
  }

  const semanticColors = avoidColors
    .map(normalizeHexColor)
    .filter((color): color is string => Boolean(color))
    .map(toLabColor)

  if (!semanticColors.length) {
    return { color: normalizedSource, adjusted: false }
  }

  const minDistance = options?.minDistance ?? 18
  const hueOffsets = options?.hueOffsets?.length ? options.hueOffsets : DEFAULT_HUE_OFFSETS

  const getCandidateMinDistance = (candidateHex: string) => {
    const candidateLab = toLabColor(candidateHex)
    return semanticColors.reduce((min, semantic) => {
      return Math.min(min, calculateDeltaE2000(candidateLab, semantic))
    }, Number.POSITIVE_INFINITY)
  }

  const originDistance = getCandidateMinDistance(normalizedSource)
  if (originDistance >= minDistance) {
    return { color: normalizedSource, adjusted: false }
  }

  const [baseH, baseS, baseL] = hexToHsl(normalizedSource)
  let bestCandidate = { color: normalizedSource, minDistance: originDistance }

  for (const offset of hueOffsets.filter(offset => offset !== 0)) {
    const candidateHex = hslToHex(baseH + offset, baseS, baseL)
    const candidateDistance = getCandidateMinDistance(candidateHex)
    if (candidateDistance > bestCandidate.minDistance) {
      bestCandidate = { color: candidateHex, minDistance: candidateDistance }
    }
    if (candidateDistance >= minDistance) {
      return { color: candidateHex, adjusted: true }
    }
  }

  return { color: bestCandidate.color, adjusted: bestCandidate.color !== normalizedSource }
}

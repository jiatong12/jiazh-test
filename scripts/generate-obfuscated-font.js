/**
 * 字体混淆生成脚本
 * 从源字体中读取 CJK 字符的字形，按 +SHIFT 规则打乱 cmap 映射后输出新字体。
 * 效果：用该字体渲染加密内容时视觉上呈现明文，用其他字体则显示乱码。
 *
 * 用法: node generate-obfuscated-font.js
 */
const fontkit = require('fontkit')
const opentype = require('opentype.js')
const fs = require('fs')
const path = require('path')

const CJK_START = 0x4E00
const CJK_END = 0x9FFF
const SHIFT = 1000
const RANGE = CJK_END - CJK_START + 1

// 源字体 & 输出路径
const ROOT = path.resolve(__dirname, '..')
const SRC_FONT = path.join(ROOT, 'ObfuscatedContent-Regular.otf')
const OUT_DIR = path.join(ROOT, 'backend', 'webapp-content-security', 'src', 'main', 'resources', 'static', 'font')
const OUT_FILE = path.join(OUT_DIR, 'obfuscated.otf')

// 常用中文标点（不在 CJK 范围内，不加密但需要在字体中提供字形）
const EXTRA_CODEPOINTS = [
  0x000A, 0x000D, // 换行、回车
  0x00A0, // 不换行空格
  0x3000, // 全角空格
  0x3001, 0x3002, // 、。
  0xFF01, 0xFF08, 0xFF09, 0xFF0C, 0xFF0E, 0xFF1A, 0xFF1B, 0xFF1F, // 全角标点
  0x201C, 0x201D, 0x2018, 0x2019, // 引号
  0x300A, 0x300B, // 《》
  0x3010, 0x3011, // 【】
  0x2026, // ……
  0x2014, 0x2013, // — –
]

/**
 * 将 fontkit 的 path commands 转换为 opentype.js 的 Path 对象
 * fontkit: {command: "moveTo", args: [x, y]}
 * opentype: {type: "M", x, y}
 */
function convertPath(srcCommands) {
  const otPath = new opentype.Path()
  for (const c of srcCommands) {
    switch (c.command) {
      case 'moveTo':
        otPath.moveTo(c.args[0], c.args[1])
        break
      case 'lineTo':
        otPath.lineTo(c.args[0], c.args[1])
        break
      case 'quadraticCurveTo':
        otPath.quadraticCurveTo(c.args[0], c.args[1], c.args[2], c.args[3])
        break
      case 'bezierCurveTo':
        otPath.bezierCurveTo(c.args[0], c.args[1], c.args[2], c.args[3], c.args[4], c.args[5])
        break
      case 'curveTo':
        otPath.bezierCurveTo(c.args[0], c.args[1], c.args[2], c.args[3], c.args[4], c.args[5])
        break
      case 'closePath':
        otPath.close()
        break
    }
  }
  return otPath
}

function main() {
  console.log('Loading source font:', SRC_FONT)
  const srcFont = fontkit.openSync(SRC_FONT)
  console.log('Source glyphs:', srcFont.numGlyphs, 'unitsPerEm:', srcFont.unitsPerEm)

  const glyphs = []
  const usedCps = new Set()

  // .notdef
  glyphs.push(new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: srcFont.unitsPerEm / 2,
    path: new opentype.Path(),
  }))

  // CJK: 只放加密后的 codepoint，指向原始字形
  let cjkCount = 0
  for (let cp = CJK_START; cp <= CJK_END; cp++) {
    const srcGlyph = srcFont.glyphForCodePoint(cp)
    if (!srcGlyph || srcGlyph.id === 0) continue

    const encCp = CJK_START + ((cp - CJK_START + SHIFT) % RANGE)
    if (usedCps.has(encCp)) continue
    usedCps.add(encCp)

    glyphs.push(new opentype.Glyph({
      name: `uni${encCp.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: encCp,
      advanceWidth: srcGlyph.advanceWidth,
      path: convertPath(srcGlyph.path.commands),
    }))
    cjkCount++
  }
  console.log('CJK encrypted glyphs:', cjkCount)

  // ASCII
  for (let cp = 0x20; cp <= 0x7E; cp++) {
    if (usedCps.has(cp)) continue
    const srcGlyph = srcFont.glyphForCodePoint(cp)
    if (!srcGlyph || srcGlyph.id === 0) continue
    usedCps.add(cp)
    glyphs.push(new opentype.Glyph({
      name: (cp >= 0x41 && cp <= 0x5A) || (cp >= 0x61 && cp <= 0x7A)
        ? String.fromCharCode(cp)
        : `uni${cp.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: cp,
      advanceWidth: srcGlyph.advanceWidth,
      path: convertPath(srcGlyph.path.commands),
    }))
  }
  console.log('ASCII glyphs added')

  // 中文标点等
  for (const cp of EXTRA_CODEPOINTS) {
    if (usedCps.has(cp)) continue
    const srcGlyph = srcFont.glyphForCodePoint(cp)
    if (!srcGlyph || srcGlyph.id === 0) continue
    usedCps.add(cp)
    glyphs.push(new opentype.Glyph({
      name: `uni${cp.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: cp,
      advanceWidth: srcGlyph.advanceWidth,
      path: convertPath(srcGlyph.path.commands),
    }))
  }
  console.log('Total glyphs:', glyphs.length)

  const ascender = srcFont.ascender || srcFont['OS/2']?.typoAscender || 800
  const descender = srcFont.descender || srcFont['OS/2']?.typoDescender || -200

  // 构建新字体
  const font = new opentype.Font({
    familyName: 'ObfuscatedContent',
    styleName: 'Regular',
    unitsPerEm: srcFont.unitsPerEm,
    ascender,
    descender,
    glyphs,
  })

  // 确保输出目录存在
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const buf = font.toArrayBuffer()
  fs.writeFileSync(OUT_FILE, Buffer.from(buf))
  console.log('Output:', OUT_FILE)
  console.log('Size:', (buf.byteLength / 1024).toFixed(0), 'KB')

  // 验证：加密后的"你"在输出字体中的字形应与源字体中"你"的字形一致
  const newFont = fontkit.openSync(OUT_FILE)
  const encYou = CJK_START + ((0x4F60 - CJK_START + SHIFT) % RANGE)
  const origSvg = srcFont.glyphForCodePoint(0x4F60).path.toSVG()
  const newSvg = newFont.glyphForCodePoint(encYou).path.toSVG()
  console.log(`\nVerify: U+4F60(你) encrypted -> U+${encYou.toString(16).toUpperCase()}`)
  console.log('Source 你 SVG:', origSvg.substring(0, 80))
  console.log('Output enc-你 SVG:', newSvg.substring(0, 80))
  console.log('Glyph matches:', origSvg === newSvg)
}

main()

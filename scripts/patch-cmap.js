/**
 * 直接修改源字体二进制中的 cmap 表，将 CJK 字符映射按 +SHIFT 规则打乱。
 * 保留源字体的所有其他表（glyf/head/hhea/name 等），确保浏览器兼容性。
 *
 * 原理：读取源字体的 cmap（字符→字形索引 映射），
 *        为每个 CJK 原始字符 c 构建新映射：encrypt(c) → glyphOf(c)
 *        替换原始 cmap 表，更新校验和，输出新字体。
 */
const fs = require('fs')
const path = require('path')

const CJK_START = 0x4E00
const CJK_END = 0x9FFF
const SHIFT = 1000
const RANGE = CJK_END - CJK_START + 1

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'ObfuscatedContent-Regular.otf')
const OUT_DIR = path.join(ROOT, 'backend', 'webapp-content-security', 'src', 'main', 'resources', 'static', 'font')
const OUT = path.join(OUT_DIR, 'obfuscated.ttf')

// ── Binary helpers ──
function readU16(buf, off) { return buf.readUInt16BE(off) }
function readI16(buf, off) { return buf.readInt16BE(off) }
function writeU16(buf, off, v) { buf.writeUInt16BE(v, off) }
function readU32(buf, off) { return buf.readUInt32BE(off) }
function writeU32(buf, off, v) { buf.writeUInt32BE(v, off) }

function calcChecksum(buf) {
  let sum = 0
  const padded = Buffer.alloc(Math.ceil(buf.length / 4) * 4)
  buf.copy(padded)
  for (let i = 0; i < padded.length; i += 4) {
    sum = (sum + padded.readUInt32BE(i)) >>> 0
  }
  return sum
}

// ── Read original cmap into a Map<codepoint, glyphIndex> ──
function parseCmap(buf, cmapOffset) {
  const map = new Map()
  const numEnc = readU16(buf, cmapOffset + 2)
  for (let i = 0; i < numEnc; i++) {
    const recOff = cmapOffset + 4 + i * 8
    const subOff = readU32(buf, recOff + 4)
    const absOff = cmapOffset + subOff
    const fmt = readU16(buf, absOff)
    if (fmt === 4) {
      parseFmt4(buf, absOff, map)
    }
  }
  return map
}

function parseFmt4(buf, off, map) {
  const segCount = readU16(buf, off + 6) / 2
  const endOff = off + 14
  const startOff = endOff + segCount * 2 + 2  // +2 for reservedPad
  const deltaOff = startOff + segCount * 2
  const rangeOff = deltaOff + segCount * 2

  for (let i = 0; i < segCount; i++) {
    const end = readU16(buf, endOff + i * 2)
    const start = readU16(buf, startOff + i * 2)
    const delta = readI16(buf, deltaOff + i * 2)
    const rangeOffset = readU16(buf, rangeOff + i * 2)

    if (start === 0xFFFF) break
    for (let c = start; c <= end; c++) {
      let glyphId
      if (rangeOffset === 0) {
        glyphId = (c + delta) & 0xFFFF
      } else {
        const idx = rangeOff + i * 2 + rangeOffset + (c - start) * 2
        glyphId = readU16(buf, idx)
        if (glyphId !== 0) glyphId = (glyphId + delta) & 0xFFFF
      }
      if (glyphId !== 0) map.set(c, glyphId)
    }
  }
}

// ── Build a new Format 4 cmap subtable from a Map ──
function buildFmt4(entries) {
  // entries: Array of [codepoint, glyphIndex], sorted by codepoint
  // Split into segments where glyphIndex = codepoint + delta (constant delta)
  const segments = []
  let segStart = entries[0][0]
  let segDelta = (entries[0][1] - entries[0][0]) & 0xFFFF
  let segEnd = entries[0][0]

  for (let i = 1; i < entries.length; i++) {
    const [c, g] = entries[i]
    const d = (g - c) & 0xFFFF
    if (c === segEnd + 1 && d === segDelta) {
      segEnd = c
    } else {
      segments.push([segStart, segEnd, segDelta])
      segStart = c
      segDelta = d
      segEnd = c
    }
  }
  segments.push([segStart, segEnd, segDelta])
  // Add terminator
  segments.push([0xFFFF, 0xFFFF, 1])

  const segCount = segments.length
  const searchRange = Math.pow(2, Math.floor(Math.log2(segCount))) * 2
  const entrySelector = Math.floor(Math.log2(segCount))
  const rangeShift = segCount * 2 - searchRange

  // Format 4: 14 header + 2 reservedPad + 4 arrays * segCount * 2
  const size = 14 + 2 + segCount * 2 * 4
  const buf = Buffer.alloc(size)
  let off = 0

  writeU16(buf, off, 4); off += 2          // format
  writeU16(buf, off, size); off += 2       // length
  writeU16(buf, off, 0); off += 2          // language
  writeU16(buf, off, segCount * 2); off += 2 // segCountX2
  writeU16(buf, off, searchRange); off += 2
  writeU16(buf, off, entrySelector); off += 2
  writeU16(buf, off, rangeShift); off += 2

  // endCode
  for (const [s, e, d] of segments) { writeU16(buf, off, e); off += 2 }
  // reservedPad
  writeU16(buf, off, 0); off += 2
  // startCode
  for (const [s, e, d] of segments) { writeU16(buf, off, s); off += 2 }
  // idDelta
  for (const [s, e, d] of segments) { writeU16(buf, off, d & 0xFFFF); off += 2 }
  // idRangeOffset (all 0 = use delta)
  for (let i = 0; i < segCount; i++) { writeU16(buf, off, 0); off += 2 }

  return buf
}

// ── Build full cmap table ──
function buildCmapTable(fmt4Buf) {
  // cmap header (4) + 1 encoding record (8) + subtable
  const buf = Buffer.alloc(4 + 8 + fmt4Buf.length)
  writeU16(buf, 0, 0)     // version
  writeU16(buf, 2, 1)     // numTables
  // encoding record: platform 3 (Windows), encoding 1 (Unicode BMP)
  writeU16(buf, 4, 3)     // platformID
  writeU16(buf, 6, 1)     // encodingID
  writeU32(buf, 8, 12)    // offset to subtable (4+8=12)
  fmt4Buf.copy(buf, 12)
  return buf
}

function main() {
  console.log('Reading source font:', SRC)
  const fontBuf = fs.readFileSync(SRC)

  // Parse offset table
  const numTables = readU16(fontBuf, 4)

  // Find cmap table record
  let cmapRecOff = -1
  for (let i = 0; i < numTables; i++) {
    const recOff = 12 + i * 16
    const tag = fontBuf.slice(recOff, recOff + 4).toString('ascii')
    if (tag === 'cmap') {
      cmapRecOff = recOff
      break
    }
  }
  if (cmapRecOff === -1) { console.error('cmap table not found!'); process.exit(1) }

  const cmapOffset = readU32(fontBuf, cmapRecOff + 8)
  console.log('cmap table at offset', cmapOffset)

  // Parse original cmap
  const origMap = parseCmap(fontBuf, cmapOffset)
  console.log('Original cmap entries:', origMap.size)

  // Build new mapping: encrypted CJK → original glyph, plus non-CJK as-is
  const newMap = new Map()
  for (const [cp, glyphId] of origMap) {
    if (cp >= CJK_START && cp <= CJK_END) {
      // Map encrypted codepoint to original glyph
      const encCp = CJK_START + ((cp - CJK_START + SHIFT) % RANGE)
      if (!newMap.has(encCp)) {
        newMap.set(encCp, glyphId)
      }
    } else {
      // Non-CJK: keep as-is
      newMap.set(cp, glyphId)
    }
  }
  console.log('New cmap entries:', newMap.size)

  // Build new cmap binary
  const sortedEntries = [...newMap.entries()].sort((a, b) => a[0] - b[0])
  const fmt4 = buildFmt4(sortedEntries)
  const newCmap = buildCmapTable(fmt4)
  console.log('New cmap table size:', newCmap.length, 'bytes')

  // Build new font: copy original, replace cmap
  const oldCmapLen = readU32(fontBuf, cmapRecOff + 12)
  const sizeDiff = oldCmapLen - newCmap.length
  const newFont = Buffer.alloc(fontBuf.length - sizeDiff)
  fontBuf.copy(newFont, 0, 0, cmapOffset)                            // before cmap
  newCmap.copy(newFont, cmapOffset)                                    // new cmap
  fontBuf.copy(newFont, cmapOffset + newCmap.length, cmapOffset + oldCmapLen) // after cmap

  // Update table directory: fix offsets and checksums for all tables
  for (let i = 0; i < numTables; i++) {
    const recOff = 12 + i * 16
    const tag = newFont.slice(recOff, recOff + 4).toString('ascii')
    const tableOff = readU32(newFont, recOff + 8)

    if (tag === 'cmap') {
      // Update cmap record
      writeU32(newFont, recOff + 12, newCmap.length)
      writeU32(newFont, recOff + 4, calcChecksum(newCmap))
    } else if (tableOff > cmapOffset) {
      // Tables after cmap shift by -sizeDiff
      writeU32(newFont, recOff + 8, tableOff - sizeDiff)
    }
  }

  // Write output
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT, newFont)
  console.log('Output:', OUT)
  console.log('Size:', (newFont.length / 1024).toFixed(0), 'KB')

  // Verify with fontkit
  const fontkit = require('fontkit')
  const vFont = fontkit.openSync(OUT)
  const encYou = CJK_START + ((0x4F60 - CJK_START + SHIFT) % RANGE)
  const origGlyph = fontkit.openSync(SRC).glyphForCodePoint(0x4F60)
  const newGlyph = vFont.glyphForCodePoint(encYou)
  console.log('\nVerify: U+4F60(你) -> encrypted U+' + encYou.toString(16).toUpperCase())
  console.log('Source glyph path:', origGlyph.path.toSVG().substring(0, 60))
  console.log('Output glyph path:', newGlyph.path.toSVG().substring(0, 60))
  console.log('Paths match:', origGlyph.path.toSVG() === newGlyph.path.toSVG())
}

main()

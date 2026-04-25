import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// 获取当前模块的绝对路径 (等同于 __filename)
const __filename = url.fileURLToPath(import.meta.url)
// 获取当前模块所在的目录路径 (等同于 __dirname)
const __dirname = path.dirname(__filename)

const projectRoot = path.join(__dirname, '..')
const agentsFilePath = path.join(projectRoot, 'AGENTS.md')
const claudeFilePath = path.join(projectRoot, 'CLAUDE.md')
const agentsSkillsDirPath = path.join(projectRoot, '.agents', 'skills')
const claudeDir = path.join(projectRoot, '.claude')
const claudeSkillsDirPath = path.join(claudeDir, 'skills')

function isSameFile(pathA, pathB) {
  const statA = fs.statSync(pathA)
  const statB = fs.statSync(pathB)
  return statA.dev === statB.dev && statA.ino === statB.ino
}

function isSameRealPath(pathA, pathB) {
  return fs.realpathSync.native(pathA) === fs.realpathSync.native(pathB)
}

function recreateHardLink(sourcePath, targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { force: true, recursive: true })
  }
  fs.linkSync(sourcePath, targetPath)
}

function recreateJunction(sourcePath, targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { force: true, recursive: true })
  }
  fs.symlinkSync(sourcePath, targetPath, 'junction')
}

// 同步根目录记忆文件：统一维护 AGENTS.md -> CLAUDE.md 的文件硬链接。
function ensureClaudeFileLink() {
  if (!fs.existsSync(agentsFilePath)) {
    console.log('未找到 AGENTS.md，跳过 CLAUDE.md 硬链接初始化。')
    return
  }

  if (!fs.existsSync(claudeFilePath)) {
    console.log('存在 AGENTS.md 但不存在 CLAUDE.md，使用硬链接创建 CLAUDE.md。')
    recreateHardLink(agentsFilePath, claudeFilePath)
    return
  }

  if (!isSameFile(agentsFilePath, claudeFilePath)) {
    console.log('CLAUDE.md 已存在但不是 AGENTS.md 的硬链接，正在自动修复。')
    recreateHardLink(agentsFilePath, claudeFilePath)
    return
  }

  console.log('CLAUDE.md 与 AGENTS.md 已是同一硬链接，无需处理。')
}

// 同步技能目录：Claude 通过 .claude/skills 读取，本项目统一复用 .agents/skills。
function ensureClaudeSkillsJunction() {
  if (!fs.existsSync(agentsSkillsDirPath)) {
    console.log('未找到 .agents/skills，跳过 .claude/skills 目录联接初始化。')
    return
  }

  if (!fs.existsSync(claudeSkillsDirPath)) {
    console.log('存在 .agents/skills 但不存在 .claude/skills，使用目录联接创建 .claude/skills。')
    recreateJunction(agentsSkillsDirPath, claudeSkillsDirPath)
    return
  }

  if (isSameRealPath(agentsSkillsDirPath, claudeSkillsDirPath)) {
    console.log('.claude/skills 与 .agents/skills 已指向同一目录，无需处理。')
    return
  }

  const claudeSkillsStat = fs.lstatSync(claudeSkillsDirPath)

  if (claudeSkillsStat.isSymbolicLink()) {
    console.log('.claude/skills 已存在但不是 .agents/skills 的目录联接，正在自动修复。')
    recreateJunction(agentsSkillsDirPath, claudeSkillsDirPath)
    return
  }

  if (claudeSkillsStat.isDirectory() && fs.readdirSync(claudeSkillsDirPath).length === 0) {
    console.log('.claude/skills 是空目录且未指向 .agents/skills，正在自动修复为目录联接。')
    recreateJunction(agentsSkillsDirPath, claudeSkillsDirPath)
    return
  }

  console.log('.claude/skills 已存在且不是指向 .agents/skills 的目录联接；为避免覆盖现有内容，跳过自动修复。')
}

ensureClaudeFileLink()
ensureClaudeSkillsJunction()

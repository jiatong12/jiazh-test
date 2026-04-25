# Technical Decision Memo

## 2026-03-26

### 决策

- 将根目录 `AGENTS.md` 从旧的 README 式说明重写为面向 AI 协作的仓库规范，内容以当前仓库真实技术栈和代码约束为准。

### 原因

- 旧文档混合了项目介绍、过时描述和不够可执行的说明，容易让协作代理把 `UnoCSS` 误判为通用原子样式方案，或忽略 `template-examples`、`Base*` 组件、`src/styles/common.scss` 等本项目的实际复用路径。

### 落地约束

- 技术栈以 `package.json`、`vite.config.ts`、`uno.config.ts`、`eslint.config.mjs` 为准。
- 页面实现优先复用 `src/modules/examples/**` 和 `src/components/**`，其中 UnoCSS 仅用于图标。
- 文档中的开发与验证命令以当前 npm scripts 为准，不再保留 README 中未实际存在的脚本描述。

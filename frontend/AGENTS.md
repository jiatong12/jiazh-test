# Repository Guidelines

## AI 协作入口

- 优先启用项目内技能 `$zv-admin`，其规范来源于 [`.agents/skills/zv-admin/SKILL.md`](D:\workspace\zving-admin-starter-vue3\.agents\skills\zv-admin\SKILL.md)。
- 生成或修改页面时，优先参考 `src/modules/examples/template-examples/**` 与 `src/modules/examples/components-examples/**`，不要把 `src/modules/platform/**` 里的旧实现当成首选模板。
- 默认使用 `<script setup lang="ts">`、Composition API、`@/` 路径别名，以及项目现有的 `hooks`、`utils`、`types`、`store`、`dicts`。
- 开发任务未完成前，不要自动启动开发服务器；如果必须启动，请先说明原因。

## 项目概述

- 当前仓库是基于 `Vue 3.5`、`Vite 7`、`TypeScript 5.9`、`Element Plus 2.13` 的后台管理脚手架。
- 状态管理使用 `Pinia 3`，路由使用 `Vue Router 4`，HTTP 层使用 `axios`。
- 常用基础能力包括 `VueUse`、`vue-i18n`、`ECharts`、`Monaco Editor`、`TinyMCE`、`Paged.js`、`xgplayer`。
- `UnoCSS` 在本项目里只用于图标能力，不是通用原子 CSS 方案。
- Vite 开发服务器固定配置为 `0.0.0.0:8848`，且 `dev` 会自动打开浏览器。

## 项目结构与模块组织

### 核心目录

- `src/components/`：基础组件库，优先复用 `Base*` 系列组件。
- `src/modules/`：业务模块；其中 `examples/` 是首选参考实现，`platform/` 主要是历史业务模块。
- `src/layouts/`：布局系统与头部、侧边栏、标签页等布局组件。
- `src/router/modules/`：路由模块定义。
- `src/store/modules/`：Pinia store 模块。
- `src/hooks/`、`src/utils/`、`src/types/`：组合式逻辑、工具函数与类型定义。
- `src/fake/`：`vite-plugin-fake-server` 使用的 mock 数据目录。
- `src/styles/`：全局样式、主题变量、Element Plus 覆盖与公共工具类。
- `vite-config/`：拆分后的 Vite 插件与工具配置。
- `scripts/`、`node-utils/`：初始化脚本和 Node 侧复用工具。

### 组件与页面组织

- `src/components/*/src/*.vue|tsx` 与 `src/components/*/src/*.tsx` 会被自动注册；新增基础组件时沿用这个目录结构。
- 业务页面优先由页面入口 + `components/` 子组件构成；当新增/编辑/详情逻辑变复杂时，拆成场景组件而不是在单文件中堆叠逻辑。
- 多入口页面、复杂表格、详情抽屉、树表格等模式，优先从 `src/modules/examples/template-examples/**` 复制骨架后再按业务调整。

## 构建、检查与开发命令

```bash
# 安装依赖
pnpm install

# 开发模式（会自动打开浏览器，默认端口 8848）
pnpm run dev

# 类型检查
pnpm run type:check

# ESLint 自动修复
pnpm run lint:eslint

# ESLint 自动修复（带缓存）
pnpm run lint:cache:eslint

# lint-staged 本地门禁
pnpm run lint:staged

# 构建开发环境
pnpm run build:dev

# 构建生产环境
pnpm run build:pro

# 生产构建并输出压缩包 / zip / 依赖分析
pnpm run build:compress
pnpm run build:archiver
pnpm run build:visualizer

# 本地预览构建产物
pnpm run preview
```

## 编码风格与实现约定

- ESLint 使用 `@antfu/eslint-config` 的 flat config，格式以仓库规则为准，不要手写一套独立风格。
- `.vue` / `.tsx` 文件遵循 `script -> template -> style` 的块顺序。
- Vue 模板中的组件名优先使用 `PascalCase`。
- 路径别名优先使用 `@/`，避免层层相对路径。
- 优先复用项目已有的 `BaseTable`、`BaseForm`、`BaseDialog`、`BaseDrawer`、`BaseTabs` 等基础组件，其次才是直接拼装 Element Plus。
- 表格、搜索表单、详情抽屉等页面模式优先复用 `useTableSetup`、`BaseTableSearchForm` 等现有封装，不重复造轮子。
- 默认不要使用 `src/fake/**`；只有用户明确要求 mock/fake 数据方案时才接入该目录。
- TypeScript 以“够用、直观、可维护”为原则，优先依赖推导，只在组件边界、接口边界和 `ref` 边界补显式类型。
- 注释只解释“为什么这样做”或“关键约束”，不要逐句翻译代码；修 bug 时必须补充防回归注释。

## 样式与主题约定

- 主题颜色、明暗模式与关键语义色优先使用 `src/styles/var.scss` 与 Element Plus CSS 变量（`--zv-*`、`--el-*`）。
- 可以直接使用 `src/styles/common.scss` 中已有的公共类，例如 `flex-column-layout`、`flex-height-fill`、`h-full`、`w-full`、`mb-*`。
- 不要把 `UnoCSS` 当成 Tailwind/原子 CSS 使用；除图标类（如 `i-mdi:*`、`i-ep:*`、`i-icon:*`）外，不要新增依赖 UnoCSS 解释的布局类或文本类。
- 页面主体高度优先通过父子容器传递，避免在业务页面滥用 `100vh` 或 `calc(100vh - xxx)`。
- 需要滚动时，优先让子内容区承担滚动；避免父子同时纵向滚动。
- 页面或业务组件需要自定义样式时，采用“页面根类命名空间 + 嵌套结构”的 SCSS 写法，避免无作用域的平铺选择器。

## 数据、接口与环境约定

- HTTP 请求统一走 `axios` 与项目封装；相对路径通常由配置层补齐前缀。
- 后端字段与数据库字段保持一致，再转换为前端常用的 `camelCase` 命名。
- 带分页的接口默认使用 `pageIndex`、`pageSize`，响应里返回列表和 `total`。
- fake 数据目录是 `src/fake/`，由 `vite-plugin-fake-server` 管理；生产构建默认不启用。
- 环境变量与运行时配置通过 `vite.config.ts`、`src/env/**`、`vite-config/**` 协同处理，不要在业务组件里硬编码后端地址、命名空间或主题键名。

## 验证要求

- 当前仓库没有 `pnpm test` 一类统一测试命令，交付前至少执行与改动匹配的验证。
- 代码或配置改动优先选择：
  - `pnpm run type:check`
  - `pnpm run lint:eslint` 或针对变更文件的 ESLint 校验
  - 影响构建、入口、Vite 配置时执行 `pnpm run build:dev` 或 `pnpm run build:pro`
- 纯文档改动至少执行 `git diff --check`，确认没有空白错误或换行问题。

## 提交与协作规范

- 提交信息遵循 Conventional Commits，说明文字优先使用中文，术语可保留英文。
- 提交前保留 `lint-staged` / `husky` 门禁，不要通过跳过校验来“完成”任务。
- 涉及 UI 调整时，在说明中写清影响页面、交互变化和验证方式。
- 新的工程级技术决策统一记录到 `docs/technical-decision-memo.md`。

## 配置提示

- 根路径别名：`@ -> ./src`
- 全局 SCSS 注入：`@use "@/styles/var.scss" as *;`
- 自动导入：`vue` 组合式 API、`useRouter`、`useRoute`
- 组件自动解析：Element Plus + `src/components/*/src/*`
- 开发环境依赖 `vite-plugin-vue-devtools`、fake server、运行时 `_app.config.js` 注入等 Vite 插件链，请优先在 `vite-config/` 与 `vite.config.ts` 中排查相关问题。

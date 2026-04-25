# zving-admin-starter-vue3
AI 协作规范：请在 Codex 中启用 `$zv-admin`（项目内 skill，位于 `.agents/skills/zv-admin`）。

### 概述
基于 Vue3 + Element-Plus + TypeScript 的后台管理系统脚手架   
前端使用 Vue3 + Element-Plus + TypeScript 框架，后端实现 RESTful 规范的接口与前端进行交互。  
前端工程要配合后端工程提供的接口来使用。  
后端工程可以使用 https://git.zving.com/com.zving/platform3.x 如果因为 platform3.x 接口变化导致对接口返回的数据处理出错, 请与我联系, 跟进接口变化更新本脚手架.

### 运用到的工具、框架或库：
- [VueJS 3.x](https://github.com/vuejs/core)
- [Vue Router 4.x](https://github.com/vuejs/router)
- [Pinia](https://github.com/vuejs/pinia) 状态管理
- [axios](https://github.com/axios/axios)
- [Element Plus](https://github.com/element-plus/element-plus)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://cn.vitejs.dev/)
- [UnoCSS](https://unocss.dev/) 原子化 CSS 引擎
- [VueUse](https://vueuse.org/) Vue 组合式工具集

## 开发流程：
1. 克隆本脚手架前端工程、后端工程，删除`.git`目录，添加自己的git仓库的`.git`目录。配置数据库，导入示例数据。
1. 根据项目实际需求，配置路由和菜单，在 `src/router/modules` 目录下配置路由，准备各路由所对应的 vue 文件，vue 文件内容为空白，待分配给项目成员实现。
1. 在 `src/fake/modules` 目录下准备 mock 数据（使用 `vite-plugin-fake-server` 插件），设计好数据结构（控件需要的数据结构）和字段名（最好同数据库中表结构字段名）
1. 实现 vue 文件的界面部分，使用 fake-server 来拦截 ajax 请求，返回 mock 数据。
1. 后端实现 RESTful 接口，并维护接口文档（在 doc 目录下维护 Swagger 格式接口文档或使用 http://apizza.cc , https://apifox.com 之类在线文档服务）
1. 前端在 `vite.config.ts` 中关闭 fake-server 插件，调试后端接口。

## 注意事项
1. 代码风格使用 `@antfu/eslint-config`，建议使用 `VSCode` 作为 js/ts/vue 的编辑器，并安装以下插件：`EditorConfig for VSCode`、`ESLint`、`Stylelint`、`Vue - Official`（原 Volar）。注意: `Vue - Official` 2.0 以上版本已内置 TypeScript 支持，不需要 `TypeScript Vue Plugin (Volar)` 插件，如果已安装请卸载。 
1. 项目使用 `eslint.config.mjs` (ESLint Flat Config 格式)，配置了 `@antfu/eslint-config`，包含 Vue3、TypeScript、格式化等规则。
1. 在开发界面时使用 Element-Plus 提供的栅格系统（24列），对界面进行响应式布局，以便移动端访问。
1. 图标使用 `@iconify/vue` 和 UnoCSS 的图标预设，支持海量图标库（包括 Ant Design Icons、Material Design Icons 等）。
1. 注意后端返回前端的数据，字段名同数据库中的字段名，并转为小写字母开头的驼峰式命名（camelCase），构造 mock 数据时也要注意这一点。
1. 工程编译时，`public` 目录下的文件会被直接复制到 `dist` 目录下。
1. 为了便于维护，对话框、页签等如果里面的内容比较多（超过 200 行），要独立成 vue 组件，尽量不要让一个 vue 组件的代码太多（超过 500 行超过 20K）。
1. 从后台请求的数据有分页的情况下，Request 参数的约定：`pageIndex` 第几页（从0开始）；`pageSize` 每页返回多少行。Response 中返回数据除了有列表外，还要有 `total` 供分页条显示总记录数。特定的 API 也可以支持 `startIndex` 从第几行记录开始，`count` 返回多少行记录。

### 浏览器兼容性

编译后（生产环境）

- Edge ≥ 90 / Chrome ≥ 90 / Firefox ≥ 90 / Safari ≥ 14.1（2021年发布，完整支持 Vue3、ES2020、动态 import、顶层 await 等现代特性）

开发模式  

- Edge ≥ 113 / Chrome ≥ 113 / Firefox ≥ 113 / Safari ≥ 16.4（2023年发布，更好的开发体验和调试支持）

## 目录说明

```
project-root
│  index.html              入口 HTML 文件
│  package.json            项目依赖配置
│  pnpm-lock.yaml          pnpm 锁定文件
│  tsconfig.json           TypeScript 配置
│  vite.config.ts          Vite 构建配置
│  eslint.config.mjs       ESLint 配置
│  uno.config.ts           UnoCSS 配置
│
├─public                   静态资源目录，不会编译，直接复制到发布目录
│  ├─static                第三方静态资源
│  │  ├─UEditorPlus        UEditor 富文本编辑器
│  │  └─tinymce-modified   TinyMCE 富文本编辑器（修改版）
│  └─vite.svg              网站图标
│
├─src
│  │  App.vue              根组件
│  │  main.ts              应用入口文件
│  │  vite-env.d.ts        Vite 环境类型声明
│  │
│  ├─assets                项目资源文件
│  │  ├─images             图片资源
│  │  └─svg-icon           SVG 图标
│  │
│  ├─auths                 权限相关工具
│  ├─components            公共组件库
│  │  ├─base-button        按钮组件
│  │  ├─base-table         表格组件
│  │  ├─base-form          表单组件
│  │  ├─base-dialog        对话框组件
│  │  └─......             其他基础组件
│  │
│  ├─config                全局配置
│  │      axios.ts           axios 配置
│  │      nprogress.ts       进度条配置
│  │      ......
│  │
│  ├─directives            自定义指令
│  ├─dicts                 字典管理
│  ├─env                   环境变量管理
│  ├─fake                  Mock 数据配置（开发用）
│  │  └─modules            各模块的 mock 数据
│  │
│  ├─hooks                 组合式函数（Composables）
│  ├─languages             国际化语言配置
│  ├─layouts               布局组件
│  │  ├─components         布局相关组件（头部、侧边栏、标签页等）
│  │  ├─layout-classic     经典布局
│  │  ├─layout-vertical    垂直布局
│  │  ├─layout-columns     分栏布局
│  │  └─layout-transverse  横向布局
│  │
│  ├─modules               业务模块（按功能分组）
│  │  ├─base               基础模块（登录、首页、错误页等）
│  │  ├─examples           示例模块（组件示例、模板示例）
│  │  └─platform           平台管理模块（系统管理）
│  │      ├─_meta.ts          模块元信息
│  │      ├─components        模块共用组件
│  │      └─views             各功能页面
│  │          ├─system-info      系统信息
│  │          ├─branch           组织机构
│  │          ├─role             角色管理
│  │          ├─user             用户管理
│  │          ├─config           配置项管理
│  │          ├─backup           数据备份
│  │          └─log              系统日志
│  │
│  ├─router                路由配置
│  │  ├─index.ts           路由主文件
│  │  └─modules            路由模块
│  │
│  ├─store                 状态管理（Pinia）
│  │  ├─index.ts           store 主文件
│  │  └─modules            各模块 store
│  │      ├─auth.ts          认证状态
│  │      ├─global.ts        全局状态
│  │      └─......
│  │
│  ├─styles                样式文件
│  │      reset.scss         重置样式
│  │      common.scss        公共样式
│  │      element-plus.scss  Element-Plus 样式定制
│  │      ......
│  │
│  ├─theme                 主题配置
│  ├─types                 TypeScript 类型声明
│  └─utils                 工具函数
│      ├─cache             缓存工具
│      ├─validate          验证工具
│      └─......
│
├─vite-config              Vite 配置模块化
│  ├─plugins               Vite 插件配置
│  └─utils                 配置工具函数
│
└─node-utils               Node.js 工具函数
```

## 开发与构建命令
建议使用 `pnpm` 最新版本，安装 npm 包速度更快。  
建议使用淘宝的 npm 仓库镜像，安装 npm 包速度更快：  

``` bash
# 更新 pnpm 到 9.x   
npm install -g pnpm@9.x

# 使用淘宝的 npm 仓库镜像   
npm config set registry https://registry.npmmirror.com
```

### 项目启动和构建

``` bash
# 安装依赖   
pnpm install

# 进入开发模式，启动开发服务器，自动打开浏览器。监听文件改动自动热更新  
pnpm run dev

# 构建开发环境
pnpm run build:dev

# 构建生产环境（发布用）
pnpm run build:pro

# 本地预览生产构建结果
pnpm run preview
```

### 代码检查和格式化

``` bash
# TypeScript 类型检查
pnpm run type:check

# ESLint 检查并修复
pnpm run lint:eslint

# ESLint 检查并修复（带缓存，更快）
pnpm run lint:cache:eslint

# Stylelint 检查并修复
pnpm run lint:stylelint

# Stylelint 检查并修复（带缓存，更快）
pnpm run lint:cache:stylelint
```

### 依赖管理

``` bash
# 检查并交互式更新依赖（主版本）
pnpm run up:major

# 检查并交互式更新依赖（次版本）
pnpm run up:minor

# 检查并交互式更新依赖（补丁版本）
pnpm run up:patch

# 检查依赖更新（不执行更新）
pnpm run update:deps
```

### 清理命令

``` bash
# 清理所有 node_modules
pnpm run clean

# 深度清理（递归删除所有 node_modules）
pnpm run deepclean

# 重置项目（深度清理 + 重新安装依赖）
pnpm run reset
```

## 文档链接

### 核心框架
Vue 3 文档  
https://cn.vuejs.org/  

Vue Router 4 文档  
https://router.vuejs.org/zh/  

Pinia 文档（状态管理）  
https://pinia.vuejs.org/zh/  

TypeScript 文档  
https://www.typescriptlang.org/zh/docs/  

### UI 框架和工具
Element-Plus 文档  
https://element-plus.org/zh-CN/  

UnoCSS 文档（原子化 CSS）  
https://unocss.dev/  

VueUse 文档（Vue 组合式工具集）  
https://vueuse.org/  

Iconify 图标（支持海量图标库）  
https://iconify.design/  
https://icones.js.org/  

### 构建工具
Vite 文档  
https://cn.vitejs.dev/  

### 其他工具
axios 文档  
https://axios-http.com/zh/docs/intro  

Day.js 文档（日期处理）  
https://day.js.org/zh-CN/  

TinyMCE 富文本编辑器  
https://www.tiny.cloud/docs/  

UEditor Plus 富文本编辑器  
https://github.com/JackieLieu/ueditor  

ECharts 图表库  
https://echarts.apache.org/zh/index.html  

### 代码规范
Anthony Fu 的 ESLint 配置  
https://github.com/antfu/eslint-config  

### 接口文档
Swagger 文档  
https://swagger.io/docs/specification/basic-structure/  

Apifox（API 文档管理）  
https://apifox.com/

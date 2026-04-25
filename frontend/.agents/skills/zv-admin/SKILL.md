---
name: zv-admin
description: 为基于 Vue 3 + TypeScript + Element Plus 的中后台脚手架提供核心协作规范，覆盖共享组件、示例模块、表单表格、字典权限、主题样式、请求封装、验证策略与派生项目扩展约定。Use when an AI coding assistant needs to create, modify, refactor, or review scaffold code or admin-style modules in repos that use shared Base components, example templates, and centralized style, dict, auth, cache, or request conventions.
---

## 目标

让 AI 助手在当前仓库中优先复用脚手架已有能力、实现模式与扩展约定，而不是按通用 Vue 后台项目习惯自由发挥。

## 适用场景

- 修改脚手架核心层代码，例如共享组件、主题变量、请求封装、字典、权限、缓存、图标能力。
- 为基于脚手架的项目新增或调整模块页面，例如列表页、表单页、详情页、弹窗、抽屉、CRUD 流程。
- 审查代码是否符合脚手架核心契约、推荐模式与验证策略。
- 判断某项实现应保留在业务模块中，还是应该上升为脚手架公共能力。

## 核心契约

### 组件与示例复用

- 代码结构、布局和交互优先参考：
  - `src/modules/examples/template-examples/**`
  - `src/modules/examples/components-examples/**`
- 避免参考 `src/modules/platform/**` 的旧写法。
- 优先使用当前仓库 `src/components/**` 下的 `Base*`、`biz-*` 组件，其次再考虑 Element Plus。
- 如果需要新增组件或封装，先检查是否已有类似封装，例如 `base-table`、`base-form`、`base-dialog`。
- 常用组件优先级：
  - 表格/列表：`BaseTable`、`BaseTableSearchForm`、`BaseTableSearchFormItem`
  - 表单：`BaseForm`、`BaseFormItem`
  - 按钮/弹窗：`BaseButton`、`BaseDialog`、`BaseDrawer`
  - 字典/标签：`BaseDictTag`、`BaseDictText`、`BaseDictBadge`
  - 布局：`BaseRow`、`BaseCard`、`BaseTabs`

### 技术栈与代码风格

- 使用 Composition API（`<script setup lang="ts">`）与项目已有工具函数、类型。
- 路径别名优先使用 `@/`。
- 生成代码前先确认：
  - 是否已有示例可以复用
  - 是否已有 `Base*` 组件可以直接使用
  - 是否已有同类 hooks、utils、types 可以沿用

### 默认数据源策略

- 默认不用 `src/fake/**`。
- 只有用户明确要求使用 fake/mock 时，才使用 `src/fake/**`。
- 其他模拟数据场景，统一使用当前模块内的本地内存文件，例如 `data.ts`。

### 样式、主题与布局契约

- 主题颜色与暗黑模式通过 CSS 变量驱动：优先使用 `src/styles/var.scss` 的 `--zv-*` 变量，其次使用 Element Plus 变量，例如 `--el-color-primary`、`--el-bg-color`、`--el-text-color-*`、`--el-border-color-*`。
- 需要随主题变化的颜色使用变量；明暗模式都固定不变的颜色才允许使用魔法值。
- 魔法值主要用于视觉强调色，并优先收敛到局部变量，例如 `--accent-color`。
- 正文、页面/卡片底色、边框基色、交互状态色等可读性关键颜色必须变量化。
- 推荐使用“固定 accent + 变量 surface/text”的组合，避免整块重色背景与复杂线条。
- 全局通用样式优先放在 `src/styles/common.scss`，避免散落在页面。
- 业务页面和业务组件尽量不写 CSS：优先使用 Base 组件、`common.scss` 工具类与 Element Plus 完成布局与样式。
- 页面内容区高度默认来源于父容器，不要在业务页面里把主要内容高度直接绑到视口。
- 页面布局优先使用 `flex-column-layout`、`flex-height-fill`、`h-full`、`min-height: 0` 这一套父子高度传递方式。
- 非全屏独立场景，避免在页面主体、卡片主体、表格区、画布区写 `height: 100vh`、`min-height: 100vh` 或 `calc(100vh - xxx)`。
- 需要滚动时，优先让子内容区承担滚动，父级只负责提供高度；避免父子同时纵向滚动。
- 页面需要写样式时，必须采用“页面根类命名空间 + 父子嵌套结构”，例如 `.product-manage { .block { .element {} } }`。
- 状态/变体样式优先使用同级嵌套，例如 `&.is-active`、`&.block--filtered`，减少分散定义与样式漂移。
- 项目没有使用原子 CSS 框架做样式开发：不要按 Tailwind / UnoCSS 原子类思路生成布局和样式代码。
- UnoCSS 仅用于图标能力，例如 `i-mdi:*`、`i-ep:*`、`i-icon:*`；除图标类名外，不要引入或生成 `flex`、`gap-4`、`text-xs`、`w-full` 一类原子类样式。
- 允许并推荐使用项目自带的 `src/styles/common.scss` 通用类，例如 `flex-column-layout`、`flex-height-fill`、`w-full`、`h-full`、`mb-4`、`mt-2`。
- 上面这类 `common.scss` 公共类不属于“原子 CSS 框架写法”；真正需要避免的是不在项目样式表中定义、依赖 UnoCSS/Tailwind 解释的原子类。
- 需要布局与样式时，优先使用 `Base*` 组件、`src/styles/common.scss` 通用类、Element Plus 组件能力，以及页面内有命名空间的 SCSS。
- 需要暗黑适配时，统一在 `src/styles/var.scss` 或 `src/styles/element-plus-dark.scss` 做变量或覆盖，不在业务组件中写 `html.dark` 分支。

### 字典、权限、缓存与请求契约

#### 字典

- 字典集中配置于 `src/config/dict.config.ts`，并以 `freezeDeep` 冻结，确保运行期只读。
- 本地静态字典统一在 `src/config/dict.config.ts` 管理；后端字典通过 `$$dicts` 统一获取。
- `data: null` 表示从后端拉取字典数据。
- 后端字典若缺少 `color` 字段，会在 `src/dicts/utils.ts` 中通过 `generateDictColorCandidates()` 按顺序自动分配主题候选色。
- 手工维护的本地字典颜色优先使用语义化类型，例如 `primary`、`info`、`warning`，不要直接写具体色值。
- 每个字典条目通常包含 `label`、`value`，可选 `color`、`disabled`；`disabled` 仅用于“不可选”，仍可用于显示或翻译。
- `isNumber` 用于后端返回字符串但业务需要数值的场景。
- 业务判断优先使用字典常量或方法，不直接比较魔法值。
- 表单/表格展示优先使用 `BaseDictTag`、`BaseDictText`、`BaseDictBadge`。
- 选择类控件优先使用支持 `dict` 的 `BaseSelect`、`BaseRadio`、`BaseCheckboxGroup`。
- 新增字典时，必须在 `src/config/dict.config.ts` 添加并说明来源。
- 引用字典时，使用 `dict` 属性绑定，不在页面内硬编码 `label/value` 列表。
- 判断状态时，优先调用字典常量或方法。
- `$$dicts` 定义于 `src/dicts/index.ts`，通过 `useDictContextHolder({ dictConfig, getDictByCode })` 统一管理本地字典与后端字典。
- 字典引用时优先使用 `$$dicts`，必要时再用 `useDict` 或组件 `dict` 属性。

#### 权限

- `$$auths` 定义于 `src/auths/index.ts`，通过 `useAuthUtils({ hasPriv, hasPrivAny })` 提供统一权限判断。
- 权限引用时统一使用 `$$auths` 判断，不直接读取 store 内部状态。
- 权限控制优先使用组件内置 `priv`，避免手写 `v-if` 分散逻辑。

#### 缓存

- 避免在业务代码中直接使用 `localStorage`。
- 优先使用 Pinia 管理状态与持久化。
- 需要缓存时，统一通过 `src/utils/cache/index.ts` 封装读写。

#### 请求与异常

- `src/config/axios.ts` 的拦截器会原样返回 `res`，常规调用通过 `res.data` 取业务数据。
- 默认开启业务状态码判断：`response.data.status === 1` 视为成功，否则视为业务失败并抛错。
- 若请求配置 `useBizStatus: true`，会跳过业务状态码判断，直接返回 `res`。
- `responseType` 为 `blob` 或 `arraybuffer` 时：
  - 若响应内容是 `application/json`，会解析为 JSON 后走业务状态码逻辑。
  - 否则视为文件流，直接返回 `res`。
- 正常请求不需要手动判断 `response.data.status`；只有在 `useBizStatus: true` 或文件下载场景才自行处理。
- 业务失败时默认触发全局错误通知；可通过 `showDefaultError: false` 关闭。
- HTTP 错误会按状态码映射提示，`401` 会触发 `unauthorizedHandler` 并中断处理。
- 超时或网络错误会统一提示“请求超时/网络连接错误”。
- 全局错误通知只显示最后一条，会关闭之前的提示。

### 图标契约

- 统一使用 UnoCSS icon class，优先 `i-mdi:*`；仅当 `i-mdi` 没有合适图标时，再考虑 `i-ep:*`、`i-lucide:*`、`i-ri:*`。
- 优先使用项目封装的 `BaseIcon` 或 `$$renderIcon` 渲染图标。
- 仅在必要时才手写 `<i class="i-xxx">`。
- 模板中优先使用 `$$renderIcon('i-xxx:icon')`。
- 普通展示优先使用 `BaseIcon`。
- JS/TS 逻辑中优先使用 `useRenderIcon('i-xxx')` 返回 Component。
- 菜单或模块图标优先用 `_meta.ts` 中的 `icon` 字段配置。
- 自定义 SVG 图标放到 `src/assets/svg-icon/`，使用 `i-icon:<fileName>` 引用，不带 `.svg` 后缀；项目注册的自定义图标集合名为 `icon`。

### 高频硬规则

- 不要优先参考 `src/modules/platform/**` 的旧写法。
- 不要默认使用 `src/fake/**`。
- 不要按 Tailwind / UnoCSS 原子类思路生成布局和样式。
- 不要在业务组件里写 `html.dark` 分支。
- 不要绕过 `Base*` 组件直接硬写重复能力。
- 不要在页面内硬编码字典数组或直接读取 store 内部权限状态。
- 不要在业务代码里直接读写 `localStorage`。

## 推荐模式

### 页面、弹层与目录组织

#### 弹层选择

1. 字段少、结构简单：优先 `BaseDialog`。
2. 字段多、信息密度高，或需要分块展示：优先 `BaseDrawer`。
3. 流程复杂、区域联动多：改成独立页面，不在弹层里堆逻辑。

#### 组件文件组织

- 新增/编辑/详情场景组件放 `components/`。
- 仅在这些场景内复用的子组件放 `components/_components/`。
- 只有模块级复用才放模块根 `_components/` 或 `_common/`。
- 场景组件本身变复杂时，直接改成文件夹组件：`components/Foo/index.vue` 作为入口，只被该场景使用的子组件放 `components/Foo/components/`。

#### 弹框 / 抽屉组件封装

- 父页面只负责入口、列表交互与刷新；弹框或抽屉组件内部维护 `visible`、数据源等状态，并优先暴露 `open`、`openAdd`、`openEdit`。
- 新增/编辑共用同一个弹框或抽屉组件时，若差异较大应直接拆成两个组件；不要在提交逻辑里堆 `mode` 分支。
- 通用/平台级弹框与抽屉组件：允许 `open({ ...payload, onSuccess })` 传回调，适合多入口场景，减少组件内 `if` 分支判断来源。
- 业务模块弹框与抽屉组件：仍推荐 `emit`，例如 `addSuccess`、`editSuccess`，不在 `open` 参数中传函数，保持调用关系清晰。

#### 抽屉 + Tabs 展示详情

- 适用场景：详情信息量大、分模块展示，例如基础信息、日志、关联列表。
- 结构建议：`BaseDrawer` 内使用 `BaseTabs` + `BaseTabPane`，每个 tab 只关注一个模块。
- 当 tab 内容依赖当前记录且内部不会自动响应更新，例如仅在挂载时拉取或内部有缓存，可在 `BaseTabPane` 加 `:key="rowKey"` 强制重建；若内容由响应式数据驱动则不必添加。
- 详情表单统一用 `BaseForm` + `BaseFormItem`，全部 `isReadonly`，只读展示。
- tab 内有表格时，使用 `useTableSetup`，并将 `externalParams` 绑定到当前详情主键，减少父组件状态。
- 打开方式优先 `open(payload)`，可传 `row` 或 `id`。传 `row` 时可先用 `row.id` 拉取详情，同时保留 `row` 里已有字段作为即时展示或回填。

#### Tabs 布局与滚动

- 只要主体是 tabs：根节点用 `h-full`，`Tabs` 用 `class="h-full"`，`TabPane` 用 `class="h-full overflow-y-auto"`，滚动落在当前 pane。
- 如果是“固定内容 + tabs”结构：外层用 `flex-column-layout h-full`，tabs 外层用 `flex-height-fill`，不要把滚动放到外层容器。
- 多 tab 编辑时，保存/取消放在对应 tab 内，不放 tab 外全局工具栏；默认保存后不关闭抽屉。
- tab 顶部若只有一排操作按钮，直接用普通 `div` + `mb-4`。

### 表单与表格模式

#### 生成优先顺序

1. 表单页优先：`BaseForm` + `BaseFormItem`
2. 表格页优先：`BaseTable` + `BaseTableSearchForm` + `BaseTableSearchFormItem`
3. 列表页优先：`BaseTable mode="list"` + `list_item` slot
4. 需要字典显示：优先 `BaseDictTag`、`BaseDictText`、`BaseDictBadge`
5. 需要权限控制：使用组件内置 `priv` 能力，例如 `BaseButton`、`BaseFormItem`
6. 表格配置优先用 `useTableSetup`，减少类型引入与绑定错误，`columns` 自动响应式
7. `useTableSetup` 处理函数内联：`headerActions`、`rowActions` 的 `handle` 直接写在配置中

#### BaseForm

- 入口：`src/components/base-form/index.ts`
- 组件：`BaseForm`、`BaseFormItem`
- 关键能力：
  - `BaseForm` 内部使用 `useForm` 统一管理数据加载、重置与变更检测。
  - `datasource` 必填，可传对象或返回 Promise 的函数。
  - `immediate` 默认 `true`，会自动加载数据。
  - `enabledLeaveCheck` 默认 `true`，开启离开页面检查。
- 常用 props：
  - `datasource`、`immediate`
  - `gutter`、`col`、`cols`
  - `width`、`center`
  - `displayMode: 'form' | 'descriptions'`
  - `labelWidth`
- `labelWidth` 规则：
  - `displayMode="descriptions"` 必须显式设置 `labelWidth`。
  - 其他模式也尽量显式设置 `labelWidth`。
  - `labelWidth` 需按当前表单最长中文标签估算，优先从 `100px/110px/120px` 档位选择。
- 布局规则：
  - `textarea` 或较大组件按需独占一行展示。
  - `BaseFormItem` 不负责栅格跨列，不能通过 `:col` 或 `:cols` 控制占位。
  - 需要独占一行时，用 `BaseCol` 包裹该项并设置列数。
  - `displayMode="descriptions"` 留白时，优先通过 `BaseCol`、字段组织或改 `:col="1"` 解决，不额外补占位节点。
- `BaseFormItem` 常用 props：
  - `prop`、`label`、`required`、`rules`
  - `widget`、`widgetProps`
  - `dict`
  - `isReadonly`、`readonlyEmpty`
  - `watchRerender`、`watchValidate`、`watchClear`
- 行为要点：
  - 编辑态通过 `modelValue` / `onUpdate:modelValue` 与表单模型同步。
  - 只读态下走只读渲染，不再展示输入控件。
  - 空值展示由 `readonlyEmpty` 控制，默认 `--`。
  - 配置 `dict` 时只读态会自动按字典翻译显示。
  - 自定义控件必须保留 `modelValue` / `onUpdate:modelValue` 接口。

#### BaseTable

- 入口：`src/components/base-table/index.ts`
- 组件：`BaseTable`、`BaseTableSearchForm`、`BaseTableSearchFormItem`
- 关键能力：
  - `useTable` 统一管理分页、搜索、排序、导出。
  - `datasource` 必填：可传数组或 Promise 函数，优先函数。
  - `rowKey` 必填。
  - `mode: 'table' | 'list'`，`list` 用 `list_item` slot 渲染。
- 常用 props：
  - `datasource`、`rowKey`、`pageSize`、`immediate`
  - `showPagination`、`showIndex`、`showSelection`、`showRadio`
  - `rowActions`、`headerActions`
  - `actionsWidth`
  - `showExportExcel`、`exportExcelDataPath`、`exportExcelFileName`
  - `externalParams`、`defaultSearchFormState`
- 搜索表单：
  - 优先放在 `BaseTable` 的 `searchForm` slot 内。
  - 使用 `BaseTableSearchForm` 包裹。
  - 单项用 `BaseTableSearchFormItem`，支持 `widget`、`dict`、`watchRerender`、`watchValidate`、`watchClear`。
  - `simpleSearch` 适合顶部快捷搜索区，透传 `searchFirstPage`、`searchFormState`。
  - `searchForm` 适合高级搜索区域，透传 `searchFormState`、`search`、`searchFirstPage`。
- 行为要点：
  - `useTable` 会读取后端 `sortableFields` 并自动启用自定义排序。
  - 导出 Excel 依赖最后一次请求配置，Axios 响应会自动记录。
  - `list` 模式支持多选与全选逻辑。
  - `showCard` 使用口径：外层没有卡片容器时用 `true`；外层已有 `BaseCard`、`BaseDrawer`、`BaseDialog` 等容器时用 `false`。
  - 表格列宽不要全部固定，至少保留部分自适应列。
  - 表格行内展示型交互控件使用单向绑定；`switch` 建议用 `click` 触发；涉及持久化操作需二次确认，成功后刷新列表。
  - 列对齐建议：
    - 文本类：`left`
    - 数值类：`right`
    - `tag` / 纯枚举状态：`center`
    - `badge`：少量阅读型状态场景下用 `left`
    - 时间/日期：默认 `center`
    - 开关/按钮/操作：`center`
- `datasource` 返回值规则：
  - 可直接返回数组。
  - 可返回对象：`{ data, total?, sortableFields? }`
  - 可返回 Axios 响应：自动读取 `response.data`，并记录导出所需配置。
  - 分页模式下期望：`{ data, total, sortableFields? }`
- 导出 Excel：
  - 只有 `datasource` 返回 Axios 响应时，才会记录 `requestConfig`。
  - 返回数组或普通对象时，导出按钮即使显示也无法按请求参数导出。
  - 常用配置：`showExportExcel`、`exportExcelDataPath`、`exportExcelFileName`、列级 `hideExportExcel`
- `externalParams` / `defaultSearchFormState`：
  - 默认筛选值用 `defaultSearchFormState`
  - 与其他组件联动的固定条件用 `externalParams`
  - 请求合并顺序：分页参数 + 排序参数 + `searchFormState` + `externalParams()`
- `BaseTable` `ref` 常用方法：
  - `search()`：当前分页不变时刷新
  - `searchFirstPage()`：筛选条件变化或新增/重置搜索时回到第一页
- 关键注意事项：
  - 若需在 `datasource` 的 `then` 中加工数据，仍应返回 Axios 响应本体，而不是只返回 `data`，否则导出拿不到 `requestConfig`。
  - `showCard` 默认值为 `false`；经验规则是“外层有壳就 `false`，外层没壳就 `true`”。
  - `searchFormState` 是内部搜索表单数据；`defaultSearchFormState()` 只决定初始值与重置值。
  - `externalParams()` 是外部固定参数，不受搜索表单重置影响；`hasSearchFormState` 的判断不包含 `externalParams()`。

#### Widget 口径

- 能用内置 widget 就用内置 widget。
- 需要自定义交互或布局时，优先用 slot 扩展，避免新增封装。
- 自定义 slot 仍保持 `modelValue` / `onUpdate:modelValue` 的绑定方式。
- `BaseForm` 内置 widget：
  - `text`、`tag`、`badge`、`link`、`image`
  - `input`、`textarea`
  - `number`、`decimal`
  - `switch`、`checkbox`、`checkboxGroup`、`radio`
  - `select`、`multipleSelect`、`treeSelect`、`multipleTreeSelect`
  - `selectTag`、`multipleSelectTag`
  - `date`、`dateRange`、`time`、`timeRange`、`dateTime`、`dateTimeRange`
- `BaseTableSearchForm` 内置 widget：
  - `input`
  - `number`、`numberRange`
  - `switch`
  - `select`、`multipleSelect`、`treeSelect`、`multipleTreeSelect`
  - `date`、`dateRange`、`time`、`timeRange`、`dateTime`、`dateTimeRange`
  - `selectTag`、`multipleSelectTag`
- `badge` / `tag` 使用口径：
  - 默认优先使用 `tag`；能用 `tag` 表达时，不用 `badge`
  - `tag` 用于单值短状态、短枚举、独立标签；表格中默认 `center`
  - `badge` 仅用于“前导标记 + 文本”的轻量状态说明；表单只读展示与表格中默认 `left`
  - 长文本说明、强占位状态展示、主操作视觉区域不用 `badge`

### Hooks、Script setup、注释与类型

#### Hooks

- `useHandleConfirm`
  - 入口：`src/hooks/useHandleConfirm.ts`
  - 用于删除、上下架、启用禁用、重置等需要二次确认的操作
  - 常用形式：`useHandleConfirm(() => apiCall(), '删除')`
  - `message` 只传动作短语，弹窗会自动拼接“是否 xxx”
  - 当表格 `rowActions` 已配置 `confirmTitle` 时，优先使用 `confirmTitle`，不要再额外使用 `useHandleConfirm`
  - 只有在非 `rowActions` 场景且需要二次确认时，才使用 `useHandleConfirm`
  - 异步执行统一放在 `api` 回调中，成功或失败提示交给 hook 处理
  - `useHandleConfirm` 已包含成功提示，调用后不要重复提示成功消息
- `useResettableState`
  - 入口：`src/hooks/useResettableState.ts`
  - 用于弹窗、抽屉、详情临时状态等需要“关闭即还原”的场景
  - 常用形式：`const [state, resetState] = useResettableState(() => initialState)`
  - `resetState()` 会重新执行工厂函数，避免共享引用
  - 初始值建议用函数返回新对象，避免引用污染

#### Script setup

- 按业务模块分区，优先级高于“按技术类型分区”，例如“基本信息 / 角色列表 / 权限列表”。
- 分区内顺序建议：状态 -> 计算 -> 行为 -> 副作用。
- 跨分区依赖要么就近定义，要么显式注入，避免在分区中隐式使用远处变量。

#### 注释

- 注释只解释“为什么这样做”或“关键约束/业务口径”，不重复代码字面含义。
- 保持注释密度精简；只有存在业务口径、易误解行为、跨层约束时再写。
- 推荐保留：
  - 统计、筛选、分页口径
  - 关键交互约束
  - 插槽、布局语义
  - 状态重置或副作用意图
- 应避免：
  - 与代码同义的描述
  - 容易过时且无法自动校验的长注释
- 单行注释直接写完整语义；模板注释直接写用途或位置语义。
- 示例模块或多文件业务模块，可在文件顶部补一句用途说明；`_meta.ts` 默认忽略。
- `.vue` 用顶部模板注释，`.ts` / `.tsx` 用顶部块注释。
- 修改逻辑时同步更新注释；若注释与代码不一致，优先删除过期注释再补充新注释。

#### TypeScript

- 类型“够用即可”，优先保证可读性与可维护性，避免为追求类型完备而引入高复杂度写法。
- 优先依赖 TypeScript 推导，只有在边界处，例如 `emit`、组件 `ref`、接口入参或返回值，再补显式类型。
- 业务实体类型保持直观，例如 `ProductItem`、`ProductOrder`，避免不必要的深层泛型与类型体操。
- 类型命名贴近业务语义，避免抽象但难懂的通用类型别名。
- 应避免：
  - 过度使用 `Pick`、`Omit`、`Partial` 组合导致阅读成本高于收益
  - 仅为“看起来严格”而添加大量冗余类型注解
  - 在业务页面中引入复杂条件类型、递归类型等高维护成本结构
- `any` 使用约束：
  - 当类型复杂度明显高于业务收益、且短期无法以低成本收敛时，允许局部使用 `any`
  - `any` 仅用于边界层，例如第三方返回、动态配置、历史遗留接口
  - 使用 `any` 时建议补一行简短注释说明原因
- 若现有代码类型已经明显偏复杂，应先询问是否需要简化，再进行类型收敛改造。
- 若用户未要求，不主动做大规模类型重构；仅在当前改动范围内做最小必要优化。

## 实现锚点

- 示例模块：
  - `src/modules/examples/template-examples/**`
  - `src/modules/examples/components-examples/**`
- 共享组件：`src/components/**`
- 通用样式：`src/styles/common.scss`
- 主题变量：`src/styles/var.scss`
- 暗黑覆盖：`src/styles/element-plus-dark.scss`
- 字典配置：`src/config/dict.config.ts`
- 字典上下文：`src/dicts/index.ts`
- 权限上下文：`src/auths/index.ts`
- 请求封装：`src/config/axios.ts`
- 缓存工具：`src/utils/cache/index.ts`
- 常用 hooks：
  - `src/hooks/useHandleConfirm.ts`
  - `src/hooks/useResettableState.ts`
- 自定义图标：`src/assets/svg-icon/**`

## 验证策略

### 总原则

- 生成或修改代码后，默认不自动运行测试或手工联调。
- 默认只在完成一轮改动后统一执行一次收尾验证，不要在中间步骤频繁重复运行验证命令。
- 验证优先做轻量检查，只有在改动风险升高时才升级验证强度。
- 如果未运行验证，或只运行了部分轻量验证，需要在最终说明中明确写出范围与原因。

### 分级策略

#### 低风险改动

- 适用场景：
  - 文案、注释、skill、文档修改
  - 纯样式微调，且未改动 TS / Vue 逻辑
  - 纯静态模板结构微调，且不涉及表达式、props、事件、类型
- 默认验证：
  - 仅对改动文件做格式化或 lint 修复

#### 中风险改动

- 适用场景：
  - 修改 `.ts`、`.tsx`、`.vue`
  - 修改 props、emit、ref、类型定义、hooks、utils、store、router、接口模型
  - 修改模块页面逻辑、表单、表格、弹层、字典、权限等常规代码
- 默认验证：
  - 先对改动文件做格式化或 lint 修复
  - 再运行 `pnpm type:check`

#### 高风险改动

- 适用场景：
  - 修改构建配置、Vite 配置、插件、环境变量、入口装配
  - 修改全局基础设施，例如请求封装、主题变量、字典机制、自动导入、全局注册
  - 修改共享 `Base*` 组件或跨模块重构
  - 用户明确要求验证构建结果
- 默认验证：
  - 先对改动文件做格式化或 lint 修复
  - 再运行 `pnpm type:check`
  - 必要时追加 `pnpm build:dev`

### 命令选择

- 优先只处理改动文件，不默认运行全仓 lint。
- 格式化或 lint 修复优先使用：`pnpm exec eslint --fix <changed-files>`
- 类型校验使用：`pnpm type:check`
- 构建验证使用：`pnpm build:dev`

### 避免浪费时间

- 不要每修改一步就跑一轮校验；完成一轮改动后统一跑一次。
- 不要把 `build` 当成默认验证；只有高风险改动才升级到构建验证。
- 仓库没有测试脚本时，不要伪造“已测试”的表述；应如实说明实际运行的是格式化、类型校验或构建验证。

## 输出要求

- 默认使用中文输出。
- 代码应贴合当前仓库风格与命名。
- 修改优先做最小必要变更，不主动做无关的大规模重构。
- 如果需要偏离本规范、引入新组件或新模式，应先说明原因与替代方案。
- 如果未运行验证，或只运行了轻量验证，需要在结果中明确说明。

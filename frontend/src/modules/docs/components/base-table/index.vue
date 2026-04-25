<!-- eslint-disable no-template-curly-in-string -->
<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseTableBasic from './demos/basic.vue'
import DemoBaseTableBasicSource from './demos/basic.vue?raw'
import DemoBaseTableCompose from './demos/compose.vue'
import DemoBaseTableComposeSource from './demos/compose.vue?raw'
import DemoBaseTableDataSource from './demos/data.ts?raw'
import DemoBaseTableList from './demos/list.vue'
import DemoBaseTableListSource from './demos/list.vue?raw'
import '@/modules/docs/styles.scss'

const tableApi = [
  {
    name: 'datasource',
    description: '统一数据入口。数组模式适合静态展示；函数模式统一承接分页、搜索、排序、导出上下文。',
    type: 'any[] | (param) => Promise<any>',
    default: '--',
  },
  {
    name: 'rowKey',
    description: '行唯一标识，内部多选、单选、列表模式选中态和分页刷新都依赖它。',
    type: 'string | (row) => string',
    default: '--',
  },
  {
    name: 'mode',
    description: '切换 table / list 两种渲染模式。list 模式下仍保留搜索、头部操作和选择能力。',
    type: '\'table\' | \'list\'',
    default: 'table',
  },
  {
    name: 'showCard',
    description: '是否给表格包一层卡片壳。外部已有 BaseCard / Drawer / Dialog 时建议关闭。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showIndex / showSelection / showRadio',
    description: '项目常用的序号、多选、单选能力封装，免去手写额外列。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'headerActions / rowActions',
    description: '统一头部操作和行操作配置；会自动注入当前选中态、disabled/show 计算和 confirm 行为。',
    type: 'TableHeaderActionBtn[] / TableRowActionBtn[]',
    default: '--',
  },
  {
    name: 'defaultSearchFormState / externalParams',
    description: '前者用于搜索表单初始值与重置值，后者用于外部固定参数，两者在重置语义上不同。',
    type: '() => Record<string, any>',
    default: '--',
  },
  {
    name: 'showExportExcel / exportExcelDataPath / exportExcelFileName',
    description: '控制导出按钮和导出请求上下文，只有 datasource 返回 Axios 响应时才会记录最后一次请求配置。',
    type: 'boolean / string / string',
    default: 'true / data / 表格数据',
  },
  {
    name: 'showSearchAction / actionsWidth / emptyHeight',
    description: '控制头部搜索动作区、操作列宽度和空数据占位高度。',
    type: 'boolean',
    default: 'true / 100px / 100%',
  },
]

const tableExposeApi = [
  {
    name: 'search()',
    description: '按当前分页重新加载数据，适合“操作后留在当前页刷新”。',
    type: '() => void',
    default: '--',
  },
  {
    name: 'searchFirstPage()',
    description: '回到第一页再加载，适合搜索条件变化、重置筛选或新增成功后的刷新。',
    type: '() => void',
    default: '--',
  },
  {
    name: 'searchFormState',
    description: '当前搜索表单模型，可在父组件或业务逻辑里直接读取和修改。',
    type: 'Ref<Record<string, any>>',
    default: '--',
  },
  {
    name: 'selectedRows / selectedKeys',
    description: '多选模式下的选中行和选中 key 集合，头部批量操作通常直接读取这里。',
    type: 'Ref<any[]>',
    default: '--',
  },
  {
    name: 'radioRow / radioRowKey',
    description: '单选模式下的当前选中行和 key。',
    type: 'ComputedRef<any> / Ref<any>',
    default: '--',
  },
  {
    name: 'rowKeys / elTableRef / scrollToTop()',
    description: '分别对应当前页 key、底层 ElTable 实例与滚动到表格顶部的方法。',
    type: 'ComputedRef<any[]> / Ref / () => void',
    default: '--',
  },
]

const tableSlotApi = [
  {
    name: 'simpleSearch',
    description: '顶部快捷搜索区域。适合一个输入框或少量轻量筛选项。',
    type: '{ searchFirstPage, searchFormState }',
    default: '--',
  },
  {
    name: 'searchForm',
    description: '高级搜索区域。通常配合 BaseTableSearchForm 使用，支持展开 / 收起。',
    type: '{ searchFormState, search, searchFirstPage }',
    default: '--',
  },
  {
    name: 'beforeTable',
    description: '搜索区之后、表格之前的通用区域，适合统计卡片、摘要信息和外部筛选联动。',
    type: '{ searchFormState, search, searchFirstPage, hasSearchFormState, resetSearchFormState, loading }',
    default: '--',
  },
  {
    name: 'list_item',
    description: 'list 模式下的卡片项内容插槽，用于自定义每条记录的展示结构。',
    type: '{ row, isSelected }',
    default: '--',
  },
  {
    name: 'empty',
    description: 'list 模式下空状态插槽。table 模式仍以 ElTable 自身空态为主。',
    type: '--',
    default: '--',
  },
  {
    name: '${prop}_default',
    description: '覆盖某一列的单元格内容。只有当前列 prop 匹配时才会生效，作用域与 ElTableColumn 默认插槽一致。',
    type: 'scope',
    default: '--',
  },
  {
    name: '${prop}_header',
    description: '覆盖某一列的表头内容。只替换标题区域，列配置中的 help 提示仍会继续追加在后面。',
    type: 'scope',
    default: '--',
  },
  {
    name: '${prop}_column',
    description: '直接接管整列渲染，作用域拿到当前列配置对象。优先级高于 ${prop}_default 和 ${prop}_header。',
    type: 'TableColumnConfig',
    default: '--',
  },
]

const featureItems = [
  { title: '标准列表页', description: '列表、分页、操作列和刷新语义都走统一模型。', meta: 'CRUD' },
  { title: '搜索表格页', description: '通过 simpleSearch / searchForm 承接快捷搜索和高级搜索。', meta: 'Search' },
  { title: '统计 + 表格', description: '把统计区放在 beforeTable，表格区继续复用 BaseTable。', meta: 'Composition' },
]

const basicSource = `${DemoBaseTableBasicSource}\n\n/* data.ts */\n${DemoBaseTableDataSource}`
const composeSource = `${DemoBaseTableComposeSource}\n\n/* data.ts */\n${DemoBaseTableDataSource}`
const listSource = `${DemoBaseTableListSource}\n\n/* data.ts */\n${DemoBaseTableDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseTable"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseTable</code>
        把
        <code class="docs-inline-code">分页</code>
        、
        <code class="docs-inline-code">搜索</code>
        、
        <code class="docs-inline-code">排序</code>
        、
        <code class="docs-inline-code">行操作</code>
        和
        <code class="docs-inline-code">导出</code>
        等高频能力收到了一个组件里，列表示例直接运行在项目真实环境中。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>列表页优先入口。</li>
        <li>
          配合
          <code class="docs-inline-code">useTableSetup</code>
          组织列与操作配置。
        </li>
        <li>
          <code class="docs-inline-code">search()</code>
          与
          <code class="docs-inline-code">searchFirstPage()</code>
          区分刷新语义。
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="文档范围">
      <ul class="docs-page-list">
        <li>这里只说明 BaseTable 在项目里额外扩展的列表页能力。</li>
        <li>
          与
          <code class="docs-inline-code">ElTable</code>
          完全一致的原生列属性、事件和样式能力不重复展开。
        </li>
        <li>
          文档更关注
          <code class="docs-inline-code">datasource</code>
          、
          <code class="docs-inline-code">搜索表单</code>
          、
          <code class="docs-inline-code">操作列</code>
          、
          <code class="docs-inline-code">导出</code>
          和
          <code class="docs-inline-code">list 模式</code>
          这些项目封装语义。
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="动态插槽规则">
      <ul class="docs-page-list">
        <li>
          <code class="docs-inline-code">BaseTable</code>
          的动态列插槽是按列
          <code class="docs-inline-code">prop</code>
          自动命名的，不是任意字符串。
        </li>
        <li>
          假设某列配置为
          <code class="docs-inline-code">prop: 'status'</code>
          ，那么可用插槽名就是
          <code class="docs-inline-code">status_default</code>
          、
          <code class="docs-inline-code">status_header</code>
          和
          <code class="docs-inline-code">status_column</code>
          。
        </li>
        <li>
          优先级从高到低依次是
          <code class="docs-inline-code">${prop}_column</code>
          →
          <code class="docs-inline-code">${prop}_default</code>
          /
          <code class="docs-inline-code">${prop}_header</code>
          →
          组件内置的
          <code class="docs-inline-code">widget / label</code>
          渲染。
        </li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础表格"
      description="基础示例按项目标准组合 useTableSetup、simpleSearch、searchForm、headerActions 和 rowActions。"
      source-hint="src/modules/docs/components/base-table/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseTableBasic />
    </DemoBlock>

    <DemoBlock
      title="BeforeTable 与外部参数"
      description="演示 beforeTable 摘要区、externalParams 与 searchForm 的配合。这里的分类筛选不会被重置搜索表单影响，适合左侧树 / 顶部标签联动表格。"
      source-hint="src/modules/docs/components/base-table/demos/compose.vue + data.ts"
      :source="composeSource"
    >
      <DemoBaseTableCompose />
    </DemoBlock>

    <DemoBlock
      title="List 模式"
      description="当主体不是传统表格，而是卡片列表、任务卡片或业务块时，可以直接切到 mode=list，同时复用头部操作与选中能力。"
      source-hint="src/modules/docs/components/base-table/demos/list.vue + data.ts"
      :source="listSource"
    >
      <DemoBaseTableList />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>
          列表页优先用
          <code class="docs-inline-code">useTableSetup</code>
          组织
          <code class="docs-inline-code">BaseTable</code>
          配置。
        </li>
        <li>
          有分页时让
          <code class="docs-inline-code">datasource</code>
          返回
          <code class="docs-inline-code">{ data, total }</code>
          。
        </li>
        <li>
          外层已有
          <code class="docs-inline-code">BaseCard</code>
          或抽屉壳时，
          <code class="docs-inline-code">showCard</code>
          设为
          <code class="docs-inline-code">false</code>
          。
        </li>
        <li>
          搜索条件变化优先调用
          <code class="docs-inline-code">searchFirstPage()</code>
          。
        </li>
        <li>
          行操作优先收敛到
          <code class="docs-inline-code">rowActions</code>
          。
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="常见约束">
      <ul class="docs-page-list">
        <li>
          <code class="docs-inline-code">rowKey</code>
          必填，文档示例也不例外。
        </li>
        <li>列宽不要全部写死，至少保留一部分自适应列。</li>
        <li>
          导出依赖请求上下文时，
          <code class="docs-inline-code">datasource</code>
          应返回 Axios 响应本体。
        </li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="插槽" :items="tableSlotApi" />
    <ComponentApiTable title="BaseTable 扩展属性" :items="tableApi" />
    <ComponentApiTable title="Ref 暴露方法" :items="tableExposeApi" />
  </div>
</template>

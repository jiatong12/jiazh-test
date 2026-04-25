<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const sceneItems = [
  {
    title: '列表页',
    description: '默认以 BaseTable 为主体，搜索、分页、行操作和刷新语义都收口到同一处。',
    meta: 'List',
  },
  {
    title: '新增 / 编辑',
    description: '字段较少优先 Dialog，字段多或需要分块时优先 Drawer，内容录入统一走 BaseForm。',
    meta: 'Edit',
  },
  {
    title: '详情页',
    description: '信息少时直接 BaseForm descriptions，信息多时用 Drawer + Tabs 拆分模块。',
    meta: 'Detail',
  },
  {
    title: '复杂流程',
    description: '跨区联动多、流程步骤长或逻辑复杂时，直接拆成独立页面，不在弹层里堆功能。',
    meta: 'Flow',
  },
]

const containerDecisionApi = [
  {
    name: 'BaseDialog',
    description: '字段少、结构简单、操作闭环短的新增或编辑场景优先使用。',
    type: '轻量弹层',
    default: '优先',
  },
  {
    name: 'BaseDrawer',
    description: '字段较多、分块明显或详情需要横向阅读空间时优先使用。',
    type: '宽内容弹层',
    default: '优先',
  },
  {
    name: '独立页面',
    description: '步骤复杂、区域联动多、需要长时间停留或多模块协作时，直接改成页面。',
    type: '复杂流程',
    default: '优先',
  },
]

const patternApi = [
  {
    name: '列表主体',
    description: '优先 BaseTable + useTableSetup，搜索区使用 BaseTableSearchForm，行操作统一放 rowActions。',
    type: '默认组合',
    default: 'BaseTable',
  },
  {
    name: '新增 / 编辑',
    description: '优先 BaseForm + BaseFormItem；字段明显变多时切 Drawer，不要在 Dialog 里继续堆分区。',
    type: '默认组合',
    default: 'BaseForm',
  },
  {
    name: '只读详情',
    description: '简单详情优先 displayMode="descriptions"，复杂详情优先 Drawer + Tabs 分区展示。',
    type: '默认组合',
    default: 'descriptions / Tabs',
  },
  {
    name: '状态切换确认',
    description: '表格 rowActions 场景优先 confirmTitle，独立按钮或批量操作再考虑 useHandleConfirm。',
    type: '默认组合',
    default: 'confirmTitle',
  },
  {
    name: '字典展示',
    description: '状态和枚举展示优先 BaseDictTag / BaseDictText / BaseDictBadge，不在页面里手写映射数组。',
    type: '默认组合',
    default: 'BaseDict*',
  },
]

const antiPatternApi = [
  {
    name: '直接从 ElTable 开始拼',
    description: '会把分页、搜索、导出、选中态和刷新语义重新散落到页面里，破坏项目统一列表模式。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '一个弹框塞完所有流程',
    description: '当弹层里开始出现多区联动、多步操作和大量 mode 分支时，说明场景已经超出弹层适用范围。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '详情页继续用 disabled 冒充只读',
    description: '项目里已有 descriptions 和 isReadonly 语义，不需要再用一整页 disabled 输入框伪装详情。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '页面先写样式再补结构',
    description: '优先确定页面容器和组件组合，再决定局部样式；否则容易把布局职责散进业务样式里。',
    type: '不推荐',
    default: '--',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="页面场景约定"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        新页面开发时，先判断它属于
        <code class="docs-inline-code">列表</code>
        、
        <code class="docs-inline-code">编辑</code>
        、
        <code class="docs-inline-code">详情</code>
        还是
        <code class="docs-inline-code">复杂流程</code>
        ，再决定使用哪些项目封装。这样能让页面结构、交互语义和后续维护方式从一开始就对齐。
      </template>
    </DocPageHeader>

    <BaseCard title="先分场景">
      <DocFeatureGrid :items="sceneItems" :columns="2" />
    </BaseCard>

    <BaseCard title="默认心智">
      <ul class="docs-page-list">
        <li>优先找项目已有页面模式，不从零自由组合组件。列表页先想 BaseTable，表单页先想 BaseForm，详情页先想 descriptions 或 Tabs。</li>
        <li>容器选择先看信息密度和流程复杂度，而不是先看“弹层能不能塞下”。能塞下不等于适合长期维护。</li>
        <li>如果某个页面开始出现大量额外样式、高度计算或 mode 分支，通常说明页面骨架选错了。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="容器选择" :items="containerDecisionApi" />
    <ComponentApiTable title="推荐组合" :items="patternApi" />

    <BaseCard title="写页面前先过一遍">
      <ul class="docs-page-list">
        <li>列表页是否已经优先使用 <code class="docs-inline-code">BaseTable + useTableSetup</code>，而不是手写分页和操作列。</li>
        <li>新增 / 编辑是否优先使用 <code class="docs-inline-code">BaseForm + BaseFormItem</code>，而不是散写多个输入框和独立状态。</li>
        <li>详情页是否明确选择了 <code class="docs-inline-code">descriptions</code> 或 <code class="docs-inline-code">Drawer + Tabs</code>，而不是继续复用一页 disabled 表单。</li>
        <li>需要二次确认的操作是否已经优先收口到 <code class="docs-inline-code">confirmTitle</code> 或 <code class="docs-inline-code">useHandleConfirm</code>。</li>
        <li>页面里出现的状态枚举是否已经走 <code class="docs-inline-code">dict</code> 或 <code class="docs-inline-code">BaseDict*</code>，而不是硬编码 label / value。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="常见反模式" :items="antiPatternApi" />
  </div>
</template>

<script setup lang="ts">
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const highFrequencyComponentItems = [
  {
    title: 'BaseForm',
    description: '统一表单容器，覆盖新增、编辑、详情与 descriptions 展示等高频后台场景。',
    meta: 'Form',
    path: '/docs/components/base-form',
  },
  {
    title: 'BaseTable',
    description: '统一列表页入口，收口分页、搜索、操作列、导出和刷新语义。',
    meta: 'Table',
    path: '/docs/components/base-table',
  },
  {
    title: 'BaseTableSearchForm',
    description: '统一表格搜索区写法，覆盖搜索项布局、范围字段映射和回车触发查询。',
    meta: 'Search',
    path: '/docs/components/base-table-search-form',
  },
  {
    title: 'BaseButton',
    description: '统一按钮权限禁用、主按钮语义和标准异步动作按钮的写法。',
    meta: 'Button',
    path: '/docs/components/base-button',
  },
  {
    title: 'BaseDialog',
    description: '统一轻量弹框的默认头部、关闭策略和全屏切换按钮。',
    meta: 'Dialog',
    path: '/docs/components/base-dialog',
  },
  {
    title: 'BaseDrawer',
    description: '统一抽屉头部与关闭策略，承接字段较多、内容更宽的编辑与详情场景。',
    meta: 'Drawer',
    path: '/docs/components/base-drawer',
  },
]

const formAndSelectionItems = [
  {
    title: 'BaseSelect',
    description: '统一字典下拉、异步选项加载和当前字典项同步能力。',
    meta: 'Select',
    path: '/docs/components/base-select',
  },
  {
    title: '选项类组件',
    description: '统一 BaseCheckboxGroup、BaseRadio 和 BaseSegmented 的字典写法与使用边界。',
    meta: 'Choice',
    path: '/docs/components/base-selection-controls',
  },
  {
    title: 'BaseNumber / BaseDecimal',
    description: '统一整数和小数输入的默认精度、宽度与表单 widget 接入方式。',
    meta: 'Number',
    path: '/docs/components/base-number',
  },
  {
    title: 'BaseTreeSelect',
    description: '统一树字典选择、字段映射、异步树节点加载和当前节点同步能力。',
    meta: 'Tree',
    path: '/docs/components/base-tree-select',
  },
  {
    title: 'BaseUpload',
    description: '统一单图、多图、附件上传和表单联动的默认口径。',
    meta: 'Upload',
    path: '/docs/components/base-upload',
  },
  {
    title: 'BaseSelectTag',
    description: '统一标签式筛选器写法，覆盖 showAll、多选和自定义标签内容。',
    meta: 'Tag Filter',
    path: '/docs/components/base-select-tag',
  },
]

const displayAndContainerItems = [
  {
    title: 'BaseRow / BaseCol',
    description: '统一后台页栅格布局，覆盖自动包裹列节点、响应式列数和换行控制。',
    meta: 'Layout',
    path: '/docs/components/base-layout',
  },
  {
    title: 'BaseCard',
    description: '统一页面区块容器，收口标题、头部操作区和卡片内容壳层。',
    meta: 'Card',
    path: '/docs/components/base-card',
  },
  {
    title: 'BaseTabs',
    description: '统一页签懒加载、动态页签校正和后台详情分区场景的写法。',
    meta: 'Tabs',
    path: '/docs/components/base-tabs',
  },
  {
    title: 'BaseDict 系列',
    description: '统一字典翻译与展示语义，覆盖 Tag / Text / Badge 和自定义字典渲染。',
    meta: 'Dict',
    path: '/docs/components/base-dict',
  },
  {
    title: 'BaseTag',
    description: '统一语义状态标签和自定义颜色标签，减少业务页手写色值样式。',
    meta: 'Tag',
    path: '/docs/components/base-tag',
  },
  {
    title: 'BaseIcon',
    description: '统一普通展示图标、按钮 icon 属性和自定义 SVG 图标的使用方式。',
    meta: 'Icon',
    path: '/docs/components/base-icon',
  },
  {
    title: 'BaseOverflowTooltip',
    description: '统一单行 / 多行文本溢出提示，只在真正溢出时展示 tooltip。',
    meta: 'Tooltip',
    path: '/docs/components/base-overflow-tooltip',
  },
  {
    title: 'BaseImage',
    description: '统一单图展示、失败占位和点击预览，适合缩略图与详情图片场景。',
    meta: 'Image',
    path: '/docs/components/base-image',
  },
]

const highFrequencyCount = highFrequencyComponentItems.length
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="组件文档"
      lead=""
      eyebrow="组件文档"
    >
      <template #lead>
        这里收口的是项目内基础组件文档。目标不是做一个脱离运行时的静态站，而是让
        <code class="docs-inline-code">说明</code>
        、
        <code class="docs-inline-code">源码</code>
        和
        <code class="docs-inline-code">真实示例</code>
        在同一个应用环境下持续演进。
      </template>
    </DocPageHeader>

    <BaseCard :title="`高频组件 (${highFrequencyCount})`">
      <DocFeatureGrid :items="highFrequencyComponentItems" :columns="2" />
    </BaseCard>

    <BaseCard title="输入与选择">
      <DocFeatureGrid :items="formAndSelectionItems" :columns="2" />
    </BaseCard>

    <BaseCard title="展示与容器">
      <DocFeatureGrid :items="displayAndContainerItems" :columns="2" />
    </BaseCard>

    <BaseCard title="阅读建议">
      <ul class="docs-page-list">
        <li>这里只聚焦组件能力，不重复展开项目约定；页面骨架、数据流、权限和弹层协作请进入 <code class="docs-inline-code">开发指南</code> 查看。</li>
        <li>高频页面通常先看 <code class="docs-inline-code">BaseTable</code>、<code class="docs-inline-code">BaseForm</code>、<code class="docs-inline-code">BaseDialog</code>、<code class="docs-inline-code">BaseDrawer</code>。</li>
        <li>如果你已经知道要找哪个组件，直接从对应分组进入即可，不需要先回顶层首页。</li>
      </ul>
    </BaseCard>

    <BaseCard title="设计原则">
      <ul class="docs-page-list">
        <li>文档页直接运行在主应用内，组件、样式、全局属性和主题变量都复用主应用运行时。</li>
        <li>
          示例代码优先使用
          <code class="docs-inline-code">src/modules/examples</code>
          和
          <code class="docs-inline-code">src/components</code>
          里的真实模式，不再维护独立文档运行环境。
        </li>
        <li>
          后续新增组件文档时，优先沿用
          <code class="docs-inline-code">index.vue + demos/ + data.ts</code>
          的内聚结构。
        </li>
        <li>
          非组件能力优先放到
          <code class="docs-inline-code">/docs/guides</code>
          ，统一记录项目约定、hooks 和工程能力说明。
        </li>
      </ul>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const docChannelItems = [
  {
    title: '组件文档',
    description: '查看 BaseTable、BaseForm、BaseDialog 等组件的运行示例、扩展属性和项目里的推荐用法。',
    path: '/docs/components/overview',
  },
  {
    title: '开发指南',
    description: '查看页面场景、样式主题、请求封装、权限、弹层协作和问题排查等项目级约定。',
    path: '/docs/guides/overview',
  },
  {
    title: '常用工具',
    description: '查看二次确认、请求状态、缓存和下载等常用 hooks / utils 的项目级用法。',
    path: '/docs/tools/overview',
  },
]

const sceneEntryItems = [
  {
    title: '我要做列表页',
    description: '先看页面场景约定，再进入 BaseTable 和高度自适应，先把页面骨架与列表容器定住。',
    meta: 'List',
    path: '/docs/guides/page-patterns',
  },
  {
    title: '我要做表单页',
    description: '优先查 BaseForm、样式与主题约定，以及字典与权限约定里的字段与状态口径。',
    meta: 'Form',
    path: '/docs/components/base-form',
  },
  {
    title: '我要做弹层',
    description: '优先查 BaseDialog、BaseDrawer 和弹层生命周期与回调；需要清理临时状态时，再补充看 useResettableState。',
    meta: 'Dialog',
    path: '/docs/guides/dialog-drawer-lifecycle',
  },
  {
    title: '我要排查问题',
    description: '从问题排查索引进入，再跳转到布局、列表语义、权限或请求封装的专题。',
    meta: 'Debug',
    path: '/docs/guides/troubleshooting',
  },
  {
    title: '我要做下载或缓存',
    description: '直接进入常用工具，优先复用 useDownload、cache、useRequest 和 useResettableState，避免页面里重复造轮子。',
    meta: 'Tools',
    path: '/docs/tools/overview',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="文档中心"
      lead=""
      eyebrow="文档中心"
    >
      <template #lead>
        文档中心分成两层：
        <code class="docs-inline-code">组件文档</code>
        负责解释封装本身，
        <code class="docs-inline-code">开发指南</code>
        负责解释项目里应该怎么组合这些封装，
        <code class="docs-inline-code">常用工具</code>
        负责收口高频 hooks 与 utils 的使用边界。
        新页面开发建议先定页面模式，再查具体组件；遇到确认、请求、临时状态重置、缓存和下载问题时，优先回到工具文档。
      </template>
    </DocPageHeader>

    <BaseCard title="文档分区">
      <DocFeatureGrid :items="docChannelItems" :columns="3" />
    </BaseCard>

    <BaseCard title="按场景进入">
      <DocFeatureGrid :items="sceneEntryItems" :columns="2" />
    </BaseCard>

    <BaseCard title="使用建议">
      <ul class="docs-page-list">
        <li>先判断问题属于“页面模式”“组件能力”还是“项目约定”，再决定从组件文档还是开发指南进入。</li>
        <li>新页面开发时，不建议先翻所有组件；先看页面场景约定，确认这是列表、表单、详情还是复杂流程。</li>
        <li>遇到布局、状态、权限或请求问题时，优先看开发指南，不要只在组件 API 里找答案。</li>
      </ul>
    </BaseCard>

    <BaseCard title="推荐路线">
      <ul class="docs-page-list">
        <li>做页面：先进入 <code class="docs-inline-code">开发指南</code>，再按页面需要回查 <code class="docs-inline-code">BaseTable</code>、<code class="docs-inline-code">BaseForm</code>、<code class="docs-inline-code">BaseDialog</code> 等组件文档。</li>
        <li>查组件：直接进入 <code class="docs-inline-code">组件导航</code>，按表单、列表、展示与容器分组找对应封装。</li>
        <li>找工具：遇到二次确认、请求状态、临时状态重置、缓存和下载问题，直接进入 <code class="docs-inline-code">常用工具</code>，不要在业务页重复封装一套。</li>
        <li>排查问题：优先从 <code class="docs-inline-code">问题排查索引</code> 进入，再跳转到高度、列表语义、权限或弹层专题。</li>
      </ul>
    </BaseCard>
  </div>
</template>

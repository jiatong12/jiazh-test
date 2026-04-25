<script setup lang="ts">
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const pageGuideItems = [
  {
    title: '页面场景约定',
    description: '先建立列表页、表单页、详情页和弹层选择的默认组合，再展开具体组件 API。新页面开发建议先看这一篇。',
    meta: 'Pattern',
    path: '/docs/guides/page-patterns',
  },
  {
    title: '样式与主题约定',
    description: '收口 CSS 变量、common.scss、页面命名空间、暗黑模式和 Uno 图标的项目级样式口径。',
    meta: 'Style',
    path: '/docs/guides/style-theme',
  },
  {
    title: '高度自适应',
    description: '统一页面、卡片、Tabs 和表格区的父子高度传递方式，避免双滚动和 100vh 滥用。',
    meta: 'Layout',
    path: '/docs/guides/height-adaptive',
  },
  {
    title: '弹层生命周期与回调',
    description: '整理 Dialog / Drawer 的 visible、open、emit、回填和关闭恢复等协作边界。',
    meta: 'Dialog',
    path: '/docs/guides/dialog-drawer-lifecycle',
  },
  {
    title: '菜单与路由约定',
    description: '说明 _meta.ts 的职责边界、菜单显示与路由注册的区别，以及 ignoreSelfAndChildren 的使用方式。',
    meta: 'Route',
    path: '/docs/guides/menu-routing',
  },
]

const dataGuideItems = [
  {
    title: '字典与权限约定',
    description: '统一 dict、$$dicts、$$auths、priv 和状态枚举展示的项目级使用方式。',
    meta: 'Auth',
    path: '/docs/guides/dict-auth',
  },
  {
    title: 'axios 封装',
    description: '说明全局 axios 实例的默认配置、业务状态拦截、错误提示和自定义请求配置项。',
    meta: 'Network',
    path: '/docs/guides/axios-wrapper',
  },
]

const troubleshootingItems = [
  {
    title: '问题排查索引',
    description: '按“现象 -> 高概率原因 -> 应看哪篇文档”组织，作为页面开发和维护时的快速回查入口。',
    meta: 'Debug',
    path: '/docs/guides/troubleshooting',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="开发指南"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        这里收口的是项目级约定，而不是单个组件 API。阅读顺序建议先看
        <code class="docs-inline-code">页面场景约定</code>
        ，建立页面组织的默认心智，再按需进入
        <code class="docs-inline-code">样式</code>
        、
        <code class="docs-inline-code">高度</code>
        、
        <code class="docs-inline-code">请求</code>
        和
        <code class="docs-inline-code">权限 / 布局 / 页面协作</code>
        这几类专题文档。
        文档重点会放在
        <code class="docs-inline-code">现有封装怎么用</code>
        、
        <code class="docs-inline-code">为什么这样约定</code>
        和
        <code class="docs-inline-code">哪些写法应该避免</code>
        。
      </template>
    </DocPageHeader>

    <BaseCard title="页面与弹层">
      <DocFeatureGrid :items="pageGuideItems" :columns="2" />
    </BaseCard>

    <BaseCard title="数据与权限">
      <DocFeatureGrid :items="dataGuideItems" :columns="2" />
    </BaseCard>

    <BaseCard title="排查入口">
      <DocFeatureGrid :items="troubleshootingItems" :columns="1" />
    </BaseCard>

    <BaseCard title="推荐阅读路径">
      <ul class="docs-page-list">
        <li>新页面开发：先看 <code class="docs-inline-code">页面场景约定</code>，再看 <code class="docs-inline-code">样式与主题约定</code>，先把页面骨架和样式边界定住。</li>
        <li>列表页开发：优先回看 <code class="docs-inline-code">高度自适应</code> 和 <code class="docs-inline-code">BaseTable</code> 文档，先确认容器、滚动和列表基础语义。</li>
        <li>状态与权限：优先回看 <code class="docs-inline-code">字典与权限约定</code>，确认状态展示、权限按钮和字典来源是否统一。</li>
        <li>菜单配置：优先回看 <code class="docs-inline-code">菜单与路由约定</code>，确认 <code class="docs-inline-code">isHide</code> 和 <code class="docs-inline-code">ignoreSelfAndChildren</code> 的职责是否混用。</li>
        <li>弹层状态串用：优先回看 <code class="docs-inline-code">弹层生命周期与回调</code>，再补充看 <code class="docs-inline-code">常用工具</code> 里的 <code class="docs-inline-code">useResettableState</code>。</li>
        <li>线上问题排查：从 <code class="docs-inline-code">问题排查索引</code> 进入，再跳转到对应专题文档。</li>
      </ul>
    </BaseCard>

    <BaseCard title="项目默认口径">
      <ul class="docs-page-list">
        <li>优先沿用项目已有封装和真实示例，尤其是 <code class="docs-inline-code">src/modules/examples/template-examples</code> 里的页面模式。</li>
        <li>文档默认回答的是“这个项目里应该怎么写”，不是“Vue 或 Element Plus 原生还能怎么写”。</li>
        <li>当某个能力已经有统一口径时，文档会直接给推荐写法和反例，减少团队协作中的二义性。</li>
      </ul>
    </BaseCard>
  </div>
</template>

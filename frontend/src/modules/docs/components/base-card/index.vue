<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseCardBasic from './demos/basic.vue'
import DemoBaseCardBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const cardApi = [
  {
    name: 'title',
    description: '默认卡片标题。未传 title 且未提供 title 插槽时，不渲染头部区域。',
    type: 'string',
    default: '--',
  },
  {
    name: 'hFull',
    description: '让卡片根节点占满父容器高度，适合和 flex 布局组合使用。',
    type: 'boolean',
    default: 'false',
  },
]

const cardSlotApi = [
  {
    name: 'default',
    description: '卡片主体内容区域。',
    type: '--',
    default: '--',
  },
  {
    name: 'title',
    description: '完全接管卡片头部左侧内容，适合复杂标题、标签组合和自定义标题结构。',
    type: '--',
    default: '--',
  },
  {
    name: 'headerRight / header-right',
    description: '头部右侧操作区，可放按钮、筛选项和状态说明。',
    type: '--',
    default: '--',
  },
]

const featureItems = [
  { title: '页面区块容器', description: '最常见的场景：把表格、表单、统计块包在统一卡片壳里。', meta: 'Panel' },
  { title: '头部操作区', description: '通过 headerRight 放新增、刷新、筛选等轻操作。', meta: 'Action' },
  { title: '自定义标题', description: '复杂头部时使用 title 插槽，不需要再手写一层卡片容器。', meta: 'Custom' },
]

const basicSource = DemoBaseCardBasicSource
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseCard"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseCard</code>
        是项目里最常用的区块容器，统一了卡片外壳、头部标题和右侧操作区的写法。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>优先用于页面区块、表格壳层、表单壳层和统计模块容器。</li>
        <li>统一头部标题样式，减少业务页重复写卡片结构。</li>
        <li>只补充项目封装约定，不重复解释普通 div 容器语义。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础卡片"
      description="这个示例聚焦 BaseCard 最常见的三种用法：title 属性、headerRight 操作区和 title 自定义插槽。"
      source-hint="src/modules/docs/components/base-card/demos/basic.vue"
      :source="basicSource"
    >
      <DemoBaseCardBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li>标题简单时优先使用 <code class="docs-inline-code">title</code> 属性，避免无意义插槽。</li>
        <li>头部右侧轻操作统一放在 <code class="docs-inline-code">headerRight</code>，不要再自行拆 header 布局。</li>
        <li>页面已经有外层壳时，不要再额外叠加过多卡片边框和阴影。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="扩展属性" :items="cardApi" />
    <ComponentApiTable title="插槽" :items="cardSlotApi" />
  </div>
</template>

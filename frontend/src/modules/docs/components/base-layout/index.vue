<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseLayoutBasic from './demos/basic.vue'
import DemoBaseLayoutBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const rowApi = [
  {
    name: 'gutter',
    description: '栅格间距。数字表示统一纵向节奏；数组表示 [水平, 垂直]。',
    type: 'number | [number, number]',
    default: '10',
  },
  {
    name: 'col',
    description: '每行分成几列，适合简单固定布局。',
    type: 'Num',
    default: '2',
  },
  {
    name: 'cols',
    description: '响应式列数配置，优先级高于 col。',
    type: 'Cols',
    default: '--',
  },
]

const colApi = [
  {
    name: 'col / cols',
    description: '单项列占比配置。col 适合固定值，cols 适合响应式值。',
    type: 'Num / Cols',
    default: '继承 BaseRow',
  },
  {
    name: 'startNewRow',
    description: '强制从新的一行开始渲染当前列。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'show',
    description: '多节点场景下可作为 v-show 的替代，避免写在外层造成结构混乱。',
    type: 'boolean',
    default: 'true',
  },
]

const featureItems = [
  { title: '自动包裹列', description: '普通子节点会自动被 BaseCol 包裹，减少模板层级。', meta: 'Auto' },
  { title: '响应式列数', description: '通过 cols 在不同断点下切换布局密度。', meta: 'Responsive' },
  { title: '精细控制', description: '复杂项再显式使用 BaseCol，不需要一开始所有节点都手写。', meta: 'Control' },
]

const basicSource = DemoBaseLayoutBasicSource
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseRow / BaseCol"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseRow</code>
        /
        <code class="docs-inline-code">BaseCol</code>
        是项目里的统一栅格布局封装，重点在于自动包裹列节点和响应式列数约定。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>优先用于表单、统计卡片、筛选区和常规后台信息块布局。</li>
        <li>普通子节点默认自动补一层 <code class="docs-inline-code">BaseCol</code>，减少模板噪音。</li>
        <li>当某一项需要独占一行或单独控制占比时，再显式使用 <code class="docs-inline-code">BaseCol</code>。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础栅格"
      description="这个示例覆盖 BaseRow / BaseCol 最常见的三种语义：自动包裹普通节点、显式控制单项列宽，以及 v-if / v-show 对占位的影响。"
      source-hint="src/modules/docs/components/base-layout/demos/basic.vue"
      :source="basicSource"
    >
      <DemoBaseLayoutBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li>简单布局优先只写 <code class="docs-inline-code">BaseRow</code>，不要一开始就把每个节点都包成 <code class="docs-inline-code">BaseCol</code>。</li>
        <li>当某项需要整行时，显式写 <code class="docs-inline-code">&lt;BaseCol :col="1"&gt;</code> 会比补专用样式更稳。</li>
        <li><code class="docs-inline-code">cols</code> 更适合文档页和业务页的响应式布局，优先级也高于 <code class="docs-inline-code">col</code>。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseRow 扩展属性" :items="rowApi" />
    <ComponentApiTable title="BaseCol 扩展属性" :items="colApi" />
  </div>
</template>

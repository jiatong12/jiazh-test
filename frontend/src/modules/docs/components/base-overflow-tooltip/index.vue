<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseOverflowTooltipBasic from './demos/basic.vue'
import DemoBaseOverflowTooltipBasicSource from './demos/basic.vue?raw'
import DemoBaseOverflowTooltipDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const tooltipApi = [
  {
    name: 'lineClamp',
    description: '开启单行或多行截断。0 表示不强制截断，只做溢出检测。',
    type: 'number',
    default: '0',
  },
  {
    name: 'placement / showAfter / effect',
    description: '透传给 ElTooltip 的常用展示属性。',
    type: 'string / number / \'dark\' | \'light\'',
    default: 'top / 300 / dark',
  },
  {
    name: 'tag',
    description: '触发器节点标签名，默认 span。',
    type: 'string',
    default: 'span',
  },
  {
    name: 'disabled',
    description: '显式禁用 tooltip；即使文本溢出也不显示。',
    type: 'boolean',
    default: 'false',
  },
]

const exposeApi = [
  {
    name: 'updateOverflow()',
    description: '手动重新计算是否溢出。外部容器尺寸突变但观察器未及时感知时可显式调用。',
    type: '() => void',
    default: '--',
  },
]

const featureItems = [
  { title: '单行省略', description: '列表列名、卡片标题、菜单标题等单行溢出场景。', meta: 'Single Line' },
  { title: '多行截断', description: '摘要、说明文案、卡片描述等多行溢出场景。', meta: 'Multi Line' },
  { title: '仅溢出提示', description: '文本不溢出时不出现 tooltip，减少无意义悬浮提示。', meta: 'Smart Tooltip' },
]

const basicSource = `${DemoBaseOverflowTooltipBasicSource}\n\n/* data.ts */\n${DemoBaseOverflowTooltipDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseOverflowTooltip"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseOverflowTooltip</code>
        只做一件事：当文本真正发生溢出时，再显示完整 tooltip。
        这样列表列、菜单标题和摘要文案都可以统一用一套写法，而不会让所有文本都无意义地悬浮提示。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>适合表格单元格、菜单标题、卡片标题、摘要说明等文本展示场景。</li>
        <li>文案统一来自默认插槽，不需要再额外传 content。</li>
        <li>文档重点说明 lineClamp 和溢出判断逻辑，不重复展开 ElTooltip 的全部能力。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础演示"
      description="同时演示短文本、单行截断、动态宽度和多行截断。"
      source-hint="src/modules/docs/components/base-overflow-tooltip/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseOverflowTooltipBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>需要 tooltip 文案与展示文案一致时，优先用默认插槽，不要同时维护 slot 和 content 两份内容。</li>
        <li>单行截断直接传 lineClamp=1；多行摘要按实际行数设置 lineClamp。</li>
        <li>它适合展示型文本，不适合承载复杂交互节点或嵌套一整块操作区。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="扩展属性" :items="tooltipApi" />
    <ComponentApiTable title="Ref 暴露方法" :items="exposeApi" />
  </div>
</template>

<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseDictBasic from './demos/basic.vue'
import DemoBaseDictBasicSource from './demos/basic.vue?raw'
import DemoBaseDictDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const dictDisplayApi = [
  {
    name: 'dict',
    description: '字典数据源，可传字典 code、静态数组或异步函数。',
    type: 'DictSource',
    default: '[]',
  },
  {
    name: 'value',
    description: '当前要翻译的值；BaseDictTag 还支持数组值。',
    type: 'string | number | boolean | any[]',
    default: '--',
  },
  {
    name: 'labelField / valueField / colorField',
    description: '当字典结构不是标准 label/value/color 时，可通过这些字段名做映射。',
    type: 'string',
    default: 'label / value / color',
  },
  {
    name: 'isNumber / ignoreDisabled',
    description: '前者用于数值转换，后者用于忽略字典中的 disabled 项。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'flicker',
    description: '仅 BaseDictBadge 支持，适合强调型状态徽标。',
    type: 'boolean',
    default: 'false',
  },
]

const dictSlotApi = [
  {
    name: 'BaseDict.default',
    description: '自定义渲染插槽，可拿到 dictApi、dictItems 和当前 modelValue。',
    type: '{ dictApi, dictItems, modelValue, onUpdate:modelValue }',
    default: '--',
  },
]

const featureItems = [
  { title: '展示态翻译', description: '详情、表格、统计块里优先使用 Tag / Text / Badge 组件。', meta: 'Display' },
  { title: '多值标签', description: 'BaseDictTag 支持数组值，适合标签集合场景。', meta: 'Multiple' },
  { title: '自定义渲染', description: '当内置展示物料不够时，直接用 BaseDict 拿字典项。', meta: 'Custom' },
]

const basicSource = `${DemoBaseDictBasicSource}\n\n/* data.ts */\n${DemoBaseDictDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseDict 系列"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseDictTag</code>
        、
        <code class="docs-inline-code">BaseDictText</code>
        、
        <code class="docs-inline-code">BaseDictBadge</code>
        和
        <code class="docs-inline-code">BaseDict</code>
        共同组成项目里的字典展示体系，统一处理翻译、颜色和异步字典加载。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>展示态优先用 <code class="docs-inline-code">BaseDictTag / BaseDictText / BaseDictBadge</code>，不要在页面里重复手写查找逻辑。</li>
        <li>当内置展示物料不够时，使用 <code class="docs-inline-code">BaseDict</code> 直接拿字典项自定义渲染。</li>
        <li>文档重点放在字典来源、值翻译和展示语义，不重复展开底层 Element Plus 文本 / 标签组件的原生能力。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础字典展示"
      description="这个示例覆盖最常见的字典展示场景：文本、标签、徽标、多值标签，以及通过 BaseDict 自定义渲染异步字典结果。"
      source-hint="src/modules/docs/components/base-dict/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseDictBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li>单值短状态优先使用 <code class="docs-inline-code">BaseDictTag</code>；阅读型说明优先使用 <code class="docs-inline-code">BaseDictText</code>。</li>
        <li>需要“前导标记 + 文本”时再使用 <code class="docs-inline-code">BaseDictBadge</code>，不要把 Badge 当成主状态视觉。</li>
        <li>页面中已有字典展示组件时，不再手写 <code class="docs-inline-code">find / map</code> 翻译逻辑。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="扩展属性" :items="dictDisplayApi" />
    <ComponentApiTable title="插槽" :items="dictSlotApi" />
  </div>
</template>

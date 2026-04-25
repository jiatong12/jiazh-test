<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseSelectAsync from './demos/async.vue'
import DemoBaseSelectAsyncSource from './demos/async.vue?raw'
import DemoBaseSelectBasic from './demos/basic.vue'
import DemoBaseSelectBasicSource from './demos/basic.vue?raw'
import DemoBaseSelectDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const selectApi = [
  {
    name: 'dict',
    description: '统一字典入口。支持本地数组、字典 code 和异步函数，组件内部会自动通过 useDict 处理。',
    type: 'DictSource',
    default: '[]',
  },
  {
    name: 'modelValue / onUpdate:modelValue',
    description: '保持与原生 v-model 一致，支持单选与多选值。',
    type: 'string | number | boolean | any[]',
    default: '--',
  },
  {
    name: 'onSyncItem',
    description: '值变化后同步当前字典项。单选时返回对象，多选时返回对象数组。',
    type: '(item) => void',
    default: '--',
  },
  {
    name: 'labelField / valueField / disabledField',
    description: '当 dict 数据结构不是默认 label/value/disabled 时，用这些字段配置映射。',
    type: 'string',
    default: 'label / value / disabled',
  },
  {
    name: 'ignoreDisabled / isNumber',
    description: '控制是否忽略禁用项，以及是否把字典值按数字处理。',
    type: 'boolean',
    default: 'false / false',
  },
  {
    name: '$attrs',
    description: '其余属性继续透传给 ElSelect，例如 clearable、multiple、collapse-tags、placeholder 等。',
    type: 'ElSelect props',
    default: '--',
  },
]

const featureItems = [
  { title: '本地字典', description: '最常见的后台常量枚举场景，直接传数组即可。', meta: 'Local' },
  { title: '异步字典', description: '异步函数会自动进入骨架屏加载态，适合动态选项。', meta: 'Async' },
  { title: '同步字典项', description: '通过 onSyncItem 直接拿到当前选中项，减少手动 find。', meta: 'Sync' },
]

const basicSource = `${DemoBaseSelectBasicSource}\n\n/* data.ts */\n${DemoBaseSelectDataSource}`
const asyncSource = `${DemoBaseSelectAsyncSource}\n\n/* data.ts */\n${DemoBaseSelectDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseSelect"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseSelect</code>
        的重点不是把
        <code class="docs-inline-code">ElSelect</code>
        再包一层，而是把项目里的
        <code class="docs-inline-code">字典映射</code>
        、
        <code class="docs-inline-code">异步加载</code>
        和
        <code class="docs-inline-code">当前项同步</code>
        统一成同一套入口。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>适合所有“值来自字典”的单选、多选场景。</li>
        <li>优先和 BaseFormItem / BaseTableSearchFormItem 的 select 类 widget 搭配使用。</li>
        <li>文档只补充 dict 和 onSyncItem 这类项目扩展语义，不重复展开 ElSelect 原生 API。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="本地字典"
      description="聚焦 BaseSelect 最常见的后台枚举场景：单选、多选、clearable 和 onSyncItem。"
      source-hint="src/modules/docs/components/base-select/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseSelectBasic />
    </DemoBlock>

    <DemoBlock
      title="异步字典"
      description="dict 直接传异步函数时，组件会自动进入骨架屏加载态；数据回来后继续保持 value 与字典项同步。"
      source-hint="src/modules/docs/components/base-select/demos/async.vue + data.ts"
      :source="asyncSource"
    >
      <DemoBaseSelectAsync />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>值来自项目字典时，优先使用 dict，不要在页面里再手写一层 options 转换。</li>
        <li>需要同时拿到当前选中项内容时，优先用 onSyncItem，不要每次都手动遍历字典数组。</li>
        <li>只要字段仍然是标准下拉选择，就继续透传 ElSelect 原生属性，而不是再新包一层业务组件。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseSelect 扩展属性" :items="selectApi" />
  </div>
</template>

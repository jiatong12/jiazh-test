<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseTreeSelectAsync from './demos/async.vue'
import DemoBaseTreeSelectAsyncSource from './demos/async.vue?raw'
import DemoBaseTreeSelectBasic from './demos/basic.vue'
import DemoBaseTreeSelectBasicSource from './demos/basic.vue?raw'
import DemoBaseTreeSelectDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const treeSelectApi = [
  {
    name: 'dict',
    description: '统一树字典入口，支持本地树数组、字典 code 和异步函数。',
    type: 'DictSource',
    default: '[]',
  },
  {
    name: 'childrenField',
    description: '树节点子级字段名，默认 children。后端树结构字段不一致时可直接映射。',
    type: 'string',
    default: 'children',
  },
  {
    name: 'labelField / valueField / disabledField',
    description: '树节点字段映射。适合 name / code / isDisabled 这类非默认字段结构。',
    type: 'string',
    default: 'label / value / disabled',
  },
  {
    name: 'onSyncItem',
    description: '值变化后同步当前节点。单选返回对象，多选返回对象数组。',
    type: '(item) => void',
    default: '--',
  },
  {
    name: '$attrs',
    description: '其余属性透传给 ElTreeSelect，例如 check-strictly、multiple、show-checkbox、filterable。',
    type: 'ElTreeSelect props',
    default: '--',
  },
]

const featureItems = [
  { title: '树字典单选', description: '所属机构、栏目、模块等树状单选场景。', meta: 'Single' },
  { title: '树字典多选', description: '组织范围、资源范围、参与团队等树状多选场景。', meta: 'Multiple' },
  { title: '异步树数据', description: '树节点来自接口时，组件会自动进入骨架屏加载态。', meta: 'Async' },
]

const basicSource = `${DemoBaseTreeSelectBasicSource}\n\n/* data.ts */\n${DemoBaseTreeSelectDataSource}`
const asyncSource = `${DemoBaseTreeSelectAsyncSource}\n\n/* data.ts */\n${DemoBaseTreeSelectDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseTreeSelect"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseTreeSelect</code>
        把项目里的
        <code class="docs-inline-code">树字典映射</code>
        、
        <code class="docs-inline-code">骨架屏加载</code>
        和
        <code class="docs-inline-code">当前节点同步</code>
        收敛到了同一层封装里，避免每个页面都手动拼
        <code class="docs-inline-code">ElTreeSelect + options 转换</code>
        。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>适合组织树、栏目树、模块树等树状字典选择场景。</li>
        <li>优先和 BaseFormItem / BaseTableSearchFormItem 的 treeSelect 类 widget 配合使用。</li>
        <li>文档只覆盖树字典和映射语义，不重复展开 ElTreeSelect 原生交互属性。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="本地树字典"
      description="演示单选、多选、checkStrictly 和 onSyncItem 的常见组合。"
      source-hint="src/modules/docs/components/base-tree-select/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseTreeSelectBasic />
    </DemoBlock>

    <DemoBlock
      title="异步树字典"
      description="dict 传异步函数时，组件会自动显示骨架屏并在数据回来后保持与 value 同步。"
      source-hint="src/modules/docs/components/base-tree-select/demos/async.vue + data.ts"
      :source="asyncSource"
    >
      <DemoBaseTreeSelectAsync />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>只是字段名不一致时，优先通过 labelField / valueField / childrenField 做映射，不要先手动转一遍树结构。</li>
        <li>需要选择父节点时开启 check-strictly；需要严格按叶子关系勾选时则保留默认层级联动。</li>
        <li>需要同时拿到当前节点内容时，优先用 onSyncItem，而不是手动递归查找树节点。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseTreeSelect 扩展属性" :items="treeSelectApi" />
  </div>
</template>

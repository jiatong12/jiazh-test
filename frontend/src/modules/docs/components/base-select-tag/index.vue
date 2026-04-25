<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseSelectTagBasic from './demos/basic.vue'
import DemoBaseSelectTagBasicSource from './demos/basic.vue?raw'
import DemoBaseSelectTagDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const selectTagApi = [
  {
    name: 'multiple',
    description: '切换单选 / 多选模式。单选时再次点击当前项会取消；多选时内部维护数组值。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showAll',
    description: '是否在最前面补一个“全部”选项。默认开启，适合标签筛选场景。',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'type',
    description: '统一传给内部 ElCheckTag 的语义色类型。',
    type: '\'primary\' | \'success\' | \'warning\' | \'danger\' | \'info\'',
    default: 'primary',
  },
  {
    name: 'readonly / disabled',
    description: 'disabled 和 readonly 都会阻止点击；readonly 更强调“保留当前值，仅禁止修改”的只读语义。',
    type: 'boolean',
    default: 'false / false',
  },
  {
    name: 'dict / onSyncItem',
    description: '沿用字典组件统一能力，支持本地数组、字典 code、异步函数和当前项同步。',
    type: 'DictSource / (item) => void',
    default: '--',
  },
]

const slotApi = [
  {
    name: 'default',
    description: '自定义单个标签内部内容，作用域会透出当前 row。',
    type: '{ row: Record<string, any> }',
    default: '--',
  },
]

const featureItems = [
  { title: '标签筛选器', description: '比下拉更适合做高频切换、少量枚举和页内筛选。', meta: 'Filter' },
  { title: '单选 / 多选', description: '一套组件同时覆盖单选标签栏和多选标签集合。', meta: 'Mode' },
  { title: '保持字典语义', description: '继续复用 dict 和 onSyncItem，不额外分叉一套 options 协议。', meta: 'Dict' },
]

const basicSource = `${DemoBaseSelectTagBasicSource}\n\n/* data.ts */\n${DemoBaseSelectTagDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseSelectTag"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseSelectTag</code>
        适合那些“选项不多、需要频繁切换、希望直接看见全部候选项”的场景。
        它保留了和字典组件一致的
        <code class="docs-inline-code">dict</code>
        语义，但把交互换成了标签式选择。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>优先用于列表页顶部筛选、卡片分组切换和轻量状态过滤。</li>
        <li>当候选项很多、需要搜索时，仍然优先回到 BaseSelect。</li>
        <li>文档重点放在 showAll、多选语义和自定义标签内容，不重复展开 ElCheckTag 原生细节。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础筛选标签"
      description="同一个示例里覆盖单选、多选、showAll、自定义内容插槽和 readonly 语义。"
      source-hint="src/modules/docs/components/base-select-tag/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseSelectTagBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>候选项数量少于一屏且需要高频切换时，优先用 BaseSelectTag，而不是下拉框。</li>
        <li>单选模式下保留 showAll，通常能把“重置筛选”也一起收进组件内部。</li>
        <li>只是自定义标签内容时优先使用默认插槽，不要另起一套外层包裹结构。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseSelectTag 扩展属性" :items="selectTagApi" />
    <ComponentApiTable title="插槽" :items="slotApi" />
  </div>
</template>

<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoSelectionControlsAsync from './demos/async.vue'
import DemoSelectionControlsAsyncSource from './demos/async.vue?raw'
import DemoSelectionControlsBasic from './demos/basic.vue'
import DemoSelectionControlsBasicSource from './demos/basic.vue?raw'
import DemoSelectionControlsDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const commonApi = [
  {
    name: 'dict',
    description: '统一字典入口，支持本地数组、字典 code 和异步函数。',
    type: 'DictSource',
    default: '[]',
  },
  {
    name: 'modelValue / onUpdate:modelValue',
    description: '保持各组件原生 v-model 语义，值类型分别由单选、多选和分段模式决定。',
    type: 'string | number | boolean | any[]',
    default: '--',
  },
  {
    name: 'onSyncItem',
    description: '值变化后同步当前字典项。单选返回对象，多选返回对象数组。',
    type: '(item) => void',
    default: '--',
  },
]

const differenceApi = [
  {
    name: 'BaseRadio',
    description: '适合单选枚举。其余属性透传给 ElRadioGroup。',
    type: 'ElRadioGroup props',
    default: '--',
  },
  {
    name: 'BaseCheckboxGroup',
    description: '适合多选枚举。其余属性透传给 ElCheckboxGroup。',
    type: 'ElCheckboxGroup props',
    default: '--',
  },
  {
    name: 'BaseSegmented',
    description: '适合页内模式切换、统计卡切换和轻量过滤。其余属性透传给 ElSegmented。',
    type: 'ElSegmented props',
    default: '--',
  },
]

const featureItems = [
  { title: '表单单选', description: '状态、优先级、是否启用等单选场景优先使用 BaseRadio。', meta: 'Radio' },
  { title: '表单多选', description: '通知方式、适用范围、标签集合等多选场景优先使用 BaseCheckboxGroup。', meta: 'Checkbox' },
  { title: '页内切换', description: '概览 / 列表 / 看板这类同级视图切换更适合用 BaseSegmented。', meta: 'Segmented' },
]

const basicSource = `${DemoSelectionControlsBasicSource}\n\n/* data.ts */\n${DemoSelectionControlsDataSource}`
const asyncSource = `${DemoSelectionControlsAsyncSource}\n\n/* data.ts */\n${DemoSelectionControlsDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseCheckboxGroup / BaseRadio / BaseSegmented"
      lead=""
    >
      <template #lead>
        这三个组件都建立在同一套
        <code class="docs-inline-code">dict + v-model + onSyncItem</code>
        语义之上，只是分别面向
        <code class="docs-inline-code">单选</code>
        、
        <code class="docs-inline-code">多选</code>
        和
        <code class="docs-inline-code">分段切换</code>
        场景。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>BaseRadio 和 BaseCheckboxGroup 更偏表单录入；BaseSegmented 更偏页面过滤和视图切换。</li>
        <li>三者都优先使用 dict，不再手动拆 label / value 数组。</li>
        <li>文档重点在共同语义和使用边界，不重复展开底层 Element Plus API。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础用法"
      description="同一页内对比单选、多选和分段切换的默认写法，便于直接判断该选哪一个。"
      source-hint="src/modules/docs/components/base-selection-controls/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoSelectionControlsBasic />
    </DemoBlock>

    <DemoBlock
      title="异步字典"
      description="三个组件都基于 useDict，所以异步字典、骨架屏和当前项同步的行为保持一致。"
      source-hint="src/modules/docs/components/base-selection-controls/demos/async.vue + data.ts"
      :source="asyncSource"
    >
      <DemoSelectionControlsAsync />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>表单字段优先区分单选还是多选，再决定选 BaseRadio 还是 BaseCheckboxGroup，不要为了省事一律下拉框。</li>
        <li>同级视图切换和页内过滤优先用 BaseSegmented，它比 Radio 更适合承接工具栏切换语义。</li>
        <li>需要拿到当前项内容时统一走 onSyncItem，不要每次手动遍历字典列表。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="共同扩展属性" :items="commonApi" />
    <ComponentApiTable title="组件差异" :items="differenceApi" />
  </div>
</template>

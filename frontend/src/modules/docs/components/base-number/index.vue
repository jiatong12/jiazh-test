<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseNumberBasic from './demos/basic.vue'
import DemoBaseNumberBasicSource from './demos/basic.vue?raw'
import DemoBaseNumberDataSource from './demos/data.ts?raw'
import DemoBaseNumberForm from './demos/form.vue'
import DemoBaseNumberFormSource from './demos/form.vue?raw'
import '@/modules/docs/styles.scss'

const numberApi = [
  {
    name: 'precision',
    description: '控制数值精度。BaseNumber 默认 0，BaseDecimal 默认 2。',
    type: 'number',
    default: '0 / 2',
  },
  {
    name: '$attrs',
    description: '其余属性透传给 ElInputNumber，例如 min、max、step、step-strictly、controls。',
    type: 'ElInputNumber props',
    default: '--',
  },
  {
    name: '样式约定',
    description: '组件默认宽度为 100%，并把 controlsPosition 固定为 right，适合直接放入表单栅格。',
    type: '--',
    default: '--',
  },
]

const featureItems = [
  { title: '整数输入', description: '数量、人数、排序值等整数场景直接使用 BaseNumber。', meta: 'Integer' },
  { title: '金额小数', description: '金额、比例、评分等两位小数场景优先使用 BaseDecimal。', meta: 'Decimal' },
  { title: '表单 widget', description: '在 BaseFormItem 中优先通过 number / decimal widget 接入。', meta: 'Widget' },
]

const basicSource = `${DemoBaseNumberBasicSource}\n\n/* data.ts */\n${DemoBaseNumberDataSource}`
const formSource = DemoBaseNumberFormSource
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseNumber / BaseDecimal"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseNumber</code>
        和
        <code class="docs-inline-code">BaseDecimal</code>
        是项目里对
        <code class="docs-inline-code">ElInputNumber</code>
        的轻封装。它们的核心价值是
        <code class="docs-inline-code">统一默认精度</code>
        和
        <code class="docs-inline-code">表单内宽度 / 控制按钮位置</code>
        ，而不是引入额外交互语义。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>整数优先使用 BaseNumber，小数优先使用 BaseDecimal。</li>
        <li>需要更多精度时，直接显式传 precision，不再额外包业务层转换。</li>
        <li>文档重点解释项目默认值和接入方式，不重复展开 ElInputNumber 全部原生属性。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="直接使用组件"
      description="这个示例聚焦精度和默认布局：BaseNumber 默认 0 位小数，BaseDecimal 默认 2 位小数。"
      source-hint="src/modules/docs/components/base-number/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseNumberBasic />
    </DemoBlock>

    <DemoBlock
      title="在 BaseForm 中使用"
      description="表单里优先通过 BaseFormItem 的 number / decimal widget 接入，而不是手动自定义 slot。"
      source-hint="src/modules/docs/components/base-number/demos/form.vue"
      :source="formSource"
    >
      <DemoBaseNumberForm />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>金额、单价、比例等默认两位小数场景直接用 BaseDecimal，避免每次都重复传 precision=2。</li>
        <li>数量、人数、排序值等整数场景直接用 BaseNumber，保持精度默认值为 0。</li>
        <li>只要仍然是标准数字输入，就继续透传 ElInputNumber 原生属性，不额外发明新的 props 协议。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="扩展属性与默认约定" :items="numberApi" />
  </div>
</template>

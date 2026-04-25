<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseTableSearchFormBasic from './demos/basic.vue'
import DemoBaseTableSearchFormBasicSource from './demos/basic.vue?raw'
import DemoBaseTableSearchFormDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const searchFormApi = [
  {
    name: 'v-model',
    description: '搜索表单模型入口。通常直接绑定 BaseTable 的 searchFormState，也可以单独用于本地搜索面板。',
    type: 'Record<string, any>',
    default: '--',
  },
  {
    name: 'handleSearch',
    description: '搜索触发函数，按回车或内部控件触发搜索时会统一走这里。',
    type: '() => void',
    default: '--',
  },
  {
    name: 'col / cols',
    description: '搜索项布局列数。未显式传入时，会使用组件内置的响应式默认布局。',
    type: 'number / Cols',
    default: '--',
  },
  {
    name: 'labelWidth',
    description: '搜索表单标签宽度，默认 100px。',
    type: 'string | number',
    default: '100px',
  },
  {
    name: 'loading',
    description: '外部控制加载状态，适合和表格查询中的 loading 联动。',
    type: 'boolean',
    default: 'false',
  },
]

const searchFormItemApi = [
  {
    name: 'widget / widgetProps',
    description: '搜索项物料入口。优先使用组件内置搜索 widget，减少手写控件和回车联动处理。',
    type: 'BaseTableSearchType / Record<string, any>',
    default: '--',
  },
  {
    name: 'dict',
    description: '字典数据源，适合 select / treeSelect / selectTag 一类枚举筛选。',
    type: 'DictSource',
    default: '--',
  },
  {
    name: 'watchRerender',
    description: '依赖变化后重建当前搜索项，适合内部状态复杂的控件。',
    type: 'string | number | boolean',
    default: '--',
  },
  {
    name: 'watchValidate / watchClear',
    description: '依赖变化后重新校验或清空当前搜索项；watchClear 优先级更高。',
    type: 'string | number | boolean',
    default: '--',
  },
  {
    name: 'help',
    description: '标签旁提示信息，适合补充筛选口径。',
    type: 'string',
    default: '--',
  },
]

const searchFormSlotApi = [
  {
    name: 'BaseTableSearchForm.default',
    description: '搜索项容器默认插槽。会透出当前 model，适合按条件控制搜索项显示。',
    type: '{ model: Record<string, any> }',
    default: '--',
  },
  {
    name: 'BaseTableSearchFormItem.default',
    description: '自定义单个搜索项控件时使用，保持 modelValue / onUpdate:modelValue 接口即可接入搜索表单。',
    type: '{ modelValue: any, onUpdate:modelValue: (val: any) => void }',
    default: '--',
  },
  {
    name: 'BaseTableSearchFormItem.label',
    description: '自定义搜索项标签内容。',
    type: '--',
    default: '--',
  },
]

const searchFormExposeApi = [
  {
    name: 'formRef',
    description: '内部 ElForm 实例，可按需调用原生表单方法。',
    type: 'Ref<FormInstance>',
    default: '--',
  },
]

const featureItems = [
  { title: '高级搜索区', description: '作为 BaseTable 的 searchForm 插槽使用，承接多条件筛选。', meta: 'Table' },
  { title: '本地筛选面板', description: '不依赖 BaseTable，也可以单独作为列表筛选表单使用。', meta: 'Standalone' },
  { title: '范围字段映射', description: 'prop 支持 startDate,endDate 这类逗号结构，自动映射到数组控件。', meta: 'Range' },
]

const basicSource = `${DemoBaseTableSearchFormBasicSource}\n\n/* data.ts */\n${DemoBaseTableSearchFormDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseTableSearchForm"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseTableSearchForm</code>
        是列表页搜索区域的统一容器，
        <code class="docs-inline-code">BaseTableSearchFormItem</code>
        负责把常用筛选控件、字典枚举和范围字段映射收敛成统一写法。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>优先作为 <code class="docs-inline-code">BaseTable</code> 的 <code class="docs-inline-code">searchForm</code> 插槽内容使用。</li>
        <li>统一搜索项布局、回车触发搜索和多字段范围值映射。</li>
        <li>只补充项目封装的搜索表单语义，不重复展开与 Element Plus 完全一致的原生表单能力。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础搜索表单"
      description="这个示例聚焦最常见的搜索区写法：关键词、枚举筛选、日期范围，以及通过 handleSearch 统一触发查询。"
      source-hint="src/modules/docs/components/base-table-search-form/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseTableSearchFormBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li><code class="docs-inline-code">handleSearch</code> 是必传项，搜索按钮、回车和部分控件联动都会依赖它。</li>
        <li>范围控件可用 <code class="docs-inline-code">prop="startDate,endDate"</code> 这种逗号结构，把一个数组控件映射到两个字段。</li>
        <li>需要更复杂的筛选控件时，优先使用 <code class="docs-inline-code">BaseTableSearchFormItem.default</code> 插槽，而不是直接跳出表单体系。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseTableSearchForm 扩展属性" :items="searchFormApi" />
    <ComponentApiTable title="BaseTableSearchFormItem 扩展属性" :items="searchFormItemApi" />
    <ComponentApiTable title="插槽" :items="searchFormSlotApi" />
    <ComponentApiTable title="Ref 暴露方法" :items="searchFormExposeApi" />
  </div>
</template>

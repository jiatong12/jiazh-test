<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseFormBasic from './demos/basic.vue'
import DemoBaseFormBasicSource from './demos/basic.vue?raw'
import DemoBaseFormDataSource from './demos/data.ts?raw'
import DemoBaseFormDescriptions from './demos/descriptions.vue'
import DemoBaseFormDescriptionsSource from './demos/descriptions.vue?raw'
import '@/modules/docs/styles.scss'

const formApi = [
  {
    name: 'datasource',
    description: '统一数据入口。对象模式适合新增和本地编辑；函数模式适合编辑回填和详情加载，组件内部会同步维护初始快照。',
    type: 'Record<string, any> | (param) => Promise<Record<string, any>>',
    default: '--',
  },
  {
    name: 'immediate',
    description: '是否在组件挂载后立即执行 datasource。需要手动控制加载时设为 false，再通过 ref.loadData() 触发。',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'displayMode',
    description: '切换为 descriptions 后，BaseForm 会用项目内置描述样式渲染 BaseRow / BaseCol，并自动取消 label 后缀与栅格间距。',
    type: '\'form\' | \'descriptions\'',
    default: 'form',
  },
  {
    name: 'col / cols',
    description: '沿用 BaseRow 的列配置语义。简单场景用 col，响应式场景优先用 cols。',
    type: 'number / Cols',
    default: '1 / --',
  },
  {
    name: 'center + width',
    description: '用于控制阅读宽度。center 只有在显式设置 width 时才有意义，适合字段较少的单列表单。',
    type: 'boolean + string',
    default: 'false + auth',
  },
  {
    name: 'enabledLeaveCheck',
    description: '开启后会根据 hasChange 自动接入离开页面提醒。详情页和纯演示场景通常建议关闭。',
    type: 'boolean',
    default: 'true',
  },
]

const formItemApi = [
  {
    name: 'widget / widgetProps',
    description: '项目约定的表单物料入口。优先走内置 widget，只有交互差异很大时再落到 slot。',
    type: 'WidgetType / Record<string, any>',
    default: '--',
  },
  {
    name: 'dict',
    description: '字典数据源，可传本地数组、字典 code 或异步函数；适合常量型枚举值回显与选择。',
    type: 'DictSource',
    default: '--',
  },
  {
    name: 'isReadonly / readonlyEmpty',
    description: '把单个字段切到只读展示态，不必用 disabled 冒充只读；空值展示由 readonlyEmpty 控制。',
    type: 'boolean / string',
    default: 'false / --',
  },
  {
    name: 'watchRerender',
    description: '依赖变化后强制重建当前字段，适合内部状态复杂、不会自动响应外部变更的物料。',
    type: 'string | number | boolean',
    default: '--',
  },
  {
    name: 'watchValidate / watchClear',
    description: '依赖字段变化后重新校验或自动清空当前字段，适合联动表单场景；watchClear 优先级更高。',
    type: 'string | number | boolean',
    default: '--',
  },
  {
    name: 'help / priv',
    description: 'help 用于字段旁的辅助提示；priv 用于权限控制，无权限时会自动退化为只读展示。',
    type: 'string / string',
    default: '--',
  },
]

const formExposeApi = [
  {
    name: 'validate()',
    description: '代理内部 ElForm.validate，提交前校验仍然走 Element Plus 原生能力。',
    type: '() => Promise<boolean>',
    default: '--',
  },
  {
    name: 'loadData()',
    description: '重新执行 datasource，并同步更新初始快照与校验状态。编辑回填、详情切换场景最常用。',
    type: '() => void',
    default: '--',
  },
  {
    name: 'reset()',
    description: '把当前模型恢复成最近一次 loadData 或初始 datasource 的结果。',
    type: '() => void',
    default: '--',
  },
  {
    name: 'model',
    description: '当前表单模型的响应式引用，可直接读取当前值。',
    type: 'Ref<Record<string, any>>',
    default: '--',
  },
  {
    name: 'hasChange',
    description: '当前模型与初始快照是否有差异，是 leave guard 的判断依据。',
    type: 'ComputedRef<boolean>',
    default: '--',
  },
  {
    name: 'leaveCheck()',
    description: '主动触发离开校验。路由切换前需要手动串联时可以显式调用。',
    type: '() => Promise<void>',
    default: '--',
  },
]

const formSlotApi = [
  {
    name: 'BaseForm.default',
    description: '表单内容区。作用域会透出当前 model，适合在表单内部做条件渲染或分组布局。',
    type: '{ model: Record<string, any> }',
    default: '--',
  },
  {
    name: 'BaseForm.header',
    description: '表单头部区域，位于 BaseRow 之前，适合放说明、提示条和分段引导。',
    type: '--',
    default: '--',
  },
  {
    name: 'BaseForm.footer',
    description: '表单底部区域，位于 BaseRow 之后，常用于提交、取消、重置等操作按钮。',
    type: '--',
    default: '--',
  },
  {
    name: 'BaseFormItem.default',
    description: '字段内容插槽。完全自定义控件时，应继续使用 modelValue / onUpdate:modelValue 与表单模型同步。',
    type: '{ modelValue: any, onUpdate:modelValue: (val: any) => void }',
    default: '--',
  },
  {
    name: 'BaseFormItem.label',
    description: '字段标签插槽。会保留 help 说明能力，适合补充字段口径。',
    type: '{ label: string }',
    default: '--',
  },
]

const featureItems = [
  { title: '新增表单', description: '直接给 datasource 一个初始对象，快速起页面。', meta: 'Create' },
  { title: '编辑表单', description: '将 datasource 设计成异步函数，进入场景时拉取数据。', meta: 'Edit' },
  { title: '只读详情', description: '使用 displayMode="descriptions"，复用同一套字段配置。', meta: 'Readonly' },
]

const basicSource = `${DemoBaseFormBasicSource}\n\n/* data.ts */\n${DemoBaseFormDataSource}`
const descriptionsSource = `${DemoBaseFormDescriptionsSource}\n\n/* data.ts */\n${DemoBaseFormDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseForm"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseForm</code>
        是项目里的统一表单容器，用来承接
        <code class="docs-inline-code">数据加载</code>
        、
        <code class="docs-inline-code">布局</code>
        、
        <code class="docs-inline-code">读写展示</code>
        和
        <code class="docs-inline-code">离开保护</code>
        。文档的价值不是重复解释组件，而是让说明、demo 和真实运行环境保持一致。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>新增、编辑、详情三种场景尽量共用同一套字段配置。</li>
        <li>
          布局统一走
          <code class="docs-inline-code">BaseRow / BaseCol</code>
          。
        </li>
        <li>
          表单项优先使用
          <code class="docs-inline-code">BaseFormItem</code>
          的内置
          <code class="docs-inline-code">widget</code>
          。
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="文档范围">
      <ul class="docs-page-list">
        <li>这里只补充项目封装新增或改变语义的能力。</li>
        <li>
          与
          <code class="docs-inline-code">ElForm</code>
          /
          <code class="docs-inline-code">ElFormItem</code>
          完全一致的原生属性、事件和校验规则，不在这里重复展开。
        </li>
        <li>
          阅读顺序建议先看示例，再看下方的
          <code class="docs-inline-code">BaseForm</code>
          /
          <code class="docs-inline-code">BaseFormItem</code>
          扩展说明。
        </li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础表单"
      description="基础示例按项目里的标准表单页写法组织：对象数据源、显式 labelWidth、字典字段、校验规则和 BaseCol 整行字段。"
      source-hint="src/modules/docs/components/base-form/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseFormBasic />
    </DemoBlock>

    <DemoBlock
      title="异步详情与 Descriptions"
      description="这个示例聚焦项目里最常见的详情展示场景：异步 datasource、displayMode=descriptions、局部整行字段，以及通过 ref.loadData() 切换不同记录。"
      source-hint="src/modules/docs/components/base-form/demos/descriptions.vue + data.ts"
      :source="descriptionsSource"
    >
      <DemoBaseFormDescriptions />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>
          新增场景直接传对象给
          <code class="docs-inline-code">datasource</code>
          。
        </li>
        <li>
          编辑场景把
          <code class="docs-inline-code">datasource</code>
          设计成异步函数。
        </li>
        <li>
          详情场景优先使用
          <code class="docs-inline-code">displayMode="descriptions"</code>
          。
        </li>
        <li>
          文本域、长内容、图片区等独占一行的项，用
          <code class="docs-inline-code">BaseCol</code>
          包裹。
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="常见约束">
      <ul class="docs-page-list">
        <li>
          <code class="docs-inline-code">datasource</code>
          是必填项，哪怕只是本地对象示例也不要省略。
        </li>
        <li>
          展示型详情页建议显式设置
          <code class="docs-inline-code">labelWidth</code>
          。
        </li>
        <li>
          遇到跨列布局时，优先调整
          <code class="docs-inline-code">BaseCol</code>
          ，不要在业务页补专用样式。
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="插槽说明">
      <ul class="docs-page-list">
        <li>
          <code class="docs-inline-code">BaseForm</code>
          和
          <code class="docs-inline-code">BaseFormItem</code>
          都有默认插槽，二者作用域不同，不建议混写理解。
        </li>
        <li>
          当你要完全自定义字段控件时，应该使用
          <code class="docs-inline-code">BaseFormItem.default</code>
          ，并显式接回
          <code class="docs-inline-code">modelValue / onUpdate:modelValue</code>
          。
        </li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseForm 扩展属性" :items="formApi" />
    <ComponentApiTable title="BaseFormItem 扩展属性" :items="formItemApi" />
    <ComponentApiTable title="插槽" :items="formSlotApi" />
    <ComponentApiTable title="Ref 暴露方法" :items="formExposeApi" />
  </div>
</template>

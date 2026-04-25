<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseButtonAction from './demos/action.vue'
import DemoBaseButtonActionSource from './demos/action.vue?raw'
import DemoBaseButtonBasic from './demos/basic.vue'
import DemoBaseButtonBasicSource from './demos/basic.vue?raw'
import DemoBaseButtonDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const buttonApi = [
  {
    name: 'ripple',
    description: '是否启用点击波纹效果。默认开启，适合主应用的大多数操作按钮；需要更克制的反馈时再显式关闭。',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'priv',
    description: '权限码。无权限时按钮会自动禁用，而不是把权限判断分散到业务页各处。',
    type: 'string',
    default: '--',
  },
  {
    name: 'disabled',
    description: '保持 ElButton 原生禁用语义，并与 priv 判断合并生效。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: '$attrs',
    description: '其余属性继续透传给 ElButton，例如 type、size、icon、loading、plain、link 等。',
    type: 'ElButton props',
    default: '--',
  },
]

const actionButtonApi = [
  {
    name: 'api',
    description: '必填异步函数。点击后会统一进入 loading，并在成功后弹出成功提示。',
    type: '() => Promise<any>',
    default: '--',
  },
  {
    name: 'validate',
    description: '可选表单校验函数。传入后会先校验，再进入 api 调用。',
    type: 'FormInstance[\'validate\']',
    default: '--',
  },
  {
    name: 'actionName',
    description: '动作名，用来拼接默认提示文案，例如“保存成功”“提交成功”。',
    type: 'string',
    default: '操作',
  },
]

const buttonSlotApi = [
  {
    name: 'default',
    description: '按钮内容插槽。BaseButton、BasePrimaryButton 和 BaseActionButton 都沿用同一套内容插槽。',
    type: '--',
    default: '--',
  },
]

const featureItems = [
  { title: '统一权限收口', description: '通过 priv 收敛权限禁用逻辑，减少散落的 v-if / disabled 判断。', meta: 'Priv' },
  { title: '主按钮别名', description: 'BasePrimaryButton 把高频的主按钮写法压缩成更稳定的语义入口。', meta: 'Primary' },
  { title: '异步动作按钮', description: 'BaseActionButton 统一处理提交、发布、保存类标准异步操作。', meta: 'Action' },
]

const basicSource = `${DemoBaseButtonBasicSource}\n\n/* data.ts */\n${DemoBaseButtonDataSource}`
const actionSource = `${DemoBaseButtonActionSource}\n\n/* data.ts */\n${DemoBaseButtonDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseButton"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseButton</code>
        不是重新定义按钮，而是在
        <code class="docs-inline-code">ElButton</code>
        之上补上项目真正会反复写到的能力：
        <code class="docs-inline-code">权限禁用</code>
        、
        <code class="docs-inline-code">波纹反馈</code>
        和
        <code class="docs-inline-code">标准异步动作</code>
        。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>普通操作用 BaseButton，主操作优先用 BasePrimaryButton。</li>
        <li>提交、发布、保存这类标准异步动作优先用 BaseActionButton。</li>
        <li>文档只覆盖项目封装新增的语义，不重复展开 ElButton 的全部原生属性。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础按钮与主按钮"
      description="聚焦 BaseButton / BasePrimaryButton 的高频写法：普通按钮、主按钮、图标按钮、禁用态和波纹开关。"
      source-hint="src/modules/docs/components/base-button/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseButtonBasic />
    </DemoBlock>

    <DemoBlock
      title="BaseActionButton"
      description="聚焦项目里常见的提交动作：内部统一处理点击节流、loading 和成功提示，业务侧只需要关心 api。"
      source-hint="src/modules/docs/components/base-button/demos/action.vue + data.ts"
      :source="actionSource"
    >
      <DemoBaseButtonAction />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>主流程的确认按钮优先使用 BasePrimaryButton，减少业务页重复写 type=&quot;primary&quot;。</li>
        <li>标准异步动作优先收敛到 BaseActionButton，不要每个页面都重复维护 loading 和成功提示。</li>
        <li>需要权限控制时优先使用 priv，不要在外层再包一层条件分支去手动禁用。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseButton 扩展属性" :items="buttonApi" />
    <ComponentApiTable title="BaseActionButton 扩展属性" :items="actionButtonApi" />
    <ComponentApiTable title="插槽" :items="buttonSlotApi" />
  </div>
</template>

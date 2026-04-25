<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseDialogBasic from './demos/basic.vue'
import DemoBaseDialogBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const dialogApi = [
  {
    name: 'showFullscreen',
    description: '是否显示默认头部里的全屏切换按钮。只影响项目封装新增的按钮，不影响 Element Plus 原生属性。',
    type: 'boolean',
    default: 'true',
  },
]

const defaultBehaviorApi = [
  {
    name: 'append-to-body',
    description: '默认关闭，弹框直接挂在当前层级中，避免业务页里到处追加到 body 带来的定位与样式漂移。',
    type: '内部默认值',
    default: 'false',
  },
  {
    name: 'destroy-on-close',
    description: '关闭后销毁内容，适合项目里常见的“打开前重置状态”模式。',
    type: '内部默认值',
    default: 'true',
  },
  {
    name: 'close-on-click-modal / close-on-press-escape',
    description: '默认关闭，避免复杂表单在误触遮罩层或键盘时直接关闭。',
    type: '内部默认值',
    default: 'false / false',
  },
  {
    name: 'show-close',
    description: '默认关闭原生关闭按钮，统一使用项目封装的头部按钮样式。',
    type: '内部默认值',
    default: 'false',
  },
]

const dialogSlotApi = [
  {
    name: 'default',
    description: '弹框主体内容。项目里通常直接放 BaseForm、详情区块或轻量确认内容。',
    type: '{ fullscreen?: boolean }',
    default: '--',
  },
  {
    name: 'header',
    description: '自定义头部时使用；一旦提供，会完全替换项目默认头部实现。',
    type: '{ close, titleId, titleClass, fullscreen }',
    default: '--',
  },
  {
    name: 'footer',
    description: '底部操作区。项目里最常见的是“取消 + 确定”或“取消 + 保存”。',
    type: '{ fullscreen?: boolean }',
    default: '--',
  },
]

const dialogExposeApi = [
  {
    name: 'fullscreen',
    description: '项目封装额外暴露的全屏状态，可通过 ref 直接读取或切换。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'ElDialog 实例能力',
    description: '底层实例能力会一并透出，方便保留原组件 ref 的常规使用方式。',
    type: 'Dialog instance',
    default: '--',
  },
]

const featureItems = [
  { title: '轻量新增 / 编辑', description: '字段少、结构简单时优先使用弹框，而不是直接上抽屉。', meta: 'Form' },
  { title: '确认型交互', description: '需要正文说明和一组明确操作按钮时，弹框更聚焦。', meta: 'Action' },
  { title: '可切全屏', description: '默认头部已内置全屏按钮，表单内容偶尔变长时仍可继续沿用弹框。', meta: 'Fullscreen' },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseDialog"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseDialog</code>
        在
        <code class="docs-inline-code">ElDialog</code>
        之上统一了默认头部、关闭策略和全屏切换按钮，适合字段较少、结构较轻的新增与编辑场景。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>字段少、结构简单的新增 / 编辑优先使用 <code class="docs-inline-code">BaseDialog</code>。</li>
        <li>关闭遮罩点击关闭和 Esc 关闭，避免复杂表单误关。</li>
        <li>只说明项目新增行为，不重复展开与 <code class="docs-inline-code">ElDialog</code> 完全一致的原生属性。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="默认头部与全屏切换"
      description="这个示例聚焦 BaseDialog 的项目封装点：默认右上角按钮、showFullscreen 开关，以及 footer 插槽里拿到 fullscreen 状态。"
      source-hint="src/modules/docs/components/base-dialog/demos/basic.vue"
      :source="DemoBaseDialogBasicSource"
    >
      <DemoBaseDialogBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li>如果字段已经明显变多、需要分区或切 tab，优先改用 <code class="docs-inline-code">BaseDrawer</code>。</li>
        <li>项目里通常通过 <code class="docs-inline-code">open()</code> 暴露打开方法，并在打开前重置本地状态。</li>
        <li>确实需要自定义头部时再使用 <code class="docs-inline-code">header</code> 插槽，否则优先沿用默认头部。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="扩展属性" :items="dialogApi" />
    <ComponentApiTable title="默认行为" :items="defaultBehaviorApi" />
    <ComponentApiTable title="插槽" :items="dialogSlotApi" />
    <ComponentApiTable title="Ref 暴露能力" :items="dialogExposeApi" />
  </div>
</template>

<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseDrawerBasic from './demos/basic.vue'
import DemoBaseDrawerBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const defaultBehaviorApi = [
  {
    name: 'append-to-body',
    description: '默认关闭，抽屉仍跟随当前页面层级，避免额外 portal 带来的样式偏移。',
    type: '内部默认值',
    default: 'false',
  },
  {
    name: 'destroy-on-close',
    description: '默认开启，关闭后销毁内容，和项目里“打开前重置状态”模式一致。',
    type: '内部默认值',
    default: 'true',
  },
  {
    name: 'close-on-click-modal',
    description: '默认关闭，防止大表单在误触遮罩层时直接退出。',
    type: '内部默认值',
    default: 'false',
  },
  {
    name: 'show-close',
    description: '默认关闭原生关闭按钮，统一由项目封装头部提供右上角关闭入口。',
    type: '内部默认值',
    default: 'false',
  },
]

const drawerSlotApi = [
  {
    name: 'default',
    description: '抽屉主体区域。项目里通常放分块表单、Tabs 或详情模块。',
    type: '--',
    default: '--',
  },
  {
    name: 'header',
    description: '需要接管顶部结构时使用；默认情况下会沿用项目统一头部。',
    type: '{ close, titleId, titleClass }',
    default: '--',
  },
  {
    name: 'footer',
    description: 'Element Plus 原生 footer 插槽仍可继续使用；但项目里更常把操作按钮直接放在主体顶部。',
    type: '--',
    default: '--',
  },
]

const drawerExposeApi = [
  {
    name: 'ElDrawer 实例能力',
    description: '底层实例能力会继续透出，保持和原组件 ref 的使用方式一致。',
    type: 'Drawer instance',
    default: '--',
  },
]

const featureItems = [
  { title: '字段多的编辑', description: '字段多、说明多、布局更宽时优先改用抽屉。', meta: 'Edit' },
  { title: '详情分块展示', description: '详情信息较长时，抽屉能承载多个信息区块而不压缩内容。', meta: 'Detail' },
  { title: 'Tabs 组合', description: '需要多个模块并列展示时，常和 BaseTabs 配合使用。', meta: 'Tabs' },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseDrawer"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseDrawer</code>
        在
        <code class="docs-inline-code">ElDrawer</code>
        之上统一了头部关闭按钮和默认关闭策略，适合字段较多、内容较长或需要更宽承载区的场景。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>字段多、区块多、需要更大横向空间时优先使用抽屉。</li>
        <li>项目里常把主要操作按钮直接放在内容区顶部，而不是依赖底部 footer。</li>
        <li>这里只说明项目封装约定，不重复展开 <code class="docs-inline-code">ElDrawer</code> 的原生尺寸、方向等基础能力。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="顶部工具区 + 分块表单"
      description="这个示例聚焦项目里最常见的 Drawer 结构：头部保持统一，主要操作按钮放在主体顶部，下面承载更宽的表单内容。"
      source-hint="src/modules/docs/components/base-drawer/demos/basic.vue"
      :source="DemoBaseDrawerBasicSource"
    >
      <DemoBaseDrawerBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li>当编辑区已经明显超出弹框的舒适阅读范围时，不要硬撑弹框，直接改用抽屉。</li>
        <li>如果抽屉内部是 <code class="docs-inline-code">Tabs</code> 主体，优先让滚动落在每个 <code class="docs-inline-code">BaseTabPane</code> 里。</li>
        <li>和弹框一样，项目里通常通过 <code class="docs-inline-code">open()</code> 暴露打开方法，并在打开前完成状态初始化。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="默认行为" :items="defaultBehaviorApi" />
    <ComponentApiTable title="插槽" :items="drawerSlotApi" />
    <ComponentApiTable title="Ref 暴露能力" :items="drawerExposeApi" />
  </div>
</template>

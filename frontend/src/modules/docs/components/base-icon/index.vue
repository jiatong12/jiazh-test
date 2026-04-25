<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseIconBasic from './demos/basic.vue'
import DemoBaseIconBasicSource from './demos/basic.vue?raw'
import DemoBaseIconButton from './demos/button.vue'
import DemoBaseIconButtonSource from './demos/button.vue?raw'
import DemoBaseIconDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const iconApi = [
  {
    name: 'name',
    description: '图标 class 名，推荐优先使用 i-mdi:*，自定义 SVG 使用 i-icon:*。',
    type: 'string',
    default: '--',
  },
]

const helperApi = [
  {
    name: 'BaseIcon',
    description: '普通展示场景优先使用 BaseIcon，例如列表说明、标签、导航文本前导图标。',
    type: '<BaseIcon name="i-mdi:home-outline" />',
    default: '--',
  },
  {
    name: '$$renderIcon',
    description: '用于 Element Plus 的 icon 属性，例如按钮、菜单和下拉项。',
    type: '$$renderIcon(\'i-mdi:content-save-outline\')',
    default: '--',
  },
  {
    name: 'i-icon:*',
    description: '项目自定义 SVG 图标集合，文件位于 src/assets/svg-icon，文件名即图标名。',
    type: 'i-icon:add',
    default: '--',
  },
]

const featureItems = [
  { title: '普通展示', description: '文本前导图标、状态说明和轻量视觉点缀。', meta: 'Display' },
  { title: '按钮 / 菜单', description: 'Element Plus 的 icon 属性统一通过 $$renderIcon 接入。', meta: 'Action' },
  { title: '自定义 SVG', description: '业务专属图标放到 src/assets/svg-icon，并通过 i-icon:* 使用。', meta: 'Custom' },
]

const basicSource = `${DemoBaseIconBasicSource}\n\n/* data.ts */\n${DemoBaseIconDataSource}`
const buttonSource = DemoBaseIconButtonSource
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseIcon"
      lead=""
    >
      <template #lead>
        图标规范在这个项目里有两层：
        普通展示优先用
        <code class="docs-inline-code">BaseIcon</code>
        ，传给 Element Plus 的
        <code class="docs-inline-code">icon</code>
        属性时优先用
        <code class="docs-inline-code">$$renderIcon</code>
        。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>图标来源优先级：i-mdi:* → 其他公共 icon 集 → i-icon:* 自定义 SVG。</li>
        <li>普通展示使用 BaseIcon，按钮 / 菜单等 icon 属性使用 $$renderIcon。</li>
        <li>文档不再展开 BaseIconPicker，本页聚焦最常用的运行时图标写法。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础图标展示"
      description="同时演示公共图标和项目自定义 SVG 图标的基础写法。"
      source-hint="src/modules/docs/components/base-icon/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseIconBasic />
    </DemoBlock>

    <DemoBlock
      title="按钮与导航"
      description="Element Plus 的 icon 属性统一使用 $$renderIcon；普通文本前导图标继续使用 BaseIcon。"
      source-hint="src/modules/docs/components/base-icon/demos/button.vue"
      :source="buttonSource"
    >
      <DemoBaseIconButton />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>普通展示场景优先使用 BaseIcon，不要直接散落一堆裸 i class。</li>
        <li>按钮、菜单、下拉项等需要传组件的 icon 属性时，统一使用 $$renderIcon。</li>
        <li>确实没有公共图标可用时，再新增 src/assets/svg-icon 下的自定义 SVG，并通过 i-icon:* 引用。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseIcon 属性" :items="iconApi" />
    <ComponentApiTable title="推荐渲染方式" :items="helperApi" />
  </div>
</template>

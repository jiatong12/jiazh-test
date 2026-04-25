<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseTagBasic from './demos/basic.vue'
import DemoBaseTagBasicSource from './demos/basic.vue?raw'
import DemoBaseTagDataSource from './demos/data.ts?raw'
import '@/modules/docs/styles.scss'

const tagApi = [
  {
    name: 'type',
    description: '语义色类型，直接复用项目里的主 / 成功 / 警告 / 危险 / 信息语义色。',
    type: '\'primary\' | \'success\' | \'warning\' | \'danger\' | \'info\'',
    default: '--',
  },
  {
    name: 'color',
    description: '支持直接传自定义颜色。若传入的是语义色字符串，会自动退回到 type 语义处理。',
    type: 'string',
    default: '--',
  },
  {
    name: 'effect',
    description: '当使用语义色时沿用 ElTag 的 dark / light / plain；自定义颜色场景默认会强制回到 plain 视觉。',
    type: '\'dark\' | \'light\' | \'plain\'',
    default: '--',
  },
  {
    name: 'onClick',
    description: '为标签补充轻点击交互，适合过滤切换和状态追踪等弱操作场景。',
    type: '(...args: any[]) => void',
    default: '--',
  },
]

const slotApi = [
  {
    name: 'default',
    description: '标签内容插槽。',
    type: '--',
    default: '--',
  },
]

const featureItems = [
  { title: '语义状态', description: '直接沿用项目统一的语义色，保证状态标签视觉一致。', meta: 'Semantic' },
  { title: '自定义品牌色', description: '对接业务品牌色或专题色时，不必再额外手写样式分支。', meta: 'Color' },
  { title: '轻交互标签', description: '适合做轻量可点击状态，不必升级成完整按钮。', meta: 'Interactive' },
]

const basicSource = `${DemoBaseTagBasicSource}\n\n/* data.ts */\n${DemoBaseTagDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseTag"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseTag</code>
        解决的是项目里两个高频问题：
        <code class="docs-inline-code">语义色统一</code>
        和
        <code class="docs-inline-code">自定义颜色标签</code>
        。
        这样业务页就不需要为每个状态点再手写一层颜色样式。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>优先用于单值短状态、枚举标签和轻量筛选项。</li>
        <li>当只是需要自定义色标签时，直接传 color，不要再额外包一层样式类。</li>
        <li>文档重点说明 type / color 的优先级和自定义颜色能力，不重复展开 ElTag 的全部原生属性。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="语义色与自定义色"
      description="同一个示例覆盖语义色标签、自定义颜色标签和轻点击交互。"
      source-hint="src/modules/docs/components/base-tag/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseTagBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>能用语义色表达的状态优先使用 type，不要把 success / warning 这类状态写成硬编码十六进制颜色。</li>
        <li>自定义品牌色或专题色再使用 color，避免把全部状态都改成不可维护的魔法值。</li>
        <li>标签需要明显主操作时，优先升级成按钮；BaseTag 更适合轻量状态和弱交互。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseTag 扩展属性" :items="tagApi" />
    <ComponentApiTable title="插槽" :items="slotApi" />
  </div>
</template>

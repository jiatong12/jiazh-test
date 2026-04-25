<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoHeightAdaptiveBasic from './demos/basic.vue'
import DemoHeightAdaptiveBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const layoutUtilityApi = [
  {
    name: 'h-full',
    description: '让当前节点继承父容器高度，常用于页面根节点、Tabs、抽屉内容区和并列卡片容器。',
    type: '全局 class',
    default: 'height: 100%',
  },
  {
    name: 'flex-column-layout',
    description: '统一纵向布局容器，负责把头部区、筛选区和主体区串起来。',
    type: '全局 class',
    default: 'display: flex; flex-direction: column',
  },
  {
    name: 'flex-height-fill',
    description: '让主体区吃掉剩余高度，并补上 min-height: 0，避免子内容撑破父容器。',
    type: '全局 class',
    default: 'flex: 1; min-height: 0',
  },
  {
    name: 'overflow-y-auto',
    description: '需要滚动时优先放在最内层内容区，而不是父子两层同时滚动。',
    type: '全局 class',
    default: 'overflow-y: auto',
  },
]

const antiPatternApi = [
  {
    name: 'height: 100vh',
    description: '普通业务页不要直接绑到视口，否则会和头部布局、主内容壳层产生高度竞争。',
    type: '不推荐',
    default: '--',
  },
  {
    name: 'min-height: 100vh',
    description: '容易把页面整体撑高，滚动条落回浏览器根节点，破坏模块内滚动口径。',
    type: '不推荐',
    default: '--',
  },
  {
    name: 'calc(100vh - xxx)',
    description: '业务页头部、面包屑、tab 高度一旦调整就要跟着改，维护成本高且容易失真。',
    type: '不推荐',
    default: '--',
  },
]

const featureItems = [
  { title: '页面主体区', description: '根节点拿到父高度后，再把剩余高度交给表格或详情区。', meta: 'Page' },
  { title: 'Tabs 场景', description: 'Tabs 自身占满高度，滚动落在当前 TabPane 的内容区。', meta: 'Tabs' },
  { title: '并列卡片', description: '左右并列布局时，每一列都先拿到统一高度，再决定各自内部滚动。', meta: 'Split' },
]

const diagnoseApi = [
  {
    name: '页面整体在滚',
    description: '先检查页面根节点有没有拿到父高度，再确认是否有人直接写了 100vh / min-height: 100vh。',
    type: '先看根节点',
    default: 'h-full',
  },
  {
    name: '中间层撑不开',
    description: '通常是父级或中间层缺了 min-height: 0。项目里优先补 flex-height-fill，而不是继续堆 calc。',
    type: '先看中间层',
    default: 'flex-height-fill',
  },
  {
    name: 'Tabs 里双滚动',
    description: 'Tabs 和 TabPane 需要继承高度，滚动只留在当前 pane 内容区，不要让外层卡片再承担纵向滚动。',
    type: '先看滚动落点',
    default: 'TabPane overflow',
  },
  {
    name: '表格区高度异常',
    description: '优先检查表格外层容器是不是已经被卡片、tabs 或抽屉包住，避免每层都各自算一次高度。',
    type: '先看容器链路',
    default: '继承父高',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="高度自适应"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        项目里的页面高度推荐通过
        <code class="docs-inline-code">父容器给高度</code>
        +
        <code class="docs-inline-code">子内容区接管滚动</code>
        的方式传递，而不是在业务页里直接写
        <code class="docs-inline-code">100vh</code>
        或
        <code class="docs-inline-code">calc(100vh - xxx)</code>
        。
      </template>
    </DocPageHeader>

    <BaseCard title="推荐口径">
      <ul class="docs-page-list">
        <li>页面根节点先拿到外层高度，常见写法是 <code class="docs-inline-code">h-full</code> 或并列布局容器。</li>
        <li>页面主结构优先使用 <code class="docs-inline-code">flex-column-layout</code>，固定头部在上，主体区通过 <code class="docs-inline-code">flex-height-fill</code> 吃剩余空间。</li>
        <li>真正需要滚动的只有最内层内容区，例如表格区、TabPane 内容区、列表区。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="父容器给高，子内容滚动"
      description="这个示例只展示项目推荐的高度传递链路。为了在文档里看出效果，最外层人为限制了高度；真实页面通常不需要这样写。"
      source-hint="src/modules/docs/guides/height-adaptive/demos/basic.vue"
      :source="DemoHeightAdaptiveBasicSource"
    >
      <DemoHeightAdaptiveBasic />
    </DemoBlock>

    <BaseCard title="常见场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="判断口诀">
      <ul class="docs-page-list">
        <li>先问“谁负责给高度”，再问“谁负责滚动”，不要两件事都交给同一层容器。</li>
        <li>页面里一旦出现多层纵向滚动，优先怀疑滚动落点放错了，而不是继续追加高度计算。</li>
        <li>碰到高度问题先沿着父子链路排查，不要第一反应就写 <code class="docs-inline-code">calc(100vh - xxx)</code>。</li>
      </ul>
    </BaseCard>

    <BaseCard title="使用建议">
      <ul class="docs-page-list">
        <li>BaseTable、Tabs、详情区这类“主体模块”优先继承父级高度，不要自己重新计算视口高度。</li>
        <li>如果已经有一层容器在滚动，下层内容就不要再额外套一层纵向滚动，否则很容易出现双滚动。</li>
        <li>当列表区撑不开时，先检查中间层是否缺了 <code class="docs-inline-code">min-height: 0</code>；项目里通常直接用 <code class="docs-inline-code">flex-height-fill</code> 解决。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="推荐使用的全局类" :items="layoutUtilityApi" />
    <ComponentApiTable title="常见症状排查" :items="diagnoseApi" />
    <ComponentApiTable title="不推荐写法" :items="antiPatternApi" />
  </div>
</template>

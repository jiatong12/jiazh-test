<script setup lang="ts">
import UseResettableStateSource from '@/hooks/useResettableState.ts?raw'
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoUseResettableStateBasic from './demos/basic.vue'
import DemoUseResettableStateBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const featureItems = [
  {
    title: '新增打开前重置',
    description: '每次 openAdd 先 reset，再展示弹层，避免上一次输入残留到下一次新增。',
    meta: 'Create',
  },
  {
    title: '编辑回填前清场',
    description: '先 reset，再合并当前记录或接口返回值，能避免旧字段在部分回填场景里漏残留。',
    meta: 'Edit',
  },
  {
    title: '详情切换记录',
    description: '切换 id 或 row 时先回到空状态，再加载新详情，适合抽屉、Tabs 和分栏详情。',
    meta: 'Detail',
  },
]

const apiItems = [
  {
    name: 'cb',
    description: '返回初始值的工厂函数。每次 reset 都会重新执行它，而不是复用第一次的对象引用。',
    type: '() => T',
    default: '--',
  },
  {
    name: 'state',
    description: '内部通过 ref 包装后的响应式状态，适合直接绑定 BaseForm、BaseDialog 等组件。',
    type: 'Ref<T>',
    default: '--',
  },
  {
    name: 'resetState',
    description: '重新执行 cb 并覆盖当前 state.value，常用于弹框打开前、详情切换时的状态清理。',
    type: '() => T',
    default: '--',
  },
]

const boundaryItems = [
  {
    name: '推荐场景',
    description: '新增 / 编辑弹层、详情抽屉、筛选草稿等需要反复回到干净初始值的本地临时状态。',
    type: '该用',
    default: '局部状态',
  },
  {
    name: '推荐顺序',
    description: '打开流程优先遵循 resetState() -> 回填当前数据 -> visible = true，不要先打开再慢慢清字段。',
    type: '该用',
    default: '先 reset',
  },
  {
    name: '不推荐场景',
    description: '派生状态、跨页面共享状态、服务端缓存或 Pinia 内的长期状态不应强行套这个 hook。',
    type: '别用',
    default: '共享状态',
  },
  {
    name: '初始值要求',
    description: 'cb 应返回新的对象或数组，不要直接复用模块级共享对象，否则 reset 只能回到污染后的引用。',
    type: '别踩',
    default: '新对象',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="useResettableState"
      lead=""
      eyebrow="常用工具"
    >
      <template #lead>
        <code class="docs-inline-code">useResettableState</code>
        用来定义一个
        <code class="docs-inline-code">可重置</code>
        的响应式状态，重点解决
        <code class="docs-inline-code">弹层重开残留旧值</code>
        和
        <code class="docs-inline-code">回填前需要先清场</code>
        这两类高频问题。
        它本质上是局部临时状态工具，不是通用状态管理方案。
      </template>
    </DocPageHeader>

    <BaseCard title="什么时候该用">
      <ul class="docs-page-list">
        <li>当一个状态需要频繁回到干净初始值时，优先用这个 hook，而不是手写一组字段逐个清空。</li>
        <li>它尤其适合对象、数组这类引用类型状态，因为 reset 时会重新执行工厂函数，避免多个场景共享同一份初始引用。</li>
        <li>项目里的默认打开顺序是 <code class="docs-inline-code">open</code> 前先 <code class="docs-inline-code">resetState()</code>，再决定是否回填编辑数据或切换默认 tab。</li>
      </ul>
    </BaseCard>

    <BaseCard title="典型场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <DemoBlock
      title="新增 / 编辑弹框"
      description="这是项目里最常见的使用方式：新增时直接 reset，编辑时先 reset 再回填，避免上一次弹框状态串到下一次。"
      source-hint="src/modules/docs/tools/use-resettable-state/demos/basic.vue"
      :source="DemoUseResettableStateBasicSource"
    >
      <DemoUseResettableStateBasic />
    </DemoBlock>

    <DemoBlock
      title="源码参考"
      description="这个 hook 很轻，阅读重点放在“为什么 reset 要重新执行工厂函数”，不需要把它理解成复杂状态库。"
      source-hint="src/hooks/useResettableState.ts"
      language-label="TypeScript"
      :source="UseResettableStateSource"
    />

    <ComponentApiTable title="核心 API" :items="apiItems" />
    <ComponentApiTable title="使用边界" :items="boundaryItems" />
  </div>
</template>

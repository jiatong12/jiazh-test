<script setup lang="ts">
import UseLoadingDelaySource from '@/hooks/useLoadingDelay.ts?raw'
import UseRequestSource from '@/hooks/useRequest.ts?raw'
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const featureItems = [
  {
    title: '默认值回退',
    description: '请求失败或结果为空时可回退到默认值，避免页面继续残留上一次成功结果。',
    meta: 'Default',
  },
  {
    title: '后发覆盖前发',
    description: '多次请求并发时，只保留最后一次请求结果，前面的结果会被丢弃。',
    meta: 'Concurrency',
  },
  {
    title: '双 loading 语义',
    description: '区分 immediateLoading 和 delayLoading，方便做更克制的 loading 体验。',
    meta: 'Loading',
  },
]

const apiItems = [
  {
    name: 'request',
    description: '请求函数。支持通过 MaybeRef 传入，内部在 send 时执行。',
    type: '(...args) => Promise<R>',
    default: '--',
  },
  {
    name: 'defaultValue',
    description: '可选默认值工厂函数。首次加载前、请求失败后或结果为空时可回退到该默认值。',
    type: '() => R',
    default: '--',
  },
  {
    name: 'opts.loadingDelay',
    description: '延迟显示 delayLoading 的时间。请求足够快时，可避免 loading 闪动。',
    type: 'number',
    default: '0',
  },
  {
    name: 'opts.loadingKeep',
    description: 'delayLoading 显示后的最短保持时间，避免 loading 一闪而过。',
    type: 'number',
    default: '300',
  },
]

const stateItems = [
  {
    name: 'result',
    description: '当前请求结果。不是 ref，而是 reactive 对象上的属性，使用时不要直接解构后丢失响应式。',
    type: 'R | undefined',
    default: '--',
  },
  {
    name: 'loading / immediateLoading / delayLoading',
    description: '分别表示总体加载、立即加载和延迟加载状态，适合区分骨架屏与按钮 loading 等场景。',
    type: 'boolean',
    default: '--',
  },
  {
    name: 'send',
    description: '触发请求入口。新的 send 会覆盖旧请求结果，适合搜索输入、列表切换这类场景。',
    type: '(params?) => Promise<R>',
    default: '--',
  },
  {
    name: 'setResult / setResultToDefaultValue',
    description: '手动设置结果或重置为默认值，适合本地修正数据和失败兜底。',
    type: 'function',
    default: '--',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="useRequest"
      lead=""
      eyebrow="常用工具"
    >
      <template #lead>
        <code class="docs-inline-code">useRequest</code>
        是项目里的统一请求状态封装。
        它的价值不只是减少
        <code class="docs-inline-code">loading / data / error</code>
        样板代码，更重要的是统一了
        <code class="docs-inline-code">默认值回退</code>
        、
        <code class="docs-inline-code">后发覆盖前发</code>
        和
        <code class="docs-inline-code">延迟 loading</code>
        这些行为语义。
      </template>
    </DocPageHeader>

    <BaseCard title="核心能力">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用建议">
      <ul class="docs-page-list">
        <li>适合需要统一维护请求状态的局部模块，例如列表、弹层详情、切换 tab 后的子数据加载。</li>
        <li>如果你会频繁触发同一请求，例如搜索输入、筛选切换，用它比手写多个 ref 更稳，因为它默认只保留最后一次结果。</li>
        <li>返回对象是 reactive，不建议直接解构；若确实需要解构，先用 <code class="docs-inline-code">toRefs</code>。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="源码参考"
      description="阅读重点建议放在 send 的覆盖策略、默认值回退和 loading 状态设计，不必把它当成通用第三方请求库理解。"
      source-hint="src/hooks/useRequest.ts + src/hooks/useLoadingDelay.ts"
      language-label="TypeScript"
      :source="`${UseRequestSource}\n\n/* useLoadingDelay.ts */\n${UseLoadingDelaySource}`"
    />

    <ComponentApiTable title="初始化参数" :items="apiItems" />
    <ComponentApiTable title="状态与方法" :items="stateItems" />
  </div>
</template>

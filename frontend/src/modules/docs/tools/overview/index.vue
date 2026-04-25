<script setup lang="ts">
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const toolItems = [
  {
    title: 'useHandleConfirm',
    description: '统一二次确认、按钮 loading 和成功提示，适合独立按钮、批量操作和非 rowActions 场景。',
    meta: 'Hook',
    path: '/docs/tools/use-handle-confirm',
  },
  {
    title: 'useRequest',
    description: '统一请求状态、默认值回退、延迟 loading 和“后发覆盖前发”的请求行为。',
    meta: 'Hook',
    path: '/docs/tools/use-request',
  },
  {
    title: 'useResettableState',
    description: '统一本地临时状态的重置时机，适合新增、编辑、详情弹层和切换记录前的清场。',
    meta: 'State',
    path: '/docs/tools/use-resettable-state',
  },
  {
    title: '缓存使用约定',
    description: '统一通过 cache 封装读写 localStorage，避免业务代码直接操作浏览器存储。',
    meta: 'Cache',
    path: '/docs/tools/cache-usage',
  },
  {
    title: 'useDownload',
    description: '统一文件下载提示、Blob 处理和文件落盘逻辑，适合导出、模板下载等场景。',
    meta: 'Download',
    path: '/docs/tools/use-download',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="常用工具"
      lead=""
      eyebrow="常用工具"
    >
      <template #lead>
        这里收口的是项目里
        <code class="docs-inline-code">高频使用</code>
        且
        <code class="docs-inline-code">容易写散</code>
        的 hooks 与 utils。
        它们和组件文档、开发指南不同，更关注“什么时候该用这个工具”和“哪些场景不要重复造轮子”。
      </template>
    </DocPageHeader>

    <BaseCard title="当前收录">
      <DocFeatureGrid :items="toolItems" :columns="2" />
    </BaseCard>

    <BaseCard title="阅读建议">
      <ul class="docs-page-list">
        <li>遇到二次确认、请求状态、临时状态重置、下载或缓存问题时，优先看这里的工具文档，而不是在业务页重复封装一套。</li>
        <li>工具文档默认只覆盖项目约定的使用边界和注意事项，不会替代组件文档或开发指南。</li>
        <li>如果一个工具已经有明确默认口径，业务代码里优先复用它，而不是再引入零散的 util 写法。</li>
      </ul>
    </BaseCard>
  </div>
</template>

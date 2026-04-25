<script setup lang="ts">
import UseDownloadSource from '@/hooks/useDownload.ts?raw'
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const featureItems = [
  {
    title: '统一下载提示',
    description: '默认在下载前给出提醒，适合导出数据量大、文件生成时间不稳定的场景。',
    meta: 'Notify',
  },
  {
    title: '统一 Blob 落盘',
    description: '统一处理 Blob、createObjectURL 和浏览器下载触发，不需要业务页重复写 a 标签逻辑。',
    meta: 'Blob',
  },
  {
    title: '浏览器兼容兜底',
    description: '内置对 msSaveOrOpenBlob 的兼容判断，避免每次下载都重复补兼容分支。',
    meta: 'Compat',
  },
]

const apiItems = [
  {
    name: 'api',
    description: '必填异步函数，返回文件二进制数据或可直接构造 Blob 的结果。',
    type: '() => Promise<any>',
    default: '--',
  },
  {
    name: 'fileName',
    description: '下载文件名，建议显式传入，避免浏览器落成无意义默认名称。',
    type: 'string',
    default: '--',
  },
  {
    name: 'isNotify',
    description: '是否在下载前显示提示通知。数据量小、体验要求克制时可关闭。',
    type: 'boolean',
    default: 'true',
  },
]

const ruleItems = [
  {
    name: '普通导出 / 模板下载',
    description: '推荐统一使用 useDownload，避免每页重复写 Blob 下载逻辑。',
    type: '推荐场景',
    default: '推荐',
  },
  {
    name: '下载失败处理',
    description: '当前实现只做基础 catch 日志，如需更强提示策略，应在上层请求或业务逻辑补充。',
    type: '注意项',
    default: '按需增强',
  },
  {
    name: '接口请求本身',
    description: 'useDownload 负责文件落盘，不替代请求封装；请求状态和错误提示仍由上层逻辑决定。',
    type: '边界',
    default: '与请求层分离',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="useDownload"
      lead=""
      eyebrow="常用工具"
    >
      <template #lead>
        <code class="docs-inline-code">useDownload</code>
        负责把“拿到文件数据之后怎么安全、统一地触发下载”收口起来。
        它不替代请求层，而是统一文件落盘、下载提示和基础浏览器兼容处理。
      </template>
    </DocPageHeader>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用建议">
      <ul class="docs-page-list">
        <li>导出 Excel、下载模板、下载附件这类场景，优先统一走 <code class="docs-inline-code">useDownload</code>，避免每页重复写下载逻辑。</li>
        <li>请求本身的接口调用、错误提示和权限判断仍然由上层负责，hook 只处理文件落盘行为。</li>
        <li>下载文件名建议显式传入，尤其是导出类接口，不要依赖浏览器默认命名。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="源码参考"
      description="源码不长，但足够收口浏览器下载的重复逻辑。阅读重点建议放在 Blob 创建、临时链接触发和通知策略。"
      source-hint="src/hooks/useDownload.ts"
      language-label="TypeScript"
      :source="UseDownloadSource"
    />

    <ComponentApiTable title="参数" :items="apiItems" />
    <ComponentApiTable title="使用边界" :items="ruleItems" />
  </div>
</template>

<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import CacheIndexSource from '@/utils/cache/index.ts?raw'
import StorageCacheSource from '@/utils/cache/storageCache.ts?raw'
import '@/modules/docs/styles.scss'

const featureItems = [
  {
    title: '统一前缀',
    description: '缓存键统一走项目命名空间前缀，避免同域名下和其他系统互相污染。',
    meta: 'Prefix',
  },
  {
    title: '统一过期策略',
    description: 'setCache / getCache 已内置过期时间语义，不需要业务页手写一套时间戳逻辑。',
    meta: 'Expire',
  },
  {
    title: '禁止直接 localStorage',
    description: '业务代码优先通过 cache 封装读写，避免把浏览器存储细节散落在页面里。',
    meta: 'Rule',
  },
]

const apiItems = [
  {
    name: 'setCache',
    description: '设置缓存，支持传入过期时间和 raw 模式。',
    type: '(key, value, isRaw?, expire?) => void',
    default: '--',
  },
  {
    name: 'getCache',
    description: '读取缓存。若已过期，会自动清理并返回默认空值。',
    type: '<T>(key, isRaw?) => T',
    default: '--',
  },
  {
    name: 'removeCache / clearCache',
    description: '删除单个缓存或清理当前前缀下全部缓存，避免误删同域名其他系统数据。',
    type: 'function',
    default: '--',
  },
  {
    name: 'clearLogin / initCacheVersion',
    description: '分别用于登录态缓存清理和版本更新后的缓存初始化。',
    type: 'function',
    default: '--',
  },
]

const ruleItems = [
  {
    name: '业务页直接 localStorage',
    description: '不推荐。优先复用 cache 封装，必要时再由更底层 storageCache 承担实现细节。',
    type: '禁用项',
    default: '--',
  },
  {
    name: '长期持久化状态',
    description: '优先考虑 Pinia + cache 封装配合，不建议在多个页面各自维护缓存键。',
    type: '推荐项',
    default: '统一收口',
  },
  {
    name: '用户相关缓存',
    description: '登录态切换时优先使用 clearLogin，而不是手动 remove 多个零散 key。',
    type: '推荐项',
    default: 'clearLogin',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="缓存使用约定"
      lead=""
      eyebrow="常用工具"
    >
      <template #lead>
        项目里关于浏览器存储的默认口径是：
        <code class="docs-inline-code">业务代码不要直接操作 localStorage</code>
        。
        统一通过 cache 封装读写，能保证命名空间、过期时间和登录态清理语义都收在一处。
      </template>
    </DocPageHeader>

    <BaseCard title="核心原则">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用建议">
      <ul class="docs-page-list">
        <li>如果页面只是临时状态，不要急着落缓存；只有确实需要跨刷新保留时，再考虑使用 cache。</li>
        <li>同一类缓存键尽量由模块或 store 统一管理，不要在多个页面零散使用相同语义的 key。</li>
        <li>如果你发现业务代码里直接出现 <code class="docs-inline-code">localStorage.setItem</code> / <code class="docs-inline-code">getItem</code>，优先考虑替换成这里的封装。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="源码参考"
      description="阅读重点建议放在命名空间前缀、过期时间封装和 clearLogin / initCacheVersion 这些项目级语义上。"
      source-hint="src/utils/cache/index.ts + src/utils/cache/storageCache.ts"
      language-label="TypeScript"
      :source="`${CacheIndexSource}\n\n/* storageCache.ts */\n${StorageCacheSource}`"
    />

    <ComponentApiTable title="常用方法" :items="apiItems" />
    <ComponentApiTable title="使用边界" :items="ruleItems" />
  </div>
</template>

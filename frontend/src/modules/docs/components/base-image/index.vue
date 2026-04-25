<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseImageBasic from './demos/basic.vue'
import DemoBaseImageBasicSource from './demos/basic.vue?raw'
import DemoBaseImageDataSource from './demos/data.ts?raw'
import DemoBaseImageTable from './demos/table.vue'
import DemoBaseImageTableSource from './demos/table.vue?raw'
import '@/modules/docs/styles.scss'

const imageApi = [
  {
    name: 'src',
    description: '图片地址，支持 null / undefined，组件内部会统一兜底为空字符串。',
    type: 'string | null | undefined',
    default: '\'\'',
  },
  {
    name: 'width / height',
    description: '支持 number 或 string。传 number 时会自动补 px。',
    type: 'number | string',
    default: '200 / 200',
  },
  {
    name: '默认行为',
    description: '内部固定 fit=cover，并自动把当前 src 作为预览列表；加载失败时显示项目内置占位图标。',
    type: '--',
    default: '--',
  },
]

const featureItems = [
  { title: '单图预览', description: '卡片图、封面图、详情图等单图展示场景。', meta: 'Preview' },
  { title: '失败占位', description: '图片地址失效时自动显示统一的失败占位图标。', meta: 'Fallback' },
  { title: '表格图片列', description: '表格里的缩略图、头像列可以直接复用 BaseImage。', meta: 'Table' },
]

const basicSource = `${DemoBaseImageBasicSource}\n\n/* data.ts */\n${DemoBaseImageDataSource}`
const tableSource = `${DemoBaseImageTableSource}\n\n/* data.ts */\n${DemoBaseImageDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseImage"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseImage</code>
        是一个轻封装，主要统一了
        <code class="docs-inline-code">宽高入参</code>
        、
        <code class="docs-inline-code">失败占位</code>
        和
        <code class="docs-inline-code">点击预览</code>
        这三件后台项目里最常重复的事情。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>适合单张图片展示、表格缩略图、详情封面图等轻量图片场景。</li>
        <li>如果需要复杂裁剪、上传或批量管理，优先使用 BaseUpload / BaseCutterImage，而不是继续堆 BaseImage。</li>
        <li>文档重点说明项目封装的默认行为，不重复展开 ElImage 的全部原生配置。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="基础展示"
      description="同时演示默认尺寸、自定义比例和失败占位。"
      source-hint="src/modules/docs/components/base-image/demos/basic.vue + data.ts"
      :source="basicSource"
    >
      <DemoBaseImageBasic />
    </DemoBlock>

    <DemoBlock
      title="表格中的图片列"
      description="表格缩略图列可以直接复用 BaseImage，不需要每列都手写 ElImage 和失败占位。"
      source-hint="src/modules/docs/components/base-image/demos/table.vue + data.ts"
      :source="tableSource"
    >
      <DemoBaseImageTable />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>只要是单图展示，优先使用 BaseImage，而不是每个页面都重复写 ElImage 的 error slot。</li>
        <li>需要固定视觉比例时直接传 width / height，避免再额外包一层专用样式容器。</li>
        <li>BaseImage 更适合展示，不承担上传、裁剪、排序等编辑职责。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="扩展属性与默认约定" :items="imageApi" />
  </div>
</template>

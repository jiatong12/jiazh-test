<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseUploadDataSource from './demos/data.ts?raw'
import DemoBaseUploadFiles from './demos/files.vue'
import DemoBaseUploadFilesSource from './demos/files.vue?raw'
import DemoBaseUploadForm from './demos/form.vue'
import DemoBaseUploadFormSource from './demos/form.vue?raw'
import DemoBaseUploadImages from './demos/images.vue'
import DemoBaseUploadImagesSource from './demos/images.vue?raw'
import '@/modules/docs/styles.scss'

const uploadApi = [
  {
    name: 'api',
    description: '上传接口函数。单图、多图、附件上传都要求外部传入，组件内部只负责流程与反馈。',
    type: '(params) => Promise<any>',
    default: '--',
  },
  {
    name: 'disabled',
    description: '显式禁用上传；若组件位于 ElForm 且父表单 disabled，也会自动禁用。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'fileSize / fileType / limit',
    description: '分别控制文件大小、文件类型和数量限制；不同上传组件支持的默认值略有区别。',
    type: 'number / string[] / number',
    default: '--',
  },
  {
    name: 'drag / width / height / borderRadius',
    description: '控制上传区域的交互和外观尺寸。',
    type: 'boolean / string / string / string',
    default: '--',
  },
]

const differenceApi = [
  {
    name: 'BaseUploadImage',
    description: '单图上传，modelValue 为 string，适合头像、封面图、主图。',
    type: 'string',
    default: '--',
  },
  {
    name: 'BaseUploadImages',
    description: '多图上传，modelValue 为 string[]，支持 limit 和图片预览列表。',
    type: 'string[]',
    default: '--',
  },
  {
    name: 'BaseUploadFiles',
    description: '附件上传，modelValue 为文件对象数组，支持下载和拖拽排序。',
    type: 'UploadUserFileItem[]',
    default: '--',
  },
]

const featureItems = [
  { title: '单图上传', description: '头像、封面图、详情头图等场景。', meta: 'Image' },
  { title: '多图上传', description: '相册、截图集合、商品详情图等场景。', meta: 'Images' },
  { title: '附件上传', description: '文档、视频、压缩包等附件管理场景。', meta: 'Files' },
]

const imagesSource = `${DemoBaseUploadImagesSource}\n\n/* data.ts */\n${DemoBaseUploadDataSource}`
const filesSource = `${DemoBaseUploadFilesSource}\n\n/* data.ts */\n${DemoBaseUploadDataSource}`
const formSource = `${DemoBaseUploadFormSource}\n\n/* data.ts */\n${DemoBaseUploadDataSource}`
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseUpload"
      lead=""
    >
      <template #lead>
        上传体系在项目里拆成了
        <code class="docs-inline-code">BaseUploadImage</code>
        、
        <code class="docs-inline-code">BaseUploadImages</code>
        和
        <code class="docs-inline-code">BaseUploadFiles</code>
        三个入口。它们共用上传反馈和表单联动逻辑，但分别面向单图、多图和附件场景。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>上传接口始终由业务侧传入，组件不内置具体后端实现。</li>
        <li>位于表单中时，上传成功或删除后会自动触发表单校验。</li>
        <li>文档重点说明三者分工和项目默认行为，不重复展开 ElUpload 的所有原生配置。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="单图与多图上传"
      description="同一示例展示单图上传、头像上传和多图上传的典型写法。"
      source-hint="src/modules/docs/components/base-upload/demos/images.vue + data.ts"
      :source="imagesSource"
    >
      <DemoBaseUploadImages />
    </DemoBlock>

    <DemoBlock
      title="附件上传"
      description="附件上传适合文档、视频、压缩包等场景，组件内部已统一了图标、下载和上传反馈。"
      source-hint="src/modules/docs/components/base-upload/demos/files.vue + data.ts"
      :source="filesSource"
    >
      <DemoBaseUploadFiles />
    </DemoBlock>

    <DemoBlock
      title="表单联动"
      description="上传组件位于 ElForm 中时，会自动接入校验状态，无需业务页手动补 validateField。"
      source-hint="src/modules/docs/components/base-upload/demos/form.vue + data.ts"
      :source="formSource"
    >
      <DemoBaseUploadForm />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="最佳实践">
      <ul class="docs-page-list">
        <li>主图、头像类单值字段优先使用 BaseUploadImage；图片数组字段优先使用 BaseUploadImages。</li>
        <li>需要文件列表、下载和排序时使用 BaseUploadFiles，不要再把附件场景硬塞进图片上传组件。</li>
        <li>上传接口只负责返回结果，页面不要重复维护上传成功提示和表单校验联动。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="共同扩展属性" :items="uploadApi" />
    <ComponentApiTable title="组件差异" :items="differenceApi" />
  </div>
</template>

<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoBaseTabsBasic from './demos/basic.vue'
import DemoBaseTabsBasicSource from './demos/basic.vue?raw'
import '@/modules/docs/styles.scss'

const tabsApi = [
  {
    name: 'lazy',
    description: '给所有 BaseTabPane 提供默认 lazy 值。项目里默认开启，适合详情页、抽屉页减少首屏无效渲染。',
    type: 'boolean',
    default: 'true',
  },
]

const tabPaneApi = [
  {
    name: 'lazy',
    description: '单个 TabPane 可覆盖父级 BaseTabs 的 lazy 默认值；未传时继承父级。',
    type: 'boolean',
    default: '继承 BaseTabs',
  },
  {
    name: 'name',
    description: '当前页签唯一标识。BaseTabs 会收集这些 name，并用于校验当前 modelValue 是否仍有效。',
    type: 'string',
    default: '--',
  },
]

const tabsBehaviorApi = [
  {
    name: '无 v-model 时禁用切换',
    description: '如果没有提供 onUpdate:modelValue，头部点击切换会被禁用，避免出现“看起来能切，其实状态不可控”的情况。',
    type: '项目约定',
    default: '自动生效',
  },
  {
    name: '默认 lazy = true',
    description: '详情抽屉、编辑抽屉里经常会放多个复杂页签，默认懒加载更符合后台场景。',
    type: '项目约定',
    default: '自动生效',
  },
]

const tabsExposeApi = [
  {
    name: 'validateAndSetModelValue()',
    description: '当前激活页签已不存在时，自动切到第一个可用页签。适合动态 Tab 或按权限裁剪页签后的兜底处理。',
    type: '() => void',
    default: '--',
  },
]

const tabsSlotApi = [
  {
    name: 'BaseTabs.default',
    description: '通常直接放 BaseTabPane 列表。',
    type: '--',
    default: '--',
  },
  {
    name: 'BaseTabPane.default',
    description: '单个页签主体内容。项目里常与 h-full、overflow-y-auto 组合，让滚动落在当前页签内。',
    type: '--',
    default: '--',
  },
]

const featureItems = [
  { title: '详情抽屉', description: '一个主体拆成多个信息模块时，Tabs 是最常见承载方式。', meta: 'Detail' },
  { title: '编辑抽屉', description: '多分区编辑时，每个 Tab 内独立保存会比一个超长表单更清晰。', meta: 'Edit' },
  { title: '动态页签', description: '页签会根据权限、记录类型或配置变化时，validateAndSetModelValue 很有用。', meta: 'Dynamic' },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="BaseTabs"
      lead=""
    >
      <template #lead>
        <code class="docs-inline-code">BaseTabs</code>
        /
        <code class="docs-inline-code">BaseTabPane</code>
        重点补的是项目级页签管理语义：默认懒加载、无受控值时禁用切换，以及动态页签的兜底校正。
      </template>
    </DocPageHeader>

    <BaseCard title="组件定位">
      <ul class="docs-page-list">
        <li>适合详情抽屉、编辑抽屉、多模块信息页这类“一个主体拆多个分区”的场景。</li>
        <li>默认更偏后台页使用口径，不是去重新包装所有 Tabs 原生能力。</li>
        <li>与高度自适应组合时，通常写成 <code class="docs-inline-code">BaseTabs class=&quot;h-full&quot;</code> + <code class="docs-inline-code">BaseTabPane class=&quot;h-full overflow-y-auto&quot;</code>。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="动态页签校正"
      description="这个示例聚焦 BaseTabs 额外暴露的 validateAndSetModelValue。动态删掉当前页签后，可以把激活值自动校正到第一个可用 Tab。"
      source-hint="src/modules/docs/components/base-tabs/demos/basic.vue"
      :source="DemoBaseTabsBasicSource"
    >
      <DemoBaseTabsBasic />
    </DemoBlock>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用约定">
      <ul class="docs-page-list">
        <li>只要主体是 Tabs，就优先让滚动落在每个 <code class="docs-inline-code">BaseTabPane</code> 内，而不是整个外层一起滚。</li>
        <li>如果某个页签内容只在挂载时拉取数据，切换记录时可结合 <code class="docs-inline-code">:key</code> 强制重建。</li>
        <li>动态裁剪页签后，如果当前激活值可能失效，记得调用 <code class="docs-inline-code">validateAndSetModelValue()</code> 做一次兜底。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="BaseTabs 扩展属性" :items="tabsApi" />
    <ComponentApiTable title="BaseTabPane 扩展属性" :items="tabPaneApi" />
    <ComponentApiTable title="项目默认行为" :items="tabsBehaviorApi" />
    <ComponentApiTable title="插槽" :items="tabsSlotApi" />
    <ComponentApiTable title="Ref 暴露方法" :items="tabsExposeApi" />
  </div>
</template>

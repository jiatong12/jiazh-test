<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const sceneItems = [
  {
    title: '轻量新增 / 编辑',
    description: '字段少、闭环短的场景优先 Dialog，组件内部维护 visible 和提交状态，并暴露 open 或 openAdd / openEdit。',
    meta: 'Dialog',
  },
  {
    title: '信息密度高的表单',
    description: '字段多或需要分块时优先 Drawer，给表单更稳定的横向空间和滚动容器。',
    meta: 'Drawer',
  },
  {
    title: '详情 + Tabs',
    description: '详情量大且存在成员、日志、跟进记录等附属信息时，优先 Drawer + Tabs 拆分模块。',
    meta: 'Detail',
  },
  {
    title: '复杂流程',
    description: '步骤长、区域联动多或 mode 分支多时，直接拆成独立页面，不在弹层里继续堆逻辑。',
    meta: 'Flow',
  },
]

const ownershipApi = [
  {
    name: '父页面',
    description: '只负责入口、列表交互、打开弹层和成功后刷新，不负责维护弹层内部 visible、表单状态和回填细节。',
    type: '职责',
    default: '轻量',
  },
  {
    name: '弹层组件',
    description: '内部维护 visible、submitLoading、本地表单状态和数据回填，并通过 expose 暴露 open / openAdd / openEdit。',
    type: '职责',
    default: '内聚',
  },
  {
    name: 'open(recordId | payload)',
    description: '作为统一打开入口。编辑和详情场景可在 open 内完成 reset、回填和默认 tab 重置。',
    type: '打开方式',
    default: '推荐',
  },
  {
    name: 'useResettableState',
    description: '用于新增打开前重置、编辑回填前清场、详情切换记录时恢复初始值；具体用法统一收口在常用工具文档。',
    type: '状态恢复',
    default: '推荐',
  },
]

const callbackApi = [
  {
    name: '业务模块弹层',
    description: '优先使用 emit，例如 addSuccess / editSuccess，让父页面只处理刷新和收尾动作。',
    type: '推荐',
    default: 'emit',
  },
  {
    name: '通用 / 平台级弹层',
    description: '在多入口复用场景下，可允许 open({ ...payload, onSuccess }) 传回调，减少来源分支判断。',
    type: '推荐',
    default: '按需',
  },
  {
    name: '新增 / 编辑共用组件',
    description: '只有字段和提交流程差异较小时才共用一个组件；差异大时应拆成两个组件，不在提交逻辑里堆 mode 分支。',
    type: '拆分边界',
    default: '差异大就拆',
  },
  {
    name: '关闭策略',
    description: '默认关闭只负责收起弹层；真正的状态恢复在下次 open 前完成，这样可避免关闭时多处串联副作用。',
    type: '关闭恢复',
    default: 'open 前 reset',
  },
]

const antiPatternApi = [
  {
    name: '父页面直接维护子弹层全部状态',
    description: '会让 visible、表单数据、loading 和回填逻辑散在父页面里，后续复用极差。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '一个组件用大量 mode 分支兼容所有场景',
    description: '当新增、编辑、详情、审批都塞进同一个弹层组件时，通常说明已经超过单组件可维护范围。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '先打开再慢慢清状态',
    description: '会出现闪动和旧数据残留。推荐顺序是 reset -> 回填 -> visible = true。',
    type: '不推荐',
    default: '--',
  },
  {
    name: 'Tabs 详情沿用上一次 activeName',
    description: '重新打开详情时应回到默认 tab，避免用户看到上一次停留的位置而误判内容。',
    type: '不推荐',
    default: '--',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="弹层生命周期与回调"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        这篇文档会专门收口
        <code class="docs-inline-code">BaseDialog</code>
        和
        <code class="docs-inline-code">BaseDrawer</code>
        在业务模块中的协作边界，避免 visible、回填、回调和关闭恢复逻辑继续散落在页面里。
      </template>
    </DocPageHeader>

    <BaseCard title="典型场景">
      <DocFeatureGrid :items="sceneItems" :columns="2" />
    </BaseCard>

    <BaseCard title="默认原则">
      <ul class="docs-page-list">
        <li>父页面只保留“打开谁、成功后怎么刷新”这类入口职责，弹层内部保持状态和提交逻辑内聚。</li>
        <li>打开顺序优先遵循 <code class="docs-inline-code">reset -> 回填 / 设置默认状态 -> visible = true</code>，不要先打开再补救旧状态。</li>
        <li>涉及本地临时状态恢复时，优先复用 <code class="docs-inline-code">useResettableState</code>，不要在每个弹层里各自手写一组清空逻辑。</li>
        <li>详情抽屉重新打开时，默认 tab、当前主键和依赖当前记录的子模块都应一起重置，避免沿用上一次查看状态。</li>
      </ul>
    </BaseCard>

    <BaseCard title="什么时候该拆组件">
      <ul class="docs-page-list">
        <li>如果新增和编辑只是初始值、提交接口不同，共用组件通常可以接受。</li>
        <li>如果字段差异明显、校验差异大、提交前后流程不同，应该直接拆成两个组件。</li>
        <li>如果一个弹层里开始同时承担详情查看、编辑提交、审批流转等多种职责，应优先改为独立页面。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="父子职责边界" :items="ownershipApi" />
    <ComponentApiTable title="回调与拆分规则" :items="callbackApi" />
    <ComponentApiTable title="常见反模式" :items="antiPatternApi" />
  </div>
</template>

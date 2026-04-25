<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const layerItems = [
  {
    title: '变量层',
    description: '颜色、文本、背景、边框等需要跟随主题变化的值，优先落在 var.scss 或 Element Plus 变量体系。',
    meta: 'Variables',
  },
  {
    title: '公共类层',
    description: '通用布局、高度传递、间距和基础工具类，优先放在 common.scss，避免每页重复造轮子。',
    meta: 'Common',
  },
  {
    title: '页面样式层',
    description: '只有业务专属结构和视觉差异才写页面 SCSS，并且必须带页面根类命名空间。',
    meta: 'Page SCSS',
  },
]

const sourceApi = [
  {
    name: 'src/styles/var.scss',
    description: '项目主题变量入口。优先定义或复用 --zv-* 变量，并通过 Element Plus 变量衔接主题色与文本色。',
    type: '变量来源',
    default: '优先',
  },
  {
    name: 'src/styles/common.scss',
    description: '项目通用布局和工具类入口，包含 h-full、flex-column-layout、flex-height-fill、间距类等。',
    type: '公共样式',
    default: '优先',
  },
  {
    name: 'src/styles/element-plus-dark.scss',
    description: '暗黑模式下的 Element Plus 覆盖入口。需要主题适配时，优先在这里或 var.scss 统一处理。',
    type: '暗黑覆盖',
    default: '集中处理',
  },
  {
    name: '页面内 SCSS',
    description: '仅承载页面专属布局、装饰和局部状态样式，不能代替全局变量和公共类职责。',
    type: '局部样式',
    default: '按需',
  },
]

const ruleApi = [
  {
    name: '主题色 / 文字 / 背景 / 边框',
    description: '需要随主题变化的值必须使用 CSS 变量，优先 --zv-*，其次 --el-*，不要直接写死颜色。',
    type: '推荐',
    default: '变量',
  },
  {
    name: '视觉强调色',
    description: '允许局部使用固定色值，但应收敛为页面局部变量，例如 --accent-color，避免散落多个魔法值。',
    type: '推荐',
    default: '局部变量',
  },
  {
    name: '布局与高度',
    description: '优先使用 common.scss 里的通用类，不要把 flex、高度传递和滚动规则重新写一遍。',
    type: '推荐',
    default: 'common.scss',
  },
  {
    name: '暗黑适配',
    description: '统一在全局变量或主题覆盖文件处理，不在业务组件内写 html.dark 分支。',
    type: '推荐',
    default: '全局处理',
  },
]

const antiPatternApi = [
  {
    name: '业务页面直接写 html.dark',
    description: '会把主题逻辑散落到业务组件里，后续维护和统一调色成本很高。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '把 UnoCSS 当原子样式框架',
    description: '本项目只把 UnoCSS 用于图标类，不应生成 flex、gap-4、text-xs 这类原子类布局代码。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '页面样式没有根命名空间',
    description: '平铺类选择器很容易和其他页面互相污染，也不利于后续维护。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '正文 / 卡片底色 / 边框写死颜色',
    description: '这些是可读性核心颜色，必须跟随主题切换，不能依赖固定色值。',
    type: '不推荐',
    default: '--',
  },
]

const checklistApi = [
  {
    name: '先找公共类',
    description: '写页面前先确认 common.scss 是否已有对应布局能力，再决定是否需要新增页面 SCSS。',
    type: '检查项',
    default: 'common.scss',
  },
  {
    name: '先判断颜色性质',
    description: '先区分它是“主题相关颜色”还是“固定强调色”，再决定用全局变量还是局部变量。',
    type: '检查项',
    default: '变量优先',
  },
  {
    name: '页面 SCSS 要带根类',
    description: '例如 .product-manage { ... }，内部再按父子结构嵌套，避免无命名空间选择器。',
    type: '检查项',
    default: '必需',
  },
  {
    name: '图标与样式分开',
    description: 'UnoCSS 用于 i-mdi:* / i-ep:* / i-icon:* 图标类，布局和间距仍走项目样式体系。',
    type: '检查项',
    default: '图标专用',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="样式与主题约定"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        这篇文档只回答一个问题：
        <code class="docs-inline-code">这个项目里的样式应该写在哪里</code>
        。
        规则核心是变量优先、公共类优先、页面样式最后兜底，并把暗黑模式和主题适配统一收口到全局样式层。
      </template>
    </DocPageHeader>

    <BaseCard title="推荐分层">
      <DocFeatureGrid :items="layerItems" :columns="3" />
    </BaseCard>

    <BaseCard title="默认原则">
      <ul class="docs-page-list">
        <li>业务页面和组件尽量不从零写样式，优先复用 <code class="docs-inline-code">Base*</code> 组件、Element Plus 和 <code class="docs-inline-code">common.scss</code> 工具类。</li>
        <li>需要随主题变化的颜色必须变量化，优先使用 <code class="docs-inline-code">--zv-*</code>，其次使用 <code class="docs-inline-code">--el-*</code>。</li>
        <li>业务页面确实需要写 SCSS 时，必须以页面根类为命名空间，再在内部按父子结构嵌套，不写无命名空间的平铺选择器。</li>
      </ul>
    </BaseCard>

    <BaseCard title="什么时候允许魔法值">
      <ul class="docs-page-list">
        <li>允许使用固定色值的场景主要是视觉强调色，例如卡片强调条、图标底色、插画装饰色。</li>
        <li>即便使用固定色值，也建议先收敛成局部变量，例如 <code class="docs-inline-code">--accent-color</code>，不要把同一个色值散落在多个选择器里。</li>
        <li>正文、卡片底色、边框、交互状态色这类可读性核心颜色，不属于允许写死的范围。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="样式落点" :items="sourceApi" />
    <ComponentApiTable title="推荐规则" :items="ruleApi" />
    <ComponentApiTable title="落地检查清单" :items="checklistApi" />
    <ComponentApiTable title="常见反模式" :items="antiPatternApi" />
  </div>
</template>

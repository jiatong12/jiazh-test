<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const sceneItems = [
  {
    title: '页面入口收口',
    description: '菜单标题、图标、排序、权限和页面入口默认都收口在模块目录下的 _meta.ts，不再拆成多处手工维护。',
    meta: 'Meta',
  },
  {
    title: '显示与注册分离',
    description: 'isHide 只控制菜单是否展示，不负责阻止动态路由注册；路由是否注册需要单独配置。',
    meta: 'Display',
  },
  {
    title: '整棵子树忽略',
    description: 'ignoreSelfAndChildren 用于忽略当前节点及全部子节点的菜单和路由注册，适合临时下线模块或示例裁剪。',
    meta: 'Subtree',
  },
  {
    title: '分组节点同样生效',
    description: '该字段既可配在页面节点，也可配在 isGroup 分组节点；配在分组上时，整组子页面都会一起失效。',
    meta: 'Group',
  },
]

const metaApi = [
  {
    name: 'title / icon / order',
    description: '菜单展示名称、图标和排序默认仍在 _meta.ts 中声明，保持目录、菜单和页面入口一处维护。',
    type: '基础配置',
    default: '必填 / 推荐',
  },
  {
    name: 'priv',
    description: '模块或页面级权限继续使用 priv，由统一权限工具和菜单过滤逻辑接管。',
    type: '权限配置',
    default: '按需',
  },
  {
    name: 'isHide',
    description: '只控制左侧菜单和搜索菜单等展示层是否可见，不会阻止该页面进入动态路由注册。',
    type: '显示控制',
    default: 'false',
  },
  {
    name: 'ignoreSelfAndChildren',
    description: '忽略当前节点及全部子节点的菜单和路由注册。适用于页面节点和分组节点；不传时按 false 处理。',
    type: '注册控制',
    default: 'false',
  },
]

const comparisonApi = [
  {
    name: 'isHide: true',
    description: '菜单中隐藏当前节点；如果页面本身仍被注册，直接访问路径依然可以进入，且隐藏页会继续参与面包屑和 activeMenu 逻辑。',
    type: '隐藏菜单',
    default: '--',
  },
  {
    name: 'ignoreSelfAndChildren: true',
    description: '当前节点及整棵子树都不会进入本地菜单树，也不会进入后续动态路由注册，等于从约定式注册链路中整体跳过。',
    type: '跳过注册',
    default: '--',
  },
]

const checklistApi = [
  {
    name: '仅隐藏菜单',
    description: '详情页、编辑页等需要保留直达访问能力但不想出现在菜单中时，优先使用 isHide。',
    type: '推荐',
    default: 'isHide',
  },
  {
    name: '整组暂不启用',
    description: '某个模块、示例分组或目录临时不想注册时，直接在对应 _meta.ts 上配置 ignoreSelfAndChildren: true。',
    type: '推荐',
    default: 'ignoreSelfAndChildren',
  },
  {
    name: '不要混用语义',
    description: '不要把 isHide 当成“禁用路由”的替代；隐藏展示和跳过注册是两件事，应该分别建模。',
    type: '约束',
    default: '必须区分',
  },
  {
    name: '优先配在最高可控节点',
    description: '需要整组失效时，优先配在分组 _meta.ts，而不是逐个页面重复配置，避免后续新增子页面时漏掉。',
    type: '约束',
    default: '分组优先',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="菜单与路由约定"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        这篇文档说明项目里
        <code class="docs-inline-code">_meta.ts</code>
        的职责边界，以及
        <code class="docs-inline-code">isHide</code>
        和
        <code class="docs-inline-code">ignoreSelfAndChildren</code>
        的区别。
        重点不是“菜单怎么显示”，而是“这个节点是否还参与约定式菜单树和动态路由注册”。
      </template>
    </DocPageHeader>

    <BaseCard title="典型场景">
      <DocFeatureGrid :items="sceneItems" :columns="2" />
    </BaseCard>

    <BaseCard title="默认原则">
      <ul class="docs-page-list">
        <li><code class="docs-inline-code">_meta.ts</code> 负责声明菜单标题、图标、排序、权限和约定式页面入口，不建议把同一份语义拆到多个配置文件里维护。</li>
        <li><code class="docs-inline-code">isHide</code> 只表示“隐藏展示”，不表示“忽略注册”；它适合详情页、编辑页这类不想在菜单里出现但仍需要路由访问的页面。</li>
        <li><code class="docs-inline-code">ignoreSelfAndChildren</code> 表示“忽略当前节点及整棵子树的菜单和路由注册”；它是注册链路层配置，不是 UI 展示层配置。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="常用字段" :items="metaApi" />
    <ComponentApiTable title="isHide 与 ignoreSelfAndChildren 的区别" :items="comparisonApi" />

    <BaseCard title="推荐写法">
      <ul class="docs-page-list">
        <li>页面节点需要临时下线但不想删除目录时，在当前页面的 <code class="docs-inline-code">_meta.ts</code> 中增加 <code class="docs-inline-code">ignoreSelfAndChildren: true</code>。</li>
        <li>整个分组或模块都不想注册时，在分组目录的 <code class="docs-inline-code">_meta.ts</code> 中增加 <code class="docs-inline-code">ignoreSelfAndChildren: true</code>，让当前节点和全部子节点一起跳过。</li>
        <li>例如正式上线时，如果不希望暴露 <code class="docs-inline-code">文档中心</code>、<code class="docs-inline-code">组件示例</code>、<code class="docs-inline-code">模板示例</code> 这类非生产模块，可以直接在这些分组的 <code class="docs-inline-code">_meta.ts</code> 上配置 <code class="docs-inline-code">ignoreSelfAndChildren: true</code>，按模块整体裁剪。</li>
        <li>该字段为可选项，不传即可；系统默认按 <code class="docs-inline-code">false</code> 处理，不需要额外补默认值。</li>
      </ul>
    </BaseCard>

    <BaseCard title="配置示例">
      <ul class="docs-page-list">
        <li>
          页面级示例：
          <code class="docs-inline-code">export default buildMeta({ title: '用户管理', icon: 'i-mdi:user-outline', isHide: false, isFull: false, isAffix: false, isKeepAlive: true, order: 0 })</code>
        </li>
        <li>
          分组级示例：
          <code class="docs-inline-code">export default buildMeta({ isGroup: true, title: '模板示例', icon: 'i-mdi:menu', order: 1 })</code>
        </li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="落地检查清单" :items="checklistApi" />
  </div>
</template>

<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const quickEntryItems = [
  {
    title: '布局滚动异常',
    description: '页面双滚动、表格撑不开、Tabs 高度异常时，先从高度链路和滚动落点排查。',
    meta: 'Layout',
  },
  {
    title: '弹层状态残留',
    description: '二次打开仍带着上次数据、默认 tab 不重置、编辑回填串值时，优先检查打开顺序和 reset 时机。',
    meta: 'Dialog',
  },
  {
    title: '状态展示不统一',
    description: '同一业务状态在不同页面文案、颜色、权限控制不一致时，先看字典与权限入口是否统一。',
    meta: 'Dict/Auth',
  },
  {
    title: '菜单隐藏但路由还能进',
    description: '菜单配置了 isHide 仍能访问页面，或想让整组页面不注册时，优先检查菜单显示与路由注册是否混用了同一个字段。',
    meta: 'Route',
  },
  {
    title: '列表请求或导出异常',
    description: '搜索重置异常、导出拿不到参数、刷新留错页时，优先检查 BaseTable 的列表语义和请求上下文。',
    meta: 'Table',
  },
]

const issueApi = [
  {
    name: '页面双滚动 / 高度失真',
    description: '高概率是父子容器同时承担滚动，或中间层缺了 min-height: 0，也可能直接写了 100vh / calc(100vh - xxx)。',
    type: '先看',
    default: '高度自适应',
  },
  {
    name: '弹层第二次打开仍有旧数据',
    description: '高概率是没有在 open 前 resetState()，或者先 visible = true 再回填，导致旧状态先渲染出来。',
    type: '先看',
    default: '常用工具 / useResettableState / 弹层生命周期与回调',
  },
  {
    name: '详情抽屉停留在上一次 tab',
    description: '高概率是重新 open 时没有重置 activeName，也没有为依赖当前记录的 tab 内容做刷新控制。',
    type: '先看',
    default: '弹层生命周期与回调',
  },
  {
    name: '搜索重置把外部条件也清掉了',
    description: '高概率是把左侧树 / 标签联动条件错误放进了 searchFormState，而不是 externalParams。',
    type: '先看',
    default: 'BaseTable / 页面场景约定',
  },
  {
    name: '导出按钮存在但导不出当前条件',
    description: '高概率是 datasource 只返回了普通对象或 response.data，导致 BaseTable 没有记录最后一次请求配置。',
    type: '先看',
    default: 'BaseTable / axios 封装',
  },
  {
    name: '同一状态在不同页面颜色和文案不一致',
    description: '高概率是页面手写了枚举数组或魔法值，没有统一走 dict.config.ts 和 BaseDict* 组件。',
    type: '先看',
    default: '字典与权限约定',
  },
  {
    name: '按钮权限判断散落模板',
    description: '高概率是没有优先使用组件 priv，或者直接读取 store 做权限判断，导致页面分散维护权限逻辑。',
    type: '先看',
    default: '字典与权限约定',
  },
  {
    name: '菜单隐藏了但页面仍可直接访问',
    description: '高概率是把 isHide 当成了忽略注册使用；isHide 只隐藏菜单，真正跳过当前节点及子树注册应使用 ignoreSelfAndChildren。',
    type: '先看',
    default: '菜单与路由约定',
  },
  {
    name: '请求重复弹错或业务状态误判',
    description: '高概率是特殊流程没有正确使用 useBizStatus / showDefaultError，或业务层重复判断 status。',
    type: '先看',
    default: 'axios 封装',
  },
]

const methodApi = [
  {
    name: '先确认现象属于哪一层',
    description: '先判断问题是布局、列表语义、弹层状态、字典权限还是请求封装，再进入对应专题，避免从症状表面乱改。',
    type: '排查方法',
    default: '分层',
  },
  {
    name: '先找默认口径有没有被绕开',
    description: '很多问题不是组件本身缺能力，而是页面绕开了项目默认模式，例如直接写 ElTable、手写状态数组、手管 visible。',
    type: '排查方法',
    default: '先对照约定',
  },
  {
    name: '优先看 template-examples',
    description: '当文档还不能覆盖所有细节时，优先回到真实示例模块核对推荐写法，而不是参考 platform 旧代码。',
    type: '排查方法',
    default: '示例优先',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="问题排查索引"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        这篇文档会按
        <code class="docs-inline-code">现象</code>
        →
        <code class="docs-inline-code">高概率原因</code>
        →
        <code class="docs-inline-code">对应专题文档</code>
        的方式组织，作为开发和维护时的快速回查入口。
      </template>
    </DocPageHeader>

    <BaseCard title="高频入口">
      <DocFeatureGrid :items="quickEntryItems" :columns="2" />
    </BaseCard>

    <BaseCard title="怎么使用这页">
      <ul class="docs-page-list">
        <li>先按“现象最接近哪一类”进入对应条目，再跳转到专题文档，而不是直接在业务页里试错式修改。</li>
        <li>如果一个问题同时涉及多层，例如“详情抽屉 + Tabs + 表格”，优先先排高度与打开顺序，再看子模块的列表语义和请求行为。</li>
        <li>发现页面明显绕开项目默认模式时，优先把结构收回到推荐口径，再判断是否还有真实缺陷。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="常见现象与定位入口" :items="issueApi" />
    <ComponentApiTable title="排查方法" :items="methodApi" />
  </div>
</template>

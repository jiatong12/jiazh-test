<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const sceneItems = [
  {
    title: '表单选择',
    description: '选择类字段优先使用支持 dict 的 BaseSelect、BaseRadio、BaseCheckboxGroup 等组件，不在页面里手写选项数组。',
    meta: 'Form',
  },
  {
    title: '状态回显',
    description: '表格和详情里的状态展示优先使用 BaseDictTag、BaseDictText、BaseDictBadge，保证展示口径统一。',
    meta: 'Display',
  },
  {
    title: '按钮权限',
    description: '组件已支持 priv 时优先直接传权限码，不在页面里散落 v-if 判断。',
    meta: 'Priv',
  },
  {
    title: '路由权限',
    description: '页面或模块级权限仍走 meta.priv，由统一权限工具和路由逻辑接管。',
    meta: 'Route',
  },
]

const dictApi = [
  {
    name: 'src/config/dict.config.ts',
    description: '所有字典统一维护在这里，并通过 freezeDeep 冻结。新增字典时优先在此处登记来源和常量语义。',
    type: '字典入口',
    default: '唯一入口',
  },
  {
    name: 'data: null',
    description: '表示字典由后端提供，运行时会通过 $$dicts 的 getDictByCode 拉取，不需要页面自己请求字典接口。',
    type: '后端字典',
    default: '允许',
  },
  {
    name: 'NORMAL / isNormal',
    description: '推荐在字典配置中补业务常量和辅助函数，避免页面里直接比较 1、0 这类魔法值。',
    type: '常量语义',
    default: '推荐',
  },
  {
    name: 'color',
    description: '颜色字段应使用 primary、info、warning 等语义类型，而不是具体色值，确保组件能跟随主题表现。',
    type: '颜色语义',
    default: '语义化',
  },
]

const usageApi = [
  {
    name: 'dict 属性',
    description: '表单项、表格列或展示组件优先通过 dict 绑定字典，不在页面内硬编码 label/value 列表。',
    type: '推荐',
    default: '优先',
  },
  {
    name: '$$dicts',
    description: '统一字典上下文入口，负责本地字典配置和后端字典拉取；页面侧优先复用这套上下文能力。',
    type: '推荐',
    default: '统一入口',
  },
  {
    name: '$$auths',
    description: '统一权限工具入口，提供 hasPriv / hasPrivAny，不直接读取 store 内部状态做权限判断。',
    type: '推荐',
    default: '统一入口',
  },
  {
    name: 'priv',
    description: '组件已内置权限能力时，优先使用 priv 属性，让按钮、表单项等自行处理无权限展示。',
    type: '推荐',
    default: '组件优先',
  },
]

const antiPatternApi = [
  {
    name: '页面里手写状态数组',
    description: '会导致同一业务状态在不同页面 label、顺序、颜色不一致，后续维护成本很高。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '直接比较魔法值',
    description: '例如 status === 1、status === "0" 这类判断应尽量由字典常量或辅助函数替代。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '权限判断直接读 store',
    description: '页面直接依赖 store 内部结构会放大耦合，权限口径应统一走 $$auths 或组件 priv。',
    type: '不推荐',
    default: '--',
  },
  {
    name: '同页到处写 v-if 控权限',
    description: '组件支持 priv 时继续手写 v-if，会让权限语义散落在模板里，不利于统一维护。',
    type: '不推荐',
    default: '--',
  },
]

const checklistApi = [
  {
    name: '新增字典',
    description: '先在 dict.config.ts 注册，再决定是前端常量还是后端字典，不要先在页面里临时写数组。',
    type: '检查项',
    default: '先登记',
  },
  {
    name: '状态展示',
    description: '优先使用 BaseDictTag / BaseDictText / BaseDictBadge，而不是自己拼标签文本和颜色。',
    type: '检查项',
    default: 'BaseDict*',
  },
  {
    name: '状态判断',
    description: '优先用字典常量或工具方法表达业务语义，例如 demo1.NORMAL、demo1.isNormal(value)。',
    type: '检查项',
    default: '避免魔法值',
  },
  {
    name: '权限控制',
    description: '组件有 priv 就交给组件，无需再写一层 v-if；组件没有 priv 再使用 $$auths 判断。',
    type: '检查项',
    default: '组件优先',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="字典与权限约定"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        这篇文档收口两类高频约定：
        <code class="docs-inline-code">状态枚举怎么统一管理</code>
        和
        <code class="docs-inline-code">权限判断应该落在哪一层</code>
        。
        目标是让状态展示、表单选项和按钮权限都保持统一来源，而不是散落在各个页面里各写一套。
      </template>
    </DocPageHeader>

    <BaseCard title="典型场景">
      <DocFeatureGrid :items="sceneItems" :columns="2" />
    </BaseCard>

    <BaseCard title="默认原则">
      <ul class="docs-page-list">
        <li>所有字典统一维护在 <code class="docs-inline-code">src/config/dict.config.ts</code>，页面内不直接硬编码 label/value 列表。</li>
        <li>状态展示优先复用 <code class="docs-inline-code">BaseDictTag</code>、<code class="docs-inline-code">BaseDictText</code>、<code class="docs-inline-code">BaseDictBadge</code>，保持颜色和文案一致。</li>
        <li>权限判断优先使用组件内置 <code class="docs-inline-code">priv</code>；只有组件本身不支持时，才在页面逻辑里使用 <code class="docs-inline-code">$$auths</code>。</li>
      </ul>
    </BaseCard>

    <BaseCard title="字典的推荐组织方式">
      <ul class="docs-page-list">
        <li>前端常量型字典直接在配置里提供 <code class="docs-inline-code">data</code> 数组，并补充常量或辅助函数表达业务语义。</li>
        <li>后端字典使用 <code class="docs-inline-code">data: null</code>，由统一字典上下文按 code 拉取，不让页面自己管理字典请求。</li>
        <li>字典项颜色使用语义类型，不写具体色值，确保不同主题下仍然可读。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="字典配置规则" :items="dictApi" />
    <ComponentApiTable title="使用入口" :items="usageApi" />
    <ComponentApiTable title="落地检查清单" :items="checklistApi" />
    <ComponentApiTable title="常见反模式" :items="antiPatternApi" />
  </div>
</template>

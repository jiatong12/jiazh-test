<script setup lang="ts">
import UseHandleConfirmSource from '@/hooks/useHandleConfirm.ts?raw'
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocFeatureGrid from '@/modules/docs/_components/DocFeatureGrid.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import '@/modules/docs/styles.scss'

const featureItems = [
  {
    title: '独立操作按钮',
    description: '适合页面顶部按钮、详情页按钮、批量操作按钮等不走 rowActions 的场景。',
    meta: 'Button',
  },
  {
    title: '统一确认弹窗',
    description: '统一“是否xxx?” 文案、确认 loading 和成功提示，减少每页手写 ElMessageBox.confirm。',
    meta: 'Confirm',
  },
  {
    title: '避免重复提示',
    description: 'hook 内部已经处理成功提示，业务侧不应在 then 里再次补一条成功消息。',
    meta: 'Rule',
  },
]

const apiItems = [
  {
    name: 'api',
    description: '必填异步函数。用户确认后执行，成功时 resolve 返回值，失败时 reject。',
    type: '() => Promise<R>',
    default: '--',
  },
  {
    name: 'message',
    description: '动作名或动词短语，例如“删除”“上架”“重置密码”。弹窗会自动拼成“是否xxx?”。',
    type: 'string',
    default: '--',
  },
  {
    name: 'confirmType',
    description: 'Element Plus MessageBox 的类型，默认 warning。',
    type: 'MessageType',
    default: 'warning',
  },
]

const ruleItems = [
  {
    name: 'rowActions 已有 confirmTitle',
    description: 'BaseTable 行操作已能直接配置 confirmTitle，此时不需要再额外套 useHandleConfirm。',
    type: '优先级',
    default: '优先 confirmTitle',
  },
  {
    name: '非 rowActions 场景',
    description: '独立按钮、批量操作、状态切换等需要确认的场景，优先使用 useHandleConfirm。',
    type: '推荐场景',
    default: '推荐',
  },
  {
    name: '成功提示',
    description: 'hook 内部已弹成功消息，业务代码不要在 then 中重复提示。',
    type: '注意项',
    default: '避免重复',
  },
]
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="useHandleConfirm"
      lead=""
      eyebrow="常用工具"
    >
      <template #lead>
        <code class="docs-inline-code">useHandleConfirm</code>
        用来统一处理
        <code class="docs-inline-code">二次确认</code>
        、
        <code class="docs-inline-code">确认按钮 loading</code>
        和
        <code class="docs-inline-code">成功提示</code>
        。
        它的重点不是替代所有确认弹窗，而是把项目里重复出现的“确认后执行异步操作”收口成一个稳定入口。
      </template>
    </DocPageHeader>

    <BaseCard title="适用场景">
      <DocFeatureGrid :items="featureItems" :columns="3" />
    </BaseCard>

    <BaseCard title="使用原则">
      <ul class="docs-page-list">
        <li>表格 <code class="docs-inline-code">rowActions</code> 已支持 <code class="docs-inline-code">confirmTitle</code>，这类场景优先用行操作配置，不再额外套 hook。</li>
        <li>页面级独立按钮、批量操作、状态切换这类场景，优先用 <code class="docs-inline-code">useHandleConfirm</code>，避免每页重复写确认逻辑。</li>
        <li>传给 <code class="docs-inline-code">message</code> 的值建议是动作短语，例如“删除”“启用”“重置密码”，不要手动拼完整句子。</li>
      </ul>
    </BaseCard>

    <DemoBlock
      title="源码参考"
      description="这份源码已经包含确认框 loading、统一成功提示和取消 / 失败 reject 逻辑。阅读时重点关注它解决了哪些重复劳动，而不是只看 API 形态。"
      source-hint="src/hooks/useHandleConfirm.ts"
      language-label="TypeScript"
      :source="UseHandleConfirmSource"
    />

    <ComponentApiTable title="参数" :items="apiItems" />
    <ComponentApiTable title="使用边界" :items="ruleItems" />
  </div>
</template>

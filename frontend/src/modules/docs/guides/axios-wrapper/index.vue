<script setup lang="ts">
import ComponentApiTable from '@/modules/docs/_components/ComponentApiTable.vue'
import DemoBlock from '@/modules/docs/_components/DemoBlock.vue'
import DocPageHeader from '@/modules/docs/_components/DocPageHeader.vue'
import DemoAxiosWrapperBasicSource from './demos/basic.ts?raw'
import DemoAxiosWrapperUseBizStatusSource from './demos/use-biz-status.ts?raw'
import '@/modules/docs/styles.scss'

const requestConfigApi = [
  {
    name: 'showDefaultError',
    description: '是否使用拦截器内置的全局错误提示。默认开启，关闭后需要业务侧自行处理错误反馈。',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'useBizStatus',
    description: '是否跳过“status === 1 才算成功”的业务状态判断。适合登录、多状态流程等特殊接口。',
    type: 'boolean',
    default: 'false',
  },
]

const interceptorRuleApi = [
  {
    name: 'main.ts',
    description: '应用启动时会先加载 src/config/axios.ts，所以业务代码统一直接 import axios from \'axios\' 即可。',
    type: '初始化入口',
    default: '全局生效',
  },
  {
    name: 'baseURL / timeout / withCredentials',
    description: '默认从环境变量注入 API_URL，请求超时 30 秒，且跨域请求默认携带凭证。',
    type: '默认配置',
    default: '已启用',
  },
  {
    name: 'status === 1',
    description: '响应拦截器默认把 response.data.status === 1 视为业务成功，其余状态会按失败处理。',
    type: '业务成功口径',
    default: '返回 res',
  },
  {
    name: 'Blob / ArrayBuffer',
    description: '下载接口若实际返回的是 JSON 错误信息，会先反序列化再走统一业务错误处理。',
    type: '特殊响应处理',
    default: '自动识别',
  },
  {
    name: '401',
    description: 'HTTP 401 会走 unauthorizedHandler，交给登录态逻辑统一处理。',
    type: '状态码处理',
    default: '自动处理',
  },
  {
    name: '最后一个错误提示',
    description: '全局错误通知会主动关闭前一个实例，避免多个请求错误同时堆叠。',
    type: '提示策略',
    default: '仅保留最新',
  },
]

const sceneItems = [
  {
    title: '普通 CRUD',
    description: '保持默认拦截器即可，业务代码直接读取 response.data，不再额外判断 status === 1。',
    meta: 'Default',
  },
  {
    title: '多状态流程',
    description: '只有接口真的存在多个有效业务状态时，才使用 useBizStatus: true 把判断权交回业务层。',
    meta: 'Branching',
  },
  {
    title: '下载 / 导出',
    description: '即便 responseType 是 blob，后端仍可能返回 JSON 错误体，当前封装会先尝试识别并走统一错误处理。',
    meta: 'File',
  },
]

const checklistApi = [
  {
    name: '普通接口',
    description: '直接 import axios from \'axios\'，按默认拦截器处理成功和失败，不重复判断业务状态。',
    type: '推荐',
    default: '默认',
  },
  {
    name: '特殊状态流',
    description: '同时考虑是否关闭 showDefaultError，避免全局错误提示和业务分支提示重复出现。',
    type: '推荐',
    default: 'useBizStatus',
  },
  {
    name: '下载接口',
    description: '关注 responseType 与文件流处理，但不要忽略后端返回 JSON 错误时的兜底逻辑。',
    type: '推荐',
    default: 'blob / arraybuffer',
  },
  {
    name: '错误处理',
    description: '只有确实需要页面自行接管时，才关闭 showDefaultError；否则继续沿用统一提示口径。',
    type: '推荐',
    default: 'showDefaultError: true',
  },
]

const basicSource = DemoAxiosWrapperBasicSource
const useBizStatusSource = DemoAxiosWrapperUseBizStatusSource
</script>

<template>
  <div class="docs-page">
    <DocPageHeader
      title="axios 封装"
      lead=""
      eyebrow="开发指南"
    >
      <template #lead>
        项目没有额外导出一个自定义请求实例，而是在
        <code class="docs-inline-code">src/config/axios.ts</code>
        里直接增强全局
        <code class="docs-inline-code">axios</code>
        。
        业务侧统一
        <code class="docs-inline-code">import axios from 'axios'</code>
        即可。
      </template>
    </DocPageHeader>

    <BaseCard title="默认行为">
      <ul class="docs-page-list">
        <li>成功请求默认返回完整的 <code class="docs-inline-code">AxiosResponse</code>，不会直接帮你拆成 <code class="docs-inline-code">response.data</code>。</li>
        <li>除非显式传 <code class="docs-inline-code">useBizStatus: true</code>，否则拦截器会自动按 <code class="docs-inline-code">response.data.status === 1</code> 判断业务成功。</li>
        <li>业务失败和 HTTP 失败都会统一走错误提示；若当前请求不希望弹全局错误，可传 <code class="docs-inline-code">showDefaultError: false</code>。</li>
      </ul>
    </BaseCard>

    <BaseCard title="优先判断什么">
      <DocFeatureGrid :items="sceneItems" :columns="3" />
    </BaseCard>

    <DemoBlock
      title="标准请求写法"
      description="适合绝大多数列表、详情、保存接口。注意返回值仍然是完整 response，所以业务代码一般继续从 response.data 里取值。"
      source-hint="src/modules/docs/guides/axios-wrapper/demos/basic.ts"
      language-label="TypeScript"
      :source="basicSource"
    />

    <DemoBlock
      title="需要自己判断业务状态时"
      description="登录、多分支确认、特殊状态码流程这类接口，通常会关闭默认错误提示并启用 useBizStatus，自己接管状态分支。"
      source-hint="src/modules/docs/guides/axios-wrapper/demos/use-biz-status.ts"
      language-label="TypeScript"
      :source="useBizStatusSource"
    />

    <BaseCard title="使用建议">
      <ul class="docs-page-list">
        <li>普通 CRUD 接口优先沿用默认业务成功口径，减少每个页面重复判断 <code class="docs-inline-code">status</code>。</li>
        <li>只有当接口确实存在多个有效业务状态时，才使用 <code class="docs-inline-code">useBizStatus: true</code> 把判断权交回业务层。</li>
        <li>下载、导入这类接口如果配置了 <code class="docs-inline-code">responseType: 'blob'</code> 或 <code class="docs-inline-code">'arraybuffer'</code>，仍然要意识到后端可能返回 JSON 错误体，当前封装已经兼容了这类情况。</li>
      </ul>
    </BaseCard>

    <ComponentApiTable title="调用检查清单" :items="checklistApi" />
    <ComponentApiTable title="自定义请求配置" :items="requestConfigApi" />
    <ComponentApiTable title="拦截器关键规则" :items="interceptorRuleApi" />
  </div>
</template>

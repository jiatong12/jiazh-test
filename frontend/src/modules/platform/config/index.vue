<script setup lang="ts">
import axios from 'axios'
import ControlNumber from '@/modules/platform/_components/control/ControlNumber.vue'
import ControlPassword from '@/modules/platform/_components/control/ControlPassword.vue'
import ControlRadio from '@/modules/platform/_components/control/ControlRadio.vue'
import ControlSelect from '@/modules/platform/_components/control/ControlSelect.vue'
import ControlText from '@/modules/platform/_components/control/ControlText.vue'
import ControlTextArea from '@/modules/platform/_components/control/ControlTextArea.vue'
import { useUserStore } from '@/store/modules/user'
import { PasswordCrypto } from '@/utils/passwordCrypto'
import util from '@/utils/util'

defineOptions({
  components: {
    ControlPassword,
    ControlRadio,
    ControlSelect,
    ControlText,
    ControlTextArea,
    ControlNumber,
  },
})

// 定义类型
interface ConfigItem {
  id: string
  name: string
  value: any
  tip?: string
  controlType: string
  dataType?: string
}

interface ConfigGroup {
  id: string
  name: string
  configs: ConfigItem[]
}

const userStore = useUserStore()

// 响应式数据
const loading = ref(true)
const configs = ref<ConfigGroup[]>([])
const isThreeRole = computed(() => userStore.userInfo?.isThreeRole)
const offsetWidth = ref('')
const cardRef = ref()

// 生命周期
onMounted(() => {
  loadConfigs()
  if (window.screen.availHeight <= 728) {
    offsetWidth.value = '0px'
  }
  else {
    offsetWidth.value = '180px'
  }

  nextTick(() => {
    window.addEventListener('scroll', onScroll)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// 方法定义
function getName(item: ConfigItem): string {
  if (item.id === 'Workflow.SendMail') {
    return '是否发送电子邮件'
  }
  if (item.id === 'Platform.Mail.FromUser') {
    return '邮件 SMTP 发信人邮件地址'
  }
  return item.name
}

async function saveClick(): Promise<void> {
  const res = await axios.put('/ui/configs/saved', { data: encryptFormData() })
  util.showResponseMessage(res.data)
  await loadConfigs()
}

function encryptFormData(): ConfigGroup[] {
  const data = [...configs.value]
  const formData: ConfigGroup[] = []

  data.forEach((plugin) => {
    const configs: ConfigItem[] = []
    plugin.configs.forEach((item) => {
      let value = item.value
      if (item.controlType === 'Password' && item.value) {
        value = PasswordCrypto.makeAES(item.value)
      }
      configs.push({ ...item, value })
    })
    formData.push({ ...plugin, configs })
  })

  return formData
}

function controlType(item: ConfigItem): string {
  if (item.controlType === 'Text' && item.dataType === 'Long') {
    return 'ControlNumber'
  }

  switch (item.controlType) {
    case 'Password':
      return 'ControlPassword'
    case 'Radio':
      return 'ControlRadio'
    case 'Select':
      return 'ControlSelect'
    case 'Text':
      return 'ControlText'
    case 'TextArea':
      return 'ControlTextArea'
    default:
      return ''
  }
}

function itemClickHandler(id: string): void {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView(true)
  }
}

function onScroll(): void {
  const scrolled = window.scrollY
  const element = document.getElementById('forGetHeight')

  if (element && cardRef.value?.$el) {
    const top = element.offsetTop
    if (scrolled >= top) {
      cardRef.value.$el.style.top = `${scrolled - top}px`
    }
    else {
      cardRef.value.$el.style.top = '0px'
    }
  }
}

async function loadConfigs(): Promise<void> {
  loading.value = true
  try {
    const res = await axios.get('/ui/configs')
    configs.value = res.data.data
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
}

async function callback(id: string, val: any): Promise<void> {
  if (id === 'Article.SimilarArticleCheckConfig') {
    const item = configs.value.find(o => o.id === 'com.zving.article')
    if (item) {
      const keyWordSizeConfig = item.configs.find(o => o.id === 'Article.KeyWordSizeConfig')
      const articleSearchSizeConfig = item.configs.find(
        o => o.id === 'Article.SimilarArticleSearchSizeConfig',
      )
      if (val === 'Y') {
        if (keyWordSizeConfig) { keyWordSizeConfig.value = 10 }
        if (articleSearchSizeConfig) { articleSearchSizeConfig.value = 10 }
      }
      else {
        if (keyWordSizeConfig) { keyWordSizeConfig.value = 0 }
        if (articleSearchSizeConfig) { articleSearchSizeConfig.value = 0 }
      }
    }
  }
  else if (id === 'IndexQueryAnalyzer' || id === 'IndexWriteAnalyzer') {
    if (id === 'IndexWriteAnalyzer') {
      try {
        await ElMessageBox.confirm(
          '更改索引分词器需要重新生成网站群索引才会生效，请访问菜单配置--》内容索引--》点击生成网站群索引按钮。',
          '提示',
          {
            type: 'warning',
            confirmButtonText: '确定',
            showCancelButton: false,
          },
        )
      }
      catch (e) {
        console.error(e)
      }
    }
    if (val === 'hanlp_crf' || val === 'hanlp_nlp') {
      util.showMessage(
        'NLP和CRF分词器需要下载更大的词典放在appdata的dic目录下才能支持，请访问http://download.hanlp.com/data-for-1.7.5.zip下载,解压data目录覆盖即可!',
        'warning',
      )
    }
  }
}
</script>

<template>
  <div class="flex-column-layout h-full">
    <div class="card">
      <BaseButton type="primary" :icon="$$renderIcon('i-mdi:content-save-outline')" priv="Platform.Config.Save" @click="saveClick">
        保存
      </BaseButton>
    </div>
    <div v-loading="loading" class="flex-height-fill">
      <ElRow class="h-full" :gutter="10">
        <ElCol :span="5" class="h-full">
          <ElCard
            v-show="!loading"
            ref="cardRef"
            class=" h-full overflow-y-auto"
          >
            <ul class="config-type-list">
              <template v-for="config in configs" :key="config.name">
                <li
                  class="config-type-item"
                  @click="itemClickHandler(config.id)"
                >
                  {{ config.name }}
                </li>
              </template>
            </ul>
          </ElCard>
        </ElCol>
        <ElCol
          :span="19"
          class="h-full overflow-y-auto"
        >
          <div id="forGetHeight" style="margin: 0px; padding: 0px; height: 0px; position: fixed" />
          <ElForm
            label-width="300px"
            label-position="left"
            class="platform-config-form"
            @submit.prevent
          >
            <div
              v-for="(config, index) in configs"
              :key="config.id"
              class="card"
              :style="{ 'margin-bottom': index + 1 === configs.length ? '0' : '10px' }"
            >
              <div :id="config.id" class="panel-legend">
                {{ config.name }}
              </div>
              <div v-for="item in config.configs" :key="item.id">
                <ElFormItem
                  v-if="
                    (!isThreeRole || item.id !== 'Platform.AdminUserName')
                      && item.id !== 'ResourceLibConfig'
                      && item.id !== 'Workflow.SendMail'
                      && item.id !== 'Platform.Mail.FromUser'
                  "
                >
                  <template #label>
                    <div>
                      <span>{{ getName(item) }}</span>
                      <ElTooltip v-if="item.tip" effect="dark" :content="item.tip" placement="top">
                        <template #content>
                          <div><span v-html="item.tip" /></div>
                        </template>
                        <BaseIcon name="i-mdi:lightbulb-outline" style="color: var(--el-color-warning)" />
                      </ElTooltip>
                      :
                    </div>
                  </template>
                  <component
                    :is="controlType(item)"
                    v-model="item.value"
                    :config="item"
                    @callback="callback"
                  />
                </ElFormItem>
                <ElFormItem
                  v-if="
                    (!isThreeRole || item.id !== 'Platform.AdminUserName')
                      && item.id !== 'ResourceLibConfig'
                      && (item.id === 'Workflow.SendMail' || item.id === 'Platform.Mail.FromUser')
                  "
                >
                  <template #label>
                    <div>
                      <span>{{ getName(item) }}</span>
                      <ElTooltip effect="dark" :content="item.name" placement="top">
                        <BaseIcon name="i-mdi:lightbulb-outline" style="color: var(--el-color-warning)" />
                      </ElTooltip>
                      :
                    </div>
                  </template>
                  <component
                    :is="controlType(item)"
                    v-model="item.value"
                    :config="item"
                    @callback="callback"
                  />
                </ElFormItem>
              </div>
            </div>
          </ElForm>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style scoped>
.config-type-list {
  list-style: none;
  display: block;
}
.config-type-item {
  cursor: pointer;
  font-size: 16px;
  line-height: 34px;
  color: var(--el-text-color-regular);
}
.config-type-item:hover {
  font-weight: 600;
  color: var(--color-primary-hover);
}
.platform-config-form :deep(.el-form-item__label) {
  text-indent: 40px;
}
.panel-legend {
  font-weight: 600;
}
</style>

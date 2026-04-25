<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import util from '@/utils/util'

// 数据状态
const tmpRoleLang = ref<Record<string, string>>({}) // 角色多种语言临时存储变量
const langList = ref<Array<{ name: string, key: string }>>([]) // 支持语言列表
const lang = ref('')
const visible = ref(false)

// 表单数据
const formData = ref<Record<string, any>>({})

const currentId = ref<string>('')
const currentLanguages = ref<string>('')
const currentTargetValue = ref<string>('')
const currentCallback = ref<((payload: { data: string, val: string, ID: string }) => void) | null>(null)

// methods
function beforeDialogOpen() {
  tmpRoleLang.value = {}
  initLanguages()
}

function open(payload: {
  id: string
  languages?: string
  targetValue?: string
  callback?: (payload: { data: string, val: string, ID: string }) => void
}) {
  currentId.value = payload.id
  currentLanguages.value = payload.languages || ''
  currentTargetValue.value = payload.targetValue || ''
  currentCallback.value = payload.callback || null
  visible.value = true
}

async function initLanguages() {
  try {
    const res = await axios.get('/ui/application/languages', { showDefaultError: false })
    langList.value = res.data.data.data
    lang.value = res.data.data.lang
    setValues()
    // 将数据同步到表单数据中
    formData.value = { ...tmpRoleLang.value }
  }
  catch {
    util.showMessage('获取语言列表失败', 'error')
  }
}

function confirm() {
  const r = ['@Lang']
  let val = ''

  // 从表单数据中获取值
  for (const key in formData.value) {
    if (key.length <= (currentId.value?.length || 0)) {
      continue
    }
    const k = key.substring((currentId.value?.length || 0) + 1)
    r.push(`${k}=${formData.value[key]}`)
    if (k === lang.value) {
      val = formData.value[key]
    }
  }

  currentCallback.value?.({
    data: escape(r.join('\n')),
    val,
    ID: currentId.value,
  })
  visible.value = false
}

function setValues() {
  if (!currentLanguages.value || !currentId.value) { return }

  const temLanguages = unescape(currentLanguages.value)
  if (temLanguages.startsWith('@Lang\n')) {
    const arr = temLanguages.substring(6).split(/\n/)
    for (let i = 0; i < arr.length; i++) {
      let k = arr[i]!
      if (k.indexOf('=') < 1) {
        continue
      }
      let v = k.substring(k.indexOf('=') + 1)
      k = k.substring(0, k.indexOf('='))
      if (k === lang.value) {
        v = currentTargetValue.value || '' // 反映最新的修改情况
      }
      tmpRoleLang.value[`${currentId.value}_${k}`] = v
    }
  }
  else {
    tmpRoleLang.value[`${currentId.value}_${lang.value}`] = currentTargetValue.value || ''
  }
}

defineExpose({ open })
</script>

<template>
  <BaseDialog
    v-model="visible"
    title="多语言字段编辑器"
    width="500px"
    @open="beforeDialogOpen"
  >
    <BaseForm :datasource="formData">
      <BaseFormItem
        v-for="o in langList"
        :key="o.name"
        :label="o.name"
      >
        <ElInput
          v-model="formData[`${currentId}_${o.key}`]"
          type="textarea"
          :rows="2"
        />
      </BaseFormItem>
    </BaseForm>

    <template #footer>
      <div>
        <BaseButton @click="visible = false">
          取 消
        </BaseButton>
        <BaseButton type="primary" @click="confirm">
          确 定
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 96% !important;
  }
}
</style>

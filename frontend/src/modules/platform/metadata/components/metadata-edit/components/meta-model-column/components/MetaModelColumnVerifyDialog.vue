<script lang="ts" setup>
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'

const emit = defineEmits(['confirm'])

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)
const controlType = ref('Select')

// 表单数据
const [formData, resetFormData] = useResettableState(() => ({
  items: [] as string[],
  lengthSymbol: '',
  lengthValue: 0,
  regex: '',
  script: '',
}))

// 方法
function open(_data?: string) {
  submitLoading.value = false
  if (!_data) {
    resetFormData()
  }
  else {
    formData.value.items = _data.split('&&')
    const scriptIndex = formData.value.items.findIndex(val => val.startsWith('Script'))
    if (scriptIndex !== -1) {
      formData.value.script = formData.value.items[scriptIndex]?.slice(7) ?? ''
      formData.value.items[scriptIndex] = 'Script'
    }
    const regexIndex = formData.value.items.findIndex(val => val.startsWith('Regex'))
    if (regexIndex !== -1) {
      formData.value.regex = formData.value.items[regexIndex]?.slice(6) ?? ''
      formData.value.items[regexIndex] = 'Regex'
    }
    const lengthIndex = formData.value.items.findIndex(val => val.startsWith('Length'))
    if (lengthIndex !== -1) {
      formData.value.lengthSymbol = formData.value.items[lengthIndex]?.slice(6, 7) ?? ''
      formData.value.lengthValue = Number(formData.value.items[lengthIndex]?.slice(7))
      formData.value.items[lengthIndex] = 'Length'
    }
  }

  visible.value = true
}

function lengthChangeHandler(val: any) {
  if (!val) {
    formData.value.lengthSymbol = ''
    formData.value.lengthValue = 0
  }
}

function regexChangeHandler(val: any) {
  if (!val) {
    formData.value.regex = ''
  }
}

function scriptChangeHandler(val: any) {
  if (!val) {
    formData.value.script = ''
  }
}

function confirmClickHandler() {
  const items = [...formData.value.items]

  const scriptIndex = items.findIndex(val => val.startsWith('Script'))
  if (scriptIndex !== -1) {
    items[scriptIndex] = `Script=${formData.value.script}`
  }

  const regexIndex = items.findIndex(val => val.startsWith('Regex'))
  if (regexIndex !== -1) {
    items[regexIndex] = `Regex=${formData.value.regex}`
  }

  const lengthIndex = items.findIndex(val => val.startsWith('Length'))
  if (lengthIndex !== -1) {
    items[lengthIndex] = `Length${formData.value.lengthSymbol}${formData.value.lengthValue}`
  }

  emit('confirm', items.join('&&'))
  handleCancel()
}

function handleCancel() {
  visible.value = false
}

// 暴露方法
defineExpose({ open })
</script>

<template>
  <BaseDialog
    v-model="visible"
    title="选择校验规则"
    width="600px"
    class="meta-column-verify-dlg"
  >
    <ElCheckboxGroup v-model="formData.items">
      <div v-if="controlType === 'RichText'" class="panel-fieldset">
        <div class="panel-legend">
          一般校验规则
        </div>
        <ElRow>
          <ElCol :span="12">
            <ElCheckbox class="rule-checkbox" value="NotNull">
              不能为空
            </ElCheckbox>
          </ElCol>
        </ElRow>
      </div>
      <div v-else>
        <div class="panel-fieldset">
          <div class="panel-legend">
            一般校验规则
          </div>
          <ElRow>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="NotNull">
                不能为空
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="Number">
                数字（整数或小数）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="Int">
                整数
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="Time">
                时间（HH:mm:ss）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="Date">
                日期（yyyy-MM-dd）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="DateTime">
                日期时间（yyyy-MM-dd HH:mm:ss）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="TitleString">
                只允许中文、英文字母和数字
              </ElCheckbox>
            </ElCol>
          </ElRow>
        </div>

        <div v-if="controlType !== 'RichText'" class="panel-fieldset">
          <div class="panel-legend">
            业务校验规则
          </div>
          <ElRow>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="Email">
                Email
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="ZipCode">
                邮政编码（中国）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="CnTel">
                固定电话号码（中国）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="CnMobile">
                移动电话号码（中国）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="CnPhone">
                固定或移动电话（中国）
              </ElCheckbox>
            </ElCol>
            <ElCol :span="12">
              <ElCheckbox class="rule-checkbox" value="IDCardNo">
                身份证号码（中国）
              </ElCheckbox>
            </ElCol>
          </ElRow>
        </div>

        <div v-if="controlType !== 'RichText'" class="panel-fieldset">
          <div class="panel-legend">
            高级校验规则
          </div>
          <ElRow style="display: none" class="adv-rule-item" :gutter="10">
            <ElCol :span="6">
              <ElCheckbox class="rule-checkbox" value="Script" @change="scriptChangeHandler">
                JavaScript脚本
              </ElCheckbox>
            </ElCol>
            <ElCol :span="18">
              <ElInput
                v-model="formData.script"
                class="rule-input"
                :disabled="!formData.items.includes('Script')"
              />
            </ElCol>
          </ElRow>
          <ElRow class="adv-rule-item" :gutter="10">
            <ElCol :span="6">
              <ElCheckbox class="rule-checkbox" value="Regex" @change="regexChangeHandler">
                正则表达式
              </ElCheckbox>
            </ElCol>
            <ElCol :span="18">
              <ElInput
                v-model="formData.regex"
                class="rule-input"
                :disabled="!formData.items.includes('Regex')"
              />
            </ElCol>
          </ElRow>
          <ElRow class="adv-rule-item" :gutter="10">
            <ElCol :span="6">
              <ElCheckbox class="rule-checkbox" value="Length" @change="lengthChangeHandler">
                长度
              </ElCheckbox>
            </ElCol>
            <ElCol :span="8">
              <ElSelect
                v-model="formData.lengthSymbol"
                clearable
                :disabled="!formData.items.includes('Length')"
                placeholder="请选择"
                class="rule-input"
                style="width: 100%"
              >
                <ElOption label="等于" value="=" />
                <ElOption label="大于" value=">" />
                <ElOption label="小于" value="<" />
              </ElSelect>
            </ElCol>
            <ElCol :span="10">
              <ElInputNumber
                v-model="formData.lengthValue"
                :disabled="!formData.items.includes('Length')"
                :min="0"
                class="rule-input"
                style="width: 100%"
              />
            </ElCol>
          </ElRow>
        </div>
      </div>
    </ElCheckboxGroup>

    <template #footer>
      <BaseButton @click="handleCancel">
        取 消
      </BaseButton>
      <BaseButton type="primary" @click="confirmClickHandler">
        确 定
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style scoped>
.panel-legend {
  font-size: 17px;
  font-weight: 600;
  display: inline-block;
  line-height: 40px;
  color: var(--el-text-color-primary);
}

.panel-fieldset {
  padding: 13px 15px 14px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(99, 99, 99, 0.05);
}

.adv-rule-item {
  margin-bottom: 10px;
}
.meta-column-verify-dlg :deep(.el-dialog) {
  width: 600px;
}
@media (max-width: 480px) {
  .meta-column-verify-dlg :deep(.el-dialog) {
    width: 96%;
  }
}
.meta-column-verify-dlg :deep(.el-dialog .el-dialog__body) {
  background: rgb(249, 249, 249);
}
.meta-column-verify-dlg :deep(.el-dialog .title) {
  color: var(--el-text-color-secondary);
  font-weight: 600;
  margin: 5px 0;
}
</style>

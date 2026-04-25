<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'

const emit = defineEmits(['confirm'])
// const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)
const controlType = ref('Select')

// 表单数据
const [formData, resetFieldOptions] = useResettableState(() => ({
  source: 'Code',
  value: '',
}))

// 计算属性
const inputTips = computed(() => {
  switch (controlType.value) {
    case 'Select':
      return `每行文本表示一个选项, 支持key=value格式`
    case 'TreeViewSelect':
      return `每行文本表示一个树节点, 使用空格缩进来表示子节点, 支持key=value格式`
    default:
      return ``
  }
})

const inputPlaceholder = computed(() => {
  switch (controlType.value) {
    case 'Select':
      return `1=选项1\n2=选项2\n3=选项3`
    case 'TreeViewSelect':
      return `1=一级节点1\n  11=二级节点1-1\n  12=二级节点1-2\n2=一级节点2\n  21=二级节点2-1\n  22=二级节点2-2\n3=一级节点3\n  31=二级节点3-1\n  32=二级节点3-2`
    default:
      return ``
  }
})

// 表单规则
const rules: FormRules = {
  value: [{ required: true, message: '必填', trigger: 'blur change' }],
}

function fieldOptionsChangeHandler() {
  formData.value.value = ''
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    if (formData.value.source === 'Input') {
      formData.value.value = formData.value.value.replace(/\n/g, '||')
    }
    emit('confirm', `${formData.value.source}:${formData.value.value}`)
    handleCancel()
  })
}

function handleCancel() {
  visible.value = false
}

/**
 * 打开
 */
function open(_data?: string): void {
  submitLoading.value = false
  // 重置
  if (!_data) {
    resetFieldOptions()
  }
  else {
    const items = _data.split(':')
    formData.value.source = items[0]!
    formData.value.value = items[1]!
    if (formData.value.source === 'Input') {
      // 兼容老数据
      formData.value.value = formData.value.value.replace(/<br>/g, '\n')
      formData.value.value = formData.value.value.replace(/\|\|/g, '\n')
    }
  }
  visible.value = true
}

const codeTypes = () => axios.get('/ui/metamodels/0/columns/codeTypes').then(r => r.data.data?.length ? r.data.data : [{ codeType: '', codeName: '' }]).then(list => list.map(item => ({ label: item.codeName, value: item.codeType })))

// 暴露方法
defineExpose({ open })
</script>

<template>
  <BaseDialog
    v-model="visible"
    title="字段选项列表"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="rules"
      label-width="128px"
    >
      <BaseFormItem label="选项数据来源：">
        <ElRadioGroup
          v-model="formData.source"
          size="small"
          @change="fieldOptionsChangeHandler"
        >
          <ElRadioButton value="Code">
            从系统代码表中选择
          </ElRadioButton>
          <ElRadioButton value="Input">
            手工输入
          </ElRadioButton>
          <ElRadioButton value="Method">
            从后台方法
          </ElRadioButton>
        </ElRadioGroup>
      </BaseFormItem>

      <div v-show="formData.source === 'Code'" class="form-item-center">
        <BaseFormItem prop="value" :dict="codeTypes" />
      </div>

      <div v-show="formData.source === 'Input'" class="form-item-center">
        <div class="gray" style="margin-bottom: 10px;">
          {{ inputTips }}
        </div>
        <BaseFormItem
          prop="value"
          widget="textarea"
          :widget-props="{
            rows: 6,
            placeholder: inputPlaceholder,
          }"
        />
      </div>

      <div v-show="formData.source === 'Method'" class="form-item-center">
        <BaseFormItem
          prop="value"
          :widget-props="{
            placeholder: '请输入，方法返回必须是Mapx.toDataTable()',
          }"
        />
      </div>
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取 消
      </BaseButton>
      <BaseButton type="primary" @click="handleSubmit">
        确 定
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style scoped>
.meta-clounm-options-dlg :deep(.el-dialog) {
  width: 530px;
}
.meta-clounm-options-dlg :deep(.el-select) {
  width: 100%;
}
.meta-clounm-options-dlg :deep(.el-radio-group label),
.el-form-item__content label {
  padding: 0;
}
.meta-clounm-options-dlg .el-form-item .el-input {
  width: 400px;
  margin-right: 5px;
}
.meta-clounm-options-dlg :deep(.el-form-item .el-textarea) {
  width: 400px;
  margin-right: 5px;
}
.meta-clounm-options-dlg :deep(.form-item-center .el-form-item__content) {
  margin: 0 auto !important;
  width: 400px;
}
@media (max-width: 480px) {
  .meta-clounm-options-dlg :deep(.el-dialog) {
    width: 96%;
  }
}
</style>

<script lang="ts" setup>
import axios from 'axios'
import { pinyin } from 'pinyin-pro'
import { ref } from 'vue'
import util from '@/utils/util'

const emit = defineEmits(['addSuccess', 'editSuccess'])
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)
const mode = ref<'add' | 'edit'>('add')
const title = computed(() => mode.value === 'add' ? '新增' : '编辑')
const code = ref<string | number>('')
const modelId = ref<string | number>('')

// 表单数据
const datasource = ref<any>()

/**
 * 打开
 */
function openEdit(_modelId: number, _code: string): void {
  mode.value = 'edit'
  code.value = _code
  modelId.value = _modelId
  submitLoading.value = false
  datasource.value = () => axios.get(`/ui/metamodels/${modelId.value}/groups/${code.value}`).then(r => r.data.data)

  visible.value = true
}
/**
 * 打开
 */
function openAdd(_modelId: number): void {
  mode.value = 'add'
  modelId.value = _modelId
  submitLoading.value = false
  datasource.value = { name: '', code: '' }

  visible.value = true
}

function handleCancel() {
  visible.value = false
}

/**
 * 根据名称初始化 code
 */
function initCodeByName(model) {
  if (model.code.trim()) {
    return
  }
  model.code = pinyin(model.name, { pattern: 'first', toneType: 'none' }).replace(/\s/g, '')
}

async function handleSubmit() {
  const formData = formRef.value?.model

  formRef.value?.validate()?.then(() => {
    submitLoading.value = true

    let handle
    if (mode.value === 'add') {
      handle = axios.post(`/ui/metamodels/${modelId.value}/groups`, formData).then((r) => {
        emit('addSuccess')
        return r
      })
    }
    else {
      handle = axios.put(`/ui/metamodels/${modelId.value}/groups/${code.value}`, formData).then((r) => {
        emit('editSuccess')
        return r
      })
    }

    handle.then(({ data }) => {
      if (data.status === 1) {
        handleCancel()
      }
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

defineExpose({ openAdd, openEdit })
</script>

<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="datasource"
    >
      <template #default="{ model }">
        <BaseFormItem label="名称" prop="name" widget="input" :widget-props="{ onChange: () => initCodeByName(model) }" :verify="['NotNull']" />
        <BaseFormItem
          label="代码" prop="code" :verify="[
            'NotNull',
            'Regex=^[a-zA-Z0-9_\.\-\/]+$||只能填写字母、数字、.、下划线、中划线',
          ]"
        />
      </template>
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.Metadata.Save" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style scoped>
.detail-form :deep(.is-required) {
  display: block;
}
.metadata-column-group-add-form :deep(.el-form-item .el-input) {
  width: 260px;
  margin-right: 5px;
}
</style>

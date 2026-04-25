<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRequest } from '@/hooks/useRequest'
// import ControlCheckbox from '@/modules/platform/_components/control/ControlCheckbox.vue'
// import ControlDatePicker from '@/modules/platform/_components/control/ControlDatePicker.vue'
import ControlNumber from '@/modules/platform/_components/control/ControlNumber.vue'
import ControlPassword from '@/modules/platform/_components/control/ControlPassword.vue'
import ControlRadio from '@/modules/platform/_components/control/ControlRadio.vue'
// import ControlRichText from '@/modules/platform/_components/control/ControlRichText.vue'
import ControlSelect from '@/modules/platform/_components/control/ControlSelect.vue'
import ControlText from '@/modules/platform/_components/control/ControlText.vue'
import ControlTextArea from '@/modules/platform/_components/control/ControlTextArea.vue'

// import ControlTreeViewSelect from '@/modules/platform/_components/control/ControlTreeViewSelect.vue'
// import ControlUpload from '@/modules/platform/_components/control/ControlUpload.vue'
// import ZFromItem from '@/modules/platform/_components/control/FormItem.vue'
import util from '@/utils/util'

defineOptions({
  components: {
    ControlPassword,
    ControlRadio,
    ControlSelect,
    ControlText,
    ControlTextArea,
    ControlNumber,
    // ControlTreeViewSelect,
    // ControlCheckbox,
    // ControlDatePicker,
    // ControlUpload,
    // ControlRichText,
    // ZFromItem,
  },
})

const emit = defineEmits(['addSuccess', 'editSuccess'])
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)
const mode = ref<'add' | 'edit'>('add')
const title = computed(() => mode.value === 'add' ? '新增' : '编辑')

const pk = ref()
const modelId = ref()

// 表单数据
const datasource = ref<any>()
const tempFields = useRequest(() => axios.get(`/ui/metamodels/${modelId.value}/columns`).then(r => r.data.data), () => [])
const fieldGroup = useRequest(() => axios.get(`/ui/metamodels/${modelId.value}/groups`).then(r => r.data.data), () => [])
const fields = useRequest(() => axios.get(`/ui/metamodels/${modelId.value}/columns`).then(r => r.data.data), () => [])

const initData = useRequest(() => Promise.all([tempFields.send(), fieldGroup.send(), fields.send()]))
const loading = toRef(initData, 'delayLoading')

/**
 * 打开
 */
function openEdit(_modelId: number, _pk: string): void {
  mode.value = 'edit'
  pk.value = _pk
  modelId.value = _modelId
  submitLoading.value = false
  initData.send()

  datasource.value = () => axios.get(`/ui/metamodels/${modelId.value}/datas/${pk.value}`).then(r => r.data.data)

  visible.value = true
}
/**
 * 打开
 */
function openAdd(_modelId: number): void {
  mode.value = 'add'
  modelId.value = _modelId
  submitLoading.value = false
  initData.send()

  const pkData = {
    PKValue: '',
    content: {},
  }
  tempFields.result.forEach((val) => {
    switch (val.dataType) {
      case 'Long':
        pkData.content[val.code] = 0
        break
      case 'Double':
        pkData.content[val.code] = 0.0
        break
      case 'Datetime':
        pkData.content[val.code] = new Date()
        break
      default:
        pkData.content[val.code] = val.defaultValue || ''
        break
    }
    if (val.controlType === 'Checkbox') {
      pkData.content[val.code] = ''
    }
  })
  datasource.value = pkData

  visible.value = true
}

// 提交添加或编辑事件
async function confirmHandler() {
  const formData = formRef.value?.model

  formRef.value?.validate()?.then(() => {
    submitLoading.value = true

    let handle
    if (mode.value === 'add') {
      handle = axios.post(`/ui/metamodels/${modelId.value}/datas`, formData).then((r) => {
        emit('addSuccess')
        return r
      })
    }
    else {
      handle = axios.put(`/ui/metamodels/${modelId.value}/datas/${pk.value}`, formData).then((r) => {
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

const tmpFields = computed(() => fields.result.concat())

// 获取某个分组字段
function getGroupFields(groupCode) {
  return tmpFields.value.filter(val => val.groupCode === groupCode)
}

// 获取控件类型
function getControlType(field) {
  if (
    field.controlType === 'Text'
    && (field.dataType === 'Long' || field.dataType === 'Double')
  ) {
    return 'ControlNumber'
  }
  switch (field.controlType) {
    case 'Radio':
      return 'ControlRadio'
    case 'Select':
      return 'ControlSelect'
    case 'TreeViewSelect':
      return 'ControlTreeViewSelect'
    case 'Text':
      return 'ControlText'
    case 'TextArea':
      return 'ControlTextArea'
    case 'Checkbox':
      return 'ControlCheckbox'
    case 'Date':
      return 'ControlDatePicker'
    case 'DateTime':
      return 'ControlDatePicker'
    case 'RichText':
      return 'ControlRichText'
    case 'ImageUpload':
    case 'FileUpload':
    case 'AudioUpload':
    case 'VideoUpload':
      return 'ControlUpload'
    default:
      return ''
  }
}

// 获取控件配置
function getControlConfig(field) {
  const config = {
    dataType: field.dataType,
    listOptions: void 0,
    resourceType: void 0,
  }

  if (field.listOptions) {
    config.listOptions = field.listOptions
  }

  if (field.controlType === 'DateTime') {
    config.dataType = 'DateTime'
  }
  if (['ImageUpload', 'FileUpload', 'AudioUpload', 'VideoUpload'].includes(field.controlType)) {
    config.resourceType = field.controlType.substring(0, field.controlType.length - 6)
  }
  return config
}

function handleCancel() {
  visible.value = false
}

defineExpose({ openAdd, openEdit })
</script>

<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    width="800px"
  >
    <BaseForm
      ref="formRef"
      v-loading="loading"
      :datasource="datasource"
      :col="1"
      label-width="230px"
      class="metadata-data-from"
    >
      <template #default="{ model }">
        <ElFormItem label="PK值" prop="PKValue" :verify="['NotNull']">
          <ElInput v-model="model.PKValue" />
        </ElFormItem>
        <div v-for="group in fieldGroup.result" :key="group.code" class="filed-group">
          <h4 class="group-name">
            {{ group.name }}
          </h4>
          <ZFromItem v-for="field in getGroupFields(group.code)" :key="field.ID" :field="field">
            <component
              :is="getControlType(field)"
              :model-value="model?.content?.[field.code]"
              :config="getControlConfig(field)"
              @update:model-value="(val) => model.content[field.code] = val"
            />
          </ZFromItem>
        </div>
      </template>
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <ElButton
        :loading="submitLoading"
        priv="Platform.Metadata.EditData"
        type="primary"
        @click="confirmHandler"
      >
        保存
      </ElButton>
    </template>
  </BaseDialog>
</template>

<style scoped>
.metadata-data-from :deep(.el-form-item .el-input) {
  width: 330px;
  margin-right: 5px;
}
.metadata-data-from :deep(.el-form-item .el-textarea) {
  width: 330px;
  margin-right: 5px;
}
.metadata-data-from :deep(.filed-group .group-name) {
  padding: 10px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-secondary);
}
</style>

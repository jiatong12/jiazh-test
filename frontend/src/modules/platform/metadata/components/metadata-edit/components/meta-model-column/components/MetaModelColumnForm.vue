<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'
import { pinyin } from 'pinyin-pro'
import { ref } from 'vue'
import util from '@/utils/util'
import MetaColumnOptionsDialog from './MetaModelColumnOptionsDialog.vue'
import MetaColumnVerifyDialog from './MetaModelColumnVerifyDialog.vue'

const emit = defineEmits(['addSuccess', 'editSuccess'])
const formRef = useTemplateRef('formRef')
const metaColumnOptionsDialogRef = useTemplateRef('metaColumnOptionsDialogRef')
const metaColumnVerifyDialogRef = useTemplateRef('metaColumnVerifyDialogRef')

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
  initData()

  mode.value = 'edit'
  code.value = _code
  modelId.value = _modelId
  submitLoading.value = false
  datasource.value = () => axios.get(`/ui/metamodels/${modelId.value}/columns/${code.value}`).then((r) => {
    const result = r.data.data ?? {}
    if (result.addTime) {
      result.addTime = dayjs(result.addTime, 'YYYY-MM-DD HH:mm:ss')
    }
    if (result.modifyTime) {
      result.modifyTime = dayjs(result.modifyTime, 'YYYY-MM-DD HH:mm:ss')
    }
    return result
  })

  visible.value = true
}
/**
 * 打开
 */
function openAdd(_modelId: number): void {
  initData()

  mode.value = 'add'
  modelId.value = _modelId
  submitLoading.value = false
  datasource.value = {
    name: '',
    code: '',
    groupCode: '',
    controlType: 'Text',
    dataType: 'ShortText',
    mandatoryFlag: 'N',
    defaultValue: '',
    listOptions: '',
    verifyRule: '',
    verifyCondition: '',
    styleClass: '',
    styleText: '',
    isForegroundDisplay: '',
    isBackstageDisplay: '',
    fVisible: '',
    bVisible: '',
    memo: '',
    addTime: '',
    modifyTime: '',
  }

  visible.value = true
}

function handleCancel() {
  visible.value = false
}

// 下拉数据
const sdt = ref<Record<string, string>>({}) // 特色控件类型和数据类型键值对
const dataTypeDisabled = ref(false) // 数据类型是否不可编辑

// 表单规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入代码', trigger: 'blur' },
    { pattern: /^[\w.\-/]+$/, message: '只能填写字母、数字、.、下划线、中划线', trigger: 'blur' },
  ],
  groupCode: [{ trigger: 'change', required: true, message: '请选择分组' }],
  controlType: [{ trigger: 'change', required: true, message: '请选择控件类型' }],
  dataType: [{ trigger: 'change', required: true, message: '请选择数据类型' }],
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

async function loadSDT() {
  try {
    const res = await axios.get('/ui/metamodels/0/columns/sdt')
    sdt.value = res.data.data
  }
  catch (error) {
    console.error('Failed to load SDT:', error)
  }
}

const controlTypes = () => axios.get('/ui/metamodels/0/columns/controlTypes').then(r => r.data.data?.length ? r.data.data : [{ key: '', value: '' }])
const dataType = () => axios.get('/ui/metamodels/0/columns/dataTypes').then(r => r.data.data?.length ? r.data.data : [{ key: '', value: '' }])
const fieldGroup = () => axios.get(`/ui/metamodels/${modelId.value}/groups`).then(r => r.data.data?.length ? r.data.data : [{ code: '', name: '' }])

async function initData() {
  await loadSDT()

  dataTypeChangeHandler(formRef.value?.model.controlType, formRef.value?.model.dataType)
}

// 是否必填开关改变事件
function mandatoryChangeHandler(val: any) {
  const model = formRef.value!.model
  const { verifyRule } = model
  if (val === 'Y') {
    if (verifyRule.includes('NotNull')) {
      return
    }
    model.verifyRule = verifyRule.length > 0
      ? `${verifyRule}&&NotNull`
      : 'NotNull'
  }
  else {
    model.verifyRule = verifyRule.replace('NotNull', '')
    model.verifyRule = verifyRule.replace('&&&&', '&&')
    if (verifyRule.endsWith('&&')) {
      model.verifyRule = verifyRule.substring(0, verifyRule.length - 2)
    }
    if (verifyRule.startsWith('&&')) {
      model.verifyRule = verifyRule.substring(2)
    }
  }
}

// 控件类型改变事件
function dataTypeChangeHandler(val: string, oldDataType?: string) {
  if (sdt.value[val]) {
    formRef.value!.model.dataType = sdt.value[val]
    dataTypeDisabled.value = true
  }
  else {
    dataTypeDisabled.value = false
    formRef.value!.model.dataType = oldDataType || 'ShortText'
  }
}

// 校验规则弹框回调
function getFieldValidateRules(data: string) {
  if (formRef.value?.model.mandatoryFlag === 'Y') {
    if (!data.includes('NotNull')) {
      data = data.length > 0 ? `NotNull&&${data}` : 'NotNull'
    }
  }
  formRef.value!.model.verifyRule = data
}

// 添加字段或修改字段保存事件
async function handleSubmit() {
  const formData = formRef.value?.model

  formRef.value?.validate()?.then(() => {
    submitLoading.value = true

    let handle
    if (mode.value === 'add') {
      handle = axios.post(`/ui/metamodels/${modelId.value}/columns`, formData).then((r) => {
        emit('addSuccess')
        return r
      })
    }
    else {
      handle = axios.put(`/ui/metamodels/${modelId.value}/columns/${code.value}`, formData).then((r) => {
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

defineExpose({
  openAdd, openEdit,
})
</script>

<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    width="800px"
  >
    <BaseForm
      ref="formRef"
      :datasource="datasource"
      :rules="rules"
    >
      <template #default="{ model }">
        <ElRow :gutter="36">
          <ElCol :span="11">
            <h4 class="title">
              基本信息
            </h4>
            <BaseFormItem label="名称" prop="name" widget="input" :widget-props="{ onChange: () => initCodeByName(model) }" />

            <BaseFormItem label="代码" prop="code" :widget-props="{ disabled: mode !== 'add' }" />

            <BaseFormItem label="字段分组" prop="groupCode" widget="select" :dict="fieldGroup" :widget-props="{ labelField: 'name', valueField: 'code' }" />
            <BaseFormItem label="控件类型" prop="controlType" widget="select" :dict="controlTypes" :widget-props="{ labelField: 'value', valueField: 'key' }" />
            <BaseFormItem label="数据类型" prop="dataType" widget="select" :dict="dataType" :widget-props="{ labelField: 'value', valueField: 'key' }" />

            <BaseFormItem label="是否必填" prop="mandatoryFlag">
              <ElSwitch
                v-model="model.mandatoryFlag"
                active-value="Y"
                inactive-value="N"
                @click="mandatoryChangeHandler"
              />
            </BaseFormItem>
            <BaseFormItem label="默认值" prop="defaultValue">
              <ElDatePicker
                v-if="model.controlType === 'Date'"
                id="data-default-value"
                v-model="model.defaultValue"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
              <ElDatePicker
                v-else-if="model.controlType === 'DateTime'"
                id="datatime-default-value"
                v-model="model.defaultValue"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              />
              <ElInput v-else v-model="model.defaultValue" />
            </BaseFormItem>
          </ElCol>
          <ElCol :span="13">
            <h4 class="title">
              界面属性
            </h4>
            <ElFormItem label="选项列表">
              <ElInput v-model="model.listOptions" :disabled="true">
                <template #append>
                  <BaseButton @click="metaColumnOptionsDialogRef?.open(model.listOptions)">
                    设置
                  </BaseButton>
                </template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="校验规则">
              <ElInput v-model="model.verifyRule">
                <template #append>
                  <BaseButton @click="metaColumnVerifyDialogRef?.open(model.verifyRule)">
                    设置
                  </BaseButton>
                </template>
              </ElInput>
            </ElFormItem>
            <BaseFormItem label="校验条件" prop="verifyCondition" />
            <BaseFormItem label="CSS样式类" prop="styleClass" />
            <BaseFormItem label="CSS样式文本" prop="styleText" />
            <ElFormItem class="visible-type">
              <ElCheckbox v-model="model.fVisible" true-value="Y" false-value="N">
                前台列表页面显示
              </ElCheckbox>
              <ElCheckbox v-model="model.bVisible" true-value="Y" false-value="N">
                后台列表页面显示
              </ElCheckbox>
            </ElFormItem>
            <BaseFormItem label="说明文本" prop="memo" widget="textarea" :widget-props="{ rows: 2 }" />
          </ElCol>
        </ElRow>
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

    <!--  选项列表弹框 -->
    <MetaColumnOptionsDialog ref="metaColumnOptionsDialogRef" @confirm="(data) => formRef!.model.listOptions = data" />
    <!-- 校验规则弹框 -->
    <MetaColumnVerifyDialog ref="metaColumnVerifyDialogRef" @confirm="getFieldValidateRules" />
  </BaseDialog>
</template>

<style scoped>
.metadata-column-form :deep(.el-form-item .el-input) {
  width: 250px;
  margin-right: 5px;
}
.metadata-column-form :deep(.el-form-item .el-textarea) {
  width: 250px;
  margin-right: 5px;
}
.metadata-column-form :deep(.el-form-item .el-checkbox__label) {
  font-size: 13px;
}
.metadata-column-form :deep(.el-form-item .el-checkbox + .el-checkbox) {
  margin-left: 10px;
}
.metadata-column-form :deep(.visible-type .el-form-item__content) {
  margin-left: 70px !important;
}
</style>

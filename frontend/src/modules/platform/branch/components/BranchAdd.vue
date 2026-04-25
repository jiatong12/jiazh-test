<script lang="ts" setup>
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import { pinyin } from 'pinyin-pro'
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'
import util from '@/utils/util'
import LangEditDialog from '../../_components/LangEditDialog.vue'
import UserSelect from '../../_components/UserSelect.vue'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')
const langDialogRef = useTemplateRef('langDialogRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

// 表单数据
const [formData, resetFormData] = useResettableState(() => ({
  parentInnerCode: '',
  manager: '',
  branchCode: '',
  parentBranchName: '',
  name: '',
  phone: '',
  fax: '',
  managers: [],
  extend: {},
  name_I18N: '',
}))

/**
 * 根据名称初始化 branchCode
 */
function initBranchCodeByName() {
  if (formData.value.branchCode) {
    return
  }
  formData.value.branchCode = pinyin(formData.value.name, { pattern: 'first', toneType: 'none' }).replace(/\s/g, '')
}
/**
 * 打开，并根据参数初始化表单
 * @param data 初始表单的数据
 */
function openWithData(data: Record<string, any>): void {
  submitLoading.value = false
  // 重置
  resetFormData()
  // 合并
  formData.value = { ...formData.value, ...cloneDeep(data) }
  visible.value = true
}

function open(): void {
  openWithData({})
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.post('/ui/branches', formData.value).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

defineExpose({ open, openWithData, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="新增组织机构"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :col="1"
      label-width="100px"
    >
      <template #default="{ model }">
        <BaseFormItem label="名称" prop="name" required>
          <ElInput v-model="formData.name" placeholder="请输入" @blur="initBranchCodeByName">
            <template #append>
              <BaseIcon
                name="i-fluent-mdl2:locale-language" @click="langDialogRef?.open({
                  id: 'name',
                  languages: model.name_I18N,
                  targetValue: model.name,
                  callback: (data) => {
                    model.name = data.val
                    model.name_I18N = data.data
                  },
                })"
              />
            </template>
          </ElInput>
        </BaseFormItem>
        <BaseFormItem label="编号" prop="branchCode" required />
        <BaseFormItem label="上级机构" prop="parentInnerCode" required>
          <BizSelectBranches v-model="formData.parentInnerCode" />
        </BaseFormItem>
        <BaseFormItem label="机构主管">
          <UserSelect v-model="formData.manager" />
        </BaseFormItem>
        <BaseFormItem
          label="电话"
          prop="phone"
          :verify="[
            'Length<20',
            'Regex=^1[3-9]\\d{9}$|^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}$||请输入正确的电话号码',
          ]"
        />
        <BaseFormItem
          label="传真"
          prop="fax"
          :verify="['Length<20', 'Regex=^[u4E00-u9FA5]+$||请输入正确的传真号码']"
        />
      <!-- <BranchFormDialogExtend
              v-model:extend-form="tmpBranch"
              url="/ui/branches/metamodel"
            /> -->
      </template>
    </BaseForm>

    <LangEditDialog ref="langDialogRef" />

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.Branch.Add" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

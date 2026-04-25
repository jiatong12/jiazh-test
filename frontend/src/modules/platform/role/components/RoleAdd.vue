<script lang="ts" setup>
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import { pinyin } from 'pinyin-pro'
import { useResettableState } from '@/hooks/useResettableState'
import { useUserStore } from '@/store/modules/user'
import util from '@/utils/util'
import LangEditDialog from '../../_components/LangEditDialog.vue'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')
const langDialogRef = useTemplateRef('langDialogRef')

const userStore = useUserStore()

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

// 表单数据
const [formData, resetFormData] = useResettableState(() => ({
  roleCode: '',
  roleName: '',
  memo: '',
  branchInnerCode: '',
  homepageLayoutID: '',
}))

/**
 * 根据名称初始化 roleCode
 */
function initRoleCodeByName() {
  if (formData.value.roleCode.trim()) {
    return
  }
  formData.value.roleCode = pinyin(formData.value.roleName, { pattern: 'first', toneType: 'none' }).replace(/\s/g, '')
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
    axios.post('/ui/roles', formData.value).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const isSecurityRole = computed(() => userStore.userInfo?.roleType === 'security')

function layoutOptionsApi() {
  return axios.get('/ui/homepage/layout/all').then(r => [
    {
      value: 0,
      label: '默认配置',
    },
    ...Object.entries(r.data.data).map(([key, label]) => ({
      value: +key,
      label,
    })),
  ])
}

defineExpose({ open, openWithData, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="新增角色"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :col="1"
      label-width="100px"
    >
      <template #default="{ model }">
        <BaseFormItem label="角色名" prop="roleName" :verify="['NotNull', 'Regex=^[\u4e00-\u9fa5|A-Za-z]{1,16}$||请用1-16位的中文或者字母']">
          <template v-if="isSecurityRole">
            {{ formData.roleName }}
          </template>
          <ElInput v-else v-model="formData.roleName" placeholder="请输入" @blur="initRoleCodeByName">
            <template #append>
              <BaseIcon
                name="i-fluent-mdl2:locale-language" @click="langDialogRef?.open({
                  id: 'roleName',
                  languages: model.roleName_I18N,
                  targetValue: model.roleName,
                  callback: (data) => {
                    model.roleName = data.val
                    model.roleName_I18N = data.data
                  },
                })"
              />
            </template>
          </ElInput>
        </BaseFormItem>
        <BaseFormItem
          label="角色代码" prop="roleCode" :verify="[
            'NotNull',
            'Regex=^[a-zA-Z0-9_]{1,16}$||请用1-16位的英文字母、数字、下划线',
          ]"
        />
        <BaseFormItem label="所属机构" prop="branchInnerCode" required>
          <BizSelectBranches v-model="formData.branchInnerCode" />
        </BaseFormItem>
        <BaseFormItem label="备注" prop="memo">
          <template v-if="isSecurityRole">
            {{ formData.memo }}
          </template>
          <ElInput v-else v-model="formData.memo" placeholder="请输入">
            <template #append>
              <BaseIcon
                name="i-fluent-mdl2:locale-language" @click="langDialogRef?.open({
                  id: 'memo',
                  languages: model.memo_I18N,
                  targetValue: model.memo,
                  callback: (data) => {
                    model.memo = data.val
                    model.memo_I18N = data.data
                  },
                })"
              />
            </template>
          </ElInput>
        </BaseFormItem>
        <BaseFormItem label="首页配置" prop="homepageLayoutID" widget="select" :is-readonly="isSecurityRole" :dict="layoutOptionsApi" />
      </template>
    </BaseForm>

    <LangEditDialog ref="langDialogRef" />

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton v-if="!isSecurityRole" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

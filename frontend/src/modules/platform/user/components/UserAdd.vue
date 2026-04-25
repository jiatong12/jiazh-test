<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'
import { useUserStore } from '@/store/modules/user'
import { PasswordCrypto } from '@/utils/passwordCrypto'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')
const userStore = useUserStore()

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

// 表单数据
const [formData, resetFormData] = useResettableState(() => ({
  userName: '',
  realName: '',
  password: '',
  repeatPassword: '',
  status: 'Y',
  branchInnerCode: null,
  roles: [] as any[],
  roleIds: [],
  lastModifyPassTime: '',
  email: '',
  tel: '',
  mobile: '',
  remark: '',
  roleCode: '',
}))

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
    const data = { ...formData.value }
    const deskey = userStore.userInfo?.userName
    data.password = PasswordCrypto.makeAES(data.password, deskey)
    data.repeatPassword = PasswordCrypto.makeAES(data.repeatPassword, deskey)
    axios.post('/ui/users', data).then(({ data }) => {
      if (data.status === 1) {
        emit('submitSuccess')
        handleCancel()
      }
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const rules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码最少6位，最多32位', trigger: 'blur' },
  ],
  repeatPassword: [
    { required: true, message: '请重复输入一次密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== formData.value.password) {
          callback(new Error('两次输入密码不一致!'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  branchInnerCode: [
    {
      required: true,
      message: '请选择所属机构',
      trigger: 'change',
    },
  ],
  roleIds: [
    {
      type: 'array',
      required: true,
      message: '请选择所属角色',
      trigger: 'change',
    },
  ],
}

const getBranches = () => axios.get('/ui/branches').then(res => res.data.data)
const getRoles = () => axios.get('/ui/roles', { params: { pageSize: 99999 } }).then(res => res.data?.data?.map(({ roleCode, name }) => ({ label: name, value: roleCode })))
const roleIdsWidgetProps = {
  collapseTags: true,
  onSyncItem: (val) => {
    formData.value.roles = val?.map(e => e.value)
    formData.value.roleCode = formData.value.roles?.join(',')
  },
}

const isSecurityRole = computed(() => userStore.userInfo?.roleType === 'security')

defineExpose({ open, openWithData, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="新增用户"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="rules"
      :col="1"
      label-width="100px"
    >
      <BaseFormItem label="用户名" prop="userName" />
      <BaseFormItem label="真实姓名" prop="realName" :is-readonly="isSecurityRole" />
      <BaseFormItem label="密码" prop="password" widget="input" :widget-props="{ type: 'password' }" />
      <BaseFormItem label="确认密码" prop="repeatPassword" widget="input" :widget-props="{ type: 'password' }" />
      <BaseFormItem label="所属机构" prop="branchInnerCode" widget="treeSelect" :is-readonly="isSecurityRole" :widget-props="{ labelField: 'name', valueField: 'branchCode', disabledField: 'disabled', checkStrictly: true }" :dict="getBranches" />
      <!-- <ElFormItem label="所属机构" prop="branchInnerCode">
        <BaseTreeSelect v-model="formData.branchInnerCode" :dict="getBranches" v-bind="{ labelField: 'name', valueField: 'branchCode', checkStrictly: true }" />
      </ElFormItem> -->
      <BaseFormItem label="邮箱" prop="email" :is-readonly="isSecurityRole" />
      <BaseFormItem label="联系电话" prop="tel" :is-readonly="isSecurityRole" />
      <BaseFormItem label="手机号码" prop="mobile" :is-readonly="isSecurityRole" />
      <BaseFormItem v-if="!userStore.userInfo?.isThreeRole || isSecurityRole" label="所属角色" prop="roleIds" widget="multipleSelect" :widget-props="roleIdsWidgetProps" :dict="getRoles" />
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.User.Add" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>

<script setup lang="tsx">
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { cloneDeep } from 'lodash-es'
import { useRequest } from '@/hooks/useRequest'
import { useUserStore } from '@/store/modules/user'
import util from '@/utils/util'
import ApiPermission from '../../_components/modules/ApiPermission.vue'
import BlockPermission from '../../_components/modules/BlockPermission.vue'
import CatalogPermission from '../../_components/modules/CatalogPermission.vue'
import DocPermission from '../../_components/modules/DocPermission.vue'
// import BranchFormDialogExtend from './FormDialogExtend.vue'
// import LangEditDialog from './LangEditDialog.vue'
import MenuPermission from '../../_components/modules/MenuPermission.vue'
import ModulesPermission from '../../_components/modules/ModulesPermission.vue'
import SitePermission from '../../_components/modules/SitePermission.vue'
import UserSelect from '../../_components/UserSelect.vue'

defineOptions({
  components: {
    MenuPermission,
    SitePermission,
    ApiPermission,
    CatalogPermission,
    ModulesPermission,
    DocPermission,
    BlockPermission,
    // BranchFormDialogExtend,
    // TreeSelect,
    // LangEditDialog,
    UserSelect,
  },
})

const emit = defineEmits(['submitSuccess'])
const drawerRef = useTemplateRef('drawerRef')
const userStore = useUserStore()

const visible = ref(false)
const submitLoading = ref(false)

const userPermissionTypesRequest = useRequest(() => axios.get('/ui/permissions/id/none/type/none/types').then(r => r.data.data), () => [])

// 表单数据
const formData = ref<any>({})

const userName = ref('')
/**
 * 打开，并根据参数初始化表单
 * @param data 初始表单的数据
 */
function openWithData(data: Record<string, any>): void {
  submitLoading.value = false
  formData.value = cloneDeep(data)
  userName.value = data.userName
  userPermissionTypesRequest.send()
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

const formRef = useTemplateRef('formRef')
async function handleSubmit() {
  userName.value = formData.value.userName
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.post('/ui/users', formData.value).then(({ data }) => {
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

const currentTab = ref('base')

const getBranches = () => axios.get('/ui/branches').then(res => res.data.data)
const getRoles = () => axios.get('/ui/roles').then(res => res.data?.data?.map(({ roleCode, name }) => ({ label: name, value: roleCode })))
const roleIdsWidgetProps = {
  collapseTags: true,
  onSyncItem: (val) => {
    formData.value.roles = val?.map(e => e.value)
    formData.value.roleCode = formData.value.roles?.join(',')
  },
}

const rules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
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

const isSecurityRole = computed(() => userStore.userInfo?.roleType === 'security')

defineExpose({ openWithData, drawerRef })
</script>

<template>
  <BaseDrawer ref="drawerRef" v-model="visible" title="编辑用户" size="96%">
    <div class="card h-full flex-column-layout">
      <ElTabs v-model="currentTab" class="h-full">
        <ElTabPane key="base" label="基本信息" name="base" class="h-full overflow-y-auto">
          <BaseForm
            ref="formRef"
            :datasource="formData"
            :rules="rules"
            :col="1"
            label-width="100px"
            width="400px"
          >
            <template #default="{ model }">
              <BaseFormItem label="用户名" prop="userName" is-readonly />
              <BaseFormItem label="真实姓名" prop="realName" :is-readonly="isSecurityRole" />
              <BaseFormItem label="所属机构" prop="branchInnerCode" :is-readonly="isSecurityRole" widget="treeSelect" :widget-props="{ labelField: 'name', valueField: 'branchCode', checkStrictly: true }" :dict="getBranches" />
              <BaseFormItem label="邮箱" prop="email" :is-readonly="isSecurityRole" />
              <BaseFormItem label="联系电话" prop="tel" :is-readonly="isSecurityRole" />
              <BaseFormItem label="手机号码" prop="mobile" :is-readonly="isSecurityRole" />
              <BaseFormItem v-if="!userStore.userInfo?.isThreeRole || isSecurityRole" label="所属角色" prop="roleIds" :is-readonly="isSecurityRole" widget="multipleSelect" :widget-props="roleIdsWidgetProps" :dict="getRoles" />
              <BaseFormItem
                v-if="!userStore.isCurrentUser(model.userName)" :is-readonly="isSecurityRole" label="状态" prop="status" widget="switch"
                :widget-props="{ activeValue: 'Y', inactiveValue: 'N', activeText: '启用', inactiveText: '停用', inlinePrompt: true }"
              />
            </template>
          </BaseForm>
          <div class="pane-btns">
            <BaseButton @click="handleCancel">
              取 消
            </BaseButton>
            <BaseButton priv="Platform.User.Edit" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
              保存基本信息
            </BaseButton>
          </div>
        </ElTabPane>
        <ElTabPane v-for="type in userPermissionTypesRequest.result" :key="type.code" :label="type.name" :name="type.code" class="h-full overflow-y-auto">
          <div>
            <component :is="type.code[0].toUpperCase() + type.code.slice(1)" v-if="currentTab === type.code" :id="userName" type="U" />
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </BaseDrawer>
</template>

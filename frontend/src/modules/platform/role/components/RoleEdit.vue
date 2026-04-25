<script setup lang="ts">
import axios from 'axios'
import { pinyin } from 'pinyin-pro'
import { useTableSetup } from '@/components/base-table'
import { useRequest } from '@/hooks/useRequest'
import { useUserStore } from '@/store/modules/user'
import util from '@/utils/util'
// import BranchFormDialogExtend from './FormDialogExtend.vue'
import LangEditDialog from '../../_components/LangEditDialog.vue'
import ApiPermission from '../../_components/modules/ApiPermission.vue'
import BlockPermission from '../../_components/modules/BlockPermission.vue'
import CatalogPermission from '../../_components/modules/CatalogPermission.vue'
import DocPermission from '../../_components/modules/DocPermission.vue'
import MenuPermission from '../../_components/modules/MenuPermission.vue'
import ModulesPermission from '../../_components/modules/ModulesPermission.vue'
import SitePermission from '../../_components/modules/SitePermission.vue'
import RoleUserSelectDialog from './RoleUserSelectDialog.vue'

defineOptions({
  components: {
    MenuPermission,
    SitePermission,
    ApiPermission,
    CatalogPermission,
    ModulesPermission,
    DocPermission,
    BlockPermission,
    RoleUserSelectDialog,
    // BranchFormDialogExtend,
    // UserSelectDialog: userSelectDlg,
    // TreeSelect,
    LangEditDialog,
  },
})

const emit = defineEmits(['submitSuccess'])
const drawerRef = useTemplateRef('drawerRef')
const formRef = useTemplateRef('formRef')
const userTableRef = useTemplateRef('userTableRef')
const langDialogRef = useTemplateRef('langDialogRef')

const userStore = useUserStore()

const visible = ref(false)
const submitLoading = ref(false)

const roleCode = ref('')

/**
 * 根据名称初始化 roleCode
 */
function initRoleCodeByName(model) {
  if (model.roleCode.trim()) {
    return
  }
  model.roleCode = pinyin(model.roleName, { pattern: 'first', toneType: 'none' }).replace(/\s/g, '')
}

const formDatasource = () => axios.get(`/ui/roles/${roleCode.value}`).then(r => r.data.data)

const isShowRoleUserSelectDialog = ref(false)
const tableConfig = useTableSetup({
  rowKey: 'id',
  showIndex: true,
  showSearchAction: true,
  pageSize: 20,
  actionsWidth: '160px',
  showPagination: true,
  datasource: params => axios.get(`/ui/roles/${roleCode.value}/users`, { params }).then(r => r.data),
  columns: [
    { prop: 'userName', label: '用户名', width: '150' },
    { prop: 'realName', label: '真实姓名', width: '150' },
    { prop: 'roles', label: '所属角色' },
  ],
  rowActions: [
    {
      name: '移出角色',
      priv: 'Member.Role.RemoveUser',
      confirmTitle: '确认将该用户从角色中移除？',
      handle({ row }) {
        if (!row || !row.userName) {
          return
        }

        axios.delete(`/ui/roles/${roleCode.value}/users`, {
          params: { usernames: row.userName },
        }).then((res) => {
          util.showResponseMessage(res)
          userTableRef.value?.search()
        })
      },
    },
  ],
  headerActions: [
    {
      name: '添加用户到角色',
      priv: 'Member.Role.AddUser',
      icon: 'i-mdi:plus-thick',
      type: 'primary',
      handle() {
        isShowRoleUserSelectDialog.value = true
      },
    },
  ],
})

// const formState = computed(() => formRef.value?.model ?? {} as any)

const activeName = ref('')
const rolePermissionTypesRequest = useRequest(() => axios.get('/ui/permissions/id/none/type/none/types').then((r) => {
  activeName.value = r.data.status === 1 && r.data.data.length ? r.data.data[0].code : ''
  return r.data.data
}), () => [])
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

/**
 * 打开，并根据参数初始化表单
 */
function open(_roleCode: string): void {
  roleCode.value = _roleCode

  submitLoading.value = false

  rolePermissionTypesRequest.send()
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.put(`/ui/roles/${roleCode.value}`, formRef.value?.model).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const isSecurityRole = computed(() => userStore.userInfo?.roleType === 'security')
const isAdminRole = computed(() => userStore.userInfo?.roleType === 'admin')

defineExpose({ open, drawerRef })
</script>

<template>
  <BaseDrawer ref="drawerRef" v-model="visible" title="编辑角色" size="96%">
    <div class="flex-column-layout h-full">
      <ElRow>
        <ElCol :span="20">
          <div class="mb-2">
            <BaseButton v-if="!isSecurityRole" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
              保存
            </BaseButton>
          </div>
          <BaseForm
            ref="formRef"
            :datasource="formDatasource"
            :col="2"
            class="card"
            label-width="100px"
          >
            <template #default="{ model }">
              <BaseFormItem label="角色名" prop="roleName" required :verify="['NotNull', 'Regex=^[\u4e00-\u9fa5|A-Za-z]{1,16}$||请用1-16位的中文或者字母']">
                <template v-if="isSecurityRole">
                  {{ model.roleName }}
                </template>
                <ElInput v-else v-model="model.roleName" placeholder="请输入" @blur="initRoleCodeByName(model)">
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
                label="角色代码" prop="roleCode" required :verify="[
                  'NotNull',
                  'Regex=^[a-zA-Z0-9_]{1,16}$||请用1-16位的英文字母、数字、下划线',
                ]"
              />
              <BaseFormItem label="所属机构" prop="branchInnerCode" required>
                <BizSelectBranches v-model="model.branchInnerCode" />
              </BaseFormItem>
              <BaseFormItem label="备注" prop="memo">
                <template v-if="isSecurityRole">
                  {{ model.memo }}
                </template>
                <ElInput v-else v-model="model.memo" placeholder="请输入">
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
        </ElCol>
      </ElRow>

      <template v-if="!isAdminRole">
        <div class="card">
          <BaseTable
            ref="userTableRef"
            v-bind="tableConfig"
          >
            <!-- <template #simpleSearch="{ handleSearch, searchFormState }">
              <ElInput v-model.trim="searchFormState.searchName" placeholder="请输入用户名/真实姓名" clearable :suffix-icon="$$renderIcon('i-ep:search')" @clear="handleSearch" />
            </template> -->
            <template #roles_default="{ row }">
              {{ row.roles.map(e => e.name)?.join(', ') }}
            </template>
          </BaseTable>
        </div>
        <div v-if="formRef?.model.roleType === null || formRef?.model.roleType === '' || formRef?.model.roleType === 'normal'" class="card flex-height-fill">
          <ElTabs v-model="activeName" class="h-full">
            <ElTabPane
              v-for="type in rolePermissionTypesRequest.result"
              :key="type.code"
              :label="type.name"
              :name="type.code"
              class="h-full overflow-y-auto"
            >
              <component :is="type.code[0].toUpperCase() + type.code.slice(1)" v-if="activeName === type.code" :id="roleCode" type="R" />
            </ElTabPane>
          </ElTabs>
        </div>
      </template>

      <RoleUserSelectDialog
        v-if="isShowRoleUserSelectDialog"
        v-model:show="isShowRoleUserSelectDialog"
        :role-code="roleCode"
        source="Y"
        @submit-success="userTableRef?.search()"
      />

      <LangEditDialog ref="langDialogRef" />
    </div>
  </BaseDrawer>
</template>

<style lang="scss" scoped>
.flex-height-fill {
  min-height: 0;
}
</style>

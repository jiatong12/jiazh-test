<script setup lang="ts">
import axios from 'axios'
import ApiPermission from '../../_components/modules/ApiPermission.vue'

defineOptions({
  components: {
    ApiPermission,
  },
})

const drawerRef = useTemplateRef('drawerRef')

const visible = ref(false)
const submitLoading = ref(false)

const userId = ref('')

const getRoles = () => axios.get('/ui/roles').then(res => res.data?.data?.map(({ roleCode, name }) => ({ label: name, value: roleCode })))

const appDatasource = () => axios.get(`/ui/tokensetting/${userId.value}`).then(r => r.data.data)
const userDatasource = () => axios.get(`/ui/users/${userId.value}`).then(r => r.data.data)
/**
 * 打开
 */
function open(_userId: string): void {
  userId.value = _userId
  submitLoading.value = false

  visible.value = true
}

const currentTab = ref('apiPermission')

defineExpose({ open, drawerRef })
</script>

<template>
  <BaseDrawer ref="drawerRef" v-model="visible" title="编辑令牌配置" size="96%">
    <div class="flex-column-layout h-full">
      <ElRow>
        <ElCol :span="20">
          <div class="title">
            授权信息
          </div>
          <BaseForm
            :datasource="appDatasource"
            :col="1"
            label-width="100px"
          >
            <BaseFormItem label="应用key" prop="appKey" widget="text" />
            <BaseFormItem label="应用Secret" prop="appSecret" widget="text" />
            <BaseFormItem label="状态" prop="appStatus" widget="badge" :dict="[{ label: '启用', value: 'Y', color: 'success' }, { label: '停用', value: 'N', color: 'danger' }]" />
          </BaseForm>
          <div class="title">
            所属用户
          </div>
          <BaseForm
            :datasource="userDatasource"
            :col="3"
            label-width="100px"
          >
            <BaseFormItem label="用户名" prop="userName" widget="text" />
            <BaseFormItem label="真实姓名" prop="realName" widget="text" />
            <BaseFormItem label="所属机构" prop="branch.name" widget="text" />
            <BaseFormItem label="邮箱" prop="email" widget="text" />
            <BaseFormItem label="联系电话" prop="tel" widget="text" />
            <BaseFormItem label="手机号码" prop="mobile" widget="text" />
            <BaseFormItem label="所属角色" prop="roleIds" widget="tag" :dict="getRoles" />
            <BaseFormItem label="状态" prop="status" widget="badge" :dict="[{ label: '启用', value: 'Y', color: 'success' }, { label: '停用', value: 'N', color: 'danger' }]" />
          </BaseForm>
        </ElCol>
      </ElRow>

      <div class="flex-height-fill">
        <ElTabs v-model="currentTab" class="h-full">
          <ElTabPane label="接口权限" :name="currentTab" class="h-full overflow-y-auto">
            <div>
              <ApiPermission :id="userId" type="U" />
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    </div>
  </BaseDrawer>
</template>

<style lang="scss" scoped>
.flex-height-fill {
  min-height: 0;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}
</style>

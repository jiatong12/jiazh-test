<script setup lang="tsx">
import axios from 'axios'
import { pinyin } from 'pinyin-pro'
import { useRequest } from '@/hooks/useRequest'
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
    UserSelect,
    LangEditDialog,
  },
})

const emit = defineEmits(['submitSuccess'])
const drawerRef = useTemplateRef('drawerRef')
const langDialogRef = useTemplateRef('langDialogRef')

const visible = ref(false)
const submitLoading = ref(false)

/**
 * 根据名称初始化 branchCode
 */
function initBranchCodeByName(model) {
  if (model.branchCode) {
    return
  }
  model.branchCode = pinyin(model.name, { pattern: 'first', toneType: 'none' }).replace(/\s/g, '')
}

const datasource = ref<any>()
const branchPermissionTypesRequest = useRequest(() => axios.get('/ui/permissions/id/none/type/none/types').then(r => r.data.data), () => [])

const branchId = ref('')
const parentId = ref('')

/**
 * 打开，并根据参数初始化表单
 */
function open(_branchId: string, _parentId: string): void {
  branchId.value = _branchId
  parentId.value = _parentId ?? '0'

  submitLoading.value = false

  datasource.value = () => axios.get(`/ui/branches/${branchId.value}`).then(r => r.data.data)
  branchPermissionTypesRequest.send()
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

const formRef = useTemplateRef('formRef')
async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.put(`/ui/branches/${branchId.value}`, formRef.value?.model).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const currentTab = ref('menuPermission')

defineExpose({ open, drawerRef })
</script>

<template>
  <BaseDrawer ref="drawerRef" v-model="visible" title="编辑组织机构" size="96%">
    <div class="flex-column-layout h-full">
      <ElRow>
        <ElCol :span="20">
          <div class="mb-2">
            <BaseButton priv="Platform.Branch.Edit" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
              保存
            </BaseButton>
          </div>
          <BaseForm
            ref="formRef"
            :datasource="datasource"
            :col="2"
            class="card"
            label-width="100px"
          >
            <template #default="{ model }">
              <BaseFormItem label="名称" prop="name" required>
                <ElInput v-model="model.name" placeholder="请输入" @blur="initBranchCodeByName(model)">
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
                <BizSelectBranches v-model="model.parentInnerCode" />
              </BaseFormItem>
              <BaseFormItem label="机构主管">
                <UserSelect v-model="model.manager" />
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
        </ElCol>
      </ElRow>

      <div class="card flex-height-fill">
        <ElTabs v-model="currentTab" class="h-full">
          <ElTabPane
            v-for="(type, index) in branchPermissionTypesRequest.result"
            :key="type.code"
            :label="type.name"
            :name="type.code"
            class="h-full overflow-y-auto"
          >
            <component
              :is="type.code[0].toUpperCase() + type.code.slice(1)"
              v-if="index === 0 || currentTab === type.code"
              :id="branchId"
              type="B"
            />
          </ElTabPane>
        </ElTabs>
      </div>

      <LangEditDialog ref="langDialogRef" />
    </div>
  </BaseDrawer>
</template>

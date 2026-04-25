<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')

// 基础状态
const visible = ref(false)
const selectedUserKeys = ref<string[]>([])

const roleBranchTree = () => axios.get('/ui/branches/branchtree').then(r => r.data.data)

const allUserTableRef = useTemplateRef('allUserTableRef')
const selectedUserTableRef = useTemplateRef('selectedUserTableRef')

function open(): void {
  selectedUserKeys.value = []
  nextTick(() => {
    visible.value = true
  })
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  const selectedRows = selectedUserTableRef.value?.selectedRows ?? []
  if (!selectedRows.length) {
    util.showMessage('请选择用户')
    return
  }
  axios.post('/ui/tokensetting', { users: selectedRows.map(e => e.userName), serverAlias: '' }).then(() => {
    handleCancel()
    emit('submitSuccess')
  })
}

const allUserConfig = useTableSetup({
  rowKey: 'userName',
  showSelection: true,
  showPagination: true,
  pageSize: 10,
  paginationOptions: { layout: 'total,sizes,->,prev,next' },
  datasource: params => axios.get('/ui/tokensetting/users', { params: { selectedUsers: selectedUserKeys.value.join(','), ...params } }).then(r => r.data),
  columns: [
    { prop: 'userName', label: '用户名', minWidth: '20%' },
    { prop: 'realName', label: '真实姓名', minWidth: '25%' },
    { prop: 'branchName', label: '所属机构', minWidth: '25%' },
  ],
})

const selectedUserConfig = useTableSetup({
  rowKey: 'userName',
  showSelection: true,
  showPagination: false,
  datasource: () => axios.get('/ui/userselector/selecteduserdatabind', { params: { selectedUsers: selectedUserKeys.value.join(',') } }).then(r => r.data.data),
  columns: [
    { prop: 'userName', label: '用户名', minWidth: '20%' },
    { prop: 'realName', label: '真实姓名', minWidth: '25%' },
    { prop: 'branchName', label: '所属机构', minWidth: '25%' },
  ],
})

function addUserClick() {
  const selectedKeys = allUserTableRef.value?.selectedKeys ?? []
  selectedUserKeys.value = selectedUserKeys.value.concat(selectedKeys)
  // 刷新表格数据
  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

function removeUserClick() {
  const selectedKeys = selectedUserTableRef.value?.selectedKeys ?? []
  selectedUserKeys.value = selectedUserKeys.value.filter(k => !selectedKeys.includes(k))

  // 刷新表格数据
  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="title"
    class="user-select-dialog"
    width="90%"
  >
    <div style="height: 50vh;overflow-y: auto;">
      <ElRow class="h-full">
        <ElCol :span="11" class="h-full">
          <BaseTable
            ref="allUserTableRef"
            v-bind="allUserConfig"
          >
            <template #searchForm="scope">
              <BaseTableSearchForm v-model="scope.searchFormState" :handle-search="scope.searchFirstPage" :cols="{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }">
                <BaseTableSearchFormItem label="所属机构" prop="branchInnerCode" widget="treeSelect" :widget-props="{ labelField: 'name', valueField: 'branchInnerCode', checkStrictly: true }" :dict="roleBranchTree" />
                <BaseTableSearchFormItem label="用户名或姓名" prop="searchContent" />
              </BaseTableSearchForm>
            </template>
          </BaseTable>
        </ElCol>

        <ElCol :span="2" class="h-full">
          <div class="h-full flex-center">
            <div style="display: inline-block;">
              <BaseButton type="primary" :icon="$$renderIcon('i-mdi:chevron-double-right')" :disabled="!allUserTableRef?.isSelected" @click="addUserClick()" />
              <br>
              <br>
              <BaseButton type="primary" :icon="$$renderIcon('i-mdi:chevron-double-left')" :disabled="!selectedUserTableRef?.isSelected" @click="removeUserClick()" />
            </div>
          </div>
        </ElCol>

        <ElCol :span="11">
          <div class="flex-column-layout">
            <div class="search-bar">
              <span class="ft">已选中用户列表</span>
            </div>
            <BaseTable
              ref="selectedUserTableRef"
              v-bind="selectedUserConfig"
            />
          </div>
        </ElCol>
      </ElRow>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <BaseButton @click="handleCancel">
          取消
        </BaseButton>
        <BaseButton type="primary" @click="handleSubmit">
          确定
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
.search-bar {
  padding: 5px 1px;
}
.select-wrap {
  width: 118px;
  float: left;
}
.input-name {
  width: 200px;
  padding-left: 2px;
  padding-right: 2px;
}
.ft {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
}
.selected-content {
  padding: 4px;
}

.table-content :deep(.cell),
.table-content :deep(th > div) {
  padding-left: 16px;
  padding-right: 16px;
}
</style>

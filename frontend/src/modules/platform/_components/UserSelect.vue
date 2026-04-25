<script setup lang="ts">
import axios from 'axios'
import { useTableSetup } from '@/components/base-table'

const modelValue = defineModel('modelValue', { type: String, default: '' })

const branchInnerCode = ref('')
const searchName = ref('')
const selectedUsers = ref<string[]>([])
const dialogLoading = ref(false)

const allUserTableRef = useTemplateRef('allUserTableRef')
const selectedUserTableRef = useTemplateRef('selectedUserTableRef')

const allUserTableConfig = useTableSetup({
  rowKey: 'userName',
  immediate: false,
  showSelection: true,
  showSearchAction: false,
  datasource(params) {
    const requestParams = {
      selectedUsers: selectedUsers.value.join(','),
      branchInnerCode: branchInnerCode.value,
      searchContent: encodeURIComponent(searchName.value),
      ...params,
    }

    return axios.get('/ui/userselector/alluserdatabind', { params: requestParams }).then(r => r.data)
  },
  columns: [
    { prop: 'userName', label: '用户名', minWidth: '100' },
    { prop: 'realName', label: '真实姓名', minWidth: '100' },
    { prop: 'branchName', label: '所属机构', minWidth: '100' },
  ],
})

const selectedUserTableConfig = useTableSetup({
  rowKey: 'userName',
  immediate: false,
  showSelection: true,
  showSearchAction: false,
  datasource(params) {
    const requestParams = {
      selectedUsers: selectedUsers.value.join(','),
      ...params,
    }

    return axios.get('/ui/userselector/selecteduserdatabind', { params: requestParams }).then(r => r.data)
  },
  columns: [
    { prop: 'userName', label: '用户名', minWidth: '100' },
    { prop: 'realName', label: '真实姓名', minWidth: '100' },
    { prop: 'branchName', label: '所属机构', minWidth: '100' },
  ],
})

const isShow = ref(false)

async function dialogOpen() {
  dialogLoading.value = true
  searchName.value = ''
  selectedUsers.value = modelValue.value?.split(',') ?? []
  nextTick(async () => {
    await Promise.all([allUserTableRef.value?.searchFirstPage(), selectedUserTableRef.value?.searchFirstPage()])
    dialogLoading.value = false
  })
}

// 添加到已选用户列表
function addUserClick(row) {
  if (row) {
    if (!selectedUsers.value.includes(row.userName)) {
      selectedUsers.value.push(row.userName)
    }
  }
  else {
    allUserTableRef.value?.selectedRows?.forEach((o) => {
      if (!selectedUsers.value.includes(o.userName)) {
        selectedUsers.value.push(o.userName)
      }
    })
  }
  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

function removeUserClick(row) {
  if (row) {
    const index = selectedUsers.value.findIndex(val => val === row.userName)
    selectedUsers.value.splice(index, 1)
  }
  else {
    selectedUserTableRef.value?.selectedRows?.forEach((o) => {
      const index = selectedUsers.value.findIndex(val => val === o.userName)
      selectedUsers.value.splice(index, 1)
    })
  }
  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

// 选择用户确定
function confirmUserSelectClick() {
  const selectedUserNames: string[] = []
  const selectedUserRealNames: string[] = []
  const selectedUserList = selectedUserTableRef.value?.tableData ?? []
  selectedUserList.forEach((row) => {
    selectedUserNames.push(row.userName)
    selectedUserRealNames.push(row.realName)
  })
  modelValue.value = selectedUserNames.join(',')
  isShow.value = false
}
</script>

<template>
  <ElInput v-model="modelValue" readonly>
    <template #append>
      <ElButtonGroup>
        <BaseButton title="添加" @click="isShow = true">
          <BaseIcon name="i-mdi:plus-thick" />
        </BaseButton>
        <BaseButton title="清空" @click="modelValue = ''">
          <BaseIcon name="i-mdi:close" />
        </BaseButton>
      </ElButtonGroup>
    </template>
  </ElInput>
  <BaseDialog v-model="isShow" title="选择用户" width="1000px" @open="dialogOpen">
    <ElRow v-loading="dialogLoading">
      <ElCol :span="11">
        <BaseTable ref="allUserTableRef" size="small" v-bind="allUserTableConfig">
          <template #simpleSearch="{ searchFirstPage }">
            <BizSelectBranches v-model="branchInnerCode" @change="searchFirstPage" @clear="searchFirstPage" />
            <ElInput
              v-model="searchName"
              placeholder="用户名或姓名"
              @keyup.enter="allUserTableRef?.searchFirstPage()"
            >
              <template #append>
                <ElButton @click="allUserTableRef?.searchFirstPage()">
                  搜索
                </ElButton>
              </template>
            </ElInput>
          </template>
        </BaseTable>
      </ElCol>
      <ElCol :span="2">
        <div class="transfer-actions">
          <ElButton :disabled="!allUserTableRef?.isSelected" @click="addUserClick(0)">
            <BaseIcon name="i-fa:angle-double-right" />
          </ElButton>
          <br>
          <br>
          <ElButton :disabled="!selectedUserTableRef?.isSelected" @click="removeUserClick(0)">
            <BaseIcon name="i-fa:angle-double-left" />
          </ElButton>
        </div>
      </ElCol>
      <ElCol :span="11">
        <div class="selected-content">
          <div class="search-bar">
            <span class="ft">已选中用户列表</span>
          </div>
          <BaseTable ref="selectedUserTableRef" size="small" v-bind="selectedUserTableConfig" />
        </div>
      </ElCol>
    </ElRow>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="isShow = false">
          取 消
        </ElButton>
        <ElButton type="primary" @click="confirmUserSelectClick">
          确 定
        </ElButton>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
.search-bar {
  padding: 5px 1px;
}

.ft {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.transfer-actions {
  margin-top: 190px;
  text-align: center;
}
</style>

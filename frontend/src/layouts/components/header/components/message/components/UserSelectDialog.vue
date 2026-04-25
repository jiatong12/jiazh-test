<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useTableSetup } from '@/components/base-table'

// 定义模型
const modelValue = defineModel<string>('modelValue', { type: String, default: '' })

// 响应式数据
const visible = ref(false)
const selectedUsers = ref<string[]>([])

// 表格引用
const allUserTableRef = useTemplateRef('allUserTableRef')
const selectedUserTableRef = useTemplateRef('selectedUserTableRef')

// 所有用户表格配置
const allUserTableConfig = useTableSetup({
  rowKey: 'userName',
  immediate: false,
  showSelection: true,
  showSearchAction: false,
  datasource(params) {
    const requestParams = {
      selectedUsers: selectedUsers.value.join(','),
      ...params,
    }

    return axios.get('/ui/userselector/alluserdatabind', { params: requestParams }).then((r) => {
      return r.data
    })
  },
  columns: [
    { prop: 'userName', label: '用户名' },
    { prop: 'realName', label: '真实姓名' },
    { prop: 'branchName', label: '所属机构' },
  ],
})

// 已选用户表格列配置
const selectedUserTableConfig = useTableSetup({
  immediate: false,
  showSelection: true,
  rowKey: 'userName',
  datasource(params: any) {
    const requestParams = {
      selectedUsers: selectedUsers.value.join(','),
      ...params,
    }

    return axios.get('/ui/userselector/selecteduserdatabind', { params: requestParams }).then((r) => {
      return r.data
    })
  },
  columns: [
    { prop: 'userName', label: '用户名' },
    { prop: 'realName', label: '真实姓名' },
    { prop: 'branchName', label: '所属机构' },
  ],
})

// 对话框打开处理
async function dialogOpen() {
  selectedUsers.value = modelValue.value ? modelValue.value.split(',') : []

  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

// 添加用户
function addUserClick(row?: any) {
  if (row) {
    // 添加单个用户
    if (!selectedUsers.value.includes(row.userName)) {
      selectedUsers.value.push(row.userName)
    }
  }
  else {
    // 添加多选用户
    allUserTableRef.value?.selectedRows.forEach((o) => {
      if (!selectedUsers.value.includes(o.userName)) {
        selectedUsers.value.push(o.userName)
      }
    })
  }

  // 更新数据
  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

// 移除用户
function removeUserClick(row?: any) {
  if (row) {
    // 移除单个用户
    const index = selectedUsers.value.findIndex(val => val === row.userName)
    if (index > -1) {
      selectedUsers.value.splice(index, 1)
    }
  }
  else {
    // 移除多选用户
    selectedUserTableRef.value?.selectedRows.forEach((o) => {
      const index = selectedUsers.value.findIndex(val => val === o.userName)
      if (index > -1) {
        selectedUsers.value.splice(index, 1)
      }
    })
  }

  // 更新数据
  allUserTableRef.value?.searchFirstPage()
  selectedUserTableRef.value?.searchFirstPage()
}

// 确认选择用户
function confirmUserSelectClick() {
  modelValue.value = selectedUsers.value.join(',')
  visible.value = false
}
</script>

<template>
  <div style="width: 100%;">
    <ElInput v-model="modelValue" readonly style="width: 100%;">
      <template #append>
        <ElButton @click="visible = true">
          选择
        </ElButton>
      </template>
    </ElInput>

    <BaseDialog
      v-model="visible"
      title="选择用户"
      width="96%"
      @open="dialogOpen"
    >
      <ElRow>
        <ElCol :span="11">
          <div class="selected-content">
            <BaseTable
              ref="allUserTableRef"
              size="small"
              v-bind="allUserTableConfig"
            >
              <template #simpleSearch="{ searchFirstPage, searchFormState }">
                <BizSelectBranches v-model="searchFormState.branchInnerCode" @change="searchFirstPage" @clear="searchFirstPage" />
                <ElInput
                  v-model="searchFormState.searchContent"
                  placeholder="请输入用户名或姓名"
                  clearable @clear="searchFirstPage"
                >
                  <template #append>
                    <ElButton @click="searchFirstPage()">
                      搜索
                    </ElButton>
                  </template>
                </ElInput>
              </template>
            </BaseTable>
          </div>
        </ElCol>
        <ElCol :span="2">
          <div class="button-container">
            <div>
              <BaseButton
                :disabled="!allUserTableRef?.isSelected"
                @click="addUserClick()"
              >
                <BaseIcon name="i-fa-angle-double-right" />
              </BaseButton>
              <br>
              <br>
              <BaseButton
                :disabled="!selectedUserTableRef?.isSelected"
                @click="removeUserClick()"
              >
                <BaseIcon name="i-fa-angle-double-left" />
              </BaseButton>
            </div>
          </div>
        </ElCol>
        <ElCol :span="11">
          <div class="selected-content">
            <div class="search-bar">
              <span class="ft">已选中用户列表</span>
            </div>
            <BaseTable
              ref="selectedUserTableRef"
              size="small"
              v-bind="selectedUserTableConfig"
            />
          </div>
        </ElCol>
      </ElRow>

      <template #footer>
        <BaseButton @click="visible = false">
          取 消
        </BaseButton>
        <BaseButton
          type="primary"
          @click="confirmUserSelectClick"
        >
          确 定
        </BaseButton>
      </template>
    </BaseDialog>
  </div>
</template>

<style scoped>
.ft {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
}

.selected-content {
  padding: 4px;
  .search-bar {
    height: 43px;
  }
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
</style>

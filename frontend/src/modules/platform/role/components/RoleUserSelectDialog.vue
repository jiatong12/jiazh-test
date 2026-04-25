<script setup lang="ts">
import axios from 'axios'

import { reactive, toRefs } from 'vue'
import { useTableSetup } from '@/components/base-table'
import util from '@/utils/util'

const show = defineModel('show', {
  type: Boolean,
  default: false,
  required: true,
})

// props
const props = defineProps({
  roleCode: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['submitSuccess'])
// data
const dataState = reactive({
  dataLoading: false,
  confirmLoading: false,
})

const tableRef = useTemplateRef('tableRef')

const { dataLoading, confirmLoading } = toRefs(dataState)

async function selectConfirmClickHandler() {
  confirmLoading.value = true
  const ids = tableRef.value?.selectedKeys ?? []
  const usernames = ids.join(',')
  const res = await axios.put(`/ui/roles/${props.roleCode}/users`, { usernames })
  util.showResponseMessage(res)
  show.value = false
  emit('submitSuccess')
  confirmLoading.value = false
}

// 使用 useTableSetup 创建表格配置
const tableConfig = useTableSetup({
  rowKey: 'userName',
  showIndex: false,
  showSelection: true,
  showSearchAction: false,
  showPagination: true,
  pageSize: 10,
  columns: [
    { prop: 'userName', label: '用户名', width: '130' },
    { prop: 'realName', label: '真实姓名', width: '150' },
    { prop: 'roles', label: '所属角色' },
  ],
  datasource(params) {
    return axios.get(`/ui/roles/${props.roleCode}/users`, {
      params: {
        source: props.source,
        optional: true,
        ...params,
      },
    }).then(r => r.data)
  },
})
</script>

<template>
  <BaseDialog
    v-model="show"
    width="800px" title="添加用户到角色" class="role-user-select-dialog"
  >
    <div v-loading="dataLoading" class="select-user-wrap">
      <BaseTable
        ref="tableRef"
        class="flex-height-fill"
        v-bind="tableConfig"
        :loading="dataLoading"
      >
        <template #simpleSearch="{ searchFirstPage, searchFormState }">
          <ElInput v-model.trim="searchFormState.searchName" placeholder="请输入用户名/真实姓名" clearable :suffix-icon="$$renderIcon('i-ep:search')" @clear="searchFirstPage" />
        </template>
        <template #roles_default="{ row }">
          {{ row.roles.map(e => e.name)?.join(', ') }}
        </template>
      </BaseTable>
    </div>
    <template #footer>
      <div>
        <BaseButton @click="show = false">
          取 消
        </BaseButton>
        <BaseButton
          type="primary"
          :loading="confirmLoading"
          :disabled="!tableRef?.isSelected"
          @click="selectConfirmClickHandler"
        >
          确 定
        </BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
.role-user-select-dialog :deep(.el-dialog) {
  width: 800px;
}
@media (max-width: 480px) {
  .role-user-select-dialog :deep(.el-dialog) {
    width: 96%;
  }
}
.search-icon {
  top: 6px;
}
</style>

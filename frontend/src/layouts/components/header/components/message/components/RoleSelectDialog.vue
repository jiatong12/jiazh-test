<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useTableSetup } from '@/components/base-table'

const modelValue = defineModel('modelValue', { type: String })

// 响应式数据
const tableRef = useTemplateRef('tableRef')

const tableConfig = useTableSetup({
  rowKey: 'roleCode',
  showIndex: true,
  showSelection: true,
  height: '500px',
  columns: [
    { prop: 'roleName', label: '名称' },
    { prop: 'roleCode', label: '代码' },
  ],
  datasource(params: any) {
    return axios.get('/ui/roles/roledatabind', { params }).then((r) => {
      const list = r.data.data ?? []

      setTimeout(() => {
        if (modelValue.value) {
          const selectedCodes = modelValue.value.split(',').filter(code => !!code)
          selectedCodes.forEach((code) => {
            const row = list?.find((item: any) => item.roleCode === code)
            if (row) {
              tableRef.value?.elTableRef?.toggleRowSelection(row, true)
            }
          })
        }
      })

      return r.data
    })
  },
})

const visible = ref(false)
// 确认选择
function confirm() {
  const selectedKeys = tableRef.value?.selectedKeys || []
  modelValue.value = selectedKeys.join(',')
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

    <BaseDialog v-model="visible" title="选择角色" width="800px">
      <BaseTable ref="tableRef" v-bind="tableConfig" size="small" />

      <template #footer>
        <BaseButton @click="visible = false">
          取 消
        </BaseButton>
        <BaseButton
          type="primary"
          @click="confirm"
        >
          确 定
        </BaseButton>
      </template>
    </BaseDialog>
  </div>
</template>

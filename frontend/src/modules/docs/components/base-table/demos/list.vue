<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useTableSetup } from '@/components/base-table'
import { baseTableRows, projectCategoryDict, projectShelfStatusDict } from './data'

const listRows = baseTableRows.slice(0, 4)

const tableConfig = useTableSetup({
  mode: 'list',
  rowKey: 'id',
  showCard: false,
  showHeader: true,
  showSelection: true,
  showPagination: false,
  datasource: () => Promise.resolve(listRows),
  headerActions: [
    {
      name: '查看已选',
      handle({ selectedRows }) {
        ElMessage.info(`当前选中 ${selectedRows.length} 条记录`)
      },
    },
  ],
})

function getCategoryLabel(value: string): string {
  return projectCategoryDict.find(item => item.value === value)?.label ?? value
}

function getCategoryColor(value: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const color = projectCategoryDict.find(item => item.value === value)?.color
  return color === 'primary' || color === 'success' || color === 'warning' || color === 'danger'
    ? color
    : 'info'
}
</script>

<template>
  <BaseTable v-bind="tableConfig">
    <template #list_item="{ row, isSelected }">
      <div>
        <div class="flex-justify-between">
          <strong>{{ row.name }}</strong>
          <ElTag :type="isSelected ? 'primary' : 'info'" effect="plain">
            {{ isSelected ? '已选中' : '点击卡片可选中' }}
          </ElTag>
        </div>

        <ElSpace wrap class="mt-2">
          <ElTag :type="getCategoryColor(row.category)" effect="plain">
            {{ getCategoryLabel(row.category) }}
          </ElTag>
          <BaseDictTag :dict="projectShelfStatusDict" :value="row.shelfStatus" />
          <ElText type="info">
            维护团队：{{ row.owner }}
          </ElText>
          <ElText type="info">
            更新时间：{{ row.updatedAt }}
          </ElText>
        </ElSpace>
      </div>
    </template>
  </BaseTable>
</template>

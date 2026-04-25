<script setup lang="ts">
import { useTableSetup } from '@/components/base-table'

interface TodoItem {
  name: string
  date: string
  complete: boolean
}

/**
 * 待办事项列表
 * 记录每日工作任务及完成状态
 */
const tableData = reactive<TodoItem[]>([
  {
    name: '查看今天工作内容',
    date: '上午 09:30',
    complete: true,
  },
  {
    name: '回复邮件',
    date: '上午 10:30',
    complete: true,
  },
  {
    name: '工作汇报整理',
    date: '上午 11:00',
    complete: true,
  },
  {
    name: '产品需求会议',
    date: '下午 02:00',
    complete: false,
  },
  {
    name: '整理会议内容',
    date: '下午 03:30',
    complete: false,
  },
  {
    name: '明天工作计划',
    date: '下午 06:30',
    complete: false,
  },
])

const listConfig = useTableSetup({
  mode: 'list',
  rowKey: 'name',
  showPagination: false,
  datasource: () => Promise.resolve(tableData),
})
</script>

<template>
  <div class="card flex-column-layout">
    <div class="header-container">
      <div class="title-container">
        <div class="title">
          代办事项
        </div>
        <div class="info">
          待处理<span class="text-danger">3</span>
        </div>
      </div>
    </div>

    <BaseTable v-bind="listConfig" class="list-wrap flex-height-fill">
      <template #list_item="{ row }">
        <div class="item-left">
          <div class="name">
            {{ row.name }}
          </div>
          <div class="time">
            {{ row.date }}
          </div>
        </div>
        <ElCheckbox v-model="row.complete" />
      </template>
    </BaseTable>
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-container {
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    .info {
      font-size: 14px;
      color: var(--zv-text-color-secondary);
      .text-danger {
        margin-left: 10px;
        color: var(--zv-danger);
      }
    }
  }
}

.list-wrap {
  :deep(.base-table-list) {
    gap: 0;
    .base-table-list-item {
      border-radius: 0;
      border: 0;
      border-bottom: 1px solid var(--el-border-color-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 20px 0;
      padding-right: 10px;
      .item-left {
        .name {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .time {
          font-size: 12px;
          color: var(--zv-text-color-secondary);
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>

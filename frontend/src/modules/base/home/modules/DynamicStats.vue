<script setup lang="ts">
import { useTableSetup } from '@/components/base-table'

interface DynamicItem {
  username: string
  type: string
  target: string
}

const tableData = reactive<DynamicItem[]>([
  {
    username: '中小鱼',
    type: '关注了',
    target: '誶誶淰',
  },
  {
    username: '何小荷',
    type: '发表文章',
    target: 'Vue3 + Typescript + Vite 项目实战笔记',
  },
  {
    username: '中小鱼',
    type: '关注了',
    target: '誶誶淰',
  },
  {
    username: '何小荷',
    type: '发表文章',
    target: 'Vue3 + Typescript + Vite 项目实战笔记',
  },
  {
    username: '誶誶淰',
    type: '提出问题',
    target: '主题可以配置吗',
  },
  {
    username: '发呆草',
    type: '兑换了物品',
    target: '《奇特的一生》',
  },
  {
    username: '甜筒',
    type: '关闭了问题',
    target: '发呆草',
  },
  {
    username: '冷月呆呆',
    type: '兑换了物品',
    target: '《高效人士的七个习惯》',
  },
])

const listConfig = useTableSetup({
  mode: 'list',
  rowKey: 'username',
  showPagination: false,
  datasource: () => Promise.resolve(tableData),
})
</script>

<template>
  <div class="card flex-column-layout">
    <div class="header-container">
      <div class="title-container">
        <div class="title">
          动态
        </div>
        <div class="info">
          新增<span class="text-success">+6</span>
        </div>
      </div>
    </div>
    <BaseTable v-bind="listConfig" class="list-wrap flex-height-fill">
      <template #list_item="{ row }">
        <span class="username">{{ row.username }}</span>
        <span class="action-type">{{ row.type }}</span>
        <span class="target">{{ row.target }}</span>
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
      .text-success {
        margin-left: 10px;
        color: var(--zv-success);
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
      font-size: 14px;
      padding: 20px 0;
      padding-right: 10px;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.username {
  font-weight: 500;
  color: var(--zv-text-color-primary);
}

.action-type {
  margin: 0 8px;
  color: var(--zv-text-color-secondary);
}

.target {
  color: var(--zv-primary);
}
</style>

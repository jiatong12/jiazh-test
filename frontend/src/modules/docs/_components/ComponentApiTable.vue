<script setup lang="ts">
interface ApiItem {
  name: string
  description: string
  type: string
  default: string
}

withDefaults(defineProps<{
  title?: string
  items: ApiItem[]
}>(), {
  title: 'API',
})
</script>

<template>
  <BaseCard :title="title" class="component-api-table">
    <ElTable :data="items" border class="component-api-table__table">
      <ElTableColumn label="参数" min-width="160">
        <template #default="{ row }">
          <span class="docs-code-text">
            {{ row.name }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="说明" min-width="280">
        <template #default="{ row }">
          <div class="component-api-table__description">
            {{ row.description }}
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="类型" min-width="240">
        <template #default="{ row }">
          <span class="docs-code-text">
            {{ row.type }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="默认值" min-width="120">
        <template #default="{ row }">
          <span class="docs-code-text" :class="{ 'component-api-table__default--empty': row.default === '--' }">
            {{ row.default }}
          </span>
        </template>
      </ElTableColumn>
    </ElTable>
  </BaseCard>
</template>

<style scoped lang="scss">
.component-api-table {
  &__description {
    color: var(--el-text-color-regular);
    line-height: 1.75;
  }

  &__default--empty {
    color: var(--el-text-color-placeholder);
  }

  :deep(.base-card-container) {
    padding-top: 0;
  }

  :deep(.el-table) {
    --el-table-header-bg-color: var(--el-fill-color-light);
    --el-table-row-hover-bg-color: color-mix(in srgb, var(--el-color-primary) 4%, var(--el-fill-color-extra-light));
  }

  :deep(.el-table th.el-table__cell) {
    background: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
    font-weight: 600;
  }

  :deep(.el-table td.el-table__cell) {
    padding-top: 14px;
    padding-bottom: 14px;
    vertical-align: top;
  }
}
</style>

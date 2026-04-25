<script setup lang="ts">
import type { Arrayable } from '@vueuse/core'
import { branchTreeDict } from './data'

const currentBranch = ref<string | undefined>('frontend')
const currentBranches = ref<string[]>(['product-1', 'backend'])
const currentBranchItem = ref<Record<string, any> | void>()
const currentBranchItems = ref<Arrayable<Record<string, any>> | void>()

const currentBranchLabels = computed(() => {
  if (!Array.isArray(currentBranchItems.value)) {
    return '--'
  }

  return currentBranchItems.value.map(item => item.label).join('、') || '--'
})
</script>

<template>
  <div class="base-tree-select-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 2 }">
      <BaseCard title="单选树选择" h-full>
        <BaseTreeSelect
          v-model="currentBranch"
          check-strictly
          clearable
          placeholder="请选择所属机构"
          :dict="branchTreeDict"
          @sync-item="currentBranchItem = $event"
        />

        <div class="base-tree-select-doc-demo__summary">
          <div class="base-tree-select-doc-demo__summary-item">
            <span class="base-tree-select-doc-demo__label">当前值</span>
            <strong>{{ currentBranch ?? '--' }}</strong>
          </div>
          <div class="base-tree-select-doc-demo__summary-item">
            <span class="base-tree-select-doc-demo__label">当前节点</span>
            <strong>{{ currentBranchItem?.label ?? '--' }}</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="多选树选择" h-full>
        <BaseTreeSelect
          v-model="currentBranches"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
          show-checkbox
          placeholder="请选择参与团队"
          :dict="branchTreeDict"
          @sync-item="currentBranchItems = $event"
        />

        <div class="base-tree-select-doc-demo__summary">
          <div class="base-tree-select-doc-demo__summary-item">
            <span class="base-tree-select-doc-demo__label">当前值</span>
            <strong>{{ currentBranches.join(', ') }}</strong>
          </div>
          <div class="base-tree-select-doc-demo__summary-item">
            <span class="base-tree-select-doc-demo__label">已选节点</span>
            <strong>{{ currentBranchLabels }}</strong>
          </div>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-tree-select-doc-demo {
  &__summary {
    display: grid;
    gap: 12px;
    margin-top: 16px;
  }

  &__summary-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-extra-light);

    strong {
      color: var(--el-text-color-primary);
      line-height: 1.7;
    }
  }

  &__label {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    letter-spacing: 0.04em;
  }
}
</style>

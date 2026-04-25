<script setup lang="ts">
import { getAsyncPriorityDict } from './data'

const currentPriority = ref('medium')
const currentPriorityItem = ref<Record<string, any> | void>()

const dictApi = () => getAsyncPriorityDict()
</script>

<template>
  <div class="base-selection-controls-async-demo">
    <BaseCard title="异步字典" h-full>
      <ElAlert
        title="三者都基于 useDict，所以本地数组、字典 code、异步函数三种入口都保持一致。"
        type="info"
        :closable="false"
        show-icon
      />

      <BaseSegmented
        v-model="currentPriority"
        class="mt-4"
        :dict="dictApi"
        @sync-item="currentPriorityItem = $event"
      />

      <div class="base-selection-controls-async-demo__meta">
        <div class="base-selection-controls-async-demo__item">
          <span class="base-selection-controls-async-demo__label">当前值</span>
          <strong>{{ currentPriority }}</strong>
        </div>
        <div class="base-selection-controls-async-demo__item">
          <span class="base-selection-controls-async-demo__label">当前项</span>
          <strong>{{ currentPriorityItem?.label ?? '--' }}</strong>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-selection-controls-async-demo {
  &__meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-extra-light);
  }

  &__label {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    letter-spacing: 0.04em;
  }
}

@media (max-width: 768px) {
  .base-selection-controls-async-demo {
    &__meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>

<script setup lang="ts">
import { getAsyncTreeDict } from './data'

const currentSystem = ref<string | undefined>('platform-auth')
const currentSystemItem = ref<Record<string, any> | void>()

const treeDict = () => getAsyncTreeDict()
</script>

<template>
  <div class="base-tree-select-async-demo">
    <BaseCard title="异步树字典" h-full>
      <ElAlert
        title="dict 传异步函数时，BaseTreeSelect 会先显示骨架屏，再把树节点喂给 ElTreeSelect。"
        type="info"
        :closable="false"
        show-icon
      />

      <BaseTreeSelect
        v-model="currentSystem"
        class="mt-4"
        check-strictly
        clearable
        placeholder="请选择系统模块"
        :dict="treeDict"
        @sync-item="currentSystemItem = $event"
      />

      <div class="base-tree-select-async-demo__meta">
        <div class="base-tree-select-async-demo__item">
          <span class="base-tree-select-async-demo__label">当前值</span>
          <strong>{{ currentSystem ?? '--' }}</strong>
        </div>
        <div class="base-tree-select-async-demo__item">
          <span class="base-tree-select-async-demo__label">当前节点</span>
          <strong>{{ currentSystemItem?.label ?? '--' }}</strong>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-tree-select-async-demo {
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

@media (max-width: 768px) {
  .base-tree-select-async-demo {
    &__meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>

<script setup lang="ts">
import { getRemoteMemberDict } from './data'

const currentMember = ref<number | undefined>(102)
const currentMemberItem = ref<Record<string, any> | void>()

const remoteDict = () => getRemoteMemberDict()
</script>

<template>
  <div class="base-select-async-demo">
    <BaseCard title="异步字典" h-full>
      <ElAlert
        title="dict 支持直接传异步函数。组件会在加载阶段显示骨架屏，并在数据就绪后继续保持与 v-model 同步。"
        type="info"
        :closable="false"
        show-icon
      />

      <BaseSelect
        v-model="currentMember"
        class="mt-4"
        clearable
        placeholder="请选择负责人"
        :dict="remoteDict"
        @sync-item="currentMemberItem = $event"
      />

      <div class="base-select-async-demo__meta">
        <div class="base-select-async-demo__item">
          <span class="base-select-async-demo__label">当前值</span>
          <strong>{{ currentMember ?? '--' }}</strong>
        </div>
        <div class="base-select-async-demo__item">
          <span class="base-select-async-demo__label">负责人</span>
          <strong>{{ currentMemberItem?.label ?? '--' }}</strong>
        </div>
        <div class="base-select-async-demo__item">
          <span class="base-select-async-demo__label">角色说明</span>
          <strong>{{ currentMemberItem?.description ?? '--' }}</strong>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-select-async-demo {
  &__meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
  .base-select-async-demo {
    &__meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>

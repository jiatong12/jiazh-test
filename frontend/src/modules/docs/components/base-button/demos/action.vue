<script setup lang="ts">
import { formatTime, wait } from './data'

const submitCount = ref(0)
const publishCount = ref(0)
const latestAction = ref('尚未触发')

async function submitPlan() {
  await wait(900)
  submitCount.value += 1
  latestAction.value = `提交方案 · ${formatTime()}`
}

async function publishDraft() {
  await wait(1200)
  publishCount.value += 1
  latestAction.value = `发布草稿 · ${formatTime()}`
}

function resetStatus() {
  submitCount.value = 0
  publishCount.value = 0
  latestAction.value = '尚未触发'
}
</script>

<template>
  <div class="base-button-action-demo">
    <BaseCard title="BaseActionButton 行为" h-full>
      <ElAlert
        title="BaseActionButton 内部会统一串联点击节流、loading 和成功提示，适合提交、发布、保存这类标准异步动作。"
        type="info"
        :closable="false"
        show-icon
      />

      <ElSpace wrap class="mt-4">
        <BaseActionButton action-name="提交方案" :api="submitPlan">
          提交方案
        </BaseActionButton>
        <BaseActionButton action-name="发布草稿" :api="publishDraft">
          发布草稿
        </BaseActionButton>
        <BaseButton @click="resetStatus">
          重置状态
        </BaseButton>
      </ElSpace>
    </BaseCard>

    <BaseCard title="执行结果" class="mt-4">
      <div class="base-button-action-demo__stats">
        <div class="base-button-action-demo__stat">
          <span class="base-button-action-demo__label">提交次数</span>
          <strong>{{ submitCount }}</strong>
        </div>
        <div class="base-button-action-demo__stat">
          <span class="base-button-action-demo__label">发布次数</span>
          <strong>{{ publishCount }}</strong>
        </div>
        <div class="base-button-action-demo__stat base-button-action-demo__stat--wide">
          <span class="base-button-action-demo__label">最近动作</span>
          <strong>{{ latestAction }}</strong>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-button-action-demo {
  &__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-extra-light);

    strong {
      color: var(--el-text-color-primary);
      font-size: 18px;
      line-height: 1.4;
    }
  }

  &__stat--wide {
    background: color-mix(in srgb, var(--el-color-primary) 6%, var(--el-fill-color-extra-light));
  }

  &__label {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    letter-spacing: 0.04em;
  }
}

@media (max-width: 768px) {
  .base-button-action-demo {
    &__stats {
      grid-template-columns: 1fr;
    }
  }
}
</style>

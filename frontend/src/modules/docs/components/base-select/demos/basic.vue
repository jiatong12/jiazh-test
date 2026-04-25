<script setup lang="ts">
import type { Arrayable } from '@vueuse/core'
import { notifyChannelDict, projectCategoryDict } from './data'

const currentCategory = ref<string | undefined>('config')
const currentChannels = ref<number[]>([1, 4])
const currentCategoryItem = ref<Record<string, any> | void>()
const currentChannelItems = ref<Arrayable<Record<string, any>> | void>()

const currentChannelLabels = computed(() => {
  if (!Array.isArray(currentChannelItems.value)) {
    return '--'
  }
  return currentChannelItems.value.map(item => item.label).join('、') || '--'
})
</script>

<template>
  <div class="base-select-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 2 }">
      <BaseCard title="单选 + onSyncItem" h-full>
        <BaseSelect
          v-model="currentCategory"
          clearable
          placeholder="请选择项目分类"
          :dict="projectCategoryDict"
          @sync-item="currentCategoryItem = $event"
        />

        <div class="base-select-doc-demo__summary">
          <div class="base-select-doc-demo__summary-item">
            <span class="base-select-doc-demo__label">当前值</span>
            <strong>{{ currentCategory ?? '--' }}</strong>
          </div>
          <div class="base-select-doc-demo__summary-item">
            <span class="base-select-doc-demo__label">当前标签</span>
            <strong>{{ currentCategoryItem?.label ?? '--' }}</strong>
          </div>
          <div class="base-select-doc-demo__summary-item">
            <span class="base-select-doc-demo__label">说明</span>
            <strong>{{ currentCategoryItem?.description ?? '--' }}</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="多选字典" h-full>
        <BaseSelect
          v-model="currentChannels"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
          placeholder="请选择通知渠道"
          :dict="notifyChannelDict"
          @sync-item="currentChannelItems = $event"
        />

        <div class="base-select-doc-demo__summary">
          <div class="base-select-doc-demo__summary-item">
            <span class="base-select-doc-demo__label">当前值</span>
            <strong>{{ currentChannels.join(', ') }}</strong>
          </div>
          <div class="base-select-doc-demo__summary-item">
            <span class="base-select-doc-demo__label">已选标签</span>
            <strong>{{ currentChannelLabels }}</strong>
          </div>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-select-doc-demo {
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
      font-size: 14px;
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

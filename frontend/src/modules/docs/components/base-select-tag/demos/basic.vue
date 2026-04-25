<script setup lang="ts">
import type { Arrayable } from '@vueuse/core'
import { projectTagDict, stageDict } from './data'

const currentStage = ref<string | undefined>('develop')
const currentTags = ref<number[] | undefined>([1, 3])
const readonlyTag = ref<number | undefined>(2)
const currentStageItem = ref<Record<string, any> | void>()
const currentTagItems = ref<Arrayable<Record<string, any>> | void>()

const currentTagLabels = computed(() => {
  if (!Array.isArray(currentTagItems.value)) {
    return '--'
  }

  return currentTagItems.value.map(item => item.label).join('、') || '--'
})
</script>

<template>
  <div class="base-select-tag-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 3 }">
      <BaseCard title="单选 + showAll" h-full>
        <BaseSelectTag
          v-model="currentStage"
          :dict="stageDict"
          @sync-item="currentStageItem = $event"
        />

        <div class="base-select-tag-doc-demo__summary">
          <span class="base-select-tag-doc-demo__label">当前值</span>
          <strong>{{ currentStage ?? '--' }}</strong>
          <span class="base-select-tag-doc-demo__label">当前标签</span>
          <strong>{{ currentStageItem?.label ?? '--' }}</strong>
        </div>
      </BaseCard>

      <BaseCard title="多选标签筛选" h-full>
        <BaseSelectTag
          v-model="currentTags"
          multiple
          :dict="projectTagDict"
          @sync-item="currentTagItems = $event"
        />

        <div class="base-select-tag-doc-demo__summary">
          <span class="base-select-tag-doc-demo__label">当前值</span>
          <strong>{{ currentTags?.join(', ') ?? '--' }}</strong>
          <span class="base-select-tag-doc-demo__label">已选标签</span>
          <strong>{{ currentTagLabels }}</strong>
        </div>
      </BaseCard>

      <BaseCard title="自定义内容与只读态" h-full>
        <BaseSelectTag
          v-model="readonlyTag"
          readonly
          :dict="projectTagDict"
          :show-all="false"
        >
          <template #default="{ row }">
            <span class="base-select-tag-doc-demo__option">
              <BaseIcon :name="(row as any).icon" />
              <span>{{ row.label }}</span>
            </span>
          </template>
        </BaseSelectTag>

        <div class="base-select-tag-doc-demo__summary">
          <span class="base-select-tag-doc-demo__label">当前值</span>
          <strong>{{ readonlyTag ?? '--' }}</strong>
          <span class="base-select-tag-doc-demo__label">说明</span>
          <strong>readonly 会保留当前选中态，但不会再响应点击。</strong>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-select-tag-doc-demo {
  &__summary {
    display: grid;
    gap: 6px;
    margin-top: 16px;
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

  &__option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}
</style>

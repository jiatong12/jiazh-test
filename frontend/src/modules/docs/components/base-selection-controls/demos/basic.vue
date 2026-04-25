<script setup lang="ts">
import type { Arrayable } from '@vueuse/core'
import { notifyChannelDict, statusDict, viewModeDict } from './data'

const currentStatus = ref<number | undefined>(1)
const currentChannels = ref<number[]>([1, 2])
const currentViewMode = ref('overview')

const currentStatusItem = ref<Record<string, any> | void>()
const currentChannelItems = ref<Arrayable<Record<string, any>> | void>()
const currentViewModeItem = ref<Record<string, any> | void>()

const currentChannelLabels = computed(() => {
  if (!Array.isArray(currentChannelItems.value)) {
    return '--'
  }

  return currentChannelItems.value.map(item => item.label).join('、') || '--'
})
</script>

<template>
  <div class="base-selection-controls-demo">
    <BaseRow :cols="{ xs: 1, md: 3 }">
      <BaseCard title="BaseRadio" h-full>
        <BaseRadio
          v-model="currentStatus"
          :dict="statusDict"
          @sync-item="currentStatusItem = $event"
        />

        <div class="base-selection-controls-demo__summary">
          <span class="base-selection-controls-demo__label">当前值</span>
          <strong>{{ currentStatus ?? '--' }}</strong>
          <span class="base-selection-controls-demo__label">当前项</span>
          <strong>{{ currentStatusItem?.label ?? '--' }}</strong>
        </div>
      </BaseCard>

      <BaseCard title="BaseCheckboxGroup" h-full>
        <BaseCheckboxGroup
          v-model="currentChannels"
          :dict="notifyChannelDict"
          @sync-item="currentChannelItems = $event"
        />

        <div class="base-selection-controls-demo__summary">
          <span class="base-selection-controls-demo__label">当前值</span>
          <strong>{{ currentChannels.join(', ') }}</strong>
          <span class="base-selection-controls-demo__label">当前项</span>
          <strong>{{ currentChannelLabels }}</strong>
        </div>
      </BaseCard>

      <BaseCard title="BaseSegmented" h-full>
        <BaseSegmented
          v-model="currentViewMode"
          :dict="viewModeDict"
          @sync-item="currentViewModeItem = $event"
        />

        <div class="base-selection-controls-demo__summary">
          <span class="base-selection-controls-demo__label">当前值</span>
          <strong>{{ currentViewMode }}</strong>
          <span class="base-selection-controls-demo__label">当前项</span>
          <strong>{{ currentViewModeItem?.label ?? '--' }}</strong>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-selection-controls-demo {
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
}
</style>

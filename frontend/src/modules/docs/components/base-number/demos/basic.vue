<script setup lang="ts">
import { numberPlans } from './data'

const memberCount = ref(8)
const budget = ref(36.5)
const efficiency = ref(1.235)

const numberSummary = computed(() => {
  return {
    memberCount: memberCount.value,
    budget: budget.value?.toFixed(2) ?? '--',
    efficiency: efficiency.value?.toFixed(3) ?? '--',
  }
})
</script>

<template>
  <div class="base-number-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 2 }">
      <BaseCard title="直接使用组件" h-full>
        <div class="base-number-doc-demo__group">
          <div class="base-number-doc-demo__field">
            <span class="base-number-doc-demo__label">成员人数</span>
            <BaseNumber v-model="memberCount" :min="1" :max="99" />
          </div>
          <div class="base-number-doc-demo__field">
            <span class="base-number-doc-demo__label">项目预算</span>
            <BaseDecimal v-model="budget" :min="0" :step="0.5" />
          </div>
          <div class="base-number-doc-demo__field">
            <span class="base-number-doc-demo__label">效率系数（3 位小数）</span>
            <BaseNumber v-model="efficiency" :precision="3" :step="0.005" :min="0" />
          </div>
        </div>
      </BaseCard>

      <BaseCard title="当前值" h-full>
        <div class="base-number-doc-demo__metrics">
          <div
            v-for="item in numberPlans"
            :key="item.key"
            class="base-number-doc-demo__metric"
          >
            <div class="base-number-doc-demo__metric-title">
              {{ item.label }}
            </div>
            <div class="base-number-doc-demo__metric-value">
              {{ numberSummary[item.key as keyof typeof numberSummary] }}
            </div>
            <div class="base-number-doc-demo__metric-description">
              {{ item.description }}
            </div>
          </div>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-number-doc-demo {
  &__group {
    display: grid;
    gap: 16px;
  }

  &__field {
    display: grid;
    gap: 8px;
  }

  &__label {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.6;
  }

  &__metrics {
    display: grid;
    gap: 12px;
  }

  &__metric {
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-extra-light);
  }

  &__metric-title {
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 600;
  }

  &__metric-value {
    margin-top: 6px;
    color: var(--el-color-primary);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }

  &__metric-description {
    margin-top: 8px;
    color: var(--el-text-color-regular);
    font-size: 13px;
    line-height: 1.7;
  }
}
</style>

<script setup lang="ts">
import { longText, multilineText, shortText } from './data'

const dynamicWidth = ref(220)
</script>

<template>
  <div class="base-overflow-tooltip-doc-demo">
    <BaseCard title="基础用法">
      <div class="base-overflow-tooltip-doc-demo__row">
        <span class="base-overflow-tooltip-doc-demo__label">短文本</span>
        <BaseOverflowTooltip class="base-overflow-tooltip-doc-demo__text text-ellipsis-1">
          {{ shortText }}
        </BaseOverflowTooltip>
      </div>
      <div class="base-overflow-tooltip-doc-demo__row">
        <span class="base-overflow-tooltip-doc-demo__label">单行截断</span>
        <BaseOverflowTooltip :line-clamp="1" class="base-overflow-tooltip-doc-demo__text">
          {{ longText }}
        </BaseOverflowTooltip>
      </div>
    </BaseCard>

    <BaseCard title="动态宽度" class="mt-4">
      <div class="base-overflow-tooltip-doc-demo__row base-overflow-tooltip-doc-demo__row--slider">
        <span class="base-overflow-tooltip-doc-demo__label">文本宽度</span>
        <ElSlider v-model="dynamicWidth" :min="120" :max="520" />
      </div>
      <div class="base-overflow-tooltip-doc-demo__row">
        <span class="base-overflow-tooltip-doc-demo__label">效果预览</span>
        <BaseOverflowTooltip
          class="base-overflow-tooltip-doc-demo__text text-ellipsis-1"
          :style="{ width: `${dynamicWidth}px` }"
        >
          {{ longText }}
        </BaseOverflowTooltip>
      </div>
    </BaseCard>

    <BaseCard title="多行截断" class="mt-4">
      <div class="base-overflow-tooltip-doc-demo__row base-overflow-tooltip-doc-demo__row--top">
        <span class="base-overflow-tooltip-doc-demo__label">两行文本</span>
        <BaseOverflowTooltip :line-clamp="2" class="base-overflow-tooltip-doc-demo__multiline">
          {{ multilineText }}
        </BaseOverflowTooltip>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-overflow-tooltip-doc-demo {
  &__row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__row + &__row {
    margin-top: 14px;
  }

  &__row--slider {
    max-width: 620px;
  }

  &__row--top {
    align-items: flex-start;
  }

  &__label {
    flex: none;
    width: 80px;
    color: var(--el-text-color-secondary);
  }

  &__text {
    display: inline-block;
    width: 220px;
  }

  &__multiline {
    display: inline-block;
    width: 360px;
    line-height: 1.6;
  }
}
</style>

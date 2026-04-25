<script setup lang="ts">
import { buttonSceneItems } from './data'

const clickCounter = reactive<Record<string, number>>({
  'default': 0,
  'primary': 0,
  'ripple-off': 0,
})

const clickSummary = computed(() => {
  return buttonSceneItems.map(item => ({
    ...item,
    count: clickCounter[item.key] ?? 0,
  }))
})

function recordClick(key: string) {
  clickCounter[key] = (clickCounter[key] ?? 0) + 1
}
</script>

<template>
  <div class="base-button-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 2 }">
      <BaseCard title="常见按钮组合" h-full>
        <ElSpace wrap>
          <BaseButton @click="recordClick('default')">
            默认按钮
          </BaseButton>
          <BasePrimaryButton @click="recordClick('primary')">
            主按钮封装
          </BasePrimaryButton>
          <BaseButton
            :icon="$$renderIcon('i-mdi:content-save-outline')"
            type="success"
            @click="recordClick('default')"
          >
            带图标
          </BaseButton>
          <BaseButton :ripple="false" @click="recordClick('ripple-off')">
            关闭波纹
          </BaseButton>
          <BaseButton disabled>
            禁用状态
          </BaseButton>
        </ElSpace>
      </BaseCard>

      <BaseCard title="点击记录" h-full>
        <div class="base-button-doc-demo__list">
          <div
            v-for="item in clickSummary"
            :key="item.key"
            class="base-button-doc-demo__metric"
          >
            <div class="base-button-doc-demo__metric-title">
              {{ item.title }}
            </div>
            <div class="base-button-doc-demo__metric-count">
              {{ item.count }} 次
            </div>
            <div class="base-button-doc-demo__metric-description">
              {{ item.description }}
            </div>
          </div>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-button-doc-demo {
  &__list {
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

  &__metric-count {
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

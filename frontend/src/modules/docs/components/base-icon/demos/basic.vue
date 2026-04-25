<script setup lang="ts">
import { customSvgIcons, mdiIcons } from './data'
</script>

<template>
  <div class="base-icon-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 2 }">
      <BaseCard title="BaseIcon 基础用法" h-full>
        <div class="base-icon-doc-demo__grid">
          <div
            v-for="iconName in mdiIcons"
            :key="iconName"
            class="base-icon-doc-demo__item"
          >
            <BaseIcon :name="iconName" class="base-icon-doc-demo__preview" />
            <span class="docs-code-text">{{ iconName }}</span>
          </div>
        </div>
      </BaseCard>

      <BaseCard title="自定义 SVG 图标" h-full>
        <div class="base-icon-doc-demo__grid">
          <div
            v-for="iconName in customSvgIcons"
            :key="iconName"
            class="base-icon-doc-demo__item"
          >
            <BaseIcon :name="iconName" class="base-icon-doc-demo__preview" />
            <span class="docs-code-text">{{ iconName }}</span>
          </div>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-icon-doc-demo {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-extra-light);
  }

  &__preview {
    color: var(--el-color-primary);
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .base-icon-doc-demo {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>

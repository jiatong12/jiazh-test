<script setup lang="ts">
defineProps<{
  title: string
  lead: string
  eyebrow?: string
}>()
</script>

<template>
  <div class="doc-page-header">
    <div class="doc-page-header__content">
      <div class="doc-page-header__eyebrow">
        {{ eyebrow || '组件文档' }}
      </div>
      <h1 class="doc-page-header__title">
        {{ title }}
      </h1>

      <p class="doc-page-header__lead">
        <slot name="lead">
          {{ lead }}
        </slot>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.doc-page-header {
  position: relative;
  overflow: hidden;
  padding: 28px 32px;
  border: 1px solid color-mix(in srgb, var(--el-color-primary) 14%, var(--el-border-color-lighter));
  border-radius: calc(var(--el-border-radius-base) + 4px);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--el-color-primary) 10%, transparent), transparent 36%),
    linear-gradient(180deg, color-mix(in srgb, var(--el-color-primary) 4%, var(--el-bg-color-page)), var(--el-bg-color));
  box-shadow: 0 14px 30px -26px rgb(0 0 0 / 35%);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    content: '';
    background: linear-gradient(90deg, var(--el-color-primary), color-mix(in srgb, var(--el-color-primary) 40%, white));
  }

  &__content {
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  &__eyebrow {
    margin-bottom: 8px;
    color: var(--el-color-primary);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  &__title {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 30px;
    line-height: 1.15;
  }

  &__lead {
    max-width: 880px;
    margin: 16px 0 0;
    color: var(--el-text-color-regular);
    font-size: 14px;
    line-height: 1.85;
  }
}

@media (max-width: 768px) {
  .doc-page-header {
    padding: 24px;

    &__title {
      font-size: 26px;
    }
  }
}
</style>

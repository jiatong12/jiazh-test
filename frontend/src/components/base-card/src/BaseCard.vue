<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    hFull?: boolean
  }>(),
  {
    title: '',
    hFull: false,
  },
)
</script>

<template>
  <div class="base-card card" :class="{ 'base-card_h-full': hFull }">
    <div v-if="$slots.title || $slots.headerRight || $slots['header-right'] || title" class="base-card-header">
      <div class="base-card-header-left">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="$slots.headerRight || $slots['header-right']" class="base-card-header-right">
        <slot name="headerRight">
          <slot name="header-right" />
        </slot>
      </div>
    </div>
    <div class="base-card-container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;

  &_h-full {
    height: 100%;
  }
}

.base-card-header {
  --header-padding-y: 12px;
  position: relative;
  padding: var(--header-padding-y) 14px var(--header-padding-y) 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  letter-spacing: 0.1px;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    position: absolute;
    left: 13px;
    top: var(--header-padding-y);
    bottom: var(--header-padding-y);
    width: 4px;
    border-radius: 2px;
    background-image: linear-gradient(180deg, var(--el-color-primary), var(--el-color-primary-light-3));
    box-shadow: 0 2px 6px -5px rgb(0 0 0 / 42%);
  }
}

.base-card-header-left {
  flex: 1;
  min-width: 0;
}

.base-card-header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-card-container {
  flex: 1;
  min-height: 0;
  padding: 14px;
  // height: 100%;
  // overflow: auto;
}
</style>

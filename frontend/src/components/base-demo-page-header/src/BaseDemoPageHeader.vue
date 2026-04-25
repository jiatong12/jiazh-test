<script setup lang="ts">
defineProps<{
  title?: string
  content?: string
}>()

const slots = useSlots()
</script>

<template>
  <div class="page-header card">
    <div class="header-main">
      <div class="header-title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="header-content">
        <slot name="content">
          {{ content }}
        </slot>
      </div>
    </div>
    <div v-if="slots.default" class="header-actions">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background-color: var(--el-bg-color);
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 16px;
  padding-bottom: 16px;
  transition: background-color 300ms;
}

.header-main {
  flex: 1 1 70%;
}

.header-title {
  font-size: 24px;
}

.header-content {
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.header-content:empty {
  display: none;
}

.header-actions {
  margin-left: auto;
  flex: none;
}
</style>

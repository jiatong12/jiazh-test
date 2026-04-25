<script setup lang="ts">
defineProps<{
  /** 当前分组标题。 */
  title: string
}>()
</script>

<template>
  <div class="security-section">
    <h3 class="security-section__title">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.security-section {
  padding: 8px 0 24px;
}

.security-section__title {
  margin: 0 0 18px;
  text-indent: 30px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>

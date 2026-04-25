<script lang="ts" setup>
withDefaults(defineProps<{
  mode?: 'tooltip' | 'text'
}>(), {
  mode: 'tooltip',
})
</script>

<template>
  <span>
    <ElTooltip v-if="mode === 'tooltip'" placement="top">
      <template #content>
        <!-- 保持换行符，并限制最大宽度 -->
        <div class="base-help-tooltip-content"><slot /></div>
      </template>
      <BaseIcon name="i-bi:info-circle" class="base-help-icon" />
    </ElTooltip>
    <span v-else-if="mode === 'text'" class="base-help-text">
      (<slot />)
    </span>
  </span>
</template>

<style lang="scss" scoped>
.base-help-tooltip-content {
  white-space: pre-wrap;
  max-width: 400px;
}

.base-help-icon {
  margin-left: 4px;
}

.base-help-text {
  color: var(--el-text-color-secondary);
}
</style>

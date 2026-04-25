<template>
  <div class="base-icon-button-demo">
    <BaseCard title="按钮与导航图标">
      <ElSpace wrap>
        <BaseButton type="primary" :icon="$$renderIcon('i-mdi:content-save-outline')">
          保存
        </BaseButton>
        <BaseButton :icon="$$renderIcon('i-ep:search')">
          查询
        </BaseButton>
        <BaseButton type="danger" :icon="$$renderIcon('i-ep:delete')">
          删除
        </BaseButton>
      </ElSpace>

      <div class="base-icon-button-demo__inline">
        <span class="base-icon-button-demo__nav-item">
          <BaseIcon name="i-mdi:view-dashboard-outline" />
          <span>工作台</span>
        </span>
        <span class="base-icon-button-demo__nav-item">
          <BaseIcon name="i-mdi:cog-outline" />
          <span>系统设置</span>
        </span>
        <span class="base-icon-button-demo__nav-item">
          <BaseIcon name="i-icon:add" />
          <span>自定义 SVG</span>
        </span>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-icon-button-demo {
  &__inline {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 18px;
  }

  &__nav-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--el-text-color-regular);
  }
}
</style>

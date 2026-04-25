<template>
  <div class="flex-column-layout">
    <BaseCard title="基础标题">
      <ElText>直接传入 title 即可得到默认卡片头部和统一内容区。</ElText>
    </BaseCard>

    <BaseCard title="右侧操作区">
      <template #headerRight>
        <BaseButton size="small" type="primary">
          新增
        </BaseButton>
        <BaseButton size="small">
          刷新
        </BaseButton>
      </template>

      <ElText>通过 headerRight 插槽放置按钮、筛选项或状态说明。</ElText>
    </BaseCard>

    <BaseCard>
      <template #title>
        <div class="flex-align-center">
          <span>完全自定义头部</span>
          <ElTag size="small" type="success" class="ml-2">
            Custom
          </ElTag>
        </div>
      </template>

      <ElText>当默认标题不满足需求时，可以使用 title 插槽完全接管头部左侧内容。</ElText>
    </BaseCard>
  </div>
</template>

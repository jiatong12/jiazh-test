<!-- 演示高度自适应布局里，滚动只落在子内容区。 -->
<script setup lang="ts">
const taskList = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: `任务区块 ${index + 1}`,
  owner: ['张敏', '李岩', '王璐'][index % 3],
  note: '外层负责提供高度，内部列表自己滚动。',
}))
</script>

<template>
  <div class="height-adaptive-demo">
    <div class="height-adaptive-demo__shell flex-column-layout">
      <ElAlert
        title="这里只是文档演示，所以外层人为限制了高度；真实业务页通常直接继承父容器高度。"
        type="info"
        :closable="false"
      />

      <div class="card flex-none height-adaptive-demo__panel">
        <div class="height-adaptive-demo__title">
          固定头部区域
        </div>
        <BaseRow :gutter="[12, 12]" :cols="{ xs: 1, md: 3 }">
          <div class="height-adaptive-demo__summary">
            页面标题
          </div>
          <div class="height-adaptive-demo__summary">
            统计信息
          </div>
          <div class="height-adaptive-demo__summary">
            顶部筛选
          </div>
        </BaseRow>
      </div>

      <div class="card flex-height-fill flex-column-layout height-adaptive-demo__panel">
        <div class="height-adaptive-demo__title">
          子内容区滚动
        </div>

        <div class="flex-height-fill">
          <div class="h-full overflow-y-auto height-adaptive-demo__list">
            <div
              v-for="item in taskList"
              :key="item.id"
              class="height-adaptive-demo__list-item"
            >
              <div>
                <div class="height-adaptive-demo__item-title">
                  {{ item.title }}
                </div>
                <div class="height-adaptive-demo__item-note">
                  {{ item.note }}
                </div>
              </div>
              <ElTag effect="plain" round>
                {{ item.owner }}
              </ElTag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.height-adaptive-demo {
  height: 420px;
}

.height-adaptive-demo__shell {
  height: 100%;
}

.height-adaptive-demo__panel {
  gap: 12px;
}

.height-adaptive-demo__title {
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;
}

.height-adaptive-demo__summary {
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 0 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.height-adaptive-demo__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

.height-adaptive-demo__list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
}

.height-adaptive-demo__item-title {
  color: var(--el-text-color-primary);
  font-weight: 600;
  line-height: 1.5;
}

.height-adaptive-demo__item-note {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.7;
}
</style>

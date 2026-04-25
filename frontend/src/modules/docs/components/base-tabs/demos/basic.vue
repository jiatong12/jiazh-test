<!-- 演示 BaseTabs 的默认 lazy 和 validateAndSetModelValue。 -->
<script setup lang="ts">
const tabsRef = useTemplateRef('tabsRef')
const activeName = ref('base')
const visibleTabs = ref([
  { name: 'base', label: '基本信息' },
  { name: 'members', label: '协同成员' },
  { name: 'logs', label: '跟进记录' },
])

function removeCurrentTab() {
  visibleTabs.value = visibleTabs.value.filter(item => item.name !== activeName.value)
  nextTick(() => {
    ;(tabsRef.value as any)?.validateAndSetModelValue()
  })
}

function resetTabs() {
  visibleTabs.value = [
    { name: 'base', label: '基本信息' },
    { name: 'members', label: '协同成员' },
    { name: 'logs', label: '跟进记录' },
  ]
  activeName.value = 'base'
}
</script>

<template>
  <div class="flex-column-layout">
    <ElAlert
      title="先切到其他 Tab，再点“移除当前 Tab”，可以看到 BaseTabs 会通过 validateAndSetModelValue 自动回退到第一个可用 Tab。"
      type="info"
      :closable="false"
    />

    <ElSpace wrap>
      <BaseButton @click="activeName = 'base'">
        切到基本信息
      </BaseButton>
      <BaseButton @click="activeName = 'members'">
        切到协同成员
      </BaseButton>
      <BaseButton type="danger" @click="removeCurrentTab">
        移除当前 Tab
      </BaseButton>
      <BaseButton type="primary" @click="resetTabs">
        重置
      </BaseButton>
    </ElSpace>

    <BaseCard title="多分区信息" h-full>
      <BaseTabs
        ref="tabsRef"
        v-model="activeName"
        class="h-full"
      >
        <BaseTabPane
          v-for="item in visibleTabs"
          :key="item.name"
          :name="item.name"
          :label="item.label"
          class="h-full overflow-y-auto"
        >
          <div class="base-tabs-doc-demo__pane">
            当前 Tab：
            <code class="docs-inline-code">{{ item.label }}</code>
          </div>
        </BaseTabPane>
      </BaseTabs>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.base-tabs-doc-demo__pane {
  min-height: 120px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  line-height: 1.8;
}
</style>

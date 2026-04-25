<script setup lang="ts">
import { customColorTags, semanticTags } from './data'

const clickCount = ref(0)
const latestClick = ref('尚未点击')

function handleTagClick(label: string) {
  clickCount.value += 1
  latestClick.value = `${label} · ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`
}
</script>

<template>
  <div class="base-tag-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 2 }">
      <BaseCard title="语义色标签" h-full>
        <ElSpace wrap>
          <BaseTag
            v-for="item in semanticTags"
            :key="item.type"
            :type="item.type"
          >
            {{ item.label }}
          </BaseTag>
        </ElSpace>
      </BaseCard>

      <BaseCard title="自定义颜色与点击反馈" h-full>
        <ElSpace wrap>
          <BaseTag
            v-for="item in customColorTags"
            :key="item.color"
            :color="item.color"
            @click="handleTagClick(item.label)"
          >
            {{ item.label }}
          </BaseTag>
          <BaseTag color="#334155" effect="dark" @click="handleTagClick('深色标签')">
            深色标签
          </BaseTag>
        </ElSpace>

        <div class="base-tag-doc-demo__meta">
          <div class="base-tag-doc-demo__item">
            <span class="base-tag-doc-demo__label">点击次数</span>
            <strong>{{ clickCount }}</strong>
          </div>
          <div class="base-tag-doc-demo__item">
            <span class="base-tag-doc-demo__label">最近点击</span>
            <strong>{{ latestClick }}</strong>
          </div>
        </div>
      </BaseCard>
    </BaseRow>
  </div>
</template>

<style scoped lang="scss">
.base-tag-doc-demo {
  &__meta {
    display: grid;
    gap: 12px;
    margin-top: 16px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-extra-light);

    strong {
      color: var(--el-text-color-primary);
      line-height: 1.7;
    }
  }

  &__label {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    letter-spacing: 0.04em;
  }
}
</style>

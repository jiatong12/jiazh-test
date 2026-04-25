<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description?: string
  source?: string
  sourceHint?: string
  languageLabel?: string
}>(), {
  description: '',
  source: '',
  sourceHint: '示例源码',
  languageLabel: 'Vue',
})

const slots = useSlots()
const expanded = ref(false)
const copied = ref(false)

const hasPreview = computed(() => !!slots.default)
const hasSource = computed(() => !!props.source)

async function copySource() {
  if (!props.source || !navigator?.clipboard) {
    return
  }

  await navigator.clipboard.writeText(props.source)
  copied.value = true

  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <section class="doc-demo-block">
    <div class="doc-demo-block__meta">
      <h3 class="doc-demo-block__title">
        {{ title }}
      </h3>
      <p v-if="description" class="doc-demo-block__description">
        {{ description }}
      </p>
    </div>

    <div v-if="hasSource" class="doc-demo-block__toolbar">
      <ElButton
        text
        class="doc-demo-block__toolbar-action"
        :class="{ 'is-active': expanded }"
        @click="expanded = !expanded"
      >
        <BaseIcon :name="expanded ? 'i-ep:arrow-up' : 'i-ep:arrow-down'" />
        <span>{{ expanded ? '隐藏源码' : '查看源码' }}</span>
      </ElButton>
      <ElButton
        text
        class="doc-demo-block__toolbar-action"
        :class="{ 'is-success': copied }"
        @click="copySource"
      >
        <BaseIcon :name="copied ? 'i-ep:select' : 'i-ep:document-copy'" />
        <span>{{ copied ? '已复制' : '复制代码' }}</span>
      </ElButton>
    </div>

    <ElCollapseTransition>
      <div v-show="expanded && hasSource" class="doc-demo-block__source">
        <div class="doc-demo-block__source-header">
          <span class="doc-demo-block__source-path">{{ sourceHint }}</span>
          <span class="docs-code-text">
            {{ languageLabel }}
          </span>
        </div>
        <pre class="doc-demo-block__source-body"><code>{{ source }}</code></pre>
      </div>
    </ElCollapseTransition>

    <div v-if="hasPreview" class="doc-demo-block__preview">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.doc-demo-block {
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: calc(var(--el-border-radius-base) + 2px);
  background: var(--el-bg-color);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: var(--el-border-color);
    box-shadow: 0 14px 28px -24px rgb(0 0 0 / 35%);
  }

  &__meta {
    padding: 18px 20px;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--el-color-primary) 3%, var(--el-fill-color-blank)),
      var(--el-bg-color)
    );
  }

  &__title {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
  }

  &__description {
    margin: 10px 0 0;
    color: var(--el-text-color-regular);
    font-size: 13px;
    line-height: 1.8;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 16px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-blank);
  }

  &__toolbar-action {
    gap: 6px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
    font-weight: 500;
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      background-color 0.2s ease;

    :deep(span) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    &:deep(.base-icon) {
      font-size: 14px;
    }

    &:hover {
      color: var(--el-color-primary);
      background: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-bg-color));
    }

    &.is-active {
      color: var(--el-color-primary);
      background: color-mix(in srgb, var(--el-color-primary) 8%, var(--el-bg-color));
    }

    &.is-success {
      color: var(--el-color-success);
      background: color-mix(in srgb, var(--el-color-success) 8%, var(--el-bg-color));
    }
  }

  &__preview {
    padding: 24px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
  }

  &__source {
    border-top: 1px solid var(--el-border-color-lighter);
    background: #0f172a;
    color: #dbe4f0;
  }

  &__source-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__source-path {
    overflow: hidden;
    color: #93a4b8;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__source-body {
    margin: 0;
    padding: 18px 20px;
    overflow: auto;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 13px;
    line-height: 1.7;
  }
}

@media (max-width: 768px) {
  .doc-demo-block {
    &__preview {
      padding: 20px;
    }

    &__toolbar {
      justify-content: space-between;
      padding: 0 12px;
    }

    &__toolbar-action {
      padding-left: 0;
      padding-right: 0;
    }

    &__source-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
</style>

<script setup lang="ts">
interface FeatureItem {
  title: string
  description: string
  meta?: string
  path?: string
}

const props = withDefaults(defineProps<{
  items: FeatureItem[]
  columns?: number
}>(), {
  columns: 3,
})

const router = useRouter()

function handleClick(path?: string) {
  if (!path) {
    return
  }
  router.push(path)
}

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
}))
</script>

<template>
  <div class="doc-feature-grid" :style="gridStyle">
    <article
      v-for="item in items"
      :key="item.title"
      class="doc-feature-grid__item"
      :class="{ 'is-link': !!item.path }"
      @click="handleClick(item.path)"
    >
      <div v-if="item.meta || item.path" class="doc-feature-grid__meta-row">
        <ElTag v-if="item.meta" effect="plain" round size="small">
          {{ item.meta }}
        </ElTag>
        <BaseIcon v-if="item.path" name="i-ep:right" class="doc-feature-grid__arrow" />
      </div>

      <h3 class="doc-feature-grid__title">
        {{ item.title }}
      </h3>
      <p class="doc-feature-grid__description">
        {{ item.description }}
      </p>
    </article>
  </div>
</template>

<style scoped lang="scss">
.doc-feature-grid {
  display: grid;
  gap: 16px;

  &__item {
    min-width: 0;
    padding: 20px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: calc(var(--el-border-radius-base) + 2px);
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--el-color-primary) 4%, var(--el-fill-color-extra-light)),
      var(--el-bg-color)
    );
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &.is-link {
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--el-color-primary) 18%, var(--el-border-color));
        box-shadow: 0 12px 28px -24px rgb(0 0 0 / 42%);
      }

      &:hover .doc-feature-grid__arrow {
        color: var(--el-color-primary);
        transform: translateX(2px);
      }
    }
  }

  &__meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 24px;
    margin-bottom: 12px;
    gap: 12px;
  }

  &__arrow {
    flex: none;
    color: var(--el-text-color-placeholder);
    font-size: 16px;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  &__title {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 16px;
  }

  &__description {
    margin: 10px 0 0;
    color: var(--el-text-color-regular);
    font-size: 13px;
    line-height: 1.8;
  }
}

@media (max-width: 960px) {
  .doc-feature-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>

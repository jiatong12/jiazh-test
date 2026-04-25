<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  src: {
    type: String as PropType<string | null | undefined>,
    default: '',
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 200,
  },
  height: {
    type: [Number, String] as PropType<number | string>,
    default: 200,
  },
})

const imageSrc = computed(() => props.src ?? '')

const realWidth = computed(() => {
  return typeof props.width === 'string' ? props.width : `${props.width}px`
})

const realHeight = computed(() => {
  return typeof props.height === 'string' ? props.height : `${props.height}px`
})

const styleObj = computed(() => {
  return {
    width: realWidth.value,
    height: realHeight.value,
  }
})

const previewSrcList = computed(() => {
  return imageSrc.value ? [imageSrc.value] : []
})
</script>

<template>
  <ElImage :src="imageSrc" fit="cover" :style="styleObj" :preview-src-list="previewSrcList" preview-teleported>
    <template #error>
      <div class="image-slot">
        <BaseIcon name="i-icon:image-load-fail" />
      </div>
    </template>
  </ElImage>
</template>

<style lang="scss" scoped>
.el-image {
  background-color: var(--el-fill-color);
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-light);
  transition:
    background-color 0.3s,
    var(--el-transition-box-shadow);

  :deep(.el-image__inner) {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.2);
    }
  }

  :deep(.image-slot) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 30px;
    color: var(--el-text-color-secondary);
  }
}
</style>

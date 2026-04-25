<script setup lang="ts">
import { imageUrls } from './data'
</script>

<template>
  <div class="base-image-doc-demo">
    <BaseRow :cols="{ xs: 1, md: 3 }">
      <BaseCard title="默认尺寸" h-full>
        <BaseImage :src="imageUrls.logo" :width="180" :height="180" />
      </BaseCard>

      <BaseCard title="自定义比例" h-full>
        <BaseImage :src="imageUrls.illustration" width="220px" height="140px" />
      </BaseCard>

      <BaseCard title="失败占位" h-full>
        <BaseImage :src="imageUrls.broken" width="180px" height="140px" />
      </BaseCard>
    </BaseRow>
  </div>
</template>

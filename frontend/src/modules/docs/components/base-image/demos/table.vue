<script setup lang="ts">
import { imageTableData } from './data'
</script>

<template>
  <div class="base-image-table-demo">
    <BaseCard title="表格中的图片列">
      <ElTable :data="imageTableData" border>
        <ElTableColumn prop="name" label="名称" min-width="160" />
        <ElTableColumn prop="scene" label="场景" min-width="180" />
        <ElTableColumn label="图片" width="160" align="center">
          <template #default="{ row }">
            <BaseImage :src="row.src" width="96px" height="96px" />
          </template>
        </ElTableColumn>
      </ElTable>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
const count = ref(6)
const showExtra = ref(true)
</script>

<template>
  <div class="flex-column-layout">
    <ElSpace wrap>
      <ElInputNumber v-model="count" :min="3" :max="8" />
      <BaseButton @click="showExtra = !showExtra">
        showExtra = {{ showExtra }}
      </BaseButton>
    </ElSpace>

    <BaseRow :gutter="[20, 10]" :cols="{ xs: 1, md: 2, lg: 3 }">
      <div class="card">
        普通子节点会自动补一层 BaseCol。
      </div>

      <BaseCol :col="1">
        <div class="card">
          可以显式使用 BaseCol 单独控制某一项的列占比。
        </div>
      </BaseCol>

      <div v-if="showExtra" class="card">
        v-if=false 时会直接移除占位。
      </div>

      <BaseCol v-show="showExtra">
        <div class="card">
          v-show=false 时仍保留占位。
        </div>
      </BaseCol>

      <div v-for="item in count" :key="item" class="card">
        区块 {{ item }}
      </div>
    </BaseRow>
  </div>
</template>

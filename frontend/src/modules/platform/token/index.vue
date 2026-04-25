<script setup lang="ts">
import { ref } from 'vue'
import TokenManager from './components/TokenManager.vue'

const currentActiveName = ref('manager')
</script>

<template>
  <div class="h-full">
    <ElTabs v-model="currentActiveName" class="h-full">
      <ElTabPane label="令牌配置" name="manager" class="h-full">
        <TokenManager v-if="currentActiveName === 'manager'" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped>
.pane-btns {
  text-align: right;
}
.tree-class {
  width: 180px;
}

.user-modify-password-dialog :deep(.el-dialog) {
  width: 400px;
}
@media (max-width: 480px) {
  .user-modify-password-dialog :deep(.el-dialog) {
    width: 96%;
  }
}
</style>

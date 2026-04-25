<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
function openDialog() {
  dialogVisible.value = true
}

defineExpose({ openDialog })
</script>

<template>
  <ElDialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <span>This is userInfo</span>
    <template #footer>
      <span class="dialog-footer">
        <BaseButton @click="dialogVisible = false">取消</BaseButton>
        <BasePrimaryButton @click="dialogVisible = false">确认</BasePrimaryButton>
      </span>
    </template>
  </ElDialog>
</template>

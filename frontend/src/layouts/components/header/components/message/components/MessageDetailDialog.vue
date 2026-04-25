<script setup lang="ts">
const visible = ref(false)
const userType = ref('')
const data = ref<any>({})
/**
 * 打开，并根据参数初始化表单
 * @param _data 初始表单的数据
 */
function open(_data, _userType = 'FromUser'): void {
  data.value = { ..._data }
  userType.value = _userType
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <BaseDialog v-model="visible" title="查看" width="700px">
    <BaseCard>
      <div v-if="userType === 'to'" class="text item">
        <strong>接收人：</strong>
        <span>{{ data.toUser }}</span>
      </div>
      <div v-else class="text item">
        <strong>发送人：</strong>
        <span>{{ data.fromUser }}</span>
      </div>
      <div class="text item">
        <strong>发送时间：</strong>
        <span>{{ data.addTime }}</span>
      </div>
      <div class="text item">
        <strong>标题：</strong>
        <span>{{ data.subject }}</span>
      </div>
      <div class="text item">
        <strong>内容：</strong>
        <span v-html="data.content" />
      </div>
    </BaseCard>

    <template #footer>
      <BaseButton @click="handleCancel">
        关 闭
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 10px 0;
}
</style>

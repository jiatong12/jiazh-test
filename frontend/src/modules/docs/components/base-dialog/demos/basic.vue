<!-- 演示 BaseDialog 的默认头部、footer 插槽和全屏切换。 -->
<script setup lang="ts">
const dialogRef = useTemplateRef('dialogRef')
const visible = ref(false)
const formData = ref({
  note: '',
})
const showFullscreen = ref(true)
const isFullscreen = computed(() => Boolean((dialogRef.value as any)?.fullscreen))

function openDialog() {
  formData.value.note = ''
  visible.value = true
}

function toggleFullscreen() {
  const nextValue = !(dialogRef.value as any)?.fullscreen
  ;(dialogRef.value as any).fullscreen = nextValue
}
</script>

<template>
  <div class="flex-column-layout">
    <ElAlert
      title="顶部右上角的放大全屏按钮来自 BaseDialog 默认头部；如果不需要，可以直接关闭 showFullscreen。"
      type="info"
      :closable="false"
    />

    <ElSpace wrap>
      <BaseButton type="primary" @click="openDialog">
        打开弹框
      </BaseButton>
      <ElSwitch
        v-model="showFullscreen"
        inline-prompt
        active-text="显示全屏"
        inactive-text="隐藏全屏"
      />
    </ElSpace>

    <BaseDialog
      ref="dialogRef"
      v-model="visible"
      title="项目弹框默认写法"
      width="620px"
      :show-fullscreen="showFullscreen"
    >
      <BaseForm
        :datasource="formData"
        :enabled-leave-check="false"
        label-width="72px"
        width="100%"
      >
        <BaseCol :col="1">
          <BaseFormItem
            label="说明"
            prop="note"
            widget="textarea"
            :widget-props="{ rows: 4, placeholder: '这里演示的是默认头部、footer 插槽和 expose 出来的 fullscreen 状态。' }"
          />
        </BaseCol>
      </BaseForm>

      <template #footer>
        <BaseButton @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '切换全屏' }}
        </BaseButton>
        <BaseButton @click="visible = false">
          取消
        </BaseButton>
        <BaseButton type="primary" @click="visible = false">
          确定
        </BaseButton>
      </template>
    </BaseDialog>
  </div>
</template>

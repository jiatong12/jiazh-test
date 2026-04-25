<script setup lang='ts'>
// import { dialogEmits, dialogProps, ElDialog } from 'element-plus'
import { ElDialog } from 'element-plus'
import { useComponentExposed } from '@/hooks/useComponentExposed'
import { propsDef } from './def'

defineOptions({
  inheritAttrs: false,
})

defineProps(propsDef)

const fullscreen = ref(false)
const attrs = useAttrs()
function onClosed(...args: any[]) {
  fullscreen.value = false;
  (attrs as any)?.onClosed?.(args)
}

const { componentRef, componentExposed } = useComponentExposed(ElDialog, {
  // 自定义暴露属性
}, ['fullscreen'])
defineExpose(componentExposed)
</script>

<template>
  <ElDialog
    :ref="componentRef"
    class="base-dialog"
    :append-to-body="false"
    destroy-on-close
    :draggable="false"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    v-bind="{ ...$props, ...$attrs }"
    :fullscreen="fullscreen"
    @closed="onClosed"
  >
    <!-- 插槽默认实现 -->
    <template v-if="!$slots.header" #header="{ close, titleId, titleClass }">
      <div class="flex-justify-between">
        <span :id="titleId" class="el-dialog__title" :class="titleClass">{{ $attrs.title ?? '' }}</span>
        <span>
          <ElButton v-if="showFullscreen" class="el-dialog__headerbtn" text style="right: 50px;" @click="fullscreen = !fullscreen">
            <BaseIcon name="i-ep:full-screen" class="el-icon el-dialog__close" />
          </ElButton>
          <ElButton class="el-dialog__headerbtn" text @click="close">
            <BaseIcon name="i-ep:close" class="el-icon el-dialog__close" />
          </ElButton>
        </span>
      </div>
    </template>

    <!-- 继承插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name v-bind="slotData || {}" :fullscreen="fullscreen" />
    </template>
  </ElDialog>
</template>

<style lang='scss' scoped>
.el-dialog__headerbtn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  width: 48px;
  height: 48px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: var(--el-message-close-size, 16px);
}
</style>

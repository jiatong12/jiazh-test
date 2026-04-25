<script setup lang='ts'>
import { ElDrawer } from 'element-plus'
import { useComponentExposed } from '@/hooks/useComponentExposed'

defineOptions({
  inheritAttrs: false,
})

defineProps({})
const { componentRef, componentExposed } = useComponentExposed(ElDrawer, {
  // 自定义暴露属性
})
defineExpose(componentExposed)
</script>

<template>
  <ElDrawer
    :ref="componentRef"
    class="base-drawer"
    :append-to-body="false"
    destroy-on-close
    :close-on-click-modal="false"
    :show-close="false"
    v-bind="$attrs"
  >
    <!-- 插槽默认实现 -->
    <template #header="{ close, titleId, titleClass }">
      <div class="flex-justify-between">
        <span :id="titleId" class="el-drawer__title" :class="titleClass">{{ $attrs.title }}</span>
        <span>
          <!-- <ElButton class="el-drawer__close-btn" text style="right: 50px;">
            <BaseIcon name="i-ep:c-screen" class="el-icon el-drawer__close" />
          </ElButton> -->
          <ElButton class="el-drawer__close-btn" text @click="close">
            <BaseIcon name="i-ep:close" class="el-icon el-drawer__close" />
          </ElButton>
        </span>
      </div>
    </template>
    <!-- 继承插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name v-bind="slotData || {}" />
    </template>
  </ElDrawer>
</template>

<style lang='scss' scoped>
.el-drawer__close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  font-size: var(--el-message-close-size, 16px);
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}
</style>

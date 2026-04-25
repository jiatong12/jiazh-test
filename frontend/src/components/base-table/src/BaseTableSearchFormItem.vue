<!-- 只对 base-table-search-form-item-inner 包装一层，不放其他逻辑，主要为了实现 watchRerender 刷新效果，如果 InnerFormItem 有接口加载等功能也能重新触发 -->
<script lang="ts" setup>
import { propsDef } from './baseTableSearchFormItemDef'
import BaseTableSearchFormItemInner from './components/BaseTableSearchFormItemInner.vue'

const props = defineProps(propsDef)

const attrs = useAttrs()
const prop = toRef(attrs, 'prop') as Ref<string | undefined>

// 变化触发重新渲染
const key = computed(() => `${prop.value}-${props.watchRerender ?? ''}`)
</script>

<template>
  <BaseTableSearchFormItemInner :key="key" v-bind="props">
    <!-- 继承插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name v-bind="slotData || {}" />
    </template>
  </BaseTableSearchFormItemInner>
</template>

<style lang="scss" scoped>

</style>

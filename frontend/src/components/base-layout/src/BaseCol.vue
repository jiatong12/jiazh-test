<script setup lang='tsx'>
import type { Cols, Num } from './types'
import { ElCol } from 'element-plus'
import { useStore } from './context'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  show: true,
})
interface Props {
  // 是否换行，默认 false
  startNewRow?: boolean
  // 列的数量
  col?: Num
  // 列的数量，优先级高于 span
  cols?: Cols
  // 多节点组件中替代 v-show
  show?: boolean
}
const { parentCol, parentCols } = useStore()

const attrs = useAttrs()

const rawCol = computed(() => {
  return props.col ?? parentCol.value
})
const rawCols = computed(() => {
  // 当 props.col 有有效值时，不使用 cols 配置
  if (props.col !== undefined && props.col !== null) {
    return null
  }
  return props.cols ?? parentCols.value
})

const SUM = 24
// 列比绑定的变量
const colBindData = computed(() => {
  if (rawCols.value) {
    const { xs, sm, md, lg, xl } = rawCols.value
    return {
      xs: xs ? SUM / xs : void 0,
      sm: sm ? SUM / sm : void 0,
      md: md ? SUM / md : void 0,
      lg: lg ? SUM / lg : void 0,
      xl: xl ? SUM / xl : void 0,
      ...attrs,
    }
  }
  else {
    return { span: SUM / rawCol.value, ...attrs }
  }
})
</script>

<template>
  <div v-show="show" v-if="startNewRow" class="new-line" />
  <ElCol v-show="show" v-bind="colBindData">
    <slot />
  </ElCol>
</template>

<style lang="scss"  scoped>
  // 用来换行的 dom
.new-line {
  width: 100%;
}
</style>

import type { PropType } from 'vue'
import type { Cols, Num } from '@/components/base-layout'
import { formProps } from 'element-plus'
// import tableProps from 'element-plus/es/components/table/src/table/defaults'
import { expandProps } from '@/components/utils'

const { model, ...others } = formProps
export const propsDef = expandProps(others, {

  /** 外部控制的加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },

  // ----------------- 布局相关 -----------------
  // 栅格间隔，数值时为水平间隔，数组时为 [水平间隔,垂直间隔]
  gutter: {
    type: [Number, Array] as PropType<number | [number, number]>,
    default: 10,
  },
  // 列的数量
  col: {
    type: Number as PropType<Num>,
    required: false,
  },
  // 列的数量，优先级高于 span
  cols: {
    type: Object as PropType<Cols>,
    required: false,
  },

  // 标签的宽度
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: '100px',
    // default: 'auto', // 用 auto在搜索表单隐藏时，控制台会报警告，并且可能会导致初始化时 label宽度计算错误
  },

  // label 是否显示
  showLabel: {
    type: Boolean,
    default: true,
  },

  // 搜索方法
  handleSearch: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

import type { PropType } from 'vue'
import type { Cols, Num } from '@/components/base-layout'
// import tableProps from 'element-plus/es/components/table/src/table/defaults'
import { expandProps } from '@/components/utils'

export const propsDef = expandProps({}, {

  /** 外部控制的加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },

  // 标签的宽度，displayMode=descriptions 时要设置这个为具体的值（不能是 auto）
  labelWidth: {
    type: [String, Number] as PropType<string | number | 'auto'>,
    // default: 'auto', // auto 在搜索表单隐藏时，控制台会报警告
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
    default: 1,
  },
  // 列的数量，优先级高于 span
  cols: {
    type: Object as PropType<Cols>,
    required: false,
  },
  // 宽度
  width: {
    type: String as PropType<string>,
    default: 'auth',
  },
  // 左右居中，必须要先设置宽度
  center: {
    type: Boolean,
    default: false,
  },
  // 显示模式 form | descriptions
  displayMode: {
    type: String as PropType<'form' | 'descriptions'>,
    default: 'form',
  },

  // ----------------- 数据相关 -----------------
  /** 数据源，可以是对象或返回Promise的函数 */
  datasource: {
    type: [Object, Function] as PropType<Record<string, any> | ((param: any) => Promise<Record<string, any>>)>,
    required: true,
  },

  /** 是否立即加载数据 */
  immediate: {
    type: Boolean,
    default: true,
  },

  /** 开启离开检查，不能动态修改 */
  enabledLeaveCheck: {
    type: Boolean,
    default: true,
  },

  /** 数据映射，多字段用逗号隔开，如 datetimeRange 组件绑定数组 ['startDate,endData']，校验也是用的这种结构，但实际数据是两个字段 */
  // arrayFields: {
  //   type: Array as PropType<string[]>,
  //   default: () => [],
  // },
})

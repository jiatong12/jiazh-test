import type { PropType } from 'vue'
import type { WidgetType } from './types'
import type { DictSource } from '@/dicts/useDict'
import { formItemProps } from 'element-plus'
import { expandProps } from '@/components/utils'

const { label, prop, required, rules, ...others } = formItemProps
export const propsDef = expandProps(others, {
  label,
  prop: {
    type: String,
    required: false,
  },
  required,
  rules,

  verify: {
    type: [Array] as PropType<string[]>,
    required: false,
  },

  // 权限
  priv: {
    type: String,
    required: false,
  },

  // ----------------- 便捷操作 -----------------
  /**
   * 数据变化触发组件重新渲染（就是通过修改 key 属性实现）
   * @example
   * 绑定个响应式变量
   */
  watchRerender: {
    type: [String, Number, Boolean],
    required: false,
  },
  /**
   * 数据变化触发校验
   * @example
   * 绑定个响应式变量
   */
  watchValidate: {
    type: [String, Number, Boolean],
    required: false,
  },
  /**
   * 数据变化触发数据清空，优先级比 watchValidate 高，同时触发时，不会触发校验
   * @example
   * 绑定个响应式变量
   */
  watchClear: {
    type: [String, Number, Boolean],
    required: false,
  },

  // ----------------- 其他 -----------------
  // 提醒
  help: {
    type: String,
    required: false,
  },

  widget: {
    type: String as PropType<WidgetType>,
    required: false,
  },
  widgetProps: {
    type: Object,
    required: false,
  },

  // 是否是只读，切换为 readonlyWidget 组件，用来实现表单中部分字段只读或禁用体验差的情况
  isReadonly: {
    type: Boolean,
    required: false,
  },
  // 展示组件为空（空字符、null、undefined）时的内容
  readonlyEmpty: {
    type: String,
    default: '--',
  },
  // // 只读组件渲染，表单某些字段人员只有查看权限时就可以用此组件，默认自动根据 widget 进行推导出对应的展示物料
  // readonlyWidget: {
  //   type: String as PropType<ReadonlyWidgetType>,
  //   required: false,
  // },
  // readonlyWidgetProps: {
  //   type: Object,
  //   required: false,
  // },

  // 字典数据源，只能用查出全部，可以认为是常量的数据，分页或部分数据不应该放这里，主要是不能进行回显，所以只能靠组件自己实现
  dict: {
    type: [String, Array, Function] as PropType<DictSource>,
    required: false,
  },
})

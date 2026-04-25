import type { PropType } from 'vue'
import type { BaseTableSearchType } from './types/search.types'
import type { DictSource } from '@/dicts/useDict'
import { formItemProps } from 'element-plus'
import { expandProps } from '@/components/utils'

const { ...others } = formItemProps
export const propsDef = expandProps(others, {

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
    type: String as PropType<BaseTableSearchType>,
    required: false,
  },
  widgetProps: {
    type: Object,
    required: false,
  },

  // 字典数据源，只能用查出全部，可以认为是常量的数据，分页或部分数据不应该放这里，主要是不能进行回显，所以只能靠组件自己实现
  dict: {
    type: [String, Array, Function] as PropType<DictSource>,
    required: false,
  },
})

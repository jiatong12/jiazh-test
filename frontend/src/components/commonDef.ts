import type { ComponentObjectPropsOptions } from 'vue'
import type { DictSource } from '@/dicts/useDict'
import { defProp } from './utils'

// 模式，可根据模式设置颜色
export const modeType = Object.freeze(['primary', 'success', 'warning', 'danger', 'info'] as const)
export type ModeType = (typeof modeType)[number]

// 公共属性
export default {
  placeholder: defProp([String]),
  clearable: defProp([Boolean], false),
  disabled: defProp([Boolean], false),
  readonly: defProp([Boolean], false),
  loading: defProp([Boolean], false),
  size: defProp(['', 'small', 'default', 'large'] as const),
} satisfies ComponentObjectPropsOptions

// ----------------- 字典相关 -----------------

export const dictCommonDef = {
  dict: defProp<DictSource>(() => []),
  labelField: defProp([String], 'label'), // label 字段名
  valueField: defProp([String], 'value'), // value 字段名
  disabledField: defProp([String], 'disabled'),
  orderField: defProp([String], 'order'),
  colorField: defProp([String], 'color'),
  ignoreDisabled: defProp([Boolean], false),
  isNumber: defProp([Boolean], false),
}
/** 树结构字典 */
export const treeDictCommonDef = {
  ...dictCommonDef,
  childrenField: defProp([String], 'children'),
}

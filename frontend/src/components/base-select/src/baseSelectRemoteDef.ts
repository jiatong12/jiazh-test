import { dictCommonDef } from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  // disabled,
  // placeholder,
  // 'clearable': defProp([Boolean]),
  // 'options': defProp<(DictItem | Record<string, any>)[]>(() => []), // 数据集
  // 'multiple': defProp([Boolean]),
  // 'showSearch': defProp([Boolean]), // 显示搜索
  'modelValue': defProp([Array, Object, String, Number, Boolean]),
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[item?: Record<string, any>[] | Record<string, any>]>(),
  ...dictCommonDef,
})

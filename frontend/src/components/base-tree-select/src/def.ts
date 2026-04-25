import { treeDictCommonDef } from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  // 'checkStrictly': defProp([Boolean], false),
  // 'showCheckbox': defProp([Boolean], false),
  // 'multiple': defProp([Boolean], false),
  'modelValue': defProp([Array, Object, String, Number, Boolean]),
  // 'options': defProp<(DictItem | Record<string, any>)[]>(() => []), // 数据集
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[item?: Record<string, any>[] | Record<string, any> ]>(),
  ...treeDictCommonDef,
})

import commonProps, { dictCommonDef } from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

const { disabled } = commonProps

export const propsDef = defProps({
  'modelValue': defProp([Array as unknown as any[]]),
  disabled,
  // 'options': defProp<(DictItem | Record<string, any>)[]>(() => []), // 数据集
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[items?: Record<string, any> ]>(),
  ...dictCommonDef,
})

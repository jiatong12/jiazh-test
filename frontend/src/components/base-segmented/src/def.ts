import { dictCommonDef } from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  'modelValue': defProp([String, Number, Boolean]),
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[item?: Record<string, any>]>(),
  ...dictCommonDef,
})

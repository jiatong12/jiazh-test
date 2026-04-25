import { dictCommonDef } from '@/components/commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  'modelValue': defProp([String, Number, Boolean, Array as unknown as any[]]),
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[item?: Record<string, any>]>(),
  ...dictCommonDef,
})

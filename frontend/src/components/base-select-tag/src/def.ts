import type { Arrayable } from '@vueuse/core'
import commonProps, { dictCommonDef } from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

const { disabled, readonly, loading } = commonProps

export const propsDef = defProps({
  'multiple': defProp([Boolean], false),
  'showAll': defProp([Boolean], true),
  'modelValue': defProp([String, Number, Boolean, Array as unknown as any[]]),
  disabled,
  readonly,
  loading,
  'type': defProp(['primary', 'success', 'warning', 'danger', 'info'] as const, 'primary'),
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onChange': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[item: Arrayable<Record<string, any>> | void ]>(),
  ...dictCommonDef,
})

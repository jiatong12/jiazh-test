import type { Arrayable } from '@vueuse/core'
import { dictCommonDef } from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  // 'clearable': defProp([Boolean], false),
  // 'options': defProp<(DictItem | Record<string, any>)[]>(() => []), // 数据集
  // 'multiple': defProp([Boolean], false),
  // 'showSearch': defProp([Boolean], false), // 显示搜索
  'modelValue': defProp([Array, Object, String, Number, Boolean]),
  'onUpdate:modelValue': defEmitProp<[val: any]>(),
  'onSyncItem': defEmitProp<[item: Arrayable<Record<string, any>> | void ]>(),
  ...dictCommonDef,
})

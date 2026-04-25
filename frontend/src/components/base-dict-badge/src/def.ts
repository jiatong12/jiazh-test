import { dictCommonDef } from '@/components/commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  value: defProp([String, Number, Boolean]),
  // options: defProp<(DictItem | Record<string, any>)[]>(() => []), // 数据集
  flicker: defProp([Boolean], false), // 是否闪烁
  onClick: defEmitProp<[...args: any[]]>(),
  ...dictCommonDef,
})

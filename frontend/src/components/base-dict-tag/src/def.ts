import { dictCommonDef } from '@/components/commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  value: defProp([Array, Object, String, Number, Boolean]),
  onClick: defEmitProp<[...args: any[]]>(),
  ...dictCommonDef,
})

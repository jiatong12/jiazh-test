import type { ModeType } from '@/components/commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  color: defProp([String]),
  type: defProp<ModeType>(),
  effect: defProp<'dark' | 'light' | 'plain'>(),
  onClick: defEmitProp<[...args: any[]]>(),
})

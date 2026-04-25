import { modeType } from '@/components/commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

export const propsDef = defProps({
  color: defProp(modeType),
  onClick: defEmitProp<[...args: any[]]>(),
})

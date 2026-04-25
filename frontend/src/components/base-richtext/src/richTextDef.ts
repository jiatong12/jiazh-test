import commonProps from '../../commonDef'
import { defEmitProp, defProp, defProps } from '../../utils'

const { disabled, placeholder } = commonProps

export const propsDef = defProps({
  disabled,
  placeholder,
  'modelValue': defProp([String]),
  'onUpdate:modelValue': defEmitProp<[val: string]>(),
})

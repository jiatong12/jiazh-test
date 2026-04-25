import commonProps from '../../commonDef'
import { defProp, defProps } from '../../utils'

const { disabled, placeholder, clearable } = commonProps

export const propsDef = defProps({
  disabled,
  placeholder,
  clearable,
  maxlength: defProp([Number]),
  showCount: defProp([Boolean], false),
  modelValue: defProp([String]),
})

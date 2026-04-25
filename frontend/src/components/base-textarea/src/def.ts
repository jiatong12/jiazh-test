import { defProp, defProps } from '../../utils'

export const propsDef = defProps({
  autosize: defProp([Boolean, Object as unknown as { minRows?: number, maxRows?: number }], () => ({ minRows: 2, maxRows: 6 })),
  maxlength: defProp([Number]),
  showCount: defProp([Boolean], false),
})

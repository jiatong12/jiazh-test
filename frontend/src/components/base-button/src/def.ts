import type { FormInstance } from 'element-plus'
import { defProp, defProps } from '../../utils'

// const { disabled, loading, size } = commonProps

const _primaryPropsDef = ({
  // disabled,
  // loading,
  // size,
  // 波纹效果
  ripple: defProp([Boolean], true),
  // 权限
  priv: defProp([String]),
  disabled: defProp([Boolean], false),
  // icon: defProp([Object as unknown as Component]),
  // // 类型
  // type: defProp(['plain', 'link', 'text'] as const),
  // // 设置按钮形状
  // shape: defProp(['circle', 'round'] as const),
  // // 按钮文本，优先级低于插槽（主要是为了方便 useSubmit 响应值绑定）
  // text: defProp([String]),

  // 点击
  // onClick: defEmitProp<[...args: any[]]>(),

  // ...other,
})

// 主按钮的参数
export const primaryPropsDef = defProps(_primaryPropsDef)

// 普通按钮的参数
export const propsDef = defProps({
  ..._primaryPropsDef,
  // ...buttonProps,
  // color: defProp([String]),
})

// 操作按钮参数
export const actionPropsDef = defProps({
  ...propsDef,
  // 提交 API
  api: defProp([Function as unknown as (() => Promise<any>)], { required: true }),
  // 校验
  validate: defProp([Function as unknown as FormInstance['validate']]),
  // 操作名
  actionName: defProp([String], '操作'),
})

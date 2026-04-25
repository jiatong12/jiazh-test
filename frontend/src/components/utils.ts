import type { ComponentObjectPropsOptions, ObjectEmitsOptions, PropType } from 'vue'

/**
 * 注册事件属性（严格模式）
 * @template T - 事件参数类型元组
 * @returns 事件属性配置对象
 *
 * @example
 * // 定义带参数的事件
 * const emitProp = defEmitProp<[string, number]>()
 * // 对应模板使用：
 * // @my-event="(a: string, b: number) => handler"
 */
export function defEmitProp<T extends any[]>() {
  return {
    type: Function as PropType<(...args: T) => void>,
  } as const
}

/**
 * 定义组件 Props 集合（类型安全封装）
 * @template T - Props 配置对象类型
 * @param props - 符合 Vue 组件规范的 Props 配置
 * @returns 原样返回输入配置（类型安全包装）
 */
export function defProps<T extends ComponentObjectPropsOptions>(props: T): T {
  return props
}

/**
 * 构造器类型到实例类型映射
 * @template T - 构造器类型（StringConstructor 等）或普通类型
 */
type ConstructorToType<T>
  = T extends StringConstructor ? string
    : T extends NumberConstructor ? number
      : T extends BooleanConstructor ? boolean
        : T extends abstract new (...args: any) => infer R ? R // 处理类构造函数
          // T extends (...args: any[]) => infer R ? R : // 处理普通函数
          : T // 保持原类型

// type ForbidArrayType<T> = T extends any[] ? never : T

// 新增类型工具：检测是否为字面量类型元组
type IsLiteralTuple<T>
  = T extends readonly [infer A, ...infer Rest]
    ? A extends string | number | boolean
      ? IsLiteralTuple<Rest>
      : false
    : T extends readonly [] ? true : false

/**
 * 字面量联合类型提取
 * @template T - 输入类型数组
 */
type LiteralUnion<T extends readonly any[]> = T[number]

/**
 * 通用属性定义函数（严格模式）
 *
 * ### 核心特性：
 * 1. 自动类型推导 - 根据参数自动推导出正确的 Prop 类型
 * 2. 严格类型校验 - 编译时 + 运行时双重校验
 * 3. 智能默认值 - 支持工厂函数形式
 * 4. 组合类型支持 - 自动合并类型校验
 * 5. 枚举值校验 - 支持字面量枚举值校验
 * 6. 严格默认值校验 - 编译期和运行期双重校验默认值合法性
 *
 * @example
 *
 * // 组合类型（构造函数数组）如果有 ts 类型用 as 进行断言（编译期+运行期）
 * defProp([String, Number], 100) // => { type: [String, Number], default: 100 }
 * defProp([String, Number, Object as unknown as {aa:string}], 100) // => { type: [String, Number,{aa:string}], default: 100 }
 *
 * // 类类型（编译期+运行期）
 * defProp([Date], () => new Date()) // => { type: Date, default: () => new Date() }
 *
 * // 枚举值校验（编译期+运行期）
 * defProp(['primary', 'danger'] as const) // 类型为 'primary' | 'danger'
 * defProp([200, 404] as const) // 类型为 200 | 404
 */

// 纯字面量枚举重载
export function defProp<T extends IsLiteralTuple<T> extends true ? unknown[] : never>(
  types: T,
): {
  type: PropType<LiteralUnion<T>>
  validator: (val: any) => boolean
}
export function defProp<T extends IsLiteralTuple<T> extends true ? unknown[] : never>(
  types: T,
  options: { required: true },
): {
  type: PropType<LiteralUnion<T>>
  required: true
  validator: (val: any) => boolean
}
export function defProp<T extends IsLiteralTuple<T> extends true ? unknown[] : never>(
  types: T,
  defaultValue: LiteralUnion<T>,
): {
  type: PropType<LiteralUnion<T>>
  default: LiteralUnion<T>
  validator: (val: any) => boolean
}

// 编译和运行期重载
export function defProp<T extends any[]>(
  types: [...T],
): {
  type: PropType<ConstructorToType<T[number]>>
  validator: (val: any) => boolean
}
export function defProp<T extends any[]>(
  types: [...T],
  options: { required: true },
): {
  type: PropType<ConstructorToType<T[number]>>
  required: true
  validator: (val: any) => boolean
}
export function defProp<T extends (StringConstructor | NumberConstructor | BooleanConstructor)[], D extends ConstructorToType<T[number]>>(
  types: [...T],
  defaultValue: D,
): {
  type: PropType<ConstructorToType<T[number]>>
  default: D
  validator: (val: any) => boolean
}
export function defProp<T extends any[], D extends () => ConstructorToType<T[number]>>(
  types: [...T],
  defaultValue: D,
): {
  type: PropType<ConstructorToType<T[number]>>
  default: D
  validator: (val: any) => boolean
}

// 纯编译期校验，ts 类型
export function defProp<T>(
): {
  type: PropType<T>
}
// 必填
export function defProp<T>(
  options: { required: true },
): {
  type: PropType<T>
  required: true
}
// 默认值
export function defProp<T>(
  defaultValue: (() => T),
): {
  type: PropType<T>
  default: (() => T)
}
// 不能是数组类型，会和 types 冲突
export function defProp<T extends (any[] extends T ? never : unknown)>(
  defaultValue: T,
): {
  type: PropType<T>
  default: T
}

export function defProp<T>(arg1?: any, arg2?: any) {
  // 处理必填属性场景
  if (arg1 && typeof arg1 === 'object' && 'required' in arg1) {
    return {
      type: null as unknown as PropType<T>,
      required: arg1.required,
    } as const
  }

  // 处理组合类型场景（支持全部构造类型或全部枚举值）
  if (Array.isArray(arg1)) {
    const [types, enumValues] = separateTypeAndValues(arg1)

    let required = false
    if (arg2 !== undefined) {
      if (typeof arg2 === 'object' && 'required' in arg2) {
        // 处理必填属性场景
        required = arg2.required
      }
      else {
        // 默认值校验（运行期）
        const actualValue = typeof arg2 === 'function' ? arg2() : arg2
        validateValue(types, enumValues, actualValue)
      }
    }

    return {
      type: types.length > 0 ? types : null,
      required,
      ...(required ? {} : { default: arg2 }),
      validator: (val: unknown) => validateValue(types, enumValues, val),
    } as const
  }

  // 处理简单类型默认值
  return {
    type: null as unknown as PropType<T>,
    ...(arg1 !== undefined ? { default: arg1 } : {}),
  } as const
}

// ---------------------- 辅助函数 ----------------------
// 类型判断辅助函数
function isConstructor(obj: any): boolean {
  return (
    obj === String
    || obj === Number
    || obj === Boolean
    || obj === Date
    || obj === Object
    || obj === Function
    || obj === Array
  )
}

// 分离类型构造函数和枚举值
function separateTypeAndValues(options: any[]): [any[], any[]] {
  const types: any[] = []
  const enumValues: any[] = []

  options.forEach((option) => {
    if (isConstructor(option)) {
      types.push(option)
    }
    else {
      enumValues.push(option)
    }
  })

  return [types, enumValues]
}

// 获取预期类型名称列表
function getExpectedTypeNames(options: any[]): string[] {
  return options.map((option) => {
    if (isConstructor(option)) {
      return option.name.toLowerCase()
    }
    return typeof option
  })
}

// 值校验核心逻辑
function validateValue(
  types: any[],
  enumValues: any[],
  value: unknown,
): boolean {
  // 打包后的正式环境不进行校验
  if (import.meta.env.PROD && import.meta.env.MODE === 'production') {
    return true
  }

  // 类型校验
  const typeValid = types?.length
    ? types.some((t) => {
        if (t === String) { return typeof value === 'string' }
        if (t === Number) { return typeof value === 'number' }
        if (t === Boolean) { return typeof value === 'boolean' }
        return value instanceof t
      })
    : true

  // 枚举值校验（严格相等）
  const enumValid = enumValues?.length
    ? enumValues.includes(value)
    : true

  // 开发环境校验提示
  if (!typeValid || !enumValid) {
    const expectedTypeNames = getExpectedTypeNames(types)
    // const typeMsg = types?.length ? `允许类型: ${types.map(t => t.name).join(' | ')}\n` : ''
    const typeMsg = expectedTypeNames?.length ? `允许类型: ${expectedTypeNames.join(' | ')}\n` : ''
    const enumValuesMsg = enumValues?.length ? `允许值: ${enumValues.join(' | ')}\n` : ''
    console.warn(
      `[defProp] 校验失败\n${typeMsg}${enumValuesMsg}`
      + `实际值: ${JSON.stringify(value)}`,
    )
  }

  return typeValid || enumValid
}

// ----------------- 测试相关 -----------------
// defProp([String], { required: true })
// // 带默认值的简单类型
// defProp([String], '')
// defProp([String], () => 1)
// // 组合类型（构造函数数组）
// defProp([String, Number], true)
// defProp([Date], () => new Date())
// defProp([Date], new Date())

// // 枚举值校验（编译期+运行期）
// defProp(['primary', 'danger'] as const, 'danger')
// // defProp(['primary', 'danger'], 'danger')
// // defProp(['primary', 'danger'] as const, () => 'danger' as const)
// defProp([200, 404] as const)
// defProp([200, 404] as const, { required: true })
// defProp([200, 404] as const, { required: true })

// // ts 类型编译期校验
// defProp<Component>()
// defProp<Component>({ required: true })
// defProp(['123'] as const)
// defProp<{ aaa: string }>(() => ({ aaa: '' }))

// defProp([String])
// // 合约束
// defProp([Date, Object as Component])
// defProp([String, Number], { required: true })
// defProp([String, Number], () => 1)
// defProp([String, Number], 1)
// defProp([String, Number], () => 1)
// defProp([String], () => 1)
// defProp([String, Object as unknown as { aa: string }], () => ({ aa: '1' }))

/**
 * ps: oldProps 的值虽然 props 能提示，但只能用 attrs 来获取，并且没默认值
 * 拓展属性，组件二次开发时使用
 * 在保持类型提示的情况下，不影响属性透传
 *
 * @param oldProps 旧属性，注意：在属性中使用此属性的值不能直接用，必须通过 attrs 来取，而不是 props
 * @param customProps 拓展的属性
 * @returns 强转为合并后的属性类型
 */
export function expandProps<OP extends ComponentObjectPropsOptions, CP extends ComponentObjectPropsOptions>(oldProps: OP, customProps: CP) {
  return customProps as (typeof oldProps & typeof customProps)
}

/**
 * 拓展事件，组件二次开发时使用
 * 在保持类型提示的情况下，不影响事件透传
 *
 * @param oldEmits 旧事件
 * @param customEmits 拓展的事件
 * @returns 强转为合并后的事件类型
 */
export function expandEmits<OE extends ObjectEmitsOptions, CE extends ObjectEmitsOptions>(oldEmits: OE, customEmits: CE) {
  return customEmits as (typeof oldEmits & typeof customEmits)
}

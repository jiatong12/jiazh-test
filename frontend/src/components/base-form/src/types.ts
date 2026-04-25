// import type { DictCode } from '@/common/dicts'
import type { DictSource } from '@/dicts/useDict'

/** 只读组件类型 */
export type ReadonlyWidgetType
// 展示组件
  = | 'text'
    | 'tag'
    | 'badge'
    | 'link'
    | 'image'

// 所有组件类型
export type WidgetType
// 输入组件
  = | 'input'
    | 'textarea'
    | 'number'
    | 'decimal'
    | 'switch'
    | 'checkbox'
    | 'checkboxGroup'
    | 'radio'
    | 'select'
    | 'multipleSelect'
    | 'treeSelect'
    | 'multipleTreeSelect'
    | 'selectTag'
    | 'multipleSelectTag'
    | 'iconPicker'
  // 时间
    | 'date'
    | 'dateRange'
    | 'time'
    | 'timeRange'
    | 'dateTime'
    | 'dateTimeRange' | ReadonlyWidgetType

export interface WidgetConfig {
  // dict?: string | Record<string, any>[] | (() => Promise<Record<string, any>[]>) // 字典数据源
  dict?: DictSource // 字典数据源
  modelValue: any // 获取数据
  setModelValue: (val: any) => void // 设置数据

  widget?: WidgetType
  widgetProps?: Record<string, any>
  isReadonly?: boolean
  // readonlyWidget?: ReadonlyWidgetType
  // readonlyWidgetProps?: Record<string, any>
  readonlyEmpty?: string
}

// export interface FormItemConfig<Type = WidgetType> {
//   empty?: string // 空（空字符、null、undefined）时的内容（只有部分展示组件生效）
//   /* 布局属性 */
//   startNewRow?: boolean // 是否换行，默认 false
//   col?: Num // 几分之几列
//   cols?: Cols // 几分之几列，优先级高于 col
//   /* 是否显示 */
//   if?: boolean // 是否显示
//   show?: boolean // 是否显示

//   /**
//    * 数据变化触发组件重新渲染（类似 Vue 的 key 属性机制）
//    * 接收需要监听的字段路径或计算值，这里可以用计算属性脚本
//    * @example
//    * 和 watch 基本一样，但不能返回对象，对象要转成字符串
//    * watchRerender: $buildComputed(($) => { return $.formData.name }) // 监听 name 变化
//    * watchRerender: $buildComputed(($) => { return $.formData.name + $.formData.id  }) // 监听多个字段
//    */
//   watchRerender?: any
//   /**
//    * 数据变化触发校验
//    * @example
//    * 就和 watch 一样写就好了
//    */
//   watchValidate?: any
//   /**
//    * 数据变化触发数据清空，优先级比 watchValidate 高，同时触发时，不会触发校验
//    * @example
//    * 就和 watch 一样写就好了
//    */
//   watchClear?: any

//   /* 表单项配置 */
//   label: string // 标题
//   /*
//     字段属性名
//     多个用逗号分隔
//   */
//   field: string
//   rules?: any[] | any // 规则
//   required?: boolean // 是否必填，rules 的一种快捷方式，可和 rules 组件
//   help?: string // 提示信息
//   helpMode?: 'tooltip' | 'text' // 提示信息显示模式
//   // dict?: MaybeRef<(DictItem | Record<string, any>)[]> | (() => Promise<(DictItem | Record<string, any>)[]>) // 字典数据源
//   dict?: any // 字典数据源，只能用查出全部，可以认为是常量的数据，分页或部分数据不应该放这里，主要是不能进行回显，所以只能靠组件自己实现
//   /* 组件 */
//   refName?: string // 组件引用名
//   render?: Type | { type: Type, props?: Record<string, any> } | ((config: PreFormItemConfig) => VNode) // 渲染
//   readonly?: boolean // 是否是只读，切换为 readonlyRender 组件
//   readonlyRender?: Type | { type: Type, props?: Record<string, any> } | ((config: PreFormItemConfig) => VNode) // 只读组件渲染，表单某些字段人员只有查看权限时就可以用此组件
//   defaultValue?: any // 默认值，一般只有在新增时用，初始时不会使用到，只有从隐藏切换到显示还有 resetForm 会使用到

//   /**
//    * 初始化时若字段值为空（null/undefined/空字符串），
//    * 是否回退到使用默认值进行初始化
//    * @default true
//    */
//   initFallbackToDefault?: boolean
//   /**
//    * 当字段从隐藏变为显示时，若当前值为空（null/undefined/空字符串）
//    * 是否回退到使用默认值
//    * @default true
//    */
//   showFallbackToDefault?: boolean

//   // 如果关联的数据是空时否自动设置默认数据 todo ：添加个模式，看是否是新增还是修改模式，如果是编辑模式，初始时就不用 defaultValue
//   // 如果关联的数据是空时否自动设置默认数据
// }

// export interface FormConfig<Type = WidgetType> {
//   // rangeDateFieldConvert:
//   // title?: string
//   // renderRight?: () => VNode | void
//   // arrayFieldsMap: Record<string, [string, string]> // 数组字段映射，注意：给表单赋值和提交取值时会删除对应的字段，以保证不出现让人疑惑的非表单输入同步数据
//   empty?: string // 空（空字符、null、undefined）时的内容（只有部分展示组件生效）
//   loading?: boolean // 外部可控制的 loading，只有内部和外部 loading 都为 false 才停止加载，用来处理依赖外部数据加载的情况
//   /* 布局属性 */
//   col?: Num // 几分之几列
//   cols?: Cols // 几分之几列，优先级高于 col
//   // label 宽度
//   labelWidth?: string | number | 'auto'
//   // 校验改变是否触发校验
//   validateOnRuleChange?: boolean

//   /**
//    * 初始化时若字段值为空（null/undefined/空字符串），
//    * 是否回退到使用默认值进行初始化
//    * @default true
//    */
//   initFallbackToDefault?: boolean
//   /**
//    * 当字段从隐藏变为显示时，若当前值为空（null/undefined/空字符串）
//    * 是否回退到使用默认值
//    * @default true
//    */
//   showFallbackToDefault?: boolean

//   // 绑定数，也可以直接用 setFormData 赋值
//   // formData: Ref<Record<string, any>>
//   // 提交按钮配置
//   // submit?: {
//   //   // 是否显示
//   //   show?: boolean
//   //   // 提交 API
//   //   api: (state: Record<string, any>) => Promise<any>
//   //   // 按钮文字
//   //   text?: string
//   // }
//   // 表单项配置
//   items: FormItemConfig<Type>[]
// }

// // 上下文
// export interface UseFormContext<S = Record<string, any>> {
//   // 变量数据
//   formData: S
//   // 在 prerender 时获取不到，在 proxy 中能使用
//   refs: Record<string, any>
//   // 加载状态
//   loading: boolean
//   // 数据加载状态
//   immediateLoading: boolean
//   // 函数的变量
//   args?: any[]

//   func: {
//     // 内置函数
//     GET: typeof get
//     SET: typeof set

//     // 获取显示字段数据
//     // getFormDataByShow: () => Record<string, any>
//     // 获取所有显示的输入字段数据
//     // getFormDataByShowInput: () => Record<string, any>
//     // 获取表单某个字段数据
//     getFormFieldData: (field: string) => any
//     setFormFieldData: (field: string, val: any) => void
//     /**
//      *  获取表单对象
//      * @returns 深度拷贝的对象
//      */
//     getFormData: () => Record<string, any>
//     setFormData: (state: Record<string, any>) => void
//     setFormDataAssign: (state: Record<string, any>) => void
//     nextTick: typeof nextTick
//     arrayFieldConvert: typeof arrayFieldConvert
//     validate: FormInstance['validate']
//     validateField: FormInstance['validateField']
//     clearValidate: FormInstance['clearValidate']
//     resetForm: () => any
//     // 自定义代理
//     proxy: (target: any) => any
//   }

//   // 权限
//   auth: {
//     /**
//      * 存在权限
//      * @param codes 权限标识
//      * @returns 是否存在权限
//      */
//     hasAuth: (...codes: string[]) => boolean
//     /**
//      * 存在其中任意一个权限
//      * @param codes 权限标识
//      * @returns 是否存在权限
//      */
//     hasAuthAny: (...codes: string[]) => boolean
//     /**
//      * 存在角色
//      * @param codes 角色标识
//      * @returns 是否存在角色
//      */
//     hasRole: (...codes: string[]) => boolean
//     /**
//      * 存在其中任意一个角色
//      * @param codes 角色标识
//      * @returns 是否存在角色
//      */
//     hasRoleAny: (...codes: string[]) => boolean

//     // 用户角色、用户权限、当前会话信息
//     accessToken: ReturnType<typeof useAuthStore>['accessToken']
//     refreshToken: ReturnType<typeof useAuthStore>['refreshToken']
//     authCodesGet: ReturnType<typeof useAuthStore>['authCodesGet']
//     roleCodesGet: ReturnType<typeof useAuthStore>['roleCodesGet']
//   }
//   // 页面相关工具，路由页面
//   page: {
//     route: RouteLocationNormalizedLoaded
//     router: Router
//     // 回到首页
//     goHome: () => Promise<any>
//     // 关闭 tob 页
//     closeCurrentTob: () => Promise<any>
//   }
//   // 获取应用上下文
//   app: {
//     userInfo: any
//   } // 用户信息、用户 id、用户名
// }

// // 辅助工具
// // export interface UseFormUtils {
// //   buildExpr: typeof buildExpr
// //   buildFuncExpr: typeof buildFuncExpr<UseFormContext>
// //   buildFunc: typeof buildFunc<UseFormContext>
// // }

// // export interface DataSource<P = any, R = any> {
// //   // 接口, 入参 params
// //   api: (params: P | undefined) => Promise<R>
// //   // 初始的 data 值，在首次响应前 data 值为初始值，未设置时为 undefined，最好用字面量吧，不要用变量
// //   defaultValue?: () => R
// //   // 是否立即发起请求，默认 true
// //   immediate?: boolean
// //   // 可实现响应时间小于100ms时不展示 loading 动画，大于100ms时展示300ms的 loading 动画时间
// //   // 延时 loading 等待时间，默认 0
// //   loadingDelay?: number
// //   // 加载时间，默认 300
// //   loadingKeep?: number
// // }

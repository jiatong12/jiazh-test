import type { ButtonType } from 'element-plus'
import type { DictSource } from '@/dicts/useDict'

export type TableColumnFixed = 'left' | 'right'
export interface TableColumnConfig<T = any> {
  // -- 列
  childrenList?: TableColumnConfig<T>[] // 用来实现表格头嵌套
  label: string // 单元格标题（非特殊类型必填）
  prop: string // 对应列内容的字段名
  width?: number | string // 列宽
  minWidth?: number | string // 最小列宽
  fixed?: TableColumnFixed// 固定列
  align?: 'left' | 'center' | 'right' // 表格列对齐方式（默认为 center）
  help?: string // 提示信息

  dict?: DictSource
  widget?: ColumnWidgetType
  widgetClick?: (scope: any) => void

  // -- 导出 excel
  exportExcelProp?: string // 导出 excel 属性，默认取 prop
  hideExportExcel?: boolean // 在导出 excel 中隐藏

  // -- 空处理
  empty?: string // 空（空字符、null、undefined）时的内容

  // -- 排序
  sortable?: boolean | 'custom' // 能否排序

  // -- 列
  hideColumn?: boolean // 隐藏列

  // -- 权限标识（判断列是否展示）
  authCode?: string
}

/** 表格行的操作按钮 */
export interface TableRowActionBtn {
  type?: ButtonType
  name?: string
  icon?: string
  priv?: string
  confirmTitle?: string // 确认
  handle: (scope: { row: any }) => void

  show?: (scope: { row: any }) => boolean
  disabled?: (scope: { row: any }) => boolean
}

/** 表格头的操作按钮 */
export interface HeaderActionBtn {
  type?: ButtonType
  name?: string
  icon?: string
  priv?: string
  // show?: (scope: any) => boolean
  // disabled?: (scope: any) => boolean
  confirmTitle?: string // 确认
  handle: () => void

  show?: () => boolean
  disabled?: () => boolean
}

export type TableHeaderActionBtn = Omit<HeaderActionBtn, 'handle' | 'show' | 'disabled'> & {
  handle: (scope: {
    rowKeys: any[]
    selectedRows: any[]
    selectedKeys: any[]
    isSelected: boolean
    radioRowKey: any
    radioRow: any
  }) => void
  show?: (scope: {
    rowKeys: any[]
    selectedRows: any[]
    selectedKeys: any[]
    isSelected: boolean
    radioRowKey: any
    radioRow: any
  }) => boolean
  disabled?: (scope: {
    rowKeys: any[]
    selectedRows: any[]
    selectedKeys: any[]
    isSelected: boolean
    radioRowKey: any
    radioRow: any
  }) => boolean
}
/** 分页配置接口 */
export interface PaginationConfig {
  /** 当前页码 */
  current: number
  /** 每页显示条目个数 */
  size: number
  /** 总条目数 */
  total: number
}

/** 分页器配置选项接口 */
export interface PaginationOptions {
  /** 每页显示个数选择器的选项列表 */
  pageSizes?: number[]
  /** 分页器的对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 分页器的布局 */
  layout?: string
  /** 是否显示分页器背景 */
  background?: boolean
  /** 只有一页时是否隐藏分页器 */
  hideOnSinglePage?: boolean
  /** 分页器的页码数量 */
  pagerCount?: number
}

// 列组件类型
export type ColumnWidgetType = 'text' | 'badge' | 'tag' | 'link' | 'image'

export interface WidgetConfig {
  dict?: DictSource // 字典数据源
  modelValue: any // 获取数据

  widget?: ColumnWidgetType
  widgetClick?: (scope: any) => void
  empty?: string
  scope?: any
}

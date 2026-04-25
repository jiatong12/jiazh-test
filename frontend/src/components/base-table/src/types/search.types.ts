import type { Cols, Num } from '@/components/base-layout'
import type { DictSource } from '@/dicts/useDict'
// ----------------- 搜索表单相关 -----------------
export type BaseTableSearchType
  = | 'input'
    | 'number'
    | 'numberRange'
    | 'switch'
    | 'select'
    | 'multipleSelect'
    | 'treeSelect'
    | 'multipleTreeSelect'
    | 'date'
    | 'dateRange'
    | 'time'
    | 'timeRange'
    | 'dateTime'
    | 'dateTimeRange'
    | 'selectTag'
    | 'multipleSelectTag'

// export type BaseSearchTriggerMode = 'button' | 'changeEvent'

export interface BaseSearchItemConfig {
  startNewRow?: boolean // 是否换行，默认 false
  col?: Num // 列的数量
  cols?: Cols // 列的数量，优先级高于 span
  /* 表单项配置 */
  label: string // 标题
  prop: string // 字段属性名
  // rules?: any[] | any // 规则
  help?: string // 提示信息
  widget?: BaseTableSearchType // 渲染搜索
  dict?: DictSource // 字典类型（渲染值的字典），如果搜索是字典类型，会默认从此字段取值
}

export interface WidgetConfig {
  dict?: DictSource // 字典数据源
  modelValue: any // 获取数据
  setModelValue: (val: any) => void // 设置数据

  widget?: BaseTableSearchType
  widgetProps?: Record<string, any>
  handleSearch: () => void
}

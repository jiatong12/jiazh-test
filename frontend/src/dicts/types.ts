// 字典项
export interface DictItem {
  readonly label: string // 名字
  readonly value: string | number // 值
  readonly disabled?: boolean // 禁用
  readonly order?: number // 顺序
  readonly color?: '' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | string // 样式类型
  readonly children?: DictItem[] // 为树形选择时，可以通过 children 属性指定子选项
  // readonly [key: string]: any
  // row?: any // 原数据
}

// 本地字典配置
export interface DictConfig {
  readonly [key: string]: DictConfigItem
}

// 本地字典配置项
export interface DictConfigItem {
  readonly isNumber?: boolean // 是否是数值类型
  readonly data: DictItem[] | null
  readonly [key: string]: any
}

export interface DictOpts {
  // ignoreDisabled?: boolean
  labelField?: string
  valueField?: string
  childrenField?: string
  disabledField?: string
  orderField?: string
  colorField?: string
  isNumber?: boolean
}

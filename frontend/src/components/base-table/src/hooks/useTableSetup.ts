import type {
  PaginationOptions,
  TableColumnConfig,
  TableHeaderActionBtn,
  TableRowActionBtn,
} from '../types/table.types'
import { ref } from 'vue'

// 定义配置接口
export interface TableSetupConfig {
  /** 行键值 */
  rowKey: string | ((row: any) => string)
  /** 列配置 */
  columns?: TableColumnConfig[]
  /** 行操作按钮 */
  rowActions?: TableRowActionBtn[]
  /** 头部操作按钮 */
  headerActions?: TableHeaderActionBtn[]
  /** 数据源，可以是数组或返回Promise的函数 */
  datasource: (param: any) => Promise<any>
  /** 是否立即加载数据 */
  immediate?: boolean

  /** 显示导出 excel，需要 datasource返回完整的响应来获取当前请求的参数，而不是 .data 这种 */
  showExportExcel?: boolean
  /** 导出 excel获取此接口的路径，如 data、data.list，这个只和后端导出有关，和前端获取数据无关 */
  exportExcelDataPath?: string
  /** 导出 excel 文件名 */
  exportExcelFileName?: string

  /** 模式 */
  mode?: 'table' | 'list'
  /** 是否启用 card 样式 */
  showCard?: boolean
  /** 分页配置 */
  paginationOptions?: PaginationOptions
  /** 空数据表格高度 */
  height?: string
  emptyHeight?: string
  /** 空数据占位 */
  empty?: string
  /** 是否显示下标列 */
  showIndex?: boolean
  /** 是否显示多选 */
  showSelection?: boolean
  /** 是否显示单选 */
  showRadio?: boolean
  /** 是否显示分页 */
  showPagination?: boolean

  /** 行多选框可选函数 */
  rowSelectable?: (scope: any) => boolean
  /** 是否显示 header */
  showHeader?: boolean
  /** 是否显示搜索操作 */
  showSearchAction?: boolean
  /** 动作列宽度 */
  actionsWidth?: string
  /** 外部参数，重置搜索表单不影响的参数 */
  externalParams?: () => Record<string, any>
  /** 默认搜索表单数据 */
  defaultSearchFormState?: () => Record<string, any>
  /** 默认每页大小 */
  pageSize?: number
}

/**
 * 简化 BaseTable 使用，不用引入各种类型定义
 * 如果有响应式变量还是直接绑定到模板上
 *
 * @param config 表格配置，这里建议都用常量
 * @returns 优化后的配置
 */
export function useTableSetup(config: TableSetupConfig) {
  // 将 columns 转换为响应式
  const columns = ref<TableColumnConfig[]>([...(config.columns ?? [])])

  // 返回配置对象，其中 columns 是响应式的
  return {
    ...config,
    // 这里为了解决 ref 类型能直接 v-bind 直接绑定，或外部用 reactive 来包裹导致浪费性能监听常量
    get 'columns'() {
      return columns.value
    },
    // 定义更新列的处理函数
    'onUpdate:columns': (val) => {
      columns.value = val
    },
  }
}

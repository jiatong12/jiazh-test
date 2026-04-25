import type { PropType } from 'vue'
import type { PaginationOptions, TableHeaderActionBtn, TableRowActionBtn } from './types/table.types'
import tableProps from 'element-plus/es/components/table/src/table/defaults'
import { expandProps } from '@/components/utils'

const { data, rowKey, height, maxHeight, ...others } = tableProps
export const propsDef = expandProps(others, {
  height,
  maxHeight,
  /* 模式 */
  mode: {
    type: String as PropType<'table' | 'list'>,
    default: 'table',
  },
  /** 是否启用 card 样式 */
  showCard: {
    type: Boolean,
    default: false,
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  // data: {
  //   type: Array,
  //   default: () => [],
  // },
  // /** 列渲染配置 */
  // columns: {
  //   type: Array as PropType<ColumnOption[]>,
  //   default: false,
  // },

  /** 分页配置 */
  paginationOptions: {
    type: Object as PropType<PaginationOptions>,
    required: false,
  },
  /** 空数据表格高度 */
  emptyHeight: {
    type: String,
    default: '100%',
  },
  /** 空数据占位 */
  empty: {
    type: String,
  },

  border: {
    type: Boolean,
    default: false,
  },
  // // 显示过滤的点
  // showFilterDot: {
  //   type: Boolean,
  //   default: false,
  // },
  /** 是否显示下标列 */
  showIndex: {
    type: Boolean,
    default: false,
  },
  /** 是否显示多选 */
  showSelection: {
    type: Boolean,
    default: false,
  },

  /** 是否显示单选 */
  showRadio: {
    type: Boolean,
    default: false,
  },

  /** 是否显示分页 */
  showPagination: {
    type: Boolean,
    default: true,
  },

  rowKey: {
    type: [String, Function] as PropType<string | ((row: any) => string)>,
    required: true,
  },

  /* 行多选框可选函数 */
  rowSelectable: {
    type: Function as PropType<(scope: any) => boolean>,
    required: false,
  },
  /** 是否显示 header */
  showHeader: {
    type: Boolean,
    default: true,
  },
  // /** 是否显示简单搜索 */
  // showSimpleSearch: {
  //   type: Boolean,
  //   default: false,
  // },

  showSearchAction: {
    type: Boolean,
    default: true,
  },
  /** 分页状态 */
  // pagination: {
  //   type: Object as PropType<PaginationConfig>,
  // },
  /** 动作列宽度 */
  actionsWidth: {
    type: String,
    default: '100px',
  },
  rowActions: {
    type: Array as PropType<TableRowActionBtn[]>,
    required: false,
  },
  headerActions: {
    type: Array as PropType<TableHeaderActionBtn[]>,
    required: false,
  },

  /** 数据源，可以是数组或返回Promise的函数 */
  datasource: {
    type: [Array, Function] as PropType<any[] | ((param: any) => Promise<any>)>,
    required: true,
  },

  /** 是否立即加载数据 */
  immediate: {
    type: Boolean,
    default: true,
  },

  /** 显示导出 excel，需要 datasource返回完整的响应来获取当前请求的参数，而不是 .data 这种 */
  showExportExcel: {
    type: Boolean,
    default: true,
  },

  /** 导出 excel获取此接口的路径，如 data、data.list，这个只和后端导出有关，和前端获取数据无关  */
  exportExcelDataPath: {
    type: String,
    default: 'data',
  },

  /** 导出 excel 文件名 */
  exportExcelFileName: {
    type: String,
    default: '表格数据',
  },

  /** 外部参数，重置搜索表单不影响的参数，如左边列表右边表格的情况 */
  externalParams: {
    type: [Function] as PropType<() => Record<string, any>>,
    required: false,
  },
  /** 默认搜索表单数据，如想在搜索表单初始时或重置搜索时显示默认值 */
  defaultSearchFormState: {
    type: [Function] as PropType<() => Record<string, any>>,
    required: false,
  },

  /** 默认每页大小 */
  pageSize: {
    type: Number,
    default: 10,
  },

  onPaginationSizeChange: {
    type: Function as PropType<(val: number) => void>,
    required: false,
  },
  onPaginationCurrentChange: {
    type: Function as PropType<(val: number) => void>,
    required: false,
  },
  // onClickRefresh: {
  //   type: Function as PropType<() => void>,
  //   required: false,
  // },
  // onClickReset: {
  //   type: Function as PropType<() => void>,
  //   required: false,
  // },
  // onClickSearch: {
  //   type: Function as PropType<() => void>,
  //   required: false,
  // },
})

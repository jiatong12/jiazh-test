import type { AxiosResponse } from 'axios'
import { get, isFunction } from 'lodash-es'
import { computed, ref, toRef, unref } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import { useSelection } from './useSelection'

interface PaginationInfo {
  current: number
  size: number
  total: number
}

interface UseTableConfig<T = any> {
  /** 行数据的唯一标识 */
  readonly rowKey: string | ((row: T) => string)
  /** 数据源，可以是数组或返回Promise的函数 */
  datasource: MaybeRefOrGetter<T[] | ((param: any) => Promise<any>)>
  /** 外部参数，重置搜索表单不影响的参数，如左边列表右边表格的情况 */
  readonly externalParams?: () => Record<string, any>
  /** 默认搜索表单数据，如想在搜索表单初始时或重置搜索时显示默认值 */
  readonly defaultSearchFormState?: () => Record<string, any>
  /** 是否立即加载数据 */
  readonly immediate?: boolean
  /** 是否启用分页 */
  readonly hasPagination?: boolean
  /** 默认每页大小 */
  readonly pageSize?: number
  /** 显示导出 excel 按钮 */
  readonly showExportExcel?: boolean
}

/**
 * 表格数据管理Hook
 * @param config 配置项
 * @returns 包含以下属性的对象：
 * - immediateLoading: Ref<boolean> - 数据加载状态
 * - delayLoading: Ref<boolean> - 延迟加载状态
 * - tableData: Ref<T[]> - 表格数据
 * - enablePagination: boolean - 是否启用分页
 * - paginationState: Ref<{pageNo: number, pageSize: number, total: number}> - 分页信息
 * - searchFormState: Ref<Record<string, any>> - 搜索表单状态
 * - resetSearchFormState: () => void - 重置搜索表单
 * - hasSearchFormState: Ref<boolean> - 是否有搜索条件，外部参数和初始参数不算
 * - search: () => void - 加载数据方法
 * - searchFirstPage: () => void - 重置到第一页并重新加载
 * - handleSizeChange: (val: number) => void - 处理每页大小变化
 * - handleCurrentChange: (val: number) => void - 处理当前页变化
 */
export function useTable<T = any>(config: UseTableConfig<T>) {
  const {
    hasPagination = false,
    rowKey,
    externalParams = () => ({}),
    defaultSearchFormState = () => ({}),
    pageSize = 10,
    immediate = true,
    showExportExcel = true,
  } = config

  const datasource = computed(() => toValue(config.datasource))

  // 归一化数据获取方法
  const getData = computed(() => isFunction(datasource.value) ? datasource.value : () => Promise.resolve(datasource.value))

  // 分页状态
  const paginationState = ref<PaginationInfo>({
    current: 1,
    size: pageSize,
    total: 0,
  })

  // 搜索表单参数
  const searchFormState = ref<Record<string, any>>(defaultSearchFormState())

  // 排序状态
  const sortState = ref<{ field: string, order: 'asc' | 'desc' }[] | undefined>(void 0)
  // 接口返回的可排序字段
  const sortableFields = ref<Set<string>>(new Set())
  // // 表格分页配置
  // if (cacheStateKey) {
  //   // 使用一个变量来保存内层 watch 的停止函数
  //   let stopPaginationWatch: (() => void) | undefined
  //   watch(() => useUserStore().userInfo?.userName, (userName) => {
  //     // 清理之前的 watch
  //     if (stopPaginationWatch) {
  //       stopPaginationWatch()
  //       stopPaginationWatch = undefined
  //     }

  //     if (!userName) {
  //       return
  //     }

  //     const key = `table-page-${cacheStateKey}-${userName}`
  //     const expire = 60 * 60 * 24 * 1
  //     // 从缓存获取状态
  //     const state = getCache(key)
  //     if (state) {
  //       paginationState.value = state
  //     }
  //     else {
  //       setCache(key, paginationState.value, false, expire)
  //     }

  //     // 创建新的 watch 并保存停止函数
  //     stopPaginationWatch = watch(paginationState, (val) => {
  //       setCache(key, val, false, expire)
  //     }, { deep: true })
  //   }, { immediate: true })

  //   onUnmounted(() => {
  //     // 清理 内部的 watch
  //     if (stopPaginationWatch) {
  //       stopPaginationWatch()
  //       stopPaginationWatch = undefined
  //     }
  //   })
  // }

  // 导出 excel 接口的参数
  const lastRequestConfig = ref<{
    url: string
    method: string
    params: Record<string, any>
    body: Record<string, any>
    // fields: { field: string, name: string, enums: { label: string, value: string }[] }[]
    // mode: { type: 'all' | 'page' | 'count' }
  }>()

  // 是否是校准页面，用来避免无限循环
  let adjustingPage = false

  /**
   * 判断是否是 Axios 的响应对象
   * @param obj 待判断的对象
   * @returns 如果是 Axios 响应对象则返回 true，否则返回 false
   */
  function isAxiosResponse(obj: any): obj is AxiosResponse {
    return (
      obj
      && typeof obj === 'object'
      && 'data' in obj
      && 'status' in obj
      && 'statusText' in obj
      && 'headers' in obj
      && 'config' in obj
    )
  }
  const getDataApi = () => {
    const { current, size } = paginationState.value

    const sort = toRaw(sortState.value)
    const sortParams = sort
      ? {
          sort: sort.map((item) => {
            return `${item.field}:${item.order}`
          }).join(','),
        }
      : {}
    return getData.value({
      ...(hasPagination
        ? {
            pageIndex: current - 1,
            pageSize: size,
          }
        : {}),
      ...sortParams,
      ...searchFormState.value,
      ...externalParams(),
    }).then((r) => {
      if (isAxiosResponse(r)) {
        // 只有在 showExportExcel 为 true 且 config 中存在有效 url 和 method 时才设置 lastRequestConfig
        if (showExportExcel && r.config?.url && r.config?.method) {
          const { url, method, params, data } = r.config
          lastRequestConfig.value = { url, method, params, body: data }
        }
        else {
          lastRequestConfig.value = void 0
        }

        // 提取实际数据
        r = r.data
      }
      else {
        // 非 Axios 响应对象时，清空 lastRequestConfig
        lastRequestConfig.value = void 0
      }

      if (hasPagination) {
        // 解构后台返回的分页数据 (如果有分页更新分页信息)
        const { data, total, sortableFields: fields } = r
        sortableFields.value = new Set(fields ?? [])
        // paginationState.value.current = paginationState.value.current
        // paginationState.value.size = paginationState.value.size
        paginationState.value.total = total

        if (total > 0) {
          const lastPageNo = Math.ceil(total / size)
          if (lastPageNo < current && !adjustingPage) {
            // 超出页码，搜索最后一页
            paginationState.value.current = lastPageNo
            // 标记为校准，避免出现无限循环
            adjustingPage = true
            return getDataApi()
          }
        }
        adjustingPage = false

        return data || []
      }
      else {
        // 判断是数组还是对象，数组直接返回，对象获取 data 和 sortableFields
        if (Array.isArray(r)) {
          sortableFields.value = new Set()
          return r
        }
        else if (typeof r === 'object' && r !== null) {
          const { data, sortableFields: fields } = r
          sortableFields.value = new Set(fields ?? [])
          return data || []
        }
        else {
          sortableFields.value = new Set()
          return []
        }
      }
    })
  }

  // API调用封装
  const request = useRequest(getDataApi, () => [])

  const tableData = computed(() => isFunction(datasource.value) ? request.result : datasource.value)

  /**
   * 搜索数据
   */
  function search() {
    request.send()
  }

  /**
   * 重置到第一页并重新搜索
   */
  function searchFirstPage() {
    paginationState.value.current = 1
    search()
  }

  /**
   * 处理每页条数改变
   * @param val 新的每页条数
   */
  const handleSizeChange = (val: number) => {
    paginationState.value.size = val
    searchFirstPage()
  }

  /**
   * 处理当前页改变
   * @param val 新的当前页
   */
  const handleCurrentChange = (val: number) => {
    paginationState.value.current = val
    search()
  }

  /**
   * 是否有搜索条件，外部参数和初始参数不算
   */
  const hasSearchFormState = computed(() => {
    const replacer = (_key, value) => {
      // 过滤掉为 null 和 空字符的参数
      if (value === undefined || value === null || value === '') {
        return undefined
      }
      else {
        return value
      }
    }

    const currentParamsStr = JSON.stringify(unref(searchFormState), replacer)
    const initParamsStr = JSON.stringify(unref(defaultSearchFormState()), replacer)

    // 是否有过滤条件
    return currentParamsStr !== initParamsStr
  })

  /**
   * 重置搜索表单
   */
  const resetSearchFormState = () => {
    // 重置搜索表单数据
    searchFormState.value = { ...defaultSearchFormState() }
    // 重新获取数据
    searchFirstPage()
  }

  // 获取 key
  const getRowKey = computed(() => isFunction(rowKey) ? rowKey : (row: any) => (get(row, rowKey)))
  /* 单选数据 */
  const radioRowKey = ref<any>()
  const radioRow = computed(() => tableData.value.find(e => getRowKey.value(e) === radioRowKey.value))
  // 当前表的 key
  const rowKeys = computed<any[]>(() => tableData.value.map(e => getRowKey.value(e)))
  watchEffect(() => {
    // 列表中不存在单选数据，清空单选数据
    if (!rowKeys.value.includes(radioRowKey.value)) {
      radioRowKey.value = void 0
    }
  })

  function currentChange(val) {
    radioRowKey.value = getRowKey.value(val)
  }

  // 表格多选 Hooks
  const { selectionChange, selectedRows, selectedKeys, isSelected, isKeySelected } = useSelection(getRowKey)

  // 是否立即加载数据
  if (immediate) {
    search()
  }

  return {
    /** 数据加载状态 */
    immediateLoading: toRef(request, 'immediateLoading'),
    /** 延迟加载状态 */
    delayLoading: toRef(request, 'delayLoading'),
    /** 表格数据 */
    tableData,
    /** 是否启用分页 */
    hasPagination,
    /** 分页信息 */
    paginationState,
    /** 搜索表单状态 */
    searchFormState,
    /* 排序 */
    sortState,
    /* 排序字段 */
    sortableFields,
    /** 重置搜索表单 */
    resetSearchFormState,
    /** 是否有搜索条件，外部参数和初始参数不算 */
    hasSearchFormState,

    /** 搜索 */
    search,
    /** 重置到第一页并重新搜索 */
    searchFirstPage,

    /** 处理每页大小变化 */
    handleSizeChange,
    /** 处理当前页变化 */
    handleCurrentChange,
    getRowKey,
    radioRowKey,
    radioRow,
    selectedRows,
    selectedKeys,
    isKeySelected,
    rowKeys,
    isSelected,
    selectionChange,
    currentChange,

    lastRequestConfig,
  }
}

// export function useBaseTable<T = any>(config: UseTableConfig<T>) {
//   // const BaseTable = defineAsyncComponent(() => import('../BaseTable.vue'))
//   const expose = useTable(config)
//   const { hasSearchFormState, tableData, immediateLoading, paginationState, rowActions, headerActions, radioData, getRowKey, showRadio, showSelection, rowSelectable, handleSizeChange, handleCurrentChange, loadData, resetSearchFormState, searchFirstPage } = expose

//   // 分页配置
//   const pagination = computed(() => ({
//     current: paginationState.value.pageNo,
//     size: paginationState.value.pageSize,
//     total: paginationState.value.total,
//   }))

//   const Render = defineComponent(
//     (props, { attrs, slots }) => {
//       const showSearch = ref(false)
//       // 渲染函数
//       return () => {
//         return (
//           <BaseTable
//             v-model:show-search={showSearch.value}
//             show-index={true}
//             show-search-action={true}
//             show-filter-dot={hasSearchFormState.value}
//             data={tableData.value}
//             loading={immediateLoading.value}
//             pagination={pagination.value}
//             row-actions={rowActions}
//             header-actions={headerActions}
//             actions-width="160px"
//             onPagination-size-change={handleSizeChange}
//             onPagination-current-change={handleCurrentChange}
//             onClick-refresh={loadData}
//             onClick-reset={resetSearchFormState}
//             onClick-search={searchFirstPage}
//             {...attrs}
//             {...props}
//           >
//             {{
//               ...slots,
//               default: () => {
//                 return (
//                   <>
//                     {/* 多选列 */}
//                     {showSelection && (
//                       <ElTableColumn type="selection" selectable={rowSelectable} />
//                     )}

//                     {/* 单选列 */}
//                     {showRadio && (
//                       <ElTableColumn width="60" align="center">
//                         {{
//                           default: scope => (
//                             <ElRadio
//                               modelValue={radioData.value}
//                               value={getRowKey.value(scope.row)}
//                               onUpdate:modelValue={val => (radioData.value = val)}
//                             >
//                               <span></span>
//                             </ElRadio>
//                           ),
//                         }}
//                       </ElTableColumn>
//                     )}

//                     {slots.default?.()}
//                   </>
//                 )
//               },
//             }}
//           </BaseTable>
//         )
//       }
//     },
//     {
//       inheritAttrs: false,
//       name: 'UseBaseTable',
//     },
//   ) as unknown as typeof BaseTable

//   return [Render, expose]
// }

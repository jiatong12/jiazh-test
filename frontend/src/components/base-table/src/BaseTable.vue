<!-- 表格组件 -->
<!-- 支持：el-table 全部属性、事件、插槽，同官方文档写法 -->
<!-- 扩展功能：分页组件、渲染自定义列、loading、表格全局边框、斑马纹、表格尺寸、表头背景配置 -->
<!-- 获取 ref：默认暴露了 elTableRef 外部通过 ref.value.elTableRef 可以调用 el-table 方法 -->
<script setup lang="ts">
import type { HeaderActionBtn, PaginationOptions, TableColumnConfig } from './types/table.types'
import { useElementSize } from '@vueuse/core'
import { ElPagination, ElRadio, ElTable, ElTableColumn } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { computed, nextTick } from 'vue'
import { propsDef } from './baseTableDef'
import BaseTableColumn from './components/BaseTableColumn.vue'
import BaseTableHeader from './components/BaseTableHeader.vue'
import { useTable } from './hooks/useTable'
import { setupStore } from './tableContext'

defineOptions({
  inheritAttrs: false,
})

const columns = defineModel('columns', { type: Array as PropType<TableColumnConfig[]> })

// 用 tableProps，是为保持原有类型提示和默认值
const props = defineProps(propsDef)

const expandSearch = ref(false)

setupStore(toRef(props, 'empty'))

const {
  tableData,
  paginationState,
  searchFormState,
  sortState,
  sortableFields,
  hasSearchFormState,
  search,
  searchFirstPage,
  resetSearchFormState,
  handleSizeChange,
  handleCurrentChange,
  // immediateLoading,
  delayLoading,
  rowKeys,
  selectedRows,
  selectedKeys,
  isKeySelected,
  radioRowKey,
  radioRow,
  isSelected,
  getRowKey,
  selectionChange,
  currentChange,
  lastRequestConfig,
} = useTable<any>({
  // 数据源函数
  datasource: toRef(props, 'datasource'),
  // 启用分页
  hasPagination: props.showPagination,
  // 设置每页大小
  pageSize: props.pageSize,
  // 行唯一标识
  rowKey: props.rowKey,
  immediate: props.immediate,
  showExportExcel: props.showExportExcel,
  // 默认搜索表单状态
  defaultSearchFormState: props.defaultSearchFormState,
  externalParams: props.externalParams,
})

const rowKeysCopy = computed(() => cloneDeep(unref(rowKeys)))
const selectedRowsCopy = computed(() => cloneDeep(unref(selectedRows)))
const selectedKeysCopy = computed(() => cloneDeep(unref(selectedKeys)))
const radioRowCopy = computed(() => cloneDeep(unref(radioRow)))
// 作用域数据
const scopeData = computed(() => {
  return {
    // 当前页的 key
    rowKeys: unref(rowKeysCopy),
    // 多选
    selectedRows: unref(selectedRowsCopy),
    selectedKeys: unref(selectedKeysCopy),
    isSelected: unref(isSelected),
    // 单选
    radioRowKey: unref(radioRowKey),
    radioRow: unref(radioRowCopy),
  }
})

// 传入作用域数据
const headerActionList = computed(() => {
  return props.headerActions?.map((e) => {
    return {
      ...e,
      handle() {
        return e.handle?.(scopeData.value) ?? true
      },
      show() {
        return e.show?.(scopeData.value) ?? true
      },
      disabled() {
        return e.disabled?.(scopeData.value) ?? false
      },
    }
  }) as HeaderActionBtn[]
})

// 获取组件根元素的引用
const rootRef = useTemplateRef('rootRef')
const { width: containerWidth } = useElementSize(rootRef)
const elTableRef = useTemplateRef('elTableRef')
// const paginationRef = useTemplateRef('paginationRef')
// const tableStore = useTableStore()
// const { isBorder, isZebra, tableSize, isFullScreen, isHeaderBackground } = storeToRefs(tableStore)

const LAYOUT = {
  MOBILE: 'prev, pager, next, jumper, total',
  IPAD: 'prev, pager, next, sizes, jumper, total',
  DESKTOP: 'total, prev, pager, next, sizes, jumper',
}

const layout = computed(() => {
  const width = containerWidth.value
  if (width < 768) {
    return LAYOUT.MOBILE
  }
  else if (width < 1024) {
    return LAYOUT.IPAD
  }
  else {
    return LAYOUT.DESKTOP
  }
})

// 默认分页常量
const defaultPaginationOptions = computed<PaginationOptions>(() => {
  return {
    pageSizes: [10, 20, 30, 50, 100],
    align: 'center',
    background: true,
    layout: layout.value,
    hideOnSinglePage: false,
    pagerCount: containerWidth.value > 1200 ? 7 : 5,
  }
})

// 合并分页配置
const mergedPaginationOptions = computed(() => {
  const result = {
    ...defaultPaginationOptions.value,
    ...props.paginationOptions,
  }
  const size = props.pageSize
  const pageSizes = [...(result.pageSizes ?? [])]
  if (!pageSizes?.includes(size)) {
    pageSizes?.push(size)
  }
  result.pageSizes = pageSizes?.sort((a, b) => a - b)

  return result
})

// // 边框 (优先级：props > store)
// const border = computed(() => props.border)
// // 斑马纹
// const stripe = computed(() => props.stripe)
// 数据是否为空
const isEmpty = computed(() => tableData.value?.length === 0)

// 是否显示分页器
const showPagination = computed(() => props.showPagination && !isEmpty.value)

// 分页大小变化
function onSizeChange(val: number) {
  handleSizeChange(val)
  props.onPaginationSizeChange?.(val)
}

// 分页当前页变化
function onCurrentChange(val: number) {
  handleCurrentChange(val)
  props.onPaginationCurrentChange?.(val)
  scrollToTop() // 页码改变后滚动到表格顶部
}

// 滚动表格内容到顶部，并可以联动页面滚动到顶部
function scrollToTop() {
  nextTick(() => {
    elTableRef.value?.setScrollTop(0) // 滚动 ElTable 内部滚动条到顶部
    // useCommon().scrollToTop() // 调用公共 composable 滚动页面到顶部
  })
}

// 全局序号
function getGlobalIndex(index: number) {
  if (!paginationState.value) { return index + 1 }
  const { current, size } = paginationState.value
  return (current - 1) * size + index + 1
}

// 找到 el-table__header-wrapper .el-table__header thead tr th
// <th class="el-table_1_column_1 is-leaf el-table__cell" colspan="1" rowspan="1"><div class="cell">ID<!----><!----></div></th>

const slots = useSlots()
const showSearchAction = computed(() => {
  return props.showSearchAction && (!!slots.simpleSearch || !!slots.searchForm)
})

/* 排序 */
function onSortChange(param: any) {
  const field = param.prop
  if (param.order) {
    const order = param.order === 'ascending' ? 'asc' : 'desc'
    sortState.value = [{ field, order }]
  }
  else {
    sortState.value = void 0
  }

  searchFirstPage()
  // console.log(11111111, /* column */ field, order, param)
}

// 表格高度逻辑
const height = computed(() => {
  // 全屏模式下占满全屏
  // if (isFullScreen.value) { return '100%' }
  // 空数据且非加载状态时固定高度
  if (isEmpty.value && !props.loading) { return props.emptyHeight }
  // 使用传入的高度
  if (props.height) { return props.height }
  // 默认占满容器高度
  return '100%'
})

const styleObj = computed(() => {
  return {
    height: height.value,
    maxHeight: props.maxHeight,
  }
})

defineExpose({
  tableData,
  scrollToTop,
  elTableRef,
  searchFormState,
  search,
  searchFirstPage,
  selectedRows,
  selectedKeys,
  isKeySelected,
  isSelected,
  radioRowKey,
  radioRow,
  rowKeys,
})

const attrs = useAttrs()
const filteredAttrs = computed(() => {
  // 过滤掉 class 和 style
  const { class: cls, style, ...rest } = attrs
  return rest
})

// 列表模式下控制 selectedRows 数据是当前列表中存在
if (props.mode === 'list') {
  watch(() => rowKeys.value, () => {
    selectedRows.value = selectedRows.value.filter(e => rowKeys.value.includes(getRowKey.value(e)))
  })
}

// 开启多选
const enabledSelected = ref(false)
watch(enabledSelected, (val) => {
  if (!val) {
    selectedRows.value = []
  }
})

// 是否选中
function isRowSelected(row) {
  if (!props.showSelection || !enabledSelected.value) {
    return false
  }
  const key = getRowKey.value(row)
  return isKeySelected(key)
}

// 切换选中状态
function toggleRowSelection(row) {
  if (!props.showSelection || !enabledSelected.value) {
    return false
  }
  const index = selectedRows.value.indexOf(row)
  const selected = index !== -1
  if (selected) {
    // 取消选中时，从选中列表中移除该行
    selectedRows.value.splice(index, 1)
  }
  else {
    // 选中时，将行添加到选中列表中（如果尚未存在）
    selectedRows.value.push(row)
  }
}

// 全选
const allSelected = computed({
  get() {
    return selectedKeys.value.length === tableData.value.length
  },
  set(val) {
    if (val) {
      selectedRows.value = [...tableData.value]
    }
    else {
      selectedRows.value = []
    }
  },
})

// Element Plus 的列拖拽逻辑依赖 border=true，这里内部始终开启，
// 再通过样式把 border=false 的视觉效果还原回来。
const tableBind = computed(() => ({ onSortChange, ...filteredAttrs.value, data: tableData.value, rowKey: getRowKey.value, border: true, onSelectionChange: selectionChange, onCurrentChange: currentChange }))

// 导出 excel 配置
const exportExcelConfig = computed(() => {
  if (!props.showExportExcel || !lastRequestConfig.value) {
    return
  }

  return {
    requestConfig: lastRequestConfig.value,
    dataPath: props.exportExcelDataPath,
    exportFileName: props.exportExcelFileName,
    pageSize: paginationState.value?.size,
    pageBeginIndex: paginationState.value?.current,
    total: paginationState.value?.total,
  }
})
</script>

<template>
  <div
    ref="rootRef"
    class="base-table"
    :class="[`base-table__${mode}-mode`, { 'is-empty': isEmpty, 'base-table--card': showCard, 'base-table--borderless-resizable': !border }]"
    :style="styleObj"
  >
    <!-- beforeTable 为通用前置区域：位于搜索区之后、表格之前，可放（搜索联动）统计/提示/摘要信息 -->
    <div v-if="$slots.beforeTable" class="base-table-before-table">
      <slot
        name="beforeTable"
        :search-form-state="searchFormState"
        :search="search"
        :search-first-page="searchFirstPage"
        :has-search-form-state="hasSearchFormState"
        :reset-search-form-state="resetSearchFormState"
        :loading="!!loading || delayLoading"
      />
    </div>

    <!-- 搜索表单插槽 -->
    <Transition
      name="search-form"
    >
      <div v-show="expandSearch" class="base-table-search-form">
        <slot name="searchForm" :search-form-state="searchFormState" :search="search" :search-first-page="searchFirstPage" />
      </div>
    </Transition>

    <!-- <div class="table-wrap" :style="tableWrapStyle" /> -->
    <div class="table-wrap">
      <!-- 头部插槽 -->
      <BaseTableHeader
        v-if="showHeader && (!!$slots.simpleSearch || !!$slots.searchForm || !!headerActionList?.length)"
        v-model:expand-search="expandSearch"
        v-model:columns="columns"
        :mode="mode"
        :show-expand="!!$slots.searchForm"
        :show-search-action="showSearchAction"
        :show-columns-setting="mode === 'table'"
        :actions="headerActionList"
        :show-filter-dot="hasSearchFormState"
        :search-loading="delayLoading"
        :fullscreen-element-ref="rootRef"
        :export-excel-config="exportExcelConfig"
        class="base-table-header"
        @search-first-page="searchFirstPage" @search="search" @reset="resetSearchFormState"
        @column-change="elTableRef?.doLayout()"
      >
        <template v-if="$slots.simpleSearch" #simpleSearch>
          <div
            class="base-table-simple-search"
            @submit.prevent
            @keyup.enter="searchFirstPage"
          >
            <slot name="simpleSearch" :search-first-page="searchFirstPage" :search-form-state="searchFormState" />
          </div>
        </template>

        <template v-if="mode === 'list'" #header_actions_after>
          <div v-if="showSelection" style="margin-left: 12px;">
            <ElCheckbox v-model="enabledSelected" style="margin-right: 12px;" label="开启多选" border />
            <ElCheckbox v-if="enabledSelected" v-model="allSelected" label="全选" border />
          </div>
        </template>
      </BaseTableHeader>

      <ElTable
        v-if="mode === 'table'"
        ref="elTableRef"
        v-loading="!!loading || delayLoading"
        highlight-current-row
        v-bind="tableBind"
      >
        <template #default>
          <!-- 多选列 -->
          <ElTableColumn v-if="showSelection" type="selection" :selectable="rowSelectable" />

          <!-- 单选列 -->
          <ElTableColumn v-if="showRadio" width="60" align="center">
            <template #default="scope">
              <ElRadio :model-value="radioRowKey" :value="getRowKey(scope.row)" />
            </template>
          </ElTableColumn>

          <!-- 渲染全局序号列 -->
          <ElTableColumn v-if="showIndex" label="#" width="80" align="center">
            <template #default="{ $index }">
              <span>{{ getGlobalIndex($index) }}</span>
            </template>
          </ElTableColumn>

          <!-- <ElTableColumn :align="col.align" :label="col.label" /> -->
          <BaseTableColumn v-for="col in columns" :key="col.prop" :sortable="sortableFields.has(col.prop) && 'custom'" v-bind="col">
            <!-- 继承插槽 -->
            <template v-for="(_, name) in $slots" #[name]="slotData">
              <slot :name v-bind="slotData || {}" />
            </template>
          </BaseTableColumn>

          <!-- 操作列 -->
          <ElTableColumn v-if="rowActions?.length" label="操作" fixed="right" :width="actionsWidth">
            <template #default="scope">
              <template v-for="item in rowActions" :key="item.name">
                <template v-if="item.show?.(scope) ?? true">
                  <ElPopconfirm v-if="item.confirmTitle" :title="item.confirmTitle" @confirm="item.handle(scope)">
                    <template #reference>
                      <BaseButton
                        :type="item.type ?? 'primary'"
                        :priv="item.priv"
                        :disabled="item.disabled?.(scope) ?? false"
                        :icon="item.icon && $$renderIcon(item.icon)"
                        link
                        @click.stop
                      >
                        {{ item.name }}
                      </BaseButton>
                    </template>
                  </ElPopconfirm>
                  <BaseButton
                    v-else
                    :type="item.type ?? 'primary'"
                    :priv="item.priv"
                    :disabled="item.disabled?.(scope) ?? false"
                    :icon="item.icon && $$renderIcon(item.icon)"
                    link
                    @click.stop="item.handle(scope)"
                  >
                    {{ item.name }}
                  </BaseButton>
                </template>
              </template>
            </template>
          </ElTableColumn>
        </template>

      <!-- <template #empty>
        <div v-if="loading" />
        <ElEmpty v-else :description="emptyText" :image-size="120" />
      </template> -->
      </ElTable>

      <!-- 列表 -->
      <ElScrollbar v-else-if="mode === 'list'" v-loading="loading || delayLoading" :style="styleObj" class="base-table-list-wrap" view-class="base-table-list">
        <!-- 空状态 -->
        <div v-if="isEmpty && !loading" class="base-table-list-empty">
          <slot name="empty">
            <ElEmpty description="暂无数据" />
          </slot>
        </div>
        <template v-else>
          <div v-for="row in tableData" :key="getRowKey(row)" class="base-table-list-item" :class="{ 'item-selected': isRowSelected(row) }" @click="toggleRowSelection(row)">
            <slot name="list_item" :row="row" :is-selected="isRowSelected(row)" />
          </div>
        </template>
      </ElScrollbar>
    </div>

    <!-- 分页 -->
    <div
      v-if="showPagination"
      class="pagination custom-pagination"
      :class="mergedPaginationOptions?.align"
    >
      <ElPagination
        v-bind="mergedPaginationOptions"
        :total="paginationState?.total"
        :disabled="loading"
        :page-size="paginationState?.size"
        :current-page="paginationState?.current"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use './base-table';
</style>

<script setup lang="tsx">
import type { VNode } from 'vue'
import type { TableColumnConfig } from '../types/table.types'
import { ElTableColumn, ElTooltip } from 'element-plus'
import { get } from 'lodash-es'
import { BaseIcon } from '@/components/base-icon'
import { useTableColumnWidget } from '../hooks/useTableColumnWidget'
import { useStore } from '../tableContext'

const props = withDefaults(defineProps<TableColumnConfig>(), {
})

const { getWidget } = useTableColumnWidget()

const { empty: parentEmpty } = useStore()

// const { getColComp } = useTableColumnComp()

const slots = useSlots()

// 渲染表格头数据
function renderColHeader(item: TableColumnConfig, scope: any): VNode {
  let result
  const slotName = getHeaderSlotName(item.prop)
  if (slots[slotName]) { result = <>{slots[slotName]!(scope)}</> }
  else { result = <>{item.label}</> }

  return (
    <>
      {result}
      {/* 提示信息 */}
      {item.help && (
        <ElTooltip effect="dark" content={item.help} placement="top">
          <BaseIcon style="margin-left:0.25em" name="i-ep:info-filled"> </BaseIcon>
        </ElTooltip>
      )}
    </>
  )
}

// 渲染表格数据
function renderCellData(item: TableColumnConfig, scope: any): VNode | void {
  const { prop, childrenList, dict, empty = parentEmpty.value, widget, widgetClick } = item

  // 嵌套表头
  if (childrenList?.length) { return <>{childrenList.map(child => RenderTableColumn(child))}</> }

  // 插槽渲染
  const slotName = getDefaultSlotName(item.prop)
  if (slots[slotName]) {
    return <>{slots[slotName](scope)}</>
  }

  const row = scope.row as any
  const modelValue = get(row, prop)

  if (modelValue === '' || modelValue === void 0 || modelValue === null) {
    // 空时显示的内容
    return <>{empty}</>
  }

  return getWidget({
    dict,
    modelValue,

    widget,
    widgetClick,
    empty,
    scope,
  })

  // 函数渲染
  // let type: ColType
  // let compProps: Record<string, any>
  // if (isString(colRender)) {
  //   type = colRender
  //   compProps = {}
  // }
  // else {
  //   type = colRender.type
  //   compProps = colRender?.props || {}
  // }

  /* json 渲染，组件映射，此对象放里面方便后面根据 item 数据修改 */
  // return getColComp({ row, type, prop, compProps, dict })()
}

// 列内容插槽名
function getDefaultSlotName(prop: string) {
  return `${prop}_default`
}

// 列头部插槽名
function getHeaderSlotName(prop: string) {
  return `${prop}_header`
}

function getSlotName(prop: string) {
  return `${prop}_column`
}

function RenderTableColumn(config: TableColumnConfig) {
  const { childrenList, hideColumn, prop, label, align, authCode, help, dict, ...others } = config
  const hasChildren = !!childrenList?.length
  return (
    <>
      {!hideColumn && (slots[getSlotName(prop)]?.(config) ?? (
        <ElTableColumn
          prop={prop}
          label={label}
          align={hasChildren ? 'center' : align}
          {...others}
        >
          {{
            default: scope => renderCellData(config, scope),
            header: scope => renderColHeader(config, scope),
          }}
        </ElTableColumn>
      ))}
    </>
  )
}
</script>

<template>
  <RenderTableColumn v-bind="props" />
</template>

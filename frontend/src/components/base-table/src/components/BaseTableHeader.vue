<script setup lang="ts">
import type { HeaderActionBtn, TableColumnConfig } from '../types/table.types'
import BaseTableColSetting from './BaseTableColSetting.vue'
import ExportExcelDialog from './ExportExcelDialog.vue'

const expandSearch = defineModel('expandSearch', { type: Boolean, default: false })
const columns = defineModel('columns', { type: Array as PropType<TableColumnConfig[]> })

withDefaults(defineProps<{
  searchLoading?: boolean
  actions?: HeaderActionBtn[]
  showSearchAction?: boolean
  showColumnsSetting?: boolean
  showExpand?: boolean
  showFilterDot?: boolean
  onSearch?: () => void
  onSearchFirstPage?: () => void
  onReset?: () => void
  onColumnChange?: () => void
  // 全屏元素
  fullscreenElementRef?: HTMLElement | null

  // 导出配置
  exportExcelConfig?: {
    requestConfig?: any // 最后一次请求配置
    dataPath?: string
    exportFileName?: string
    pageSize?: number
    pageBeginIndex?: number
    total?: number
  }
}>(), {
  showExpand: false,
  showSearchAction: true,
  showColumnsSetting: true,
})

const exportExcelDialogRef = useTemplateRef('exportExcelDialogRef')
const tableColSettingRef = useTemplateRef('tableColSettingRef')
const fullscreenRef = useTemplateRef('fullscreenRef')
</script>

<template>
  <div class="base-table-header">
    <div class="base-table-header__left">
      <template v-for="item in actions" :key="item.name">
        <BaseButton v-if="item.show?.() ?? true" :disabled="item.disabled?.() ?? false" :priv="item.priv" :type="item.type" :icon="item.icon && $$renderIcon(item.icon)" @click="item.handle()">
          {{ item.name }}
        </BaseButton>
      </template>
      <slot name="header_actions_after" />
    </div>
    <div class="base-table-header__right">
      <slot name="simpleSearch" />

      <!-- <ElTooltip v-if="onRefresh" effect="dark" content="刷新" placement="top">
        <ElButton :disabled="searchLoading" :icon="$$renderIcon('i-ep:refresh')" @click="onRefresh" />
      </ElTooltip> -->

      <ElButtonGroup v-if="showSearchAction && onSearchFirstPage">
        <ElButton :loading="searchLoading" type="primary" :icon="$$renderIcon('i-ep:search')" @click="onSearchFirstPage">
          搜索
        </ElButton>

        <ElTooltip v-if="onReset" effect="dark" content="重置" placement="top">
          <ElButton :disabled="searchLoading" :icon="$$renderIcon('i-ep:refresh-right')" @click="onReset" />
        </ElTooltip>

        <ElTooltip v-if="showExpand" effect="dark" content="搜索表单" placement="top">
          <ElButton
            :icon="$$renderIcon(expandSearch ? 'i-ep:caret-top' : 'i-ep:caret-bottom')"
            @click="expandSearch = !expandSearch"
          >
            <!-- 这里用 v-if 是因为直接切换 is-dot 属性时样式会出问题  -->
            <ElBadge v-if="showFilterDot" is-dot>
              <BaseIcon name="i-ep:filter" />
            </ElBadge>
            <BaseIcon v-else name="i-ep:filter" />
          </ElButton>
        </ElTooltip>
      </ElButtonGroup>

      <ElButtonGroup v-if="showSearchAction && onSearchFirstPage">
        <ElTooltip v-if="exportExcelConfig" effect="dark" content="导出 excel" placement="top">
          <ElButton
            round :icon="$$renderIcon('i-mdi:table-export')" @click="exportExcelDialogRef?.open({
              columns,
              ...exportExcelConfig,
            })"
          />
        </ElTooltip>
        <ElTooltip v-if="showColumnsSetting" effect="dark" content="列设置" placement="top">
          <ElButton round :icon="$$renderIcon('i-ep:operation')" @click="tableColSettingRef?.open()" />
        </ElTooltip>
        <ElTooltip v-if="fullscreenElementRef" effect="dark" content="全屏" placement="top">
          <ElButton round @click="fullscreenRef?.handleFullScreen()">
            <template #icon>
              <BaseFullscreen ref="fullscreenRef" :element-ref="fullscreenElementRef" />
            </template>
          </ElButton>
        </ElTooltip>
      </ElButtonGroup>
    </div>

    <BaseTableColSetting ref="tableColSettingRef" v-model="columns" @change="onColumnChange" />
    <ExportExcelDialog ref="exportExcelDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
.base-table-header {
  display: flex;
  justify-content: space-between;

  &__left {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 0;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>

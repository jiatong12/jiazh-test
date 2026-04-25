<script setup lang="ts">
import type { TableColumnConfig, TableColumnFixed } from '../types/table.types'
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const modelValue = defineModel('modelValue', { type: Array as PropType<TableColumnConfig[]> })
const emits = defineEmits(['change'])

const el = useTemplateRef('el')
watch(el, (val) => {
  if (val) {
    useDraggable(val, modelValue, {
      animation: 300,
      handle: '.draggableHandle',
      onEnd: () => {
        emits('change')
      },
    })
  }
})

// 表格列对齐方式（默认为 center）
function setFixed(item: TableColumnConfig, val: TableColumnFixed) {
  if (item.hideColumn) { return }
  item.fixed === val ? (item.fixed = void 0) : (item.fixed = val)
}
// 打开列设置
const show = ref(false)

defineExpose({
  open() {
    show.value = true
  },
})
</script>

<template>
  <!-- 列设置 -->
  <ElDrawer v-model="show" title="列设置" size="300px">
    <div ref="el" class="base-table-col-setting">
      <div v-for="element in modelValue" :key="element.prop">
        <div class="base-table-col-setting__item-flex">
          <div class="tools-l">
            <ElIcon class="draggableHandle">
              <BaseIcon name="i-ep:rank" />
            </ElIcon>
            <ElCheckbox :model-value="!element.hideColumn" @update:model-value="val => element.hideColumn = !val as any">
              {{ element.label }}
            </ElCheckbox>
          </div>

          <div class="tools-r">
            <ElTooltip class="box-item" effect="dark" content="固定到左侧" placement="left">
              <ElIcon
                :class="{ 'active': element.fixed === 'left', 'no-drop': element.hideColumn }"
                @click="setFixed(element, 'left')"
              >
                <BaseIcon name="i-ep:download" />
              </ElIcon>
            </ElTooltip>
            <i class="i-hr" />
            <ElTooltip class="box-item" effect="dark" content="固定到右侧" placement="left">
              <ElIcon
                :class="{ 'active': element.fixed === 'right', 'no-drop': element.hideColumn }"
                @click="setFixed(element, 'right')"
              >
                <BaseIcon name="i-ep:download" />
              </ElIcon>
            </ElTooltip>
          </div>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<style scoped lang="scss">
.base-table-col-setting__item-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .draggableHandle {
    margin-right: 5px;
    cursor: move;
  }

  .tools-l {
    display: flex;
    flex: 1;
    align-items: center;
  }

  .tools-r {
    display: flex;
    align-items: center;

    .el-icon {
      position: relative;
      cursor: pointer;

      &:last-child {
        transform: rotateZ(-90deg);
      }

      &:first-child {
        transform: rotateZ(90deg);
      }
    }

    .i-hr {
      display: flex;
      width: 1px;
      height: 10px;
      margin: 2px 5px;
      background-color: var(--el-border-color);
    }

    .active {
      color: var(--el-menu-active-color);
    }
  }

  .no-drop {
    color: var(--el-color-info-light-3) !important;
    cursor: no-drop !important;
  }
}
</style>

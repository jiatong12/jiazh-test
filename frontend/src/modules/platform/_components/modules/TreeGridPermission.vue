<script setup lang="ts">
import type { PropType } from 'vue'
import { ElCheckbox } from 'element-plus'
import { h, reactive, toRefs } from 'vue'

// other untransformed options
defineOptions({ components: {} })

// props
const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    default() {
      return []
    },
  },
  columns: {
    type: Array as PropType<any[]>,
    default() {
      return []
    },
  },
})

// 事件
const emit = defineEmits(['update:modelValue', 'loadChildren'])

// 拆分后的状态对象
const uiState = reactive({
  isAllChecked: false,
})

// 解构所有状态属性
const {
  isAllChecked,
} = toRefs(uiState)

// methods
function selectedAllHandler() {
  const responseData = [...props.modelValue]
  if (isAllChecked.value) {
    isAllChecked.value = false
  }
  else {
    isAllChecked.value = true
  }
  responseData.forEach((row) => {
    props.columns.forEach((column) => {
      if (!column.noCheckBox) {
        if (row[column.dataIndex].value !== isAllChecked.value && !row[column.dataIndex].disabled) {
          row[column.dataIndex].value = isAllChecked.value
        }
      }
    })
  })
  emit('update:modelValue', responseData)
}

function renderHeaderFunc({ column, $index }) {
  if ($index < 1 || props.columns[$index].noCheckBox) {
    return column.label
  }
  else {
    return h(
      ElCheckbox,
      {
        label: column.label,
        type: 'checkbox',
        onChange: val => onColumnClick(val, props.columns[$index]),
      },
    )
  }
}

function onColumnClick(isChecked, column) {
  const responseData = JSON.parse(JSON.stringify(props.modelValue))
  const key = column.dataIndex
  responseData.forEach((val) => {
    if (!val[key].disabled) {
      val[key].value = isChecked
      // 遍历所有选项，判断选项是否需要勾选
      let isRowNodeChecked = false
      if (isChecked) {
        isRowNodeChecked = true
      }
      else {
        props.columns.forEach((col, index) => {
          if (index > 0 && !col.noCheckBox) {
            if (val[col.dataIndex].value) {
              isRowNodeChecked = true
            }
          }
        })
      }
      if (
        val[props.columns[0].dataIndex].value !== isRowNodeChecked
        && !val[props.columns[0].dataIndex].disabled
      ) {
        val[props.columns[0].dataIndex].value = isRowNodeChecked
      }
    }
  })
  emit('update:modelValue', responseData)
}

function checkBoxChangeHandler(isChecked, row, dataIndex) {
  const responseData = JSON.parse(JSON.stringify(props.modelValue))
  let isRowNodeChecked = false
  if (isChecked) {
    isRowNodeChecked = true
  }
  else {
    props.columns.forEach((val, index) => {
      if (index > 0 && !val.noCheckBox) {
        if (row[val.dataIndex].value) {
          isRowNodeChecked = true
        }
      }
    })
  }
  const parentID = row.parentID
  const ID = row.ID
  const firstDataIndex = props.columns[0].dataIndex
  // 遍历所有节点,找到节点以及他的父节点
  responseData.forEach((val) => {
    if (val.ID === ID) {
      val[dataIndex].value = isChecked
      if (val.hasChildren || val._level > 0 || isChecked) {
        if (val[firstDataIndex].value !== isRowNodeChecked && !val[firstDataIndex].disabled) {
          val[firstDataIndex].value = isRowNodeChecked
        }
      }
    }
    else if (
      val.ID === parentID
      && val[firstDataIndex].value !== isRowNodeChecked
      && !val[firstDataIndex].disabled
    ) {
      val[firstDataIndex].value = isRowNodeChecked
    }
  })
  emit('update:modelValue', responseData)
}

function onRowCheckClick(isChecked, row) {
  const responseData = JSON.parse(JSON.stringify(props.modelValue))
  const ID = row.ID
  const parentID = row.parentID
  props.columns.forEach((column) => {
    // 父级节点全选择时，需要把子节点也全选择了
    if (ID !== 0 && !column.noCheckBox) {
      responseData.forEach((val) => {
        if ((val.parentID === ID || val.ID === ID) && !val[column.dataIndex].disabled) {
          val[column.dataIndex].value = isChecked
        }
        if (isChecked) {
          if (
            val.ID === parentID
            && val[props.columns[0].dataIndex].value !== isChecked
            && !val[column.dataIndex].disabled
          ) {
            val[props.columns[0].dataIndex].value = isChecked
          }
        }
      })
    }
  })
  emit('update:modelValue', responseData)
}

function loadChildren(row) {
  emit('loadChildren', row)
}

defineExpose({
  selectedAllHandler,
})
</script>

<template>
  <ElTable :data="modelValue" show-overflow-tooltip border>
    <ElTableColumn
      v-for="(column, index) in columns"
      :key="column.dataIndex"
      :label="column.text"
      width="auto"
      :render-header="renderHeaderFunc"
    >
      <template #default="scope">
        <template v-if="index === 0">
          <span
            v-for="levelIndex in scope.row._level"
            :key="levelIndex"
            class="ms-tree-space"
          />
          <ElCheckbox
            v-model="scope.row[column.dataIndex].value"
            :disabled="scope.row[column.dataIndex].disabled"
            @change="onRowCheckClick($event, scope.row)"
          />
          <span
            v-if="scope.row.hasChildren"
            style="margin-left: 5px"
            class="haschildren-link"
            @click="loadChildren(scope.row)"
          >{{ scope.row.name }}</span>
          <span v-else style="margin-left: 5px">{{ scope.row.name }}</span>
        </template>
        <span v-else-if="column.noCheckBox">{{ scope.row[column.dataIndex] }}</span>
        <ElCheckbox
          v-else-if="scope.row[column.dataIndex].disabled !== 'disabled'"
          v-model="scope.row[column.dataIndex].value"
          :disabled="scope.row[column.dataIndex].disabled"
          @change="checkBoxChangeHandler($event, scope.row, column.dataIndex)"
        />
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<style scoped>
.haschildren-link {
  /* color: #28b06e; */
  color: var(--el-color-primary);
}

.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}

.ms-tree-space::before {
  content: '';
}
</style>

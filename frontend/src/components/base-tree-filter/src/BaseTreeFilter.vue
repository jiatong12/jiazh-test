<script setup lang="ts">
import type { TreeInstance } from 'element-plus'
import { isFunction } from 'lodash-es'
import { computed, nextTick, onBeforeMount, ref, watch } from 'vue'

// 接收父组件参数并设置默认值
interface TreeFilterProps {
  datasource?: { [key: string]: any }[] | ((data?: any) => Promise<any>)
  loading?: boolean // loading ==> 非必传
  title?: string // treeFilter 标题 ==> 非必传
  valueField?: string // 选择的key ==> 非必传，默认为 "id"
  labelField?: string // 显示的label ==> 非必传，默认为 "label"
  childrenField?: string
  multiple?: boolean // 是否为多选 ==> 非必传，默认为 false
  defaultValue?: any // 默认选中的值 ==> 非必传
  showAll?: boolean // 显示全部 ==> 非必传
  width?: string
}

const props = withDefaults(defineProps<TreeFilterProps>(), {
  datasource: () => [],
  loading: false,
  valueField: 'value',
  labelField: 'label',
  childrenField: 'children',
  multiple: false,
  showAll: true,
  width: '300px',
})

// emit
const emit = defineEmits<{
  change: [id: any, item: any]
}>()

defineSlots<{
  top: () => any
  actions: (props: { node: any, data: any }) => any
  default: (props: { node: any, data: any }) => any
}>()

const defaultProps = computed(() => ({
  children: props.childrenField,
  label: props.labelField,
}))

const treeRef = ref<TreeInstance>()
const treeData = ref<{ [key: string]: any }[]>([])
const selected = ref<any>(null)
const apiLoading = ref(false)
const filterText = ref('')

// 计算属性优化
const requestApi = computed(() => {
  if (isFunction(props.datasource)) {
    return props.datasource
  }
  return () => Promise.resolve(props.datasource)
})

const treeAllData = computed(() => {
  return [
    ...(props.showAll
      ? [{ [props.valueField]: '', [props.labelField]: '全部' }]
      : []),
    ...treeData.value,
  ]
})

const isLoading = computed(() => props.loading || apiLoading.value)

// 方法优化
function setSelected() {
  selected.value = null
  nextTick(() => {
    if (props.multiple) {
      selected.value = Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [props.defaultValue]
    }
    else {
      selected.value = typeof props.defaultValue === 'string'
        ? props.defaultValue
        : ''
    }
  })
}

// 过滤方法优化
function filterNode(value: string, _data: { [key: string]: any }, node: any) {
  if (!value) { return true }

  let parentNode = node.parent
  const labels = [node.label]
  let level = 1

  while (level < node.level) {
    labels.push(parentNode.label)
    parentNode = parentNode.parent
    level++
  }

  return labels.some(label => label.includes(value))
}

// 事件处理优化
function handleNodeClick(data: { [key: string]: any }) {
  if (props.multiple) { return }
  const val = data[props.valueField]
  // 这里用 null用来避免 key 可能是数值场景
  emit('change', val === '' ? null : val, data)
}

function handleCheckChange() {
  emit('change', treeRef.value?.getCheckedKeys(), treeRef.value?.getCheckedNodes())
}

// 数据获取优化
async function search() {
  apiLoading.value = true
  try {
    const data = await requestApi.value()
    treeData.value = data
  }
  finally {
    apiLoading.value = false
  }
}

function initSearch() {
  filterText.value = ''
  search()
}

// 树节点展开/折叠优化
function toggleTreeNodes(isExpand: boolean) {
  const nodes = treeRef.value?.store.nodesMap
  if (!nodes) { return }

  Object.values(nodes).forEach((node) => {
    if (node) { node.expanded = isExpand }
  })
}

// 生命周期
onBeforeMount(initSearch)

// 监听器优化
watch(
  () => props.defaultValue,
  () => nextTick(setSelected),
  { immediate: true },
)

watch(
  () => treeData.value,
  () => nextTick(setSelected),
)

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

watch(
  () => props.datasource,
  search,
)

// 暴露给父组件使用
defineExpose({
  filterText,
  treeData,
  treeAllData,
  treeRef,
  search,
  initSearch,
})
</script>

<template>
  <BaseCard class="tree-filter">
    <template #title>
      <div v-if="title" class="text-ellipsis-1">
        {{ title }}
      </div>
    </template>

    <div class="tree-filter-content">
      <slot name="top" />
      <div class="search">
        <ElInput v-model="filterText" placeholder="输入关键字进行过滤" clearable>
          <template #append>
            <ElDropdown trigger="click">
              <BaseButton :icon="$$renderIcon('i-mdi:more-horiz')" :ripple="false" />
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="toggleTreeNodes(true)">
                    展开全部
                  </ElDropdownItem>
                  <ElDropdownItem @click="toggleTreeNodes(false)">
                    折叠全部
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </template>
        </ElInput>
      </div>
      <ElScrollbar v-loading="isLoading" class="tree-content">
        <ElTree
          ref="treeRef"
          default-expand-all
          :node-key="valueField"
          :data="multiple ? treeData : treeAllData"
          :show-checkbox="multiple"
          :check-strictly="false"
          :current-node-key="!multiple ? selected : ''"
          :highlight-current="!multiple"
          :expand-on-click-node="false"
          :check-on-click-node="multiple"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :default-checked-keys="multiple ? selected : []"
          @node-click="handleNodeClick"
          @check="handleCheckChange"
        >
          <template #default="scope">
            <slot v-bind="scope">
              {{ scope.node.label }}
            </slot>
            <div class="node-actions" @click.stop>
              <slot name="actions" v-bind="scope" />
            </div>
          </template>
        </ElTree>
      </ElScrollbar>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
.tree-filter {
  height: 100%;
  margin-right: 20px;
  width: v-bind(width);

  .search {
    display: flex;
    align-items: center;

    // margin: 0 0 15px;
    // .el-icon {
    //   cursor: pointer;
    //   transform: rotate(90deg) translateY(-8px);
    // }
  }

  .el-input {
    margin: 0 0 15px;
  }

  .tree-filter-content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .tree-content {
    flex: 1;
    min-height: 100px;

    :deep(.el-tree) {
      .el-tree-node__content {
        position: relative;
        height: auto;
        min-height: 33px;

        .node-actions {
          position: absolute;
          right: 4px;
          z-index: 100;
          display: none;
        }

        &:hover {
          .node-actions {
            display: initial;
          }
        }
      }
    }
  }
}
</style>

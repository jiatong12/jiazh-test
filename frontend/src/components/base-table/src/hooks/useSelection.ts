import { computed, ref } from 'vue'

/**
 * @description 表格多选数据操作
 * @param {Function} getRowKey 获取 key
 */
export function useSelection(getRowKey: MaybeRefOrGetter<(row: any) => any>) {
  // 是否选中数据
  const isSelected = ref<boolean>(false)
  // 选中的数据列表
  const selectedRows = ref<any[]>([])

  // 当前选中的所有 key (数组)，可根据项目自行配置id字段
  const selectedKeys = computed<any[]>(() => selectedRows.value.map(e => unref(getRowKey)(e)))

  // 使用 Set 优化选中 key 的查找性能
  const selectedKeySet = computed(() => new Set(selectedKeys.value))

  /**
   * @description 检查指定 key 是否已被选中
   * @param key 要检查的 key
   * @returns boolean 是否被选中
   */
  const isKeySelected = (key: any): boolean => {
    return selectedKeySet.value.has(key)
  }

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: any) => {
    isSelected.value = rowArr.length !== 0
    selectedRows.value = rowArr
  }

  return {
    isSelected,
    selectedRows,
    selectedKeys,
    selectionChange,
    isKeySelected,
  }
}

import type { DictOpts } from './types'
import { generateDictColorCandidates } from '@/utils/colorPalette'

/**
 * 深度处理字典项数据
 * - 数值类型转换
 * - 按order字段排序
 * @param {DictItem[]} list - 原始字典项列表
 * @returns {DictItem[]} 处理后的字典项列表
 */
export function deepHandleDictItems(list: Record<string, any>[] = [], opts?: DictOpts) {
  const { /* ignoreDisabled = false, */ labelField = 'label', valueField = 'value', childrenField = 'children', disabledField = 'disabled', orderField = 'order', colorField = 'color', isNumber = false } = opts ?? {}
  const dictColorCandidates = generateDictColorCandidates()

  function handleItems(items: Record<string, any>[] = []) {
    const result = items
      .map((e) => {
        e[childrenField] &&= handleItems(e[childrenField])
        return { value: isNumber ? +e[valueField] : e[valueField], label: e[labelField], children: e[childrenField], color: e[colorField], disabled: e[disabledField], raw: e }
      })
      .sort((a, b) => (a[orderField] || 0) - (b[orderField] || 0))

    if (dictColorCandidates.length) {
      result.forEach((item, index) => {
        if (!item.color) {
          item.color = dictColorCandidates[index % dictColorCandidates.length]
        }
      })
    }

    return result
  }

  // if (ignoreDisabled) {
  //   result = result.filter(e => e[disabledField])
  // }

  return handleItems(list)
}

import { get, set } from 'lodash-es'

/**
 * 数组字段拆分转换或聚合
 * 常用在将表单绑定的数据转成后台需要的数据和后台返回数据转成表单数据
 *  todo 这里要考虑到级联路径情况
 * @param obj 对象
 * @param mapFields 字段映射
 * @param combination 是否聚合成数组
 */
export function arrayFieldConvert(obj: MaybeRef<Record<string, any>>, mapFields: Record<string, string[]>, combination: boolean = false) {
  // 浅拷贝，避免修改原对象
  const result = { ...unref(obj) }

  if (combination) {
    // 聚合数组
    for (const rangeFieldName in mapFields) {
      const fields = mapFields[rangeFieldName]!
      // 赋值新字段
      const data = fields.map(field => get(result, field))
      /*
        如果集合内有非空的值就保留结构，如果全是空就返回 null，
        这里和 apps\web-ele\src\components\base-form\src\components\BaseFormItem.vue 文件中保持一致
      */
      const isEmpty = !data?.some(e => e !== null && e !== void 0)
      result[rangeFieldName] = isEmpty ? null : data
      // 删除旧字段
      for (const field of fields) {
        delete result[field]
      }
    }
  }
  else {
    // 拆分数组
    for (const rangeFieldName in mapFields) {
      const rangeFieldData = result[rangeFieldName]
      if (rangeFieldData) {
        const fields = mapFields[rangeFieldName]!
        // 赋值新字段
        for (let index = 0; index < fields.length; index++) {
          const field = fields[index]!
          set(result, field, rangeFieldData?.[index])
        }
      }
      // 删除旧字段
      delete result[rangeFieldName]
    }
  }

  return result
}

import type { DictConfig } from '@/dicts'
import { freezeDeep } from '@/utils'
// ----------------- 字典配置相关 -----------------
export default freezeDeep({
  /** @description：用户状态 */
  demo1: {
    /* value 如果数据定义在后端弄个空数组就可以了，后端没定义弄个 [{label:"xxx",value:'xxx', type: 'xxx'}] 结构的数据，其中 type 类似 tag 组件的 type，不能是具体的颜色，这样会影响在不同ui主题的效果 */
    data: [
      { label: '正常', value: 1, color: 'primary' },
      { label: '禁用', value: 0, color: 'info' },
      { label: 'test', value: -1, color: 'warning', disabled: true }, // 禁用，只能用来翻译，不能用在下拉列表
    ],
    // 常量，避免魔法值
    NORMAL: 1,
    /* 工具函数，避免在页面中使用 status === 1 这种魔法值 */
    isNormal(value: number) {
      return value === 1
    },
  },
  demo2: {
    // value 为空时会从后端获取数据，如果要由后端控制是否禁用，最好就这样从后端获取（其实就算禁用了也没啥太大意义，后端也很难校验，只是防君之不防小人）
    data: null,
    // 因为字典表只能是字符类型，但实际业务可能是数值类型，所以需要根据配置的 isNumber转换
    isNumber: true,
  },
} as const satisfies DictConfig)

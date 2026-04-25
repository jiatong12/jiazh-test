export interface NumberPlan {
  key: string
  label: string
  description: string
}

export const numberPlans: NumberPlan[] = [
  {
    key: 'memberCount',
    label: '成员人数',
    description: '整数输入优先使用 BaseNumber，默认精度为 0。',
  },
  {
    key: 'budget',
    label: '项目预算',
    description: '金额、比例等小数输入优先使用 BaseDecimal，默认保留两位小数。',
  },
  {
    key: 'efficiency',
    label: '效率系数',
    description: '需要更多小数位时，直接显式设置 precision。',
  },
]

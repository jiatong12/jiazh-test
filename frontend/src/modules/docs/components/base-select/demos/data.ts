export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
}

export const projectCategoryDict: SelectOption[] = [
  { label: '客户运营', value: 'crm', description: '统一客户与会员触达能力。' },
  { label: '内容发布', value: 'cms', description: '承接站点内容、审核与发布。' },
  { label: '系统配置', value: 'config', description: '维护平台级参数和系统开关。' },
  { label: '数据看板', value: 'bi', description: '聚合经营数据与指标分析。', disabled: true },
]

export const notifyChannelDict: SelectOption[] = [
  { label: '站内消息', value: 1 },
  { label: '邮件通知', value: 2 },
  { label: '短信提醒', value: 3 },
  { label: '企业微信', value: 4 },
]

const remoteMemberDict = [
  { label: '王越', value: 101, description: '平台产品负责人' },
  { label: '陈青', value: 102, description: '交付实施负责人' },
  { label: '沈楠', value: 103, description: '技术负责人' },
]

export function wait(ms = 700) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function getRemoteMemberDict() {
  await wait()
  return remoteMemberDict
}

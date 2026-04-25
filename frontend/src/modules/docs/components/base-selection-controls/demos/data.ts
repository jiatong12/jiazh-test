export const statusDict = [
  { label: '启用', value: 1, color: 'success' },
  { label: '停用', value: 0, color: 'info' },
  { label: '维护中', value: 2, color: 'warning' },
] satisfies Array<{
  label: string
  value: number
  color: 'success' | 'info' | 'warning'
}>

export const notifyChannelDict = [
  { label: '站内消息', value: 1 },
  { label: '邮件通知', value: 2 },
  { label: '短信提醒', value: 3 },
  { label: '企业微信', value: 4 },
] satisfies Array<{
  label: string
  value: number
}>

export const viewModeDict = [
  { label: '概览', value: 'overview' },
  { label: '列表', value: 'table' },
  { label: '看板', value: 'board' },
] satisfies Array<{
  label: string
  value: string
}>

const asyncPriorityDict = [
  { label: '高优先级', value: 'high' },
  { label: '中优先级', value: 'medium' },
  { label: '低优先级', value: 'low' },
]

export function wait(ms = 650) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function getAsyncPriorityDict() {
  await wait()
  return asyncPriorityDict
}

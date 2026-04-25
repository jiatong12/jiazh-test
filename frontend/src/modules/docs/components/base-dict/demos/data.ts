export const stageDict = [
  { label: '需求规划', value: 'plan', color: 'info' },
  { label: '开发中', value: 'building', color: 'primary' },
  { label: '交付验收', value: 'delivery', color: 'success' },
]

export const projectTagDict = [
  { label: '重点项目', value: 1, color: 'danger' },
  { label: '对外发布', value: 2, color: 'primary' },
  { label: '需要联调', value: 3, color: 'warning' },
]

export async function loadRemoteStatusDict() {
  await new Promise(resolve => setTimeout(resolve, 200))
  return [
    { label: '待分配', value: 1, color: '#F3A73F' },
    { label: '处理中', value: 2, color: '#3B82F6' },
    { label: '已完成', value: 3, color: '#16A34A' },
  ]
}

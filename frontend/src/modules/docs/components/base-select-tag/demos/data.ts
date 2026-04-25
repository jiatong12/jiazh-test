export const stageDict = [
  { label: '规划中', value: 'plan', color: 'primary' },
  { label: '开发中', value: 'develop', color: 'warning' },
  { label: '已上线', value: 'online', color: 'success' },
] satisfies Array<{
  label: string
  value: string
  color: 'primary' | 'warning' | 'success'
}>

export const projectTagDict = [
  { label: '重点项目', value: 1, color: 'danger', icon: 'i-mdi:star-four-points-circle-outline' },
  { label: '对外交付', value: 2, color: 'primary', icon: 'i-mdi:rocket-launch-outline' },
  { label: '联调中', value: 3, color: 'warning', icon: 'i-mdi:connection' },
  { label: '运维保障', value: 4, color: 'success', icon: 'i-mdi:shield-check-outline' },
] satisfies Array<{
  label: string
  value: number
  color: 'primary' | 'success' | 'warning' | 'danger'
  icon: string
}>

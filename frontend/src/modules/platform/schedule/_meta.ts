import { buildMeta } from '@/utils'

export default buildMeta({
  icon: 'i-mdi:clock-outline',
  title: '定时任务',
  isHide: false,
  isFull: false,
  isAffix: false,
  isKeepAlive: true,
  order: 0.5,
  priv: 'Platform.Schedule',
})

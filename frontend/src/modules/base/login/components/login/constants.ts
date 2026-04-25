import type { Mode } from '../../types'

const operates: { title: string, mode: Mode }[] = [
  {
    title: '手机登录',
    mode: 'phone',
  },
  {
    title: '二维码登录',
    mode: 'qrcode',
  },
  {
    title: '注册',
    mode: 'register',
  },
]

const thirdParty = [
  {
    title: '微信登录',
    icon: 'i-ri:wechat-fill',
  },
  {
    title: '支付宝登录',
    icon: 'i-ri:alipay-fill',
  },
  {
    title: 'QQ登录',
    icon: 'i-ri:qq-fill',
  },
  {
    title: '微博登录',
    icon: 'i-ri:weibo-fill',
  },
]

export { operates, thirdParty }

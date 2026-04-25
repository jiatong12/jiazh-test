export interface SmsTemplateOption {
  /** 短信模板编码。 */
  code?: string
  /** 短信模板名称。 */
  name?: string
}

export interface ExpirationNoticeItem {
  /** 发送日期偏移量。 */
  key: number
  /** 页面展示文案。 */
  value: string
}

export type NumericSecurityField
  = | 'passwordMinLength'
    | 'passwordMaxLength'
    | 'repeatCount'
    | 'maxLoginCount'
    | 'lockTime'
    | 'expiration'

export interface ChangePwdNoticeSmsConfig {
  /** 是否启用短信通知。 */
  open: string
  /** 选中的短信模板编码。 */
  template: string
  /** 是否在短信中包含过期时间。 */
  ExpDate: string
}

export interface ChangePwdNoticeTextConfig {
  /** 是否启用当前通知方式。 */
  open: string
  /** 当前通知方式的模板内容。 */
  template: string
}

export interface ChangePwdNoticeConfig {
  /** 短信通知配置。 */
  sms: ChangePwdNoticeSmsConfig
  /** 邮件通知配置。 */
  email: ChangePwdNoticeTextConfig
  /** 站内信通知配置。 */
  msg: ChangePwdNoticeTextConfig
}

export interface SecurityFormModel {
  /** 是否启用账户安全配置。 */
  isOpenThreeSecurity: boolean
  /** 密码最小长度。 */
  passwordMinLength: number
  /** 密码最大长度。 */
  passwordMaxLength: number
  /** 密码字符要求。 */
  passwordCharacterSpecification: string
  /** 密码中不能包含的用户信息。 */
  notIncludeUserInfo: string[]
  /** 是否开启密码重复性检查。 */
  isOpenRecentlyCheck: boolean
  /** 重复密码检查记录数。 */
  repeatCount: number
  /** 是否启用超限锁定。 */
  specifyOverTimeLock: boolean
  /** 密码错误最大重试次数。 */
  maxLoginCount: number
  /** 超过最大次数后的处理方式。 */
  overLoginCountType: string
  /** 禁止登录时长。 */
  lockTime: number
  /** 密码过期时间。 */
  expiration: number
  /** 密码过期后策略。 */
  forbiddenPolicy: string
  /** 密码过期通知配置。 */
  changePwdNotice: ChangePwdNoticeConfig
  /** 发送通知的日期列表。 */
  expirationDate: number[]
  /** 发送通知的时刻。 */
  sendNoticeTime: string
  /** 下次登录是否强制修改密码。 */
  nextLoginUpdatePwd: boolean
}

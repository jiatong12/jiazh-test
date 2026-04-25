import type { FormInstance } from 'element-plus'
import type { ChangePwdNoticeConfig, ExpirationNoticeItem, NumericSecurityField, SecurityFormModel, SmsTemplateOption } from './accountSecurity.types'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useRequest } from '@/hooks/useRequest'
import util from '@/utils/util'

const SECURITY_NUMBER_DEFAULTS = {
  passwordMinLength: 6,
  passwordMaxLength: 30,
  repeatCount: 0,
  maxLoginCount: 0,
  lockTime: 0,
  expiration: 0,
}

/** 创建默认的密码过期通知配置。 */
export function createDefaultChangePwdNotice(): ChangePwdNoticeConfig {
  return {
    sms: { open: 'N', template: '', ExpDate: 'N' },
    email: { open: 'N', template: '' },
    msg: { open: 'N', template: '' },
  }
}

/** 创建账户安全表单默认值。 */
export function createInitialSecurity(): SecurityFormModel {
  return {
    isOpenThreeSecurity: false,
    passwordMinLength: 6,
    passwordMaxLength: 30,
    passwordCharacterSpecification: 'A',
    notIncludeUserInfo: [],
    isOpenRecentlyCheck: false,
    repeatCount: 0,
    specifyOverTimeLock: false,
    maxLoginCount: 0,
    overLoginCountType: '',
    lockTime: 0,
    expiration: 0,
    forbiddenPolicy: 'N',
    changePwdNotice: createDefaultChangePwdNotice(),
    expirationDate: [],
    sendNoticeTime: '10:00',
    nextLoginUpdatePwd: false,
  }
}

/** 尝试把后端 JSON 字段解析成对象。 */
function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === '' || value === null || value === undefined) {
    return fallback
  }
  if (typeof value !== 'string') {
    return value as T
  }
  try {
    return JSON.parse(value) as T
  }
  catch {
    return fallback
  }
}

/** 补齐数字字段默认值，避免空串破坏输入组件的状态。 */
function normalizeNumberFields(target: Record<string, any>, defaults: Record<string, number>) {
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    const currentValue = target[key]
    target[key]
      = currentValue === '' || currentValue === null || currentValue === undefined || Number.isNaN(Number(currentValue))
        ? defaultValue
        : Number(currentValue)
  })
}

/** 把接口返回结果归一化成页面可编辑的表单结构。 */
function normalizeSecurity(data: unknown): SecurityFormModel {
  const initialSecurity = createInitialSecurity()
  const parsedData = typeof data === 'string' ? parseJsonField(data, initialSecurity) : data
  const security = {
    ...initialSecurity,
    ...(parsedData as Record<string, any> || {}),
  }

  security.changePwdNotice = {
    ...createDefaultChangePwdNotice(),
    ...parseJsonField(security.changePwdNotice, createDefaultChangePwdNotice()),
  }
  security.changePwdNotice.sms = {
    ...createDefaultChangePwdNotice().sms,
    ...(security.changePwdNotice.sms || {}),
  }
  security.changePwdNotice.email = {
    ...createDefaultChangePwdNotice().email,
    ...(security.changePwdNotice.email || {}),
  }
  security.changePwdNotice.msg = {
    ...createDefaultChangePwdNotice().msg,
    ...(security.changePwdNotice.msg || {}),
  }
  security.expirationDate = parseJsonField(security.expirationDate, [])
  security.notIncludeUserInfo = Array.isArray(security.notIncludeUserInfo)
    ? security.notIncludeUserInfo
    : parseJsonField(security.notIncludeUserInfo, [])
  security.forbiddenPolicy = security.forbiddenPolicy || 'N'
  normalizeNumberFields(security, SECURITY_NUMBER_DEFAULTS)

  return security as SecurityFormModel
}

/** 根据密码过期天数生成通知日期选项。 */
function buildExpirationNoticeItems(expiration: number): ExpirationNoticeItem[] {
  const result: ExpirationNoticeItem[] = []
  if (expiration <= 0) {
    return result
  }

  const maxDailyRange = expiration > 14 ? 14 : expiration
  for (let day = 0; day <= maxDailyRange; day += 1) {
    result.push({
      key: day,
      value: day === 0 ? '过期当天' : `${day}天`,
    })
  }

  if (expiration >= 15) {
    result.push({ key: 15, value: '半个月' })
  }
  if (expiration >= 30) {
    result.push({ key: 30, value: '一月' })
  }

  return result
}

/** 提取接口中真正的账户安全数据，兼容旧接口的 data 包装层。 */
function resolveSecurityResponseData(responseData: any) {
  return responseData?.data ?? responseData
}

/** 统一格式化请求失败信息，避免页面出现“点击无反应”。 */
function resolveRequestErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallbackMessage
}

/** 管理账户安全表单的加载、保存和数据归一化逻辑。 */
export function useAccountSecurityForm() {
  const submitLoading = ref(false)
  const smsTemplateName = ref('')

  const securityRequest = useRequest(async () => {
    const response = await axios.get('/ui/securitys', { useBizStatus: true })
    return normalizeSecurity(resolveSecurityResponseData(response.data))
  }, createInitialSecurity)

  const securityForm = computed(() => securityRequest.result as SecurityFormModel)
  const expirationNoticeItems = computed(() => buildExpirationNoticeItems(securityForm.value.expiration))
  const showNoticeTip = computed(() => securityForm.value.expiration > 0)

  /** 加载短信模板名称，避免页面只展示模板编码。 */
  async function loadSmsTemplateName() {
    const templateCode = securityForm.value.changePwdNotice.sms.template
    if (!templateCode) {
      smsTemplateName.value = ''
      return
    }

    try {
      const response = await axios.get(`/ui/sms/template/${encodeURIComponent(templateCode)}/name`, {
        responseType: 'text',
        useBizStatus: true,
      })
      smsTemplateName.value = typeof response.data === 'string' ? response.data : ''
    }
    catch {
      smsTemplateName.value = ''
    }
  }

  /** 处理数字输入的空值和非法值回退。 */
  function handleInputNumberChange(
    field: NumericSecurityField,
    value: string | number | null | undefined,
    fallbackValue: number,
  ) {
    const normalizedValue
      = value === '' || value === null || value === undefined || Number.isNaN(Number(value))
        ? fallbackValue
        : Number(value)
    securityForm.value[field] = normalizedValue
  }

  /** 处理普通字段更新，统一收口子组件对父表单的修改入口。 */
  function handleFieldChange(
    field: keyof SecurityFormModel,
    value: unknown,
  ) {
    const target = securityForm.value as unknown as Record<string, unknown>
    target[field] = value
  }

  /** 更新密码过期通知中的嵌套字段，避免子组件直接改 props。 */
  function handleChangePwdNoticeFieldChange(
    channel: keyof ChangePwdNoticeConfig,
    field: string,
    value: unknown,
  ) {
    const target = securityForm.value.changePwdNotice[channel] as unknown as Record<string, string>
    target[field] = value == null ? '' : String(value)
  }

  /** 根据当前表单状态构造提交给后端的最终数据。 */
  function buildSubmitPayload() {
    const payload = JSON.parse(JSON.stringify(securityForm.value))

    if (!payload.isOpenRecentlyCheck) {
      payload.repeatCount = 0
    }

    if (!payload.specifyOverTimeLock) {
      payload.maxLoginCount = 0
      payload.overLoginCountType = ''
      payload.lockTime = 0
    }

    if (payload.expiration === 0) {
      payload.changePwdNotice = ''
      payload.expirationDate = []
      payload.sendNoticeTime = ''
      return payload
    }

    const availableNoticeKeys = new Set(expirationNoticeItems.value.map(item => item.key))
    payload.expirationDate = (payload.expirationDate || []).filter((item: number) => availableNoticeKeys.has(item))
    payload.forbiddenPolicy = payload.forbiddenPolicy || 'N'
    payload.sendNoticeTime = payload.sendNoticeTime || '10:00'

    if (payload.changePwdNotice.sms.open !== 'Y') {
      payload.changePwdNotice.sms.template = ''
      payload.changePwdNotice.sms.ExpDate = 'N'
    }
    if (payload.changePwdNotice.email.open !== 'Y') {
      payload.changePwdNotice.email.template = ''
    }
    if (payload.changePwdNotice.msg.open !== 'Y') {
      payload.changePwdNotice.msg.template = ''
    }

    return payload
  }

  /** 保存账户安全配置，并在成功后重新拉取一次以保持状态一致。 */
  async function saveAccountSecurity(formInstance?: FormInstance) {
    const isFormValid = await formInstance?.validate().catch(() => false)
    if (isFormValid === false) {
      return
    }

    if (securityForm.value.passwordMinLength > securityForm.value.passwordMaxLength) {
      ElMessage.warning('密码最大长度不能小于最小长度')
      return
    }

    submitLoading.value = true
    try {
      const response = await axios.put(
        '/ui/securitys/all',
        { data: buildSubmitPayload() },
        { showDefaultError: false },
      )
      util.showResponseMessage(response.data)
      await securityRequest.send()
      await loadSmsTemplateName()
    }
    catch (error) {
      util.showMessage(resolveRequestErrorMessage(error, '账户安全配置保存失败'), 'error')
    }
    finally {
      submitLoading.value = false
    }
  }

  /** 处理短信模板选择结果，并同步刷新模板名称。 */
  async function handleSmsTemplateSelect(template: SmsTemplateOption) {
    securityForm.value.changePwdNotice.sms.template = template.code || ''
    await loadSmsTemplateName()
  }

  /** 初始化页面数据，并补一次短信模板名称。 */
  async function initPageData() {
    await securityRequest.send()
    await loadSmsTemplateName()
  }

  watch(
    () => securityForm.value.specifyOverTimeLock,
    (enabled) => {
      if (!enabled) {
        securityForm.value.maxLoginCount = 0
        securityForm.value.overLoginCountType = ''
        securityForm.value.lockTime = 0
      }
    },
  )

  watch(
    () => securityForm.value.changePwdNotice.sms.template,
    () => {
      loadSmsTemplateName()
    },
  )

  return {
    securityRequest,
    securityForm,
    expirationNoticeItems,
    showNoticeTip,
    submitLoading,
    smsTemplateName,
    handleFieldChange,
    handleChangePwdNoticeFieldChange,
    handleInputNumberChange,
    handleSmsTemplateSelect,
    saveAccountSecurity,
    initPageData,
  }
}

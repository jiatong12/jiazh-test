import { useThrottleFn } from '@vueuse/core'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { computed, nextTick, ref } from 'vue'
import { HOME_URL, INSTALL_URL, LICENSE_URL, LOGIN_URL } from '@/config'
import { isZCaptchaEnabled } from '@/config/zcaptcha'
import router from '@/router'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { getTimeState } from '@/utils'
import { clearLogin } from '@/utils/cache'
import { PasswordCrypto } from '@/utils/passwordCrypto'
import { useTabsStore } from '../tabs'
import { useUserStore } from '../user'

interface LicenseData {
  title: string
  licenseWarning: string
  linceseNearEndWarning: string
  secondConfirm: boolean
  seek: string
  needEnrypt: boolean
  secretType: string
  status: number
}

interface LoginTypeOption {
  code: string
  name?: string
}

/**
 * 登录相关状态与流程。
 * 包含账号密码登录、手机号登录、登录初始化、退出登录和未授权处理。
 */
export function createAuthLoginModule() {
  const isLogin = ref<boolean>(false)
  const showVerifyCode = ref<boolean>(false)
  const loginTypes = ref<LoginTypeOption[]>([])
  const smsNeedAuthCode = ref(false)
  const smsAuthCodeURL = ref('')
  const smsSending = ref(false)
  const smsSendLimit = ref(60)
  const smsSendCounter = ref(0)
  let smsSendCounterTimer: number | null = null

  const licenseData = ref<LicenseData | null>(null)
  const isLogout = ref(false)
  const desKey = ref('')
  let loginInitPromise: Promise<void> | null = null

  const showPhoneLoginEntry = computed(() => {
    return loginTypes.value.some(item => item.code === 'UserSMSLogin')
  })

  /** 生成短信图形验证码地址，确保每次打开弹窗都拿到最新图片。 */
  function getSmsAuthCodeURL() {
    const baseURL = String(axios.defaults.baseURL || '').replace(/\/$/, '')
    return `${baseURL}/ui/authcode?t=${Date.now()}`
  }

  /** 刷新短信发送前使用的图形验证码。 */
  function refreshSmsAuthCode() {
    smsAuthCodeURL.value = getSmsAuthCodeURL()
  }

  /** 清理短信发送倒计时，并同步复位剩余秒数。 */
  function clearSmsSendCounter() {
    if (smsSendCounterTimer) {
      window.clearInterval(smsSendCounterTimer)
      smsSendCounterTimer = null
    }
    smsSendCounter.value = 0
  }

  /** 启动短信发送冷却倒计时。 */
  function startSmsSendCounter(counter: number) {
    clearSmsSendCounter()
    smsSendCounter.value = counter
    // 倒计时统一挂在 store，避免切换登录页组件或弹窗状态时计时被意外重置。
    smsSendCounterTimer = window.setInterval(() => {
      if (smsSendCounter.value <= 0) {
        clearSmsSendCounter()
        return
      }
      smsSendCounter.value -= 1
    }, 1000)
  }

  /** 重置手机号登录页的运行态，避免不同登录会话之间串状态。 */
  function resetSmsLoginRuntimeState() {
    smsNeedAuthCode.value = false
    smsSending.value = false
    smsSendLimit.value = 60
    clearSmsSendCounter()
    refreshSmsAuthCode()
  }

  /**
   * 登录页的验证码、强制注销标记、加密参数都属于一次性运行态。
   * 退出登录或重新进入登录流程时必须重置，避免沿用上一次会话状态。
   */
  function resetLoginRuntimeState(options: { resetLicenseData?: boolean } = {}) {
    const { resetLicenseData = false } = options
    if (resetLicenseData) {
      licenseData.value = null
      desKey.value = ''
    }
    showVerifyCode.value = false
    isLogout.value = false
    resetSmsLoginRuntimeState()
  }

  /** 清除登录凭证。 */
  function clearLoginInfo() {
    clearLogin()
    resetLoginRuntimeState({ resetLicenseData: true })
    isLogin.value = false
  }

  /** 按当前登录初始化返回的加密策略处理密码。 */
  function makeAES(password: string) {
    const currentLicenseData = licenseData.value
    if (!currentLicenseData) {
      throw new Error('登录初始化未完成')
    }
    const { needEnrypt, secretType } = currentLicenseData
    if (!needEnrypt) {
      return password
    }
    return PasswordCrypto.encrypt(password, desKey.value, true, secretType)
  }

  /**
   * 后端返回的仍是传统 html 入口，这里统一映射为前端路由，
   * 避免登录页和路由守卫分散兼容这套老协议。
   */
  function handleLoginInitRedirect(redirectURL?: string) {
    switch (redirectURL) {
      case 'install.html':
        router.replace(INSTALL_URL)
        return true
      case 'licenseRequest.html':
        router.replace(LICENSE_URL)
        return true
      default:
        return false
    }
  }

  /** 初始化登录页需要的加密参数、许可证信息和可用登录方式。 */
  async function loginInit() {
    if (licenseData.value) {
      return
    }

    if (!loginInitPromise) {
      loginInitPromise = (async () => {
        // 登录方式入口由后端下发，脚手架只负责渲染支持的入口，不在前端写死开关。
        const loadLoginTypes = axios.get(`/ui/login/types?${Date.now()}`, {
          showDefaultError: false,
          useBizStatus: true,
        }).then(({ data }) => {
          const nextLoginTypes = Array.isArray(data.data) ? data.data : []
          if (data.status === 1 && nextLoginTypes.length > 0) {
            loginTypes.value = nextLoginTypes
            return
          }
          loginTypes.value = []
        }).catch(() => {
          loginTypes.value = []
        })

        const [{ data: initData }] = await Promise.all([
          axios.get('/ui/login/init'),
          loadLoginTypes,
        ])

        if (initData.status !== 1) {
          throw new Error(initData.message || '登录初始化失败，请刷新页面后重试')
        }

        if (handleLoginInitRedirect(initData.redirectURL)) {
          return
        }

        desKey.value = initData.seek
        const nextLicenseData = { ...initData, needEnrypt: true }
        licenseData.value = nextLicenseData
        if (nextLicenseData.linceseNearEndWarning !== '') {
          ElMessage.warning({
            message: nextLicenseData.linceseNearEndWarning,
            duration: 0,
            showClose: true,
          })
        }
      })().finally(() => {
        loginInitPromise = null
      })
    }

    await loginInitPromise
  }

  /** 执行账号密码登录，并兼容验证码、强制登录和首次改密分支。 */
  async function _loginByAccount(params: any) {
    const { userName, password, verifyCode } = params
    const data: any = {
      userName,
      password: makeAES(password),
      _r: makeAES(CryptoJS.MD5(userName).toString()),
    }
    if (showVerifyCode.value) {
      data.IsVerifyCode = true
      data.VerifyCode = verifyCode
    }

    if (isLogout.value) {
      data.logout = 'Y'
    }

    return axios.post('/ui/login', data, { showDefaultError: false, useBizStatus: true }).then((res) => {
      if (res.data.seek) {
        desKey.value = res.data.seek
        data.password = makeAES(password)
        data._r = makeAES(CryptoJS.MD5(userName).toString())
        data.encrypted = true
        return axios.post('/ui/login', data, { showDefaultError: false, useBizStatus: true })
      }

      return res
    }).then((response) => {
      const status = response.data.status
      if (status === 1) {
        return response
      }

      if (status === 20000) {
        return { editPwdModal: true, editPwdModalTitle: '重置密码信息' }
      }

      if (status === 30000) {
        return { editPwdModal: true, editPwdModalTitle: '初始密码信息' }
      }

      if (status === 10000) {
        return ElMessageBox.confirm(
          '该用户正在登录状态，可能是其他人正在使用或您上一次登录没有正常退出，是否强制注销并登录？',
          '强制注销确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          isLogout.value = true
          return _loginByAccount(params)
        })
      }

      if (!isZCaptchaEnabled()) {
        showVerifyCode.value = true
      }
      ElMessageBox({
        message: response.data.message,
        type: 'error',
      })
      return Promise.reject(response)
    })
  }

  /** 预热手机号登录配置，并同步短信通道要求的验证码与冷却时间。 */
  async function initPhoneLogin(mobile = '') {
    if (mobile) {
      smsSending.value = true
    }

    try {
      const { data } = await axios.get('/ui/user_sms/init', {
        params: mobile ? { mobile } : undefined,
        showDefaultError: false,
        useBizStatus: true,
      })

      if (data.status === 1) {
        smsNeedAuthCode.value = data.needAuthCode === 'Y'

        if (mobile && data.sendLimit) {
          const nextSendLimit = Number(data.sendLimit)
          if (Number.isFinite(nextSendLimit) && nextSendLimit > 0) {
            smsSendLimit.value = nextSendLimit
          }
        }

        if (mobile && data.leftTime) {
          const leftTime = Number(data.leftTime)
          if (Number.isFinite(leftTime) && leftTime > 0) {
            // 防回归：接口明确返回冷却剩余时间时，前端必须沿用该时间，不能重新从 sendLimit 开始计。
            startSmsSendCounter(leftTime)
            ElMessage.warning('验证码已发送，请勿频繁发送！')
            return false
          }
        }

        return true
      }

      if (mobile && data.message) {
        ElMessage.warning(data.message)
      }
    }
    catch (error) {
      if (mobile) {
        ElMessage.error(error instanceof Error ? error.message : '初始化手机号登录失败，请稍后重试！')
      }
    }
    finally {
      if (mobile) {
        smsSending.value = false
      }
    }

    return false
  }

  /** 发送短信验证码，请求成功后统一更新发送冷却时间。 */
  async function sendPhoneVerifyCode(params: { mobile: string, authCode?: string }) {
    smsSending.value = true
    // 只有图形验证码发送失败时才刷新图片，避免无意义地打断用户重复输入短信验证码。
    const shouldRefreshAuthCode = Boolean(params.authCode)

    try {
      const { data } = await axios.post('/ui/user_sms/send_sms', params, {
        showDefaultError: false,
        useBizStatus: true,
      })

      if (data.status === 1) {
        startSmsSendCounter(smsSendLimit.value || 60)
        ElMessage.success('短信验证码已发送，请注意查收！')
        return true
      }

      if (shouldRefreshAuthCode) {
        refreshSmsAuthCode()
      }
      ElMessage.warning(data.message || '短信验证失败')
      return false
    }
    catch {
      if (shouldRefreshAuthCode) {
        refreshSmsAuthCode()
      }
      ElMessage.error('发送验证码失败，请稍后重试！')
      return false
    }
    finally {
      smsSending.value = false
    }
  }

  /** 确认手机号对应的已登录会话，供强制登录场景复用。 */
  async function _confirmLoginByPhone(params: { mobile: string, md5: string }) {
    return axios.post('/ui/user_sms/confirm_login', params, {
      showDefaultError: false,
      useBizStatus: true,
    })
  }

  /** 执行手机号验证码登录，并兼容强制登录与首次改密分支。 */
  async function _loginByPhone(params: { mobile: string, code: string }) {
    return axios.post('/ui/user_sms/login', params, {
      showDefaultError: false,
      useBizStatus: true,
    }).then((response) => {
      const { data } = response

      if (data.status === 1) {
        return response
      }

      if (data.status === 20000) {
        return {
          editPwdModal: true,
          editPwdModalTitle: '重置密码信息',
          editPwdModalUserName: data.userName || params.mobile,
        }
      }

      if (data.status === 30000) {
        return {
          editPwdModal: true,
          editPwdModalTitle: '初始密码信息',
          editPwdModalUserName: data.userName || params.mobile,
        }
      }

      if (data.status === 10000) {
        return ElMessageBox.confirm(
          '该用户正在登录状态，可能是其他人正在使用或您上一次登录没有正常退出，是否强制注销并登录？',
          '强制注销确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          return _confirmLoginByPhone({
            mobile: params.mobile,
            md5: data.md5,
          })
        }).then((confirmResponse) => {
          // 手机号登录的“强制登录”要复用后端确认接口，不能像账号密码登录那样重发原请求。
          if (confirmResponse.data.status === 1) {
            return confirmResponse
          }

          ElMessageBox.alert(confirmResponse.data.message || '短信验证失败', '提示', {
            type: 'error',
          })
          return Promise.reject(confirmResponse)
        })
      }

      ElMessageBox.alert(data.message || '短信验证失败', '提示', {
        type: 'error',
      })
      return Promise.reject(response)
    })
  }

  /** 对外暴露的账号密码登录入口。 */
  async function loginByAccount(params: any) {
    return loginHandler(() => _loginByAccount(params))
  }

  /** 对外暴露的手机号验证码登录入口。 */
  async function loginByPhone(params: { mobile: string, code: string }) {
    return loginHandler(() => _loginByPhone(params))
  }

  /** 统一登录成功后的初始化与跳转流程。 */
  async function loginHandler(loginApi: () => Promise<any>) {
    try {
      isLogin.value = false
      await loginInit()
      const res = await loginApi()
      if (res?.editPwdModal) {
        return res
      }

      // 手机号登录和账号密码登录都必须走同一套初始化，保证权限、菜单、字典缓存口径一致。
      await Promise.all([
        useUserStore().init(),
        initDynamicRouter(),
      ])
      resetLoginRuntimeState()
      isLogin.value = true

      useTabsStore().setTabs([])

      await nextTick()
      const redirect = router.currentRoute.value.query?.redirect as string
      const path = redirect || HOME_URL
      await router.replace(path)

      ElNotification.success({
        duration: 3000,
        title: '欢迎登录',
        message: getTimeState(),
      })

      return { ...res }
    }
    catch (error) {
      clearLoginInfo()
      throw error
    }
  }

  /** 退出当前登录态，并保留当前页作为重新登录后的回跳目标。 */
  async function logout() {
    const res = await axios.get('/ui/logout').then((response) => {
      return response.data.data
    })
    clearLoginInfo()

    const { fullPath } = router.currentRoute.value
    await router.push({
      path: LOGIN_URL,
      query: {
        redirect: fullPath,
      },
    })

    return res
  }

  /** 登录失效后的统一兜底处理，使用节流避免重复弹错和重复跳转。 */
  const unauthorizedHandler = useThrottleFn((err: any) => {
    const { path, fullPath } = router.currentRoute.value
    if (path === LOGIN_URL) {
      return
    }

    if (err?.response?.data?.loginURL) {
      window.location.href = err.response.data.loginURL + encodeURIComponent(window.location.href)
      return
    }

    clearLoginInfo()

    ElMessage.error('登录失效！请您重新登录')
    return router.push({
      path: LOGIN_URL,
      query: {
        redirect: fullPath,
      },
    })
  }, 2000)

  return {
    isLogin,
    showVerifyCode,
    loginTypes,
    showPhoneLoginEntry,
    smsNeedAuthCode,
    smsAuthCodeURL,
    smsSending,
    smsSendLimit,
    smsSendCounter,
    clearLoginInfo,
    refreshSmsAuthCode,
    initPhoneLogin,
    sendPhoneVerifyCode,
    loginByAccount,
    loginByPhone,
    loginInit,
    loginHandler,
    logout,
    unauthorizedHandler,
  }
}

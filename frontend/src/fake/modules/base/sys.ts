import type { FakeConfig } from '../../_tools/route'
import { ResultUtils } from '../../../utils/faker'

interface MultiRequestBody {
  urls?: string[]
}

const mockUserInfo = {
  installed: true,
  userName: 'admin',
  realName: '系统管理员',
  adminUserName: 'admin',
  threeRoles: false,
  isAdminUser: 'Y',
  roleType: 'S',
  isThreeRole: false,
  logined: true,
  secretType: 'des',
}

const mockAppInfo = {
  appCode: 'zving-admin',
  appName: 'ZV Admin',
  copyright: 'Zving',
  version: 'dev-mock',
}

const mockPriv = {
  fullPrivs: true,
  ids: {},
  keys: {},
  types: {},
}

const mockPreference = {}
const mockMessageUnread = {
  count: 3,
}

const mockLoginInit = {
  title: 'ZCMS内容管理系统',
  licenseWarning: '',
  linceseNearEndWarning: '',
  secondConfirm: false,
  seek: 'mock_login_seek_key',
  needEnrypt: true,
  secretType: 'des',
  status: 1,
}

const multiRequestDataFactory: Record<string, () => unknown> = {
  '/ui/login': () => mockUserInfo,
  '/ui/application/info': () => mockAppInfo,
  '/ui/application/privs': () => mockPriv,
  '/ui/users/preferences': () => mockPreference,
}

function normalizePath(url: string): string {
  return url.split('?')[0] || url
}

function resolveMultiRequestData(url: string) {
  const path = normalizePath(url)
  const factory = multiRequestDataFactory[path]
  if (!factory) {
    return ResultUtils.success({})
  }
  return ResultUtils.success(factory())
}

export default [
  // 登录页初始化
  {
    url: '/ui/login/init',
    method: 'get',
    response: () => {
      return mockLoginInit
    },
  },
  // 账号密码登录
  {
    url: '/ui/login',
    method: 'post',
    response: (_req) => {
      return ResultUtils.success({})
    },
  },
  // 当前用户信息（提供单接口回退）
  {
    url: '/ui/login',
    method: 'get',
    response: () => {
      return ResultUtils.success(mockUserInfo)
    },
  },
  // 应用信息（提供单接口回退）
  {
    url: '/ui/application/info',
    method: 'get',
    response: () => {
      return ResultUtils.success(mockAppInfo)
    },
  },
  // 权限信息（提供单接口回退）
  {
    url: '/ui/application/privs',
    method: 'get',
    response: () => {
      return ResultUtils.success(mockPriv)
    },
  },
  // 用户偏好（提供单接口回退）
  {
    url: '/ui/users/preferences',
    method: 'get',
    response: () => {
      return ResultUtils.success(mockPreference)
    },
  },
  // MultiRequest 聚合接口
  {
    url: '/ui/multiRequest',
    method: 'post',
    response: (_req) => {
      const { urls = [] } = (_req.body || {}) as MultiRequestBody
      const data = Object.fromEntries(
        urls.map(url => [url, resolveMultiRequestData(url)]),
      )
      return ResultUtils.success(data)
    },
  },
  // 安装状态检查
  {
    url: '/ui/install/status',
    method: 'get',
    response: () => {
      return ResultUtils.success(true)
    },
  },
  // 消息未读数
  {
    url: '/ui/message/unread',
    method: 'get',
    response: () => {
      return ResultUtils.success(mockMessageUnread)
    },
  },
  // 登出
  {
    url: '/ui/logout',
    method: 'get',
    response: () => {
      return ResultUtils.success({})
    },
  },
] as const satisfies FakeConfig

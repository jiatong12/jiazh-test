import axios from 'axios'
import { LOGIN_URL } from '@/config'
import { $$dicts } from '@/dicts'
import router from '@/router'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { useUserStore } from '../user'

/** 登录后的系统级辅助能力。 */
export function createAuthSystemModule() {
  let systemInstalled: boolean | null = null

  /** 尝试静默刷新用户信息、动态路由和字典缓存。 */
  async function tryRefreshInfo() {
    const path = router.currentRoute.value.path
    if (path === LOGIN_URL) {
      return
    }
    return Promise.all([
      useUserStore().init(),
      initDynamicRouter(),
      $$dicts.$initDictCache(),
    ])
  }

  /**
   * 只负责返回安装状态并维护缓存。
   * 安装页访问控制和页面跳转统一放在路由层处理，避免 store 里混入导航副作用。
   * 接口失败时不覆盖已有缓存，避免一次瞬时异常把状态误判成“已安装”。
   * @param useCache 是否使用缓存的安装状态（安装后不缓存重新调用）
   * @returns 系统是否已安装
   */
  async function checkSystemInstallationStatus(useCache = true) {
    if (useCache && systemInstalled !== null) {
      return systemInstalled
    }

    let nextSystemInstalled
    try {
      const { data } = await axios.get('/ui/install/status')
      nextSystemInstalled = Boolean(data.data)
    }
    catch (error) {
      console.error('调用安装状态接口失败', error)
      // 防回归：瞬时网络异常不能把系统状态误判成“已安装”并写入缓存。
      return systemInstalled ?? false
    }

    systemInstalled = nextSystemInstalled
    return systemInstalled
  }

  return {
    tryRefreshInfo,
    checkSystemInstallationStatus,
  }
}

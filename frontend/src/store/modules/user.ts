import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { INSTALL_URL } from '@/config'
import { useMultiRequest } from '@/hooks/useMultiRequest'

/** 用户信息 */
export interface UserInfo {
  installed: boolean
  userName: string
  realName: string
  adminUserName: string
  threeRoles: boolean
  isAdminUser: string
  roleType: string
  isThreeRole: boolean
  logined: boolean
  secretType: string
}

/* app 信息 */
export interface AppInfo {
  appCode: string
  appName: string
  copyright: string
  version: string
}

/* 权限信息 */
export interface Priv {
  fullPrivs: boolean
  ids: Record<string, any>
  keys: Record<string, any>
  types: Record<string, any>
}

export interface Site {
  siteID: number
  prefix: number
  siteName: number
  siteURL: number
}

export const useUserStore = defineStore('user', () => {
  // ----------------- 用户信息 -----------------
  const userInfo = ref<UserInfo>()
  // ----------------- 应用信息 -----------------
  const appInfo = ref<AppInfo>()
  // ----------------- 权限 -----------------
  const priv = ref<Priv>()
  // ----------------- 国际化 -----------------
  // const i18ns = ref<Record<string, string>>()
  // ----------------- 网站信息 -----------------
  const sites = ref<Site>()
  // ----------------- 用户偏好 -----------------
  const preference = ref<Record<string, string>>()
  // ----------------- 栏目 -----------------
  // const rootCatalogId = ref<string>()
  const router = useRouter()

  async function init() {
    const initRequest = useMultiRequest()
    initRequest.add('/ui/login')
    initRequest.add('/ui/application/info')
    // initRequest.add('/ui/sites')
    initRequest.add('/ui/application/privs')
    initRequest.add('/ui/users/preferences')
    // initRequest.add('/ui/application/i18ns')
    // initRequest.add('/ui/workspace/nocatalog/init')
    await initRequest.execute()

    /* 用户信息 */
    userInfo.value = await initRequest.get('/ui/login').then(r => r.data.data)
    if (!userInfo.value?.installed) {
      router.replace(INSTALL_URL)
      return
    }
    const { isAdminUser } = userInfo.value!

    await nextTick() // 保证获取当前 query
    const threeUrl = router.currentRoute.value.query?.threeurl as string
    if (isAdminUser && threeUrl) {
      window.location.href = threeUrl
    }

    /* 应用信息 */
    if (!appInfo.value?.appCode) {
      appInfo.value = await initRequest.get('/ui/application/info').then(r => r.data.data)
      window.document.title = `${appInfo.value?.appCode}-${appInfo.value?.appName}`
    }
    else {
      window.document.title = `${appInfo.value?.appCode}-${appInfo.value?.appName}`
    }

    /* 权限 */
    priv.value = await initRequest.get('/ui/application/privs').then(r => r.data.data)

    /* 国际化 */
    // i18ns.value = await initRequest.get('/ui/application/i18ns').then(r => r.data)

    sites.value = {
      siteID: 0,
      prefix: 0,
      siteName: 0,
      siteURL: 0,
    }
    // /* 网站信息 */
    // sites.value = await initRequest.get('/ui/sites').then((res) => {
    //   const result = res.data
    //   const { siteID, prefix, siteName, siteURL } = result
    //   return {
    //     ...result,
    //     siteID: siteID || 0,
    //     prefix: prefix || 0,
    //     siteName: siteName || 0,
    //     siteURL: siteURL || 0,
    //   }
    // })

    /* 用户偏好 */
    preference.value = await initRequest.get('/ui/users/preferences').then(r => r.data.data)

    // /* 根栏目 */
    // rootCatalogId.value = await initRequest.get('/ui/workspace/nocatalog/init').then(r => r.data.data.catalogID)
  }

  // 更新权限
  async function updatePriv() {
    return priv.value = await axios.get('/ui/application/privs', { showDefaultError: false }).then(r => r.data.data)
  }

  // 是否是当前用户
  function isCurrentUser(userName: string) {
    return userInfo.value?.userName === userName
  }

  return {
    userInfo,
    appInfo,
    priv,
    // i18ns,
    sites,
    preference,
    // rootCatalogId,
    init,
    updatePriv,
    isCurrentUser,
  }
},
{
  // persist: {
  //   pick: ['userInfo'],
  // },
  persist: false,
},
)

import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import { HOME_URL, INSTALL_URL, LOGIN_URL, ROUTE_MODE, ROUTER_WHITE_LIST } from '@/config'
import NProgress from '@/config/nprogress'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import {
  errorRouter,
  staticRouter,
} from '@/router/modules/staticRouter'
import { useAuthStore } from '@/store/modules/auth'
import { isRouteCache, useTabsStore } from '@/store/modules/tabs'

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory(),
}
const history = routerMode[ROUTE_MODE]()
history.listen(() => {
  // 历史记录切换
  // 开启缓存（如果本身开启了缓存）
  isRouteCache.value = true
})

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 */
const router = createRouter({
  history,
  routes: [...staticRouter, ...errorRouter],
  scrollBehavior: () => ({ left: 0, top: 0 }),
  strict: false,
})

/**
 * @description 路由拦截 beforeEach
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const tabsStore = useTabsStore()

  // 刷新 keepAlive 缓存
  if (isRouteCache.value) {
    // tab 触发、历史记录切换，启用缓存
    tabsStore.keepAliveTempExclude = ''
  }
  else {
    // 非 tab触发，禁缓存
    tabsStore.keepAliveTempExclude = to.fullPath
  }

  // await nextTick(async () => {
  // 让所有页面跳转默认缓存都失效（有缓存，但默认方式缓存无效）
  // await tabsStore.clearPageCache(async () => {
  // 1.NProgress 开始
  NProgress.start()

  // 2.动态设置标题
  // document.title = to.meta.title ? `${to.meta.title} - ${APP_TITLE}` : APP_TITLE

  // 3.判断是访问登陆页，登录了就在当前页面，否则重置路由到登陆页
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (authStore.isLogin) {
      return next(from.fullPath)
    }
    // 重置路由
    resetRouter()
    return next()
  }

  // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) {
    return next()
  }

  // 系统初始化页面需要根据后端接口判断能否访问
  if (to.path.toLocaleLowerCase() === INSTALL_URL) {
    const isInstalled = await authStore.checkSystemInstallationStatus()
    if (isInstalled) {
      return next({
        path: HOME_URL,
        replace: true,
      })
    }
    return next()
  }

  // 5.判断是否登录，没有登录时统一回到登录页，并保留目标地址供登录后回跳
  if (!authStore.isLogin) {
    return next({
      path: LOGIN_URL,
      query: {
        ...(to.path !== LOGIN_URL && { redirect: to.fullPath }),
      },
      replace: true,
    })
  }

  // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (authStore.menuListGet.length === 0) {
    await initDynamicRouter()
    return next({ ...to, replace: true })
  }

  // 7.正常访问页面
  next()
  // }, to.fullPath, to.meta.isKeepAlive as boolean, !isTabActive.value)
  // })
})
/**
 * @description 重置路由
 */
export function resetRouter() {
  const authStore = useAuthStore()
  authStore.flatMenuListGet.forEach((route) => {
    const { name } = route
    if (name && router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

/**
 * @description 路由跳转错误
 */
router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 */
router.afterEach(() => {
  NProgress.done()
})

export default router

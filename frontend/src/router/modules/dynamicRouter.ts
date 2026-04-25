import type { RouteRecordRaw } from 'vue-router'

import { PAGE404_URL } from '@/config'
import { useAuthStore } from '@/store/modules/auth'

import router from '../index'
import { pageModules } from './module-globs'

/**
 * @description 初始化动态路由
 */
export async function initDynamicRouter() {
  const authStore = useAuthStore()

  try {
    // 1.获取菜单列表 && 按钮权限列表
    // await Promise.all([authStore.getMenuList(), authStore.getAuthCodes()])
    await Promise.all([authStore.getMenuList()/*  authStore.getAuthCodes() */])

    // 2.判断当前用户有没有菜单权限
    if (authStore.menuListGet.length === 0) {
      throw new Error('No permission')
    }

    // 3.添加动态路由
    authStore.flatMenuListGet.forEach((item) => {
      item.children && delete item.children
      if (item.component && typeof item.component === 'string') {
        const component = item.component
        item.component = () => {
          console.log('================', component)
          const page = pageModules[`/src/modules${component}.vue`]
          if (!page) {
            // 没有此页面，跳转到 404，TODO：一般不应该进入这个逻辑，请检查路由配置
            return router.replace(PAGE404_URL)
          }
          return page().then((res) => {
            // 修改组件名，方便使用 tab 切换缓存功能，解决路由 name 和 keep-alive 中生效的页面 name 不一致问题，这里用
            // (res as any).default.name = item.name
            return res
          })
        }
      }
      if (item.meta.isFull) {
        router.addRoute(item as unknown as RouteRecordRaw)
      }
      else {
        router.addRoute('layout', item as unknown as RouteRecordRaw)
      }
    })
  }
  catch (error) {
    return Promise.reject(error)
  }
}

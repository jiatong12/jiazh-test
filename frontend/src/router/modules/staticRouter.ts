import type { RouteRecordRaw } from 'vue-router'

import { HOME_URL, INSTALL_NAME, INSTALL_URL, LICENSE_NAME, LICENSE_URL, LOGIN_URL, PAGE404_URL } from '@/config'

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  // 根目录
  {
    path: '/',
    redirect: HOME_URL,
  },
  // // 首页
  // {
  //   component: () => import('@/modules/base/views/home/index.vue'),
  //   meta: {
  //     icon: 'i-lucide:house,
  //     title: '首页',
  //     isHide: false,
  //     isFull: false,
  //     isAffix: true,
  //     isKeepAlive: true,
  //     order: -100,
  //   },
  //   name: 'home',
  //   path: HOME_URL,
  // },
  // 系统初始化
  {
    component: () => import('@/modules/base/install/index.vue'),
    meta: {
      title: '系统初始化',
    },
    name: INSTALL_NAME,
    path: INSTALL_URL,
  },
  // 更新许可证
  {
    component: () => import('@/modules/base/license/index.vue'),
    meta: {
      title: '更新许可证',
    },
    name: LICENSE_NAME,
    path: LICENSE_URL,
  },
  // 登录
  {
    component: () => import('@/modules/base/login/index.vue'),
    meta: {
      title: '登录',
    },
    name: 'login',
    path: LOGIN_URL,
  },
  // 布局
  {
    component: () => import('@/layouts/index.vue'),
    name: 'layout',
    path: '/layout',
    // component: () => import("@/layouts/indexAsync.vue"),
    redirect: HOME_URL,
    children: [],
  },
]

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    component: () => import('@/modules/base/error-message/403.vue'),
    meta: {
      title: '403页面',
    },
    name: '403',
    path: '/403',
  },
  {
    component: () => import('@/modules/base/error-message/404.vue'),
    meta: {
      title: '404页面',
    },
    name: '404',
    path: PAGE404_URL,
  },
  {
    component: () => import('@/modules/base/error-message/500.vue'),
    meta: {
      title: '500页面',
    },
    name: '500',
    path: '/500',
  },
  // Resolve refresh page, route warnings
  {
    component: () => import('@/modules/base/error-message/404.vue'),
    path: '/:pathMatch(.*)*',
  },
]

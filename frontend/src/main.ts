import { useTitle } from '@vueuse/core'
import { MotionPlugin } from '@vueuse/motion'

import { createApp } from 'vue'
import VueUeditorWrap from 'vue-ueditor-wrap'

// import { unmountGlobalLoading } from '@/hooks/unmountGlobalLoading'

// import I18n from '@/languages/index'

import directives from '@/directives/index'

import App from './App.vue'

import { useEnv } from './env'

import { registerGlobalProperties } from './globalConfig'

import { unmountGlobalLoading } from './hooks/unmountGlobalLoading'
import router from './router'
import { initStores } from './store'

import { useAuthStore } from './store/modules/auth'
import { initCacheVersion } from './utils/cache'

import './config/axios'
import '@/styles/reset.scss'

// element css
import 'element-plus/dist/index.css'
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css'
// custom element dark css
import '@/styles/element-plus.scss'
import '@/styles/element-plus-dark.scss'

// CSS common style sheet
import '@/styles/common.scss'

import 'virtual:uno.css' // 添加这行来引入 UnoCSS 生成的样式

// ----------------- 应用初始化 -----------------
/**
 * 应用初始化完成之后再进行页面加载渲染
 */
async function initApplication() {
  const { APP_TITLE } = useEnv()
  // name用于指定项目唯一标识
  // 用于区分不同项目的偏好设置以及存储数据的key前缀以及其他一些需要隔离的数据
  // const namespace = getNamespace()

  // app偏好设置初始化
  // await initPreferences({
  //   namespace,
  //   overrides: overridesPreferences,
  // })

  // 启动应用并挂载
  // vue应用主要逻辑及视图

  const app = createApp(App)

  // 注册全局属性
  registerGlobalProperties(app)

  // 配置 pinia-store
  await initStores(app)

  // 配置路由及路由守卫
  app.use(router).use(directives).use(MotionPlugin).use(VueUeditorWrap)
  // .use(I18n)

  // 初始缓存版本，如果对不上就清空缓存
  initCacheVersion()

  // 动态更新标题
  watchEffect(() => {
    // if (preferences.app.dynamicTitle) {
    const routeTitle = router.currentRoute.value.meta?.title
    const pageTitle = (routeTitle ? `${routeTitle} - ` : '') + APP_TITLE
    useTitle(pageTitle)
    // }
  })

  // // 路由是异步的
  // router.isReady().then(() => {
  //   app.mount('#app')
  // })

  // 路由是异步的
  router.isReady().then(() => {
    // 尝试刷新字典、用户信息、权限
    useAuthStore()
      .tryRefreshInfo()
      .finally(() => {
        // 移除并销毁 loading，因为这里销毁的时机有点晚，注意要 loading页面中的 css不要影响到了页面中的代码
        unmountGlobalLoading()
        app.mount('#app')
      })
  })
}

initApplication()

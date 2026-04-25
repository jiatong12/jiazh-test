import { useRenderIcon } from '@/hooks/useRenderIcon'

// 扩展 ComponentCustomProperties 类型
declare module 'vue' {
  interface ComponentCustomProperties {
    // ----------------- 权限相关 -----------------
    // $$auths: typeof $$auths
    // $$hasAuth: typeof $$auths.hasAuth
    // $$hasAuthAny: typeof $$auths.hasAuthAny
    // $$hasRole: typeof $$auths.hasRole
    // $$hasRoleAny: typeof $$auths.hasRoleAny
    // ----------------- 其他 -----------------
    // 渲染图片
    $$renderIcon: typeof useRenderIcon
  }
}

//
/**
 * 全局属性注册函数
 * setup 组合式 script 用不了（要获取 this）,  只能在 template 中使用，
 * 可以弥补自动导入开启 template后会将不该导入变量放 template的问题（像 vue3的那些 api），
 * @param app
 */
export function registerGlobalProperties(app: any) {
  // ----------------- 权限相关 -----------------
  // app.config.globalProperties.$$auths = $$auths
  // app.config.globalProperties.$$hasAuth = $$auths.hasAuth
  // app.config.globalProperties.$$hasAuthAny = $$auths.hasAuthAny
  // app.config.globalProperties.$$hasRole = $$auths.hasRole
  // app.config.globalProperties.$$hasRoleAny = $$auths.hasRoleAny
  // ----------------- 其他 -----------------
  // 渲染图片
  app.config.globalProperties.$$renderIcon = useRenderIcon
}

/* 这个项目用来注册权限工具实例，如果有多个后台可以多构建几个 */
import { useAuthStore } from '@/store/modules/auth'
// import { freezeDeep } from '@/utils'
import { useAuthUtils } from './auth.util'

// const authConfig = freezeDeep([
//   // 用户管理
//   'user:page',
//   // `user:page` as `user:page:${string}`,
//   'user:add',
//   'user:batchAdd',
//   'user:export',
//   'user:batchDelete',
//   'user:status',
//   // buttons
//   'buttons:page',
//   'buttons:add',
//   'buttons:edit',
//   'buttons:delete',
//   'buttons:import',
//   'buttons:export',
// ] as const satisfies string[])
// 权限 code
// export type AuthCode = (typeof authConfig)[number]

// const roleConfig = freezeDeep([
//   'admin',
//   'manage',
//   'user',
// ] as const satisfies string[])
// 角色 code
// export type RoleCode = (typeof roleConfig)[number]

export const $$auths = useAuthUtils({
  /* 权限 */
  // authConfig,
  hasPriv: (code) => {
    return useAuthStore().hasPriv(code)
  },
  hasPrivAny: (code) => {
    return useAuthStore().hasPrivAny(code)
  },
  /* 角色 */
  // roleConfig,
  // hasRole: (...codes) => {
  //   return useAuthStore().hasRole(...codes)
  // },
  // hasRoleAny: (...codes) => {
  //   return useAuthStore().hasRoleAny(...codes)
  // },
})

import { freezeDeep } from '@/utils'

// ----------------- 权限配置相关 -----------------
export const authConfig = freezeDeep([
  // 用户管理
  'user:page',
  'user:add',
  'user:batchAdd',
  'user:export',
  'user:batchDelete',
  'user:status',
  // buttons
  'buttons:page',
  'buttons:add',
  'buttons:edit',
  'buttons:delete',
  'buttons:import',
  'buttons:export',
] as const satisfies string[])

// ----------------- 角色配置相关 -----------------
export const roleConfig = freezeDeep([
  'admin',
  'manage',
  'user',
] as const satisfies string[])

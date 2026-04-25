/**
 * 权限工具
 */

/*
<
  AuthConfig extends readonly string[], AuthCode extends AuthConfig[number],
  // RoleConfig extends readonly string[], RoleCode extends RoleConfig[number],
>
*/
export function useAuthUtils(options: {
  /* 权限标识配置 */
  // readonly authConfig: AuthConfig
  /**
   * 存在权限
   * @param codes 权限标识
   * @returns 是否存在权限
   */
  hasPriv: (code: string) => boolean
  // hasPriv: (...codes: AuthCode[]) => boolean
  /**
   * 存在其中任意一个权限
   * @param codes 权限标识
   * @returns 是否存在权限
   */
  hasPrivAny: (code: string) => boolean
  // hasPrivAny: (...codes: AuthCode[]) => boolean

  // /* 角色标识配置 */
  // readonly roleConfig: RoleConfig
  // /**
  //  * 存在角色
  //  * @param codes 角色标识
  //  * @returns 是否存在角色
  //  */
  // hasRole: (...codes: RoleCode[]) => boolean
  // /**
  //  * 存在其中任意一个角色
  //  * @param codes 角色标识
  //  * @returns 是否存在角色
  //  */
  // hasRoleAny: (...codes: RoleCode[]) => boolean
}) {
  return Object.freeze(options)
}

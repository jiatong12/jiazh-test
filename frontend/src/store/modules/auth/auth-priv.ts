import type { Ref } from 'vue'

interface PrivLike {
  fullPrivs?: boolean
  ids?: Record<string, any>
  keys?: Record<string, any>
  types?: Record<string, any>
}

interface UserStoreLike {
  userInfo?: {
    isAdminUser?: string | boolean
  }
}

/** 权限判断相关能力。 */
export function createAuthPrivModule(options: {
  userStore: UserStoreLike
  priv: Ref<PrivLike | undefined>
}) {
  const { userStore, priv } = options

  /**
   * 将字符转换为标志位
   * @param flag 字符编码
   * @returns 转换后的标志位
   */
  function charToFlag(flag: number): number {
    let i = 0
    if (flag === 36 || flag === 37) {
      i = flag
    }
    else if (flag < 58) {
      i = flag - 48
    }
    else if (flag < 91) {
      i = flag - 27
    }
    else if (flag < 123) {
      i = flag - 87
    }
    return i
  }

  /**
   * 判断字符串是否为整数
   * @param str 待判断的字符串
   * @returns 是否为整数
   */
  function isInt(str: string | number): boolean {
    str = `${str}`
    if (str.trim() === '') {
      return false
    }
    return /^-?\d+$/.test(str)
  }

  /** 管理员或 fullPrivs 用户默认拥有全部权限。 */
  function hasFullAccess() {
    return Boolean(userStore.userInfo?.isAdminUser || priv.value?.fullPrivs)
  }

  /**
   * 检查是否有权限
   * @param k 权限标识
   * @returns 是否有权限
   */
  function _hasPriv(k: string): boolean {
    if (!k) {
      return false
    }

    if (hasFullAccess()) {
      return true
    }

    const index = k.lastIndexOf('.')
    if (index > 0) {
      const id = k.substring(index + 1)
      if (isInt(id)) {
        k = k.substring(0, index)
        const flags = priv.value?.ids?.[id]
        if (!flags || flags === null) {
          return false
        }
        const order = priv.value?.types?.[k]
        if ((order !== 0 && !order) || order >= flags.length * 6) {
          return false
        }
        const flag = flags.charCodeAt(order / 6)
        return (charToFlag(flag) & (1 << (5 - (order % 6)))) !== 0
      }

      return priv.value?.keys?.[k] || false
    }

    return priv.value?.keys?.[k] || false
  }

  /** 验证是否具备全部指定权限。 */
  function hasPriv(code: string) {
    if (!code) {
      return false
    }
    if (hasFullAccess()) {
      return true
    }
    const arr = code.split('||')
    return arr.every(code => _hasPriv(code))
  }

  /** 验证是否具备任意指定权限。 */
  function hasPrivAny(code: string) {
    if (!code) {
      return false
    }
    if (hasFullAccess()) {
      return true
    }
    const arr = code.split('||')
    return arr.some(code => _hasPriv(code))
  }

  return {
    hasPriv,
    hasPrivAny,
  }
}

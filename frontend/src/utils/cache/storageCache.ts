/**
 * @description  删除 localStorage 中指定前缀的 key
 * @param prefix 前缀
 */
export function removeLocalStorageByPrefix(prefix: string = '') {
  Object.entries(localStorage)
    .map(e => e[0])
    .filter(e => e.startsWith(prefix))
    .forEach(e => localStorage.removeItem(e))
}

export interface CreateStorageParams {
  prefixKey: string
  timeout?: number | null
}
export function createStorage({
  prefixKey = '',
  timeout = null,
}: Partial<CreateStorageParams> = {}) {
  /**
   * @class
   * @example
   */
  class Storage {
    private prefixKey?: string

    /**
     */
    constructor() {
      this.prefixKey = prefixKey
    }

    public getKey(key: string) {
      return `${this.prefixKey}${key}`.toLowerCase()
    }

    /**
     * 设置缓存
     * @param {string} key
     * @param {*} value
     * @param {*} expire Expiration time in seconds
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = timeout) {
      try {
        const stringData = JSON.stringify({
          value,
          time: Date.now(),

          expire: expire ? Date.now() + (expire * 1000) : null,
        })

        localStorage.setItem(this.getKey(key), stringData)
      }
      catch (err) {
        throw new Error(`localStorage setItem key ${key} error: ${err}`)
      }
    }

    /**
     * 设置缓存
     * @param {string} key
     * @param {*} value
     * @memberof Cache
     */
    setRaw(key: string, value: any) {
      try {
        const stringData = JSON.stringify(value)
        localStorage.setItem(this.getKey(key), stringData)
      }
      catch (err) {
        throw new Error(`localStorage setItem key ${key} error: ${err}`)
      }
    }

    /**
     * 读取缓存
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get<T = any>(key: string, def: any = null): T {
      const val = localStorage.getItem(this.getKey(key))
      if (!val) { return def }

      try {
        const data = JSON.parse(val)
        const { value, expire } = data
        if (expire && expire < Date.now()) {
          this.remove(key)
          return def
        }
        return value
      }
      catch {
        return def
      }
    }

    /**
     * 读取缓存
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    getRaw<T = any>(key: string, def: any = null): T {
      const val = localStorage.getItem(this.getKey(key))
      if (!val) { return def }

      try {
        return JSON.parse(val)
      }
      catch {
        return def
      }
    }

    /**
     * 根据键名删除缓存
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      localStorage.removeItem(this.getKey(key))
    }

    /**
     * 清理当前前缀的缓存（避免清除同域名下的其他缓存）
     */
    clear(): void {
      removeLocalStorageByPrefix(this.getKey(''))
    }
  }
  return new Storage()
}

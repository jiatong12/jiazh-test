import type { CreateStorageParams } from './storageCache'
import { PREFIX_KEY } from '@/config/namespace'
import { useEnv } from '@/env'
import { createStorage } from './storageCache'

const VERSION_KEY = 'version'

const { CACHE_VERSION } = useEnv()

const options: Partial<CreateStorageParams> = {
  prefixKey: PREFIX_KEY,
  // 缓存过期时间（秒）
  timeout: 60 * 60 * 24 * 7,
}
export const storage = createStorage(options)

export function getKey(key: string) {
  return storage.getKey(key)
}

export function setCache(key: string, value: any, isRaw = false, expire?: number | null): void {
  isRaw ? storage.setRaw(key, value) : storage.set(key, value, expire)
}

export function getCache<T = any>(key: string, isRaw = false): T {
  return isRaw ? storage.getRaw<T>(key) : storage.get<T>(key)
}

export function removeCache(key: string): void {
  return storage.remove(key)
}

/**
 * 清理当前前缀的缓存（避免清除同域名下的其他缓存）
 */
export function clearCache(): void {
  return storage.clear()
}

/**
 * 清理当前用户相关的缓存
 */
export function clearLogin(): void {
  storage.remove('auth')
  storage.remove('tabs')
}

/**
 * @description 初始化缓存版本，清理此项目的的 storage key，删除是为了避免版本更新导致存储过多和各版本缓存有区别的问题
 */
export function initCacheVersion() {
  if (CACHE_VERSION !== getCache(VERSION_KEY)) {
    // 版本不一致将清空持久化数据
    clearCache()
  }
  // 设置版本
  setCache(VERSION_KEY, CACHE_VERSION)
}

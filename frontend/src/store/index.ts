import type { Pinia } from 'pinia'
import type { App } from 'vue'
import { createPinia } from 'pinia'
// import { NAMESPACE_PREFIX } from '@/config/namespace'
// import { NAMESPACE_PREFIX } from '@/config/namespace'
import { getCache, setCache } from '@/utils/cache'

let pinia: Pinia

/**
 * @zh_CN 初始化pinia
 */
export async function initStores(app: App) {
  const { createPersistedState } = await import('pinia-plugin-persistedstate')
  pinia = createPinia()
  pinia.use(
    createPersistedState({
      // key: id => `${NAMESPACE_PREFIX}_${id}`,
      storage: {
        getItem(key) {
          return getCache(key)
        },
        setItem(key, value) {
          setCache(key, value)
        },
      },
    }),
  )
  app.use(pinia)
  return pinia
}

export function resetAllStores() {
  if (!pinia) {
    console.error('Pinia is not installed')
    return
  }
  const allStores = (pinia as any)._s
  for (const [_key, store] of allStores) {
    store.$reset()
  }
}

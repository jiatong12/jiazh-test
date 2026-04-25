// 用于指定项目唯一标识
import { useEnv } from '@/env'
import { getNamespace } from '../../vite-config/utils/namespace'

const { APP_NAMESPACE, CACHE_VERSION } = useEnv()
export const {
  namespacePrefix: NAMESPACE_PREFIX,
  namespace: NAMESPACE,
  prefixKey: PREFIX_KEY,
  getKey,
  // namespacePreferencesTheme: NAMESPACE_PREFERENCES_THEME,
  // versionKey: VERSION_KEY,
} = getNamespace({ isBuild: import.meta.env.PROD, appNamespace: APP_NAMESPACE, cacheVersion: CACHE_VERSION })

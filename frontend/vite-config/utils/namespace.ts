export function getNamespace(config: {
  isBuild: boolean
  appNamespace: string
  cacheVersion: string
}) {
  const { isBuild, appNamespace, cacheVersion } = config
  // 用于区分不同项目的偏好设置以及存储数据的key前缀以及其他一些需要隔离的数据
  const env = isBuild ? 'prod' : 'dev'
  // 命名空间前缀，可以用来清除此项目相关缓存
  const namespacePrefix = `${appNamespace}-${env}`
  // 命名空间
  const namespace = `${namespacePrefix}-${cacheVersion}`
  // 主题
  // const namespacePreferencesTheme = `${namespacePrefix}_preferences-theme`
  // 当前缓存持久化 key，这个就是用来判断版本来清理缓存的
  // const versionKey = `${appNamespace}-${env}_version`

  const prefixKey = `${namespacePrefix}_`
  function getKey(key: string) {
    return `${prefixKey}${key}`.toLowerCase()
  }

  return {
    namespacePrefix,
    namespace,
    prefixKey,
    getKey,
    // namespacePreferencesTheme,
    // versionKey,
  }
}

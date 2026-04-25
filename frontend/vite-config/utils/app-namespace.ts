import { resolve } from 'node:path'
import { readJSON } from '../../node-utils'

interface PackageConfig {
  name?: string
}

function getValidName(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function resolveAppNamespace(root: string) {
  const packageJsonPath = resolve(root, 'package.json')
  const packageConfig = await readJSON(packageJsonPath) as PackageConfig
  const packageName = getValidName(packageConfig.name)

  if (packageName) {
    return packageName
  }

  throw new Error('未读取到应用命名空间，请在 package.json 中配置 name')
}

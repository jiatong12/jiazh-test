import type { PluginOption } from 'vite'

import { colors } from '../../node-utils'

interface PluginOptions {
  extraAppData?: Record<string, any>
  fileName: string
  attrName: string
}

/**
 * 用于将配置文件抽离出来，供运行时按需加载
 * @returns
 */

async function viteExtraAppConfigPlugin({
  extraAppData = {},
  fileName = '_app.config.js',
  attrName,
}: PluginOptions): Promise<PluginOption | undefined> {
  let servePath = `/${fileName}`
  let source: string

  return {
    async configResolved(config) {
      servePath = `${ensureTrailingSlash(config.base)}${fileName}`.replace(/\/{2,}/g, '/')
      source = await getConfigSource(attrName, extraAppData)
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = req.url ? new URL(req.url, 'http://localhost') : null
        if (reqUrl?.pathname !== servePath) {
          next()
          return
        }

        // 开发环境没有物理 _app.config.js 文件，这里由 dev server 动态返回同结构脚本。
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
        res.end(source)
      })
    },
    async generateBundle() {
      try {
        this.emitFile({
          fileName,
          source,
          type: 'asset',
        })

        console.log(colors.cyan(`✨configuration file is build successfully!`))
      }
      catch (error) {
        console.log(
          colors.red(
            `configuration file configuration file failed to package:\n${error}`,
          ),
        )
      }
    },
    name: 'vite:extra-app-config',
  }
}

async function getConfigSource(
  attrName: PluginOptions['attrName'],
  extraAppData: PluginOptions['extraAppData'],
) {
  const windowVariable = `window.${attrName}`
  const formattedAppData = JSON.stringify(extraAppData, null, 2)

  // 运行时配置文件需要可直接手改，生成多行格式比压成一行更适合部署后维护。
  return `${windowVariable} = ${formattedAppData};

Object.freeze(${windowVariable});

Object.defineProperty(window, "${attrName}", {
  configurable: false,
  writable: false,
});
`
}

function ensureTrailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`
}

export { viteExtraAppConfigPlugin }

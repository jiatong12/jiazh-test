import type { PluginOption } from 'vite'
import type { InjectAppLoadingOptions } from '../../types'
import fs from 'node:fs'
import fsp from 'node:fs/promises'

import { join } from 'node:path'

import { fileURLToPath } from 'node:url'
/**
 * 用于生成将loading样式注入到项目中
 * 为多app提供loading样式，无需在每个 app -> index.html单独引入
 */
async function viteInjectAppLoadingPlugin(
  options?: InjectAppLoadingOptions,
): Promise<PluginOption | undefined> {
  const {
    loadingTemplate = 'default-loading.html',
    isDarkKey,
    primaryHslKey,
    defaultPrimary,
    defaultIsDark,
  } = options || {}
  const loadingHtml = await getLoadingRawByHtmlTemplate(loadingTemplate)
  const isDarkKeyName = `'${isDarkKey}'`
  const primaryHslKeyName = `'${primaryHslKey}'`

  // 获取缓存的主题
  // 保证黑暗主题下，刷新页面时，loading也是黑暗主题
  const injectScript = `
    <script data-app-loading="inject-js">
    function hexToHsl(hex) {
      const reg = /^#?[0-9A-F]{6}$/i
      if (!reg.test(hex)) {
        return '0 0 0'
      }

      // 移除#前缀并转换为RGB
      hex = hex.replace('#', '')
      const r = Number.parseInt(hex.substring(0, 2), 16) / 255
      const g = Number.parseInt(hex.substring(2, 4), 16) / 255
      const b = Number.parseInt(hex.substring(4, 6), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0; let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h = h * 60
      }

      return Math.round(h) + " " + Math.round(s * 100) + " " + Math.round(l * 100)
    }

    var primaryHsl = JSON.parse(localStorage.getItem(${primaryHslKeyName})) ?? hexToHsl('${defaultPrimary}');
    document.documentElement.style.setProperty('--default-primary-hsl', primaryHsl)
    var isDark = JSON.parse(localStorage.getItem(${isDarkKeyName})) ?? ${defaultIsDark};
    document.documentElement.classList.toggle('dark', isDark);
  </script>
  `
  //   const injectScript = `
  //   <script data-app-loading="inject-js">
  // </script>
  // `

  if (!loadingHtml) {
    return
  }

  return {
    enforce: 'pre',
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        const re = /<body\s*>/
        html = html.replace(re, `<body>${injectScript}${loadingHtml}`)
        return html
      },
      order: 'pre',
    },
  }
}

/**
 * 用于获取loading的html模板
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
  // 支持在app内自定义loading模板，模版参考default-loading.html即可
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  let appLoadingPath = join(__dirname, loadingTemplate)
  if (!fs.existsSync(appLoadingPath)) {
    appLoadingPath = join(__dirname, './default-loading.html')
  }

  return await fsp.readFile(appLoadingPath, 'utf8')
}

export { viteInjectAppLoadingPlugin }

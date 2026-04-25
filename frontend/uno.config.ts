/* unocss 这里只用来处理图标的按需加载，不用原子 css */
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
  defineConfig,
  presetIcons,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
      include: [
        // /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        /\.(js|ts|vue|[jt]sx)($|\?)/,
        'src/**/*.{js,ts,jsx,tsx,vue}',
      ],
    },
  },
  presets: [
    // 由 Iconify 提供支持的纯 CSS 图标解决方案
    // 支持图标，需要搭配图标库，eg: @iconify-json/carbon, 使用 `<button class="i-carbon-sun dark:i-carbon-moon" />`
    presetIcons({
      scale: 1,
      prefix: 'i-',
      // prefix: '',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': '-0.15em',
        // 'vertical-align': 'middle',
        // 'text-align': 'center',
        // 'height': '1ex',
      },
      collections: {
        // me: FileSystemIconLoader('./src/assets/icons/isme'),
        // fe: FileSystemIconLoader("./src/static/svg", (svg) =>
        //   svg.replace(/#FFF/, "currentColor")
        // ),
        icon: FileSystemIconLoader('./src/assets/svg-icon'),
      },
    }),
  ],
  // 禁用其他所有功能，只保留图标
  rules: [],
  shortcuts: [],
  variants: [],
  transformers: [],
})

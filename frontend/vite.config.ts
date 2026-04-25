import type { UserConfig } from 'vite'
import { resolve } from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
// import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import viteCompressPlugin from 'vite-plugin-compression'
import { vitePluginFakeServer } from 'vite-plugin-fake-server'
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html'
import viteVueDevTools from 'vite-plugin-vue-devtools'
import { DEFAULT_IS_DARK, IS_DARK_KEY, PRIMARY_HSL_KEY } from './src/config/index'
import { convertEnv } from './src/env/utils'
import { APP_CONF_ATTR_NAME } from './vite-config/index'
import { viteArchiverPlugin } from './vite-config/plugins/archiver'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteExtraAppConfigPlugin } from './vite-config/plugins/extra-app-config'
import { viteInjectAppLoadingPlugin } from './vite-config/plugins/inject-app-loading'
import { viteLicensePlugin } from './vite-config/plugins/license'
import { vitePrintPlugin } from './vite-config/plugins/print'
import { resolveAppNamespace } from './vite-config/utils/app-namespace'
import { loadAndConvertEnv } from './vite-config/utils/env'
import { getNamespace } from './vite-config/utils/namespace'
import { createServerProxy } from './vite-config/utils/server-proxy'

// const isDevelopment = process.env.NODE_ENV === 'development'

// const mode = import.meta.env.MODE

// https://vite.dev/config/
export default defineConfig(async (configEnv): Promise<UserConfig> => {
  const { mode, command } = configEnv

  const root = process.cwd()
  const isBuild = command === 'build' // 等效于 import.meta.env.PROD
  const enableCompress = process.argv.includes('--compress')
  const enableArchiver = process.argv.includes('--archiver')
  const enableVisualizer = process.argv.includes('--visualizer')
  const viteEnv = loadEnv(mode, root)
  const appNamespace = await resolveAppNamespace(root)

  const { envVarConfig } = convertEnv(viteEnv, { appNamespace })
  const { APP_TITLE, PRIMARY_COLOR } = envVarConfig
  const {
    envConstConfig: { PUBLIC_PATH, DROP_CONSOLE, PROXY, DEVTOOLS, MOCK, CACHE_VERSION },
  } = loadAndConvertEnv(viteEnv)

  const isProd = mode === 'production'
  const { getKey } = getNamespace({ isBuild, appNamespace, cacheVersion: CACHE_VERSION })

  return {
    define: {
      // 前端和构建侧统一使用同一个项目名来源，不再额外维护 VITE_APP_NAMESPACE。
      __APP_NAMESPACE__: JSON.stringify(appNamespace),
    },
    plugins: [
      // mock支持
      // 仅在启用 MOCK 且未配置代理时生效，避免 mock 与代理冲突
      MOCK
      && !PROXY?.length
      && vitePluginFakeServer({
        logger: true, // 打印日志
        enableProd: false,
        timeout: 1000,
        // include: 'src/mock',
        // include: 'src/api-paths-config/mock',
        infixName: 'fake',
        watch: true,
        include: ['src/fake'],
        basename: '/api',
      }),
      vue({
        script: {
          // defineModel: true,
        // propsDestructure: true,
        },
      }),
      vueJsx(),
      // 调试工具
      !isBuild && DEVTOOLS && viteVueDevTools(),
      // 是否生成包预览，分析依赖包大小做优化处理
      isBuild && enableVisualizer && viteVisualizerPlugin({
        filename: './node_modules/.cache/visualizer/stats.html',
        gzipSize: true,
        brotliSize: true,
        open: true,
      }),
      // 打印
      vitePrintPlugin({ infoMap: {
        'Y Admin Docs': 'https://doc.xxx.xxx',
      } }),
      // loading 首屏只能读取构建时默认值，这里与运行时主题色配置保持同一来源。
      await viteInjectAppLoadingPlugin({ primaryHslKey: getKey(PRIMARY_HSL_KEY), isDarkKey: getKey(IS_DARK_KEY), defaultPrimary: PRIMARY_COLOR, defaultIsDark: DEFAULT_IS_DARK, loadingTemplate: 'default-loading-prism-wireframe.html' }),
      // 用于注入版权信息
      await viteLicensePlugin(),
      // 创建打包压缩配置
      isBuild
      && enableCompress
      && viteCompressPlugin({
      // 生成的压缩包后缀
        ext: '.gz',
        // 体积大于threshold才会被压缩
        threshold: 0,
        // 默认压缩.js|mjs|json|css|html后缀文件，设置成true，压缩全部文件
        filter: () => true,
        // 压缩后是否删除原始文件
        deleteOriginFile: false,
      }),
      // 创建打包压缩配置
      isBuild
      && enableCompress
      && viteCompressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        threshold: 0,
        filter: () => true,
        deleteOriginFile: false,
      }),
      // 注入变量到 html 文件
      viteHtmlPlugin({
        minify: true,
        inject: {
          data: { title: APP_TITLE },
        },
      }),
      // 开发环境由 dev server 响应 /_app.config.js，生产环境则输出物理文件，启动链路保持一致。
      await viteExtraAppConfigPlugin({
        fileName: '_app.config.js',
        attrName: APP_CONF_ATTR_NAME,
        extraAppData: envVarConfig,
      }),
      // 打包压缩文件
      enableArchiver && viteArchiverPlugin({}),

      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: [
          'vue',
          // "pinia",
          // "vue-router"
          {
            'vue-router': ['useRouter', 'useRoute'],
          },
          {
          // '@/apis/index': [['default', '$$api']],
          // '@/dicts/index': [['default', '$$dict']],
          // '@/form-rules/index': [['default', '$$formRule']],
          // '@/common/auths/index': [['hasAuth', '$$hasAuth'], ['hasAuthAny', '$$hasAuthAny']],
          // '@/common/auths/index': [['default', '$$auths']],
            // '@/hooks/use-api': ['useRequest'],
            // '@/hooks/use-resettable-state': ['useResettableState'],
          },
        ],
        // resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-imports.d.ts',
        // dirs
        dirs: [
        // 'src/composables',
        // 'src/stores/modules',
        ],
        // eslintrc: {
        //   enabled: true,
        // },
        resolvers: [ElementPlusResolver({
          // importStyle: mode === 'development' ? false : 'sass',
          importStyle: false,
          // 解决指令样式（如 ElLoading）
          // directives: true,
        })],
      }),
      Components({
      // resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-components.d.ts',
        /*
      * globs 相比 dirs 能减少不必要的组件注册
      * src/components 下面 src 中的 vue 文件，注意这里封装不要命名为 index.vue，方便自动注册
      */
        globs: ['src/components/*/src/*.vue', 'src/components/*/src/*.tsx'],
        // dirs: ['src/components'], // 按需加载的文件夹
        resolvers: [ElementPlusResolver({
          importStyle: false,
          // 必须添加，不然会导致 message 和 notification 等组件样式无法自定义
          // importStyle: mode === 'development' ? false : 'sass',
        })],
      }),
      UnoCSS(),
    ],
    root,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 这里导入了，main.ts 中就不能再导入了，不然会报错
          additionalData: `@use "@/styles/var.scss" as *; `,
          // additionalData: `@use "@/styles/var.scss" as *;`,
        },
      },
    },
    base: PUBLIC_PATH,
    optimizeDeps: {
      // Monaco 通过多个 ESM 子路径和 worker 按需加载，跳过预构建可避免 dev 下落到 .vite/deps 的递归转换问题。
      exclude: ['monaco-editor'],
    },
    build: {
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'jse/index-[name]-[hash].js',
          manualChunks: {
            // 分包配置，配置完成自动按需加载
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', 'element-plus'],
            echarts: ['echarts'],
            monaco: ['monaco-editor'],
          },
        },
      },
      target: 'es2015',
    },
    // css: createCssOptions(injectGlobalScss),
    esbuild: {
      drop: isBuild && isProd
        ? [
            ...(DROP_CONSOLE ? ['console'] as const : []),
            'debugger',
          ]
        : [],
      legalComments: 'none',
    },
    server: {
      host: '0.0.0.0',
      port: 8848,
      open: true,
      cors: true,
      proxy: createServerProxy(PROXY),
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: [
          './index.html',
          // './src/bootstrap.ts',
          // './src/{views,layouts,router,store,api,adapter}/*',
        ],
      },
    },
  }
})

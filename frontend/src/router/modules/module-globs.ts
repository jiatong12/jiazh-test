const includeGuides = import.meta.env.VITE_INCLUDE_GUIDES === 'true'

/**
 * 指南模块（示例和文档）走独立开关，关闭后直接从 glob 入口排除，避免进入打包产物。
 */
export const metaModules = includeGuides
  ? import.meta.glob<Menu.Meta>(
      '/src/modules/**/_meta.ts',
      {
        eager: true,
        import: 'default',
      },
    )
  : import.meta.glob<Menu.Meta>(
      [
        '/src/modules/**/_meta.ts',
        '!/src/modules/examples/**/_meta.ts',
        '!/src/modules/docs/**/_meta.ts',
      ],
      {
        eager: true,
        import: 'default',
      },
    )

/**
 * 动态页面组件扫描和菜单扫描保持一致，避免菜单被裁掉后页面文件仍然被打进产物。
 */
export const pageModules = includeGuides
  ? import.meta.glob('/src/modules/**/index.vue')
  : import.meta.glob([
      '/src/modules/**/index.vue',
      '!/src/modules/examples/**/index.vue',
      '!/src/modules/docs/**/index.vue',
    ])

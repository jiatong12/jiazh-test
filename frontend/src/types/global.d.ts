/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
/* 字典 */
// 字典项
declare type DictItem = import('@/dicts/types').DictItem

// /**
//  * 平台的名称、版本、依赖、最后构建时间的类型提示
//  */
// declare const __APP_INFO__: {
//   pkg: {
//     name: string
//     version: string
//     dependencies: Recordable<string>
//     devDependencies: Recordable<string>
//   }
//   lastBuildTime: string
// }

/* Menu */
/* 拓展路由 meta 属性 */
// import 'vue-router';
// declare module 'vue-router' {
//   interface RouteMeta {
//     icon: string
//     title: string
//     activeMenu?: string // 隐藏页面需要配置这个高亮菜单
//     isLink?: string
//     isHide: boolean
//     isFull: boolean
//     isAffix: boolean
//     isKeepAlive: boolean
//   }
// }

declare namespace Menu {
  interface MenuOptions {
    path: string
    name: string
    component?: string | (() => Promise<unknown>)
    redirect?: string
    meta: MetaProps
    children?: MenuOptions[]
  }
  interface MetaProps {
    icon: string
    title: string
    activeMenu?: string // 隐藏页面需要配置这个高亮菜单
    isLink?: string
    ignoreSelfAndChildren?: boolean // 忽略当前节点及全部子节点的菜单和路由注册，可用于上线裁剪非生产模块
    isHide: boolean
    isFull: boolean
    isAffix: boolean
    isKeepAlive: boolean
    priv?: string // 权限
  }

  // 约定式路由配置
  type Meta
    = | (MetaProps & {
      // routeName: string // 路由名，会同步将页面 name 修改，因为组件有 vue-grid-layout 全局注册的， gridLayout gridItem 等名不能作为 routeName
      order: number // 顺序
      routePathPart?: string // 路由路径片段，没有值就按文件夹名字来，可以是 xxx 也可以是 xxx/xxx，前后不用加 "/"
    })
    | {
      isGroup: true // 是分组，非页面
      icon: string
      title: string
      ignoreSelfAndChildren?: boolean // 忽略当前节点及全部子节点的菜单和路由注册，可用于上线裁剪非生产模块
      order: number
      routePathPart?: string // 路由路径片段，没有值就按文件夹名字来，可以是 xxx 也可以是 xxx/xxx，前后不用加 "/"
      priv?: string // 权限
    }
  // 约定式路由目录配置
  // interface Layout {
  //   icon: string;
  //   title: string;
  //   order: number;
  // }
}

/* FileType */
declare namespace FileType {
  type ImageMimeType
    = | 'image/png'
      | 'image/jpeg'
      | 'image/webp'
      | 'image/apng'
      | 'image/bmp'
      | 'image/gif'
      | 'image/pjpeg'
      | 'image/svg+xml'
      | 'image/tiff'
      | 'image/x-icon'

  type ExcelMimeType = 'application/vnd.ms-excel' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

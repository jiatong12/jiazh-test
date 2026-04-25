/* 自动注册路由，只取 modules 下的  _meta.ts，如果是 isGroup=true 就是目录，否则同级目录下的 index 文件就是页面 */
// import { ElNotification } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { metaModules } from './module-globs'

/** ----------------------------------------- 自动注册路由 */
// const layoutModules = import.meta.glob<Menu.Layout>("../../views/**/_layout.ts", {
//   eager: true,
//   import: "default"
// });
// const pageModules = import.meta.glob("../../views/**/index.vue");

// 约定式路由信息，把扫描到信息映射成路由信息
// export const layoutRoutes = Object.entries(layoutModules).map(([layoutPath, config]) => {
//   // 匹配路由路劲
//   let path = layoutPath.replace("../../views", "").replace("/_layout.ts", "");
//   // 判断是否根路径
//   path = path || "/";
//   return {
//     path,
//     // redirect,
//     meta: {
//       icon: config.icon,
//       title: config.title,
//       order: config.order
//     }
//   };
// });
const pageRoutes = Object.entries(metaModules).map(([metaPath, meta]) => {
  // 匹配路由路劲
  const basePath = metaPath.replace('/src/modules/', '/')

  let path = basePath.replace('/_meta.ts', '')
  // 判断是否根路径
  path = path || '/'
  // 路由名称，这里具体根据公司的要求，这里用 _meta.ts 中的 routeName
  // const name = path.split("/").filter(Boolean).join("-") || "index";
  const isGroup = 'isGroup' in meta
  if (isGroup) {
    return {
      // redirect,
      meta,
      path,
    }
  }
  else {
    // const name = meta.routeName
    // const pagePath = metaPath.replace("_meta.ts", "index.vue");
    // (filePath) => filePath.replace('src/modules/base/views/', '')
    // (filePath) => filePath.replace('src/modules/order/views/', '/order')
    const pagePath = basePath.replace('/_meta.ts', '/index')
    // const page = pageModules[pagePath];
    // 这里返回的就是每个路由的信息
    return {
      // },
      component: pagePath,
      // activeMenu:
      meta,
      // 这不能这样写，生产环境会有问题
      // component: () => import(component),
      // component: () => {
      //   return page().then(res => {
      //     // 修改组件名，方便使用 tab 切换缓存功能，解决路由 name 和 keep-alive 中生效的页面 name 不一致问题
      //     (res as any).default.name = name;
      //     return res;
      //   });
      // name,
      path,
    }
  }
})

// console.log('localRoutes', layoutRoutes, pageRoutes)
// console.log('pageRoutes', pageRoutes)

// ----------------------------------------- 转成 map 构成树结构
const mapTree: Record<string, any> = {}
// 路由重复检查
// const nameSet = new Set()
// function checkNameUnique(name: string | undefined, item: any) {
//   if (name && nameSet.has(name)) {
//     // 路由重复检查
//     const msg = `路由 name=${name} 重复 path=${item.path}，如果代码没写错，那么就是浏览器缓存导致，可以在浏览器控制台网络中开启“禁用缓存”刷新再关闭`
//     if (import.meta.env.MODE !== 'production') {
//       // 正式环境模式不提示
//       ElNotification.error({
//         duration: 0,
//         title: '菜单配置异常',
//         message: msg,
//       })
//     }

//     console.error(msg)
//     // throw new Error(`路由 name=${name} 重复`);
//   }
//   nameSet.add(name)
// }
function deepGroup(path: string, value: any) {
  // console.log('path', path)
  const pathArr = path.split('/').filter(Boolean)
  // console.log('pathArr', pathArr)
  let currentObj = mapTree
  pathArr.forEach((item) => {
    let val = currentObj[item]
    if (!val) {
      val = currentObj[item] = {}
    }
    currentObj = val
  })
  // 将值赋值给最后一个节点
  currentObj.$ = value
}
// 转成 map 够成树结构
// layoutRoutes.forEach(item => {
//   (item as any).$isMenu = true;
//   deep(item.path, item, true);
// });

pageRoutes.forEach((item) => {
  // const { name, path } = item
  const { path } = item
  // 检查路由 name 唯一
  // checkNameUnique(name, item)
  // 根据路径切割分组
  deepGroup(path, item)
})

// console.log('mapTree', mapTree)

// ----------------------------------------- 转成菜单配置
function deepToMenuConfig(
  obj: Record<string, any>,
  list: any[],
  pPath: string = '',
) {
  const val = obj.$
  if (val?.meta?.ignoreSelfAndChildren) {
    return
  }
  let group
  if (val) {
    const path = val.path
    const routePathPart = val.meta.routePathPart ?? path.split('/').findLast(Boolean)
    list.push(val)
    list = val.children = []
    if (val.meta.isHide && pPath) {
      // 进入隐藏页面(比如详情)时高亮的菜单
      val.meta.activeMenu = pPath
    }
    delete obj.$
    // 非页节点菜单
    group = val.meta.isGroup ? val : null
    // val.path = pPath = routePathPart ? `${pPath}/${routePathPart}` : `${pPath}`
    val.path = pPath = `${pPath}/${routePathPart}`
  }
  Object.entries(obj).forEach(([_, v]) => {
    // 处理子节点信息
    deepToMenuConfig(v, list, pPath)

    // ---- 子节点信息处理完
    // 排序
    list.sort((a, b) => a.meta.order - b.meta.order)
  })

  if (group) {
    // 非隐藏的子节点，
    const noHideList = group.children.filter((e: any) => !e.meta?.isHide)
    // 重定向选择逻辑：第一个没有隐藏的叶节点 > 第一个没有隐藏的节点 > 第一个节点（就算是隐藏展示的时候也是有面包屑的）
    group.redirect = (
      noHideList.find((e: any) => e.component)
      || noHideList[0]
      || group.children[0]
    )?.path
    // 如果没有显示的子节点，那么不显示
    group.meta.isHide = !group.children.some((e: any) => !e.meta?.isHide)
  }
}
const localMenus: any[] = []
deepToMenuConfig(cloneDeep(mapTree), localMenus)
console.log('localMenus', localMenus)
// 本地菜单配置
export default localMenus

import axios from 'axios'
import { computed, ref } from 'vue'
import localRouter from '@/router/modules/localRouter'
import {
  getAllBreadcrumbList,
  getFlatMenuList,
  getShowMenuList,
} from '@/utils/route'

/** 菜单状态与菜单派生数据。 */
export function createAuthMenuModule() {
  const menuList = ref<Menu.MenuOptions[]>([])

  /** 递归处理后的面包屑导航列表。 */
  const breadcrumbListGet = computed(() => getAllBreadcrumbList(menuList.value))

  /** 扁平化菜单列表（用于动态路由注册）。 */
  const flatMenuListGet = computed(() => getFlatMenuList(menuList.value))

  /** 原始菜单列表。 */
  const menuListGet = computed(() => menuList.value)

  /** 可见菜单列表（过滤隐藏菜单）。 */
  const showMenuListGet = computed(() => getShowMenuList(menuList.value))

  /** 获取菜单列表（本地/远程）。 */
  async function getMenuList() {
    menuList.value = true
      ? localRouter
      : (await axios.get('/menu/list').then(r => r.data.data)) as any
    return menuList.value
  }

  return {
    menuList,
    breadcrumbListGet,
    flatMenuListGet,
    menuListGet,
    showMenuListGet,
    getMenuList,
  }
}

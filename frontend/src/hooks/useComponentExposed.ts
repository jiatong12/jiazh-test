import type { ComponentInstance } from 'vue'

/**
 * @author 石匀
 *
 * 类型安全的合并暴露，方便组件二次封装时保持属性、事件、插槽提示
 * @param _component 组件类型
 * @param customExposed 自定义暴露对象
 * @param _excludeKeys 排除的属性和事件（仅不提示）
 * @returns componentRef: 用于更新暴露引用的函数，绑定到二次封装的 ref 属性上， componentExposed: 合并后的类型安全对象，可直接用于 defineExpose(componentExposed) 中，实现属性、事件、插槽的类型提示
 */
export function useComponentExposed<
  ComponentType extends { new (): any },
  CustomExposed extends Record<string, any>,
  ExcludeKey extends keyof ComponentInstance<ComponentType> = never,
>(
  _component: ComponentType,
  customExposed: CustomExposed,
  _excludeKeys: readonly ExcludeKey[] = [] as const,
) {
  let instance
  function componentRef(_instance) {
    instance = _instance
    // if (vm && _instance) {
    //   vm!.exposeProxy = vm!.exposed = Object.assign({ ...customExposed }, _instance)
    // }
  }

  // 从组件实例中排除 $props 和 $emit（如果只排除 $props不管 $emit 会导致事件排除失效，$emit 排除类型又特别麻烦，直接全部清理掉） 和自定义排除属性（属性可以不过滤，只管 $props）
  type ComponentWithoutInternalKeys = Omit<ComponentInstance<ComponentType>, '$props' | '$emit' | ExcludeKey>

  // 获取 $props 类型
  type PropsType = ComponentInstance<ComponentType>['$props']

  // 从 $props 中排除指定的键
  type FilteredProps = Omit<PropsType, ExcludeKey>

  return {
    componentRef,
    // 合并结果：不包含 $props 的组件实例 + 过滤后的 props + 自定义暴露对象
    componentExposed: new Proxy({}, {
      get(_, prop) {
        // 优先返回 customExposed 中的值
        if (typeof prop === 'string' && customExposed && prop in customExposed) {
          return customExposed[prop]
        }

        // 然后尝试从实例中获取
        return instance?.[prop]
      },

      has(_, prop) {
        return (customExposed && prop in customExposed) || prop in (instance ?? {})
      },
    }) as ComponentWithoutInternalKeys & { $props?: FilteredProps } & typeof customExposed,
  } as const
}

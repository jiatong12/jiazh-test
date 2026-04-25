import type { FormInstance } from 'element-plus'
import { cloneDeep, isFunction } from 'lodash-es'
import { computed, ref, toRef, unref } from 'vue'
import { useRequest } from '@/hooks/useRequest'
// import { arrayFieldConvert } from '../utils'

interface UseFormConfig<T = any> {
  /** 数据源，可以是数组或返回Promise的函数 */
  datasource: MaybeRefOrGetter<T | (() => Promise<T>)>
  // /** 外部参数，重置搜索表单不影响的参数，如左边列表右边表格的情况 */
  // readonly externalParams?: () => Record<string, any>
  // /** 默认搜索表单数据，如想在搜索表单初始时或重置搜索时显示默认值 */
  // readonly defaultSearchFormState?: () => Record<string, any>
  /** 是否立即加载数据 */
  readonly immediate?: MaybeRefOrGetter<boolean>
  readonly formRef: MaybeRefOrGetter<FormInstance>
  // readonly arrayFields?: MaybeRefOrGetter<string[]>
}

/**
 * 表单数据管理Hook
 * @param config 配置项
 */
export function useForm(config: UseFormConfig) {
  // 通过 computed 获取配置值，保持响应性
  const datasource = computed(() => toValue(config.datasource))
  const immediate = computed(() => toValue(config.immediate) ?? true)
  const formRef = computed(() => toValue(config.formRef))
  // const arrayFieldMap = computed(() => toValue(config.arrayFields) ?? [])

  // 归一化数据获取方法
  const getData = computed(() => isFunction(datasource.value) ? datasource.value : () => Promise.resolve(datasource.value))

  // 调用封装
  const request = useRequest(
    () => getData.value(),
    () => isFunction(datasource.value) ? {} : datasource.value,
  )

  const replacer = (_key, value) => {
    // 过滤掉为 null 和 空字符的参数
    if (value === undefined || value === null || value === '') {
      return undefined
    }
    else {
      return value
    }
  }

  const initFormState = ref<any>(cloneDeep(request.result))
  // const model = toRef(api, 'result')
  const dataState = reactive<{ model: Record<string, any> }>({ model: {} })

  watch(() => datasource.value, () => {
    dataState.model = isFunction(datasource.value) ? toRef(request, 'result') : datasource
  }, { immediate: true })

  /**
   * 加载数据
   */
  function loadData() {
    request.send().then((result) => {
      initFormState.value = cloneDeep(result)
      // 加载完数据清理校验
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    })
  }
  /**
   * 重置为初始数据
   */
  function reset() {
    dataState.model = cloneDeep(initFormState.value)
  }

  // /**
  //  * 刷新当前数据为初始数据，新增或修改成功后调用
  //  */
  // function refreshInitialData() {
  //   initFormState.value = cloneDeep(unref(dataState.model))
  // }

  const initFormStateStr = computed(() => JSON.stringify(unref(initFormState), replacer))
  const currentFormStateStr = computed(() => JSON.stringify(unref(dataState.model), replacer))

  /**
   * 表单是否有改变
   */
  const hasChange = computed(() => {
    // 表单是否有改变
    return currentFormStateStr.value !== initFormStateStr.value
  })

  // 是否立即加载数据
  if (immediate.value) {
    loadData()
  }

  return {
    /** 数据加载状态 */
    immediateLoading: toRef(request, 'immediateLoading'),
    /** 延迟加载状态 */
    delayLoading: toRef(request, 'delayLoading'),
    loading: toRef(request, 'loading'),
    /** 表单数据 */
    model: toRef(dataState, 'model'),
    /** 加载数据 */
    loadData,
    /** 重置 */
    reset,
    /** 是否存在改变 */
    hasChange,
    /** 刷新当前数据为初始数据，新增或修改成功后调用 */
    // refreshInitialData,
  }
}

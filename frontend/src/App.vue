<script setup lang="ts">
// import type { LanguageType } from './store/modules/global'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed } from 'vue'
// import { useI18n } from 'vue-i18n'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/store/modules/global'
// import { unmountGlobalLoading } from './hooks/unmountGlobalLoading'
// import { useAuthStore } from './store/modules/auth'
import { getBrowserLang } from './utils'

const globalStore = useGlobalStore()

// init theme
const { initTheme } = useTheme()
initTheme()

// // 尝试刷新字典、用户信息、权限
// useAuthStore().tryRefreshInfo().finally(() => {
//   // 移除并销毁loading
//   unmountGlobalLoading()
// })

// // init language
// const i18n = useI18n()
// onMounted(() => {
//   const language = globalStore.language ?? getBrowserLang()
//   i18n.locale.value = language
//   globalStore.language = language as LanguageType
// })

// element language
const locale = computed(() => {
  if (globalStore.language === 'zh') { return zhCn }
  if (globalStore.language === 'en') { return en }
  return getBrowserLang() === 'zh' ? zhCn : en
})

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize)

// element button config
const buttonConfig = { autoInsertSpace: false }

// type ExtractPathParams<TPath extends string> =
//   TPath extends `${infer _Prefix}/{${infer Param}}${infer Rest}`
//     ? { [K in Param]: string } & ExtractPathParams<Rest> // 递归处理剩余部分
//     : {}

// // 测试
// type Params = ExtractPathParams<'/user/{id}/post/{postId}'>
// { id: string; postId: string }

// // 通用版（支持 `:param` 和递归）
// type ExtractPathParams<TPath extends string> =
//   TPath extends `${infer _Prefix}:${infer Param}/${infer Rest}`
//     ? { [K in Param]: string } & ExtractPathParams<`/${Rest}`>
//     : TPath extends `${infer _Prefix}:${infer Param}`
//       ? { [K in Param]: string }
//       : {}

// // 使用示例
// type Params = ExtractPathParams<'/user/:id/post/:postId/:idd/:aaa'>
// const a: Params
// // { id: string; postId: string }

// // { postId: string; commentId: string }

// type ParamsConfig<TParams> =
//   keyof TParams extends never
//     ? { params?: never } // 无路径参数时可选
//     : { params: TParams } // 有路径参数时必填
// function get<
//   TPath extends string,
//   TParams extends ExtractPathParams<TPath>,
// >(
//   url: TPath,
//   ...[config]: ParamsConfig<TParams> extends { params?: never }
//     ? [] | [config: { params?: never }] // 允许完全省略或传空对象
//     : [config: { params: TParams }] // 必须传完整参数
//   // config: {
//   //   params: TParams
//   // },
// ) {
//   // 实现路径参数替换
//   const resolvedUrl = (
//     config?.params
//       ? Object.entries(config.params).reduce<string>(
//           (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
//           url,
//         )
//       : url
//   )

//   return null
// }

// get('/user/:id/post/:postId/:idd/:aaa', { params: { id: '', aaa: '', postId: '', idd: '' } })
// get('/user/list')
</script>

<template>
  <ElConfigProvider :locale="locale" :size="assemblySize" :button="buttonConfig" :z-index="2000">
    <RouterView />
  </ElConfigProvider>
</template>

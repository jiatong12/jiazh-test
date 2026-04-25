import { defineStore } from 'pinia'
import { toRef } from 'vue'
import { useUserStore } from '../user'
import { createAuthLoginModule } from './auth-login'
import { createAuthMenuModule } from './auth-menu'
import { createAuthPrivModule } from './auth-priv'
import { createAuthSystemModule } from './auth-system'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const priv = toRef(userStore, 'priv')
  const loginModule = createAuthLoginModule()
  const privModule = createAuthPrivModule({ userStore, priv })
  const menuModule = createAuthMenuModule()
  const systemModule = createAuthSystemModule()

  return {
    ...loginModule,
    ...privModule,
    ...menuModule,
    ...systemModule,
  }
}, {
  persist: {
    pick: ['isLogin'], // 持久化字段
  },
})

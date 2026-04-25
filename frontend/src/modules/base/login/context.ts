import type { Mode } from './types'
import { ref } from 'vue'
import { useContext } from '@/hooks/useContext'

export const { setupStore, useStore } = useContext('login', () => {
  // 当前页面
  const currentPage = ref<Mode>('login')
  function swatchPage(mode: Mode) { currentPage.value = mode }
  function swatchLogin() { swatchPage('login') }
  function swatchPhone() { swatchPage('phone') }
  function swatchQrCode() { swatchPage('qrcode') }
  function swatchRegister() { swatchPage('register') }
  function swatchForget() { swatchPage('forget') }

  return {
    currentPage,
    swatchPage,
    swatchLogin,
    swatchPhone,
    swatchQrCode,
    swatchRegister,
    swatchForget,
  }
})

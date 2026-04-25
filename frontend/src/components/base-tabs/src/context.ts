import { useContext } from '@/hooks/useContext'

export const { setupStore, useStore } = useContext('base-tabs', (nameList: Ref<(string | number)[]>, lazy: Ref<boolean>) => {
  return {
    nameList,
    lazy,
  }
})

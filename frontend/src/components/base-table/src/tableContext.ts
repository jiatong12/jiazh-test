import { useContext } from '@/hooks/useContext'

export const { setupStore, useStore } = useContext('base-table', (empty: Ref<string | undefined>) => {
  return {
    empty,
  }
})

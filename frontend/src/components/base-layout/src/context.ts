import type { Cols, Num } from './types'
import { useContext } from '@/hooks/useContext'

export const { setupStore, useStore } = useContext('base-row', (col: Ref<Num>, cols: Ref<Cols | undefined>) => {
  return {
    parentCol: col,
    parentCols: cols,
  }
})

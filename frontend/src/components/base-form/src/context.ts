import type { FormInstance } from 'element-plus'
import type { ShallowRef } from 'vue'
import { useContext } from '@/hooks/useContext'

export const { setupStore, useStore } = useContext('base-form', (model: Ref<Record<string, any>>, formRef: Readonly<ShallowRef<FormInstance>>, loading: Ref<boolean>) => {
  return {
    model,
    formRef,
    loading,
  }
})

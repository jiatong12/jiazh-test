import type { FormInstance } from 'element-plus'
import type { ShallowRef } from 'vue'
import { useContext } from '@/hooks/useContext'

export const { setupStore, useStore } = useContext('base-table-search-form', (
  modal: Ref<Record<string, any>>,
  formRef: Readonly<ShallowRef<FormInstance>>,
  loading: Ref<boolean>,
  handleSearch: Ref<() => void>,
) => {
  return {
    modal,
    formRef,
    loading,

    handleSearch,
  }
})

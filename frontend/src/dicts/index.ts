import axios from 'axios'
import dictConfig from '@/config/dict.config'
import { useDictContextHolder } from './useDictContextHolder'

export type * from './types'

// 字典配置项 code
export type DictCode = keyof typeof dictConfig

// export const dictContextHolder = useDictContextHolder({

export const $$dicts = useDictContextHolder({
  dictConfig,
  getDictByCode: (code) => {
    return axios.get(`/ui/codes/${code}/items`).then((r) => {
      const list = r.data?.data ?? []
      return list.map(e => ({ label: e.codeName, value: e.codeValue, order: e.codeOrder }))
    })
  },
})

// export const $$dicts = dictContextHolder

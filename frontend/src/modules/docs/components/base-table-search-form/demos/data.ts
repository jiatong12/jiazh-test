export interface SearchFormDemoState {
  keyword: string
  category: string
  shelfStatus: number | ''
  startDate: string
  endDate: string
}

export const projectCategoryDict = [
  { label: '礼盒商城', value: 'gift' },
  { label: '设备台账', value: 'device' },
  { label: '办公物资', value: 'office' },
  { label: '企业服务', value: 'service' },
]

export const projectShelfStatusDict = [
  { label: '已发布', value: 1, color: 'success' },
  { label: '已下线', value: 0, color: 'info' },
]

export function createSearchFormDemoState(): SearchFormDemoState {
  return {
    keyword: '',
    category: '',
    shelfStatus: '',
    startDate: '',
    endDate: '',
  }
}

export function createFilledSearchFormDemoState(): SearchFormDemoState {
  return {
    keyword: '商品',
    category: 'gift',
    shelfStatus: 1,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  }
}

export interface BaseTableDemoItem {
  id: string
  name: string
  category: string
  owner: string
  shelfStatus: number
  updatedAt: string
}

interface BaseTableDemoQuery {
  keyword?: string
  category?: string
  shelfStatus?: string | number
  pageIndex?: number
  pageSize?: number
}

export const projectCategoryDict = [
  { label: '礼盒商城', value: 'gift', color: 'danger' },
  { label: '设备台账', value: 'device', color: 'primary' },
  { label: '办公物资', value: 'office', color: 'warning' },
  { label: '企业服务', value: 'service', color: 'success' },
]

export const projectShelfStatusDict = [
  { label: '已发布', value: 1, color: 'success' },
  { label: '已下线', value: 0, color: 'info' },
]

export const baseTableRows: BaseTableDemoItem[] = [
  { id: '1', name: '商品管理', category: 'gift', owner: '交付中台', shelfStatus: 1, updatedAt: '2026-03-18 10:20' },
  { id: '2', name: '设备台账', category: 'device', owner: '运维平台组', shelfStatus: 1, updatedAt: '2026-03-18 09:40' },
  { id: '3', name: '办公物资', category: 'office', owner: '行政支持组', shelfStatus: 0, updatedAt: '2026-03-17 18:30' },
  { id: '4', name: '企业服务目录', category: 'service', owner: '客户成功组', shelfStatus: 1, updatedAt: '2026-03-17 15:10' },
  { id: '5', name: '礼盒活动专区', category: 'gift', owner: '品牌运营组', shelfStatus: 1, updatedAt: '2026-03-16 14:20' },
  { id: '6', name: '智能前台', category: 'device', owner: '空间数字化组', shelfStatus: 0, updatedAt: '2026-03-16 09:15' },
]

export async function getBaseTableDemoList(params: BaseTableDemoQuery = {}) {
  const keyword = `${params.keyword ?? ''}`.trim()
  const category = `${params.category ?? ''}`.trim()
  const shelfStatus = params.shelfStatus === '' || params.shelfStatus === undefined || params.shelfStatus === null
    ? ''
    : Number(params.shelfStatus)

  const filteredRows = baseTableRows.filter((item) => {
    const matchKeyword = !keyword || [item.name, item.owner].some(text => text.includes(keyword))
    const matchCategory = !category || item.category === category
    const matchShelfStatus = shelfStatus === '' || item.shelfStatus === shelfStatus

    return matchKeyword && matchCategory && matchShelfStatus
  })

  const pageIndex = Number(params.pageIndex ?? 0)
  const pageSize = Number(params.pageSize ?? 10)
  const start = pageIndex * pageSize

  return Promise.resolve({
    data: filteredRows.slice(start, start + pageSize),
    total: filteredRows.length,
  })
}

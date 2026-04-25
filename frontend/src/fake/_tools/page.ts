import type { ReqPage, ResPage } from '@/types/service'

type PageRequest = Partial<Pick<ReqPage, 'pageIndex' | 'pageSize'>>

function normalizePositiveInt(value: unknown, fallback: number): number {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  const intValue = Math.trunc(numericValue)
  return intValue > 0 ? intValue : fallback
}

export function paginate<T>(list: readonly T[], pageRequest: PageRequest): ResPage<T> {
  const total = list.length
  const pageIndex = normalizePositiveInt(pageRequest.pageIndex, 0)
  const pageSize = normalizePositiveInt(pageRequest.pageSize, total || 10)
  const start = pageIndex * pageSize
  const end = start + pageSize

  return {
    data: list.slice(start, end),
    pageIndex,
    pageSize,
    total,
  }
}

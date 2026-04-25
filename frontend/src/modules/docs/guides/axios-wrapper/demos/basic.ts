import axios from 'axios'

interface QueryParams {
  keyword?: string
  pageIndex?: number
  pageSize?: number
}

export async function fetchProjectList(params: QueryParams) {
  const response = await axios.get('/ui/projects', {
    params,
    showDefaultError: false,
  })

  // 项目里的 axios 拦截器不会自动改写返回值，仍然返回完整 response。
  const rows = response.data.data?.data ?? []
  const total = response.data.data?.total ?? 0

  return {
    rows,
    total,
  }
}

export async function saveProject(payload: Record<string, any>) {
  const response = await axios.post('/ui/projects', payload)

  // status === 1 时拦截器才会当作业务成功。
  return response.data
}

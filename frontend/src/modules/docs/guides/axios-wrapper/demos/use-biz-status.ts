import axios from 'axios'
import { ElMessageBox } from 'element-plus'

export async function loginByAccount(payload: Record<string, any>) {
  const response = await axios.post('/ui/login', payload, {
    showDefaultError: false,
    useBizStatus: true,
  })

  const status = response.data.status

  if (status === 1) {
    return response.data
  }

  if (status === 10000) {
    await ElMessageBox.confirm(
      '该用户当前处于登录中，是否强制注销并继续登录？',
      '强制注销确认',
      { type: 'warning' },
    )
    return null
  }

  throw new Error(response.data.message || '登录失败')
}

/**
 * 文件下载hook函数
 * @param params - 下载参数对象
 * @param params.api - 获取文件数据的异步API函数
 * @param params.fileName - 下载文件的名称
 * @param params.isNotify - 是否显示下载提示通知，默认为true
 * @returns Promise<void>
 */
export async function useDownload(params: {
  api: () => Promise<any>
  fileName: string
  isNotify?: boolean
}) {
  const { api, fileName, isNotify = true } = params

  // 显示下载提示通知
  if (isNotify) {
    ElNotification({
      title: '温馨提示',
      message: '如果数据庞大会导致下载缓慢哦，请您耐心等待！',
      type: 'info',
      duration: 3000,
    })
  }
  try {
    // 调用API获取文件数据并创建Blob对象
    const res = await api()
    const blob = new Blob([res])
    // 兼容 edge 不支持 createObjectURL 方法
    if ('msSaveOrOpenBlob' in navigator) { return window.navigator.msSaveOrOpenBlob(blob, fileName) }

    // 创建临时下载链接并触发下载
    const blobUrl = window.URL.createObjectURL(blob)
    const exportFile = document.createElement('a')
    exportFile.style.display = 'none'
    exportFile.download = fileName
    exportFile.href = blobUrl
    document.body.appendChild(exportFile)
    exportFile.click()
    // 去除下载对 url 的影响
    document.body.removeChild(exportFile)
    window.URL.revokeObjectURL(blobUrl)
  }
  catch (error) {
    console.log(error)
  }
}

import axios from 'axios'
import { ElMessage } from 'element-plus'
import Progress from './util.progress.ts'

const util = {

  showProgress: (taskID: string, title: string, successMessage?: string) => {
    return Progress({ taskID, title, successMessage })
  },

  showMessage: (message: string, type: 'error' | 'primary' | 'success' | 'warning' | 'info' = 'info') => {
    ElMessage({
      showClose: true,
      message,
      type,
    })
  },

  showResponseMessage: (data: any) => {
    const message = (data.message || '').replace(/\d\. (Error|Warning): /g, '')
    if (data.status === 1) {
      ElMessage({
        showClose: true,
        duration: 2000,
        message: message || '操作成功！',
        type: 'success',
      })
    }
    // ElMessageBox({
    //   title: '提示',
    //   type: 'error',
    //   message: message || '操作失败！',
    // })
  },

  // 获取树的指定属性的值节点
  findTreeNode: (tree: any[], key: string, val: any, childName: string) => {
    let result = null

    for (let i = 0; i < tree.length; i++) {
      if (tree[i][key] === val) {
        result = tree[i]
        break
      }

      if (tree[i][childName] && tree[i][childName].length) {
        const tmp = util.findTreeNode(tree[i][childName], key, val, childName)

        if (tmp) {
          result = tmp
          break
        }
      }
    }

    return result as any
  },

  // 获取树的指定属性的值节点的父节点
  findTreeParentNode: (tree: any[], key: string, val: any, childName: string) => {
    let result = null
    for (let i = 0; i < tree.length; i++) {
      if (tree[i][key] === val) {
        result = tree[i]
        break
      }
      if (!!tree[i][childName] && !!tree[i][childName].length) {
        const tmp = util.findTreeParentNode(tree[i][childName], key, val, childName)

        if (tmp) {
          if (tmp[key] === val) {
            result = tree[i]
          }
          else {
            result = tmp
          }
          break
        }
      }
    }

    return result as any
  },

  // 下载文件
  downloadFile: (fileURL: string, fileName: string) => {
    return axios
      .get(fileURL, {
        responseType: 'blob',
      })
      .then(res => res.data)
      .then((blob) => {
        const link = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
      })
  },

}

export default util

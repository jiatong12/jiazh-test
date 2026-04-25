import type { UploadProps, UploadRequestOptions } from 'element-plus'
import { useUploadFeedback } from './useUploadFeedback'

interface UseImageUploadOptions {
  getFileSize: () => number
  getFileType: () => FileType.ImageMimeType[]
}

export function useImageUpload(options: UseImageUploadOptions) {
  const { notifyWarning, notifySuccess, notifyError, notifyMissingApi: notifyMissingApiCommon } = useUploadFeedback()

  function getFileTypeByName(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (!ext) {
      return '' as FileType.ImageMimeType | ''
    }

    const imageTypeMap: Record<string, FileType.ImageMimeType> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      apng: 'image/apng',
      bmp: 'image/bmp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      tif: 'image/tiff',
      tiff: 'image/tiff',
      ico: 'image/x-icon',
    }

    return imageTypeMap[ext] || ''
  }

  const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const fileSize = options.getFileSize()
    const fileType = options.getFileType()
    const sizeValid = rawFile.size / 1024 / 1024 <= fileSize
    const rawType = rawFile.type || getFileTypeByName(rawFile.name)
    const typeValid = fileType.includes(rawType as FileType.ImageMimeType)

    if (!typeValid) {
      notifyWarning('上传图片不符合所需的格式！')
    }
    if (!sizeValid) {
      notifyWarning(`上传图片大小不能超过 ${fileSize}M！`)
    }
    return typeValid && sizeValid
  }

  function notifyUploadSuccess() {
    notifySuccess('图片上传成功！')
  }

  function notifyUploadError() {
    notifyError('图片上传失败，请您重新上传！')
  }

  function notifyMissingApi(options: UploadRequestOptions, message = '请先配置图片上传接口 api') {
    notifyMissingApiCommon(options, message)
  }

  function notifyMissingFileUrl(options: UploadRequestOptions, message = '上传成功但未返回图片地址') {
    notifyWarning(message)
    options.onError(new Error(message) as any)
  }

  return {
    beforeUpload,
    notifyUploadSuccess,
    notifyUploadError,
    notifyMissingApi,
    notifyMissingFileUrl,
  }
}

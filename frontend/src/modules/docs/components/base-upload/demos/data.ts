import type { UploadRequestOptions } from 'element-plus'

const imagePool = [
  '/branding/logo.svg',
  '/branding/login-illustration.svg',
  '/branding/login-bg.svg',
]

const fileUrlMap: Record<string, string> = {
  jpg: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  png: 'https://i.imgtg.com/2023/01/16/QRBHS.jpg',
  mp4: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4',
  pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  doc: 'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
  docx: 'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.docx',
}

let imageIndex = 0

function getNextImageUrl() {
  const url = imagePool[imageIndex % imagePool.length] || imagePool[0] || ''
  imageIndex += 1
  return url
}

function getFileExtension(fileName?: string) {
  if (!fileName) {
    return ''
  }
  return fileName.split('.').pop()?.toLowerCase() || ''
}

export function uploadImageApi() {
  return Promise.resolve({
    fileUrl: getNextImageUrl(),
  })
}

export function uploadFileApi(options: UploadRequestOptions) {
  const ext = getFileExtension(options.file?.name)
  return Promise.resolve({
    id: `${Date.now()}`,
    fileUrl: fileUrlMap[ext] || fileUrlMap.jpg,
  })
}

type ExternalTarget = '_blank' | '_self'

/**
 * 统一外链打开，默认开启 noopener/noreferrer，避免新标签页获取 opener。
 */
export function openExternal(url: string, target: ExternalTarget = '_blank') {
  if (!url) {
    return
  }

  if (target === '_blank') {
    window.open(url, target, 'noopener,noreferrer')
    return
  }

  window.open(url, target)
}

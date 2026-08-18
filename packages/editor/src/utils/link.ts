/** 简单 URL 清理，仅允许白名单协议 */
export function sanitizeUrl(inputUrl: string, baseUrl: string): string | null {
  try {
    const url = new URL(inputUrl, baseUrl);
    const allowed = ['http:', 'https:', 'ftp:', 'mailto:', 'tel:', 'sms:'];
    if (allowed.includes(url.protocol)) {
      return url.href;
    }
  } catch {
    // 无效 URL
  }
  return null;
}

/** 读取 <a> 元素的 href，过滤空值 */
export function getHrefFromAnchor(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute('href');
  return href && href.trim() ? href : null;
}

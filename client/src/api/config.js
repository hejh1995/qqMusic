export const commonParams = {
  // 使用jsonp的时候的通信参数，与抓取的网站相同
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
  // callback的名字，与抓取网站的相同
}

export const ERR_OK = 0
// 很多网站都是当返回正确时，返回值的code为0

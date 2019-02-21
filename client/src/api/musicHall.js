import jsonp from './jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getScrollImg() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    // 自有参数
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
export function getrecommed() {
  // 因为后台的数据获取要特定的headers，所以用后端代理获取数据。后端代理是一种欺骗行为。
  // 在webpack.dev.conf.js中有设置
  const url = '/api/getRecommend'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

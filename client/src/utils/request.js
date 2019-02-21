import axios from 'axios'
import qs from 'qs' // 解决跨域问题的时候，post请求会变成options
// 保证后台返回的数据中文不乱码
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// console.log('baseURL', process.env.BASE_API)
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000
})
service.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    console.log('request-error', error)
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => response.data,
  error => {
    console.log('response-err', error)
    return Promise.reject(error)
  }
)
export default service

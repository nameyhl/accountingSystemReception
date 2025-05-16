import axios from 'axios'

import userStore from '@/stores/models/user.js'
const user = userStore()
// 创建可一个新的axios对象
const request = axios.create({
  baseURL: 'http://127.0.0.1:3000/', // 后端的接口地址  ip:port
  timeout: 30000,
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    // let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    // config.headers['token'] = 'token'  // 设置请求头
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : null
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = token
    }

    // 处理请求地址为 /api/accounting的接口
    if (config.url.includes('api/accounting')) {
      if (config.method === 'get') {
        // 给请求参数添加一个属性
        config.params = {
          ...config.params,
          user_id: user.getUser().uid,
        }
        return config
      }
    }
    return config
  },
  (error) => {
    console.error('request error: ' + error) // for debug
    return Promise.reject(error)
  },
)

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  (response) => {
    let res = response.data

    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    return res
  },
  (error) => {
    console.error('response error: ' + error) // for debug
    return Promise.reject(error)
  },
)

export default request

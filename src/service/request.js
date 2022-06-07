import axios from 'axios'
import { ElMessage } from 'element-plus'

export const request = (config) => {
  const service = axios.create({
    headers: config.headers,
    baseURL: process.env.NODE_ENV === 'production' ? 'https://nocodenolife.net/ann/' : '/api',
    timeout: 30000,

    transformRequest: [
      (data = config.params) => {
        const tempData = getJwtData(JSON.stringify(data))
        return tempData.data
      }
    ]
  })

  const getJwtData = (data) => {
    // 如果jwt的key中含有空字串或者undefined，刪除該條jwt
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const val = data[key]
        if (val === '' || val === undefined) {
          delete data[key]
        }
      }
    }
    const jwt = encodeURIComponent(btoa(encodeURIComponent(data)))
    return { data: jwt }
  }

  //設置 request 攔截器
  service.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  //設置 response 攔截器
  service.interceptors.response.use(
    (response) => {
      if (response.status === 200) {
        console.log('res', response)
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
      }
    },
    (error) => {
      if (error.response.status !== 200) {
        ElMessage({
          showClose: true,
          message: '輸入有誤，請重新輸入！',
          type: 'error'
        })
      }
    }
  )
  return service(config)
}

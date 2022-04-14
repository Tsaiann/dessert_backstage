import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.baseURL = 'https://nocodenolife/ann/rawtest'
axios.defaults.timeout = 30000

//設置 request 攔截器
axios.interceptors.request.use((config) =>{
  const token = JSON.parse(Cookies.get('userInfo').token)
  token && (config.headers.Authorization = token)
  return config
})

//設置 response 攔截器
axios.interceptors.response.use((response) =>{
    if(response.status === 200){
      return Promise.resolve(response)
    }else{
      return Promise.reject(response)
    }
  }
)

//封裝api
const api = axios.create({
  headers: { 'Content-Type': 'raw' },

  get: (url, params) => {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  post: (url, params) => {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  put: (url, params) => {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },


  delete: (url, params) => {
    return new Promise((resolve, reject) => {
      axios.delete(url)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
})

export default api
import axios from 'axios'
import Cookies from 'js-cookie'

//axios.defaults.baseURL = 'https://nocodenolife.net/ann/postman'

//設置 request 攔截器
axios.interceptors.request.use((config) =>{
  const token = JSON.parse(Cookies.get('userInfo').token)
  token && (config.headers.Authorization = 'Bearer' + token)
  return config
},(error)=>{
  return Promise.reject(error)
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
export const service = axios.create({
  headers: { 'Content-Type': 'raw' },
  timeout: 60000,
  baseURL:'https://nocodenolife.net/ann/postman',
  
  transformRequest: [(data) => {
    let ret = ''
    const tempData = getJwtData(data)
    for (const item in tempData) {
      ret += encodeURIComponent(item) + '=' + encodeURIComponent(tempData[item]) + '&';
    }
    return ret
  }]
})

const getJwtData = (data) => {
  // 如果jwt的key中含有空字串或者undefined，刪除該條jwt
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const val = data[key]
      if (val === '' || val === undefined){
        delete data[key]
      }
    }
  }

  const userInfo = Cookies.get('userInfo')
  let token = ''
  if (userInfo) {
    token = JSON.parse(userInfo).token
  }

  const jwt = token + '.' + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(data))))
  return {data:jwt}
}

export const api = {
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
      axios.post(url, JSON.stringify(params))
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
}

export default { api, service }
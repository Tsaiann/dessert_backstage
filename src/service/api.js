import axios from 'axios'
import Cookies from 'js-cookie'


export const request = (config) =>{
  const service = axios.create({
    headers: { 'Content-Type': 'text/plain' },
    baseURL:'https://nocodenolife.net/ann/',
    timeout: 60000,
    
    transformRequest: [(data) => {
      const tempData = getJwtData(data)
      return tempData
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
    const jwt = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(data))))
    return { data: jwt }
  }
  
  //設置 request 攔截器
  service.interceptors.request.use((config) =>{
    return config
  },(error)=>{
    return Promise.reject(error)
  })

  //設置 response 攔截器
  service.interceptors.response.use((response) =>{
    if(response.status === 200){
      return Promise.resolve(response)
    }else{
      return Promise.reject(response)
    }
  }),(error)=>{
    error.message ='error!'
  }

  return service(config)
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
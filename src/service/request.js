import axios from 'axios'


export const request = (config) =>{
  const service = axios.create({
    headers: config.headers,
    baseURL: 'https://nocodenolife.net/ann/' ,
    timeout: 30000,
    
    transformRequest: [(data) => {
      let ret = ''
      const tempData = getJwtData(data)
      for (const item in tempData) {
        ret += encodeURIComponent(item) + '=' + encodeURIComponent(tempData[item]) + '&'
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
      console.log('res', response)
      return Promise.resolve(response)
    }else{
      return Promise.reject(response)
    }
  }),(error)=>{
    error.message ='error!'
  }

  return service(config)
}

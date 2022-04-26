import request from '@/api' 

export const getData = (data) =>
  request({
    url: 'https://nocodenolife.net/ann/postman',
    method: 'post',
    data,
  })

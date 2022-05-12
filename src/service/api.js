import { request } from '@/service/request'

// 取得token
export const getToken = () =>{
  return localStorage.getItem('token')
}

// 獲得登入OTP碼 
export const getOtp = (params) =>
  request({
    url: '/member/otp',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    params
  })
// login
export const login = (params) =>
  request({
    url: '/member/login',
    method: 'post',
    headers: { 
      'Content-Type': 'text/plain', 
    },
    params
  })
// getProductList
export const productList = (params) =>
  request({
    url: '/admin/goods/r',
    method: 'post',
    headers: { 
      'token': getToken(), 
      'Content-Type': 'application/json'
     },
    params
  })

// addProduct
export const addProduct = (params) =>
  request({
    url: '/admin/goods/c',
    method: 'post',
    headers: { 
      'token': getToken(), 
      'Content-Type': 'application/json'
     },
    params
  })

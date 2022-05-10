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
// dashboard
export const getDashboard = (params) =>
  request({
    url: '/admin/dashboard',
    method: 'post',
    headers: { 
      'token': getToken(), 
      'Content-Type': 'application/json'
     },
    params
  })

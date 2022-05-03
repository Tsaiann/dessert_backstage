//管理所有api的地方
import { request } from '@/service/request'

// 獲得登入OTP碼 
export const getOtp = (params) =>
  request({
    url: '/member/otp',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    params
  })
// login
export const login = (data) =>
  request({
    url:'/member/login',
    method:'post',
    headers:{ 'Content-Type': 'text/plain' },
    data : data
  })
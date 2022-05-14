import { request } from '@/service/request'

// 取得token
export const getToken = () => {
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
      'Content-Type': 'text/plain'
    },
    params
  })
// getProductList
export const productList = (params) =>
  request({
    url: '/admin/goods/r',
    method: 'post',
    headers: {
      token: getToken(),
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
      token: getToken(),
      'Content-Type': 'application/json'
    },
    params
  })

// updateProduct
export const updateProduct = (params) =>
  request({
    url: '/admin/goods/u',
    method: 'put',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    params
  })

// deleteProduct
export const delProduct = (params) =>
  request({
    url: '/admin/goods/d?ID=8',
    method: 'delete',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

// getGoodsTypeList
export const goodsTypeList = (params) =>
  request({
    url: '/admin/goodstype/r',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

// addGoodsType
export const addGoodType = (params) =>
  request({
    url: '/admin/goodstype/c',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

// updateGoodsType
export const updateGoodsType = (params) =>
  request({
    url: '/admin/goodstype/u',
    method: 'put',
    headers: {
      token: getToken()
    },
    params
  })

// deleteGoodsType
export const delGoodsType = (params) =>
  request({
    url: '/admin/goodstype/d',
    method: 'delete',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

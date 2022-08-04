import { request } from '@/service/request'

// 取得token
export const getToken = () => {
  return JSON.parse(localStorage.getItem('userInfo')).token
}

// 獲得登入OTP碼
export const getOtp = (params) =>
  request({
    url: '/admin/otp',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    params
  })
// login
export const login = (params) =>
  request({
    url: '/admin/login',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: params
  })
// 取得所有商品資料
export const productList = (params) =>
  request({
    url: '/admin/goods/r',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: params
  })

// 新增商品資料
export const addGoodsList = (data) =>
  request({
    url: '/admin/goods/c',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })

// 修改商品資料
export const updateProduct = (data) =>
  request({
    url: '/admin/goods/u',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })

// 刪除商品資料
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
// 刪除商品規格
export const delSpecs = (params) =>
  request({
    url: '/admin/goods/specs/d',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    params
  })

// 獲得商品類別資料
export const goodsTypeList = (params) =>
  request({
    url: '/admin/goods/goodstype/r',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

// 新增商品類別
export const addGoodType = (params) =>
  request({
    url: '/admin/goods/goodstype/c',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

// 更新商品類別資料
export const updateGoodsType = (params) =>
  request({
    url: '/admin/goods/goodstype/u',
    method: 'post',
    headers: {
      token: getToken()
    },
    params
  })

// 刪除商品類別
export const delGoodType = (params) =>
  request({
    url: '/admin/goods/goodstype/d',
    method: 'delete',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })

// 刪除商品照片
export const delImg = (data) =>
  request({
    url: '/admin/image/d',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })

// 取得管理權限表
export const getAdminPermissions = (data) =>
  request({
    url: '/admin/permission/r',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })
// 更新管理權限表
export const updateAdminPermissions = (data) =>
  request({
    url: '/admin/permission/u',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })
//取得所有管理者列表
export const getAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/r',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    data: data
  })
//新增管理員
export const addAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/c',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    data: data
  })
//更新管理員資訊
export const updateAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/u',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data: data
  })
//刪除管理員
export const removeAdminMembers = (params) =>
  request({
    url: '/admin/member/backstage/d',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'text/plain'
    },
    params
  })
//刪除管理員
export const getImg = (data) =>
  request({
    url: '/admin/image/r',
    method: 'post',
    headers: {
      token: getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })

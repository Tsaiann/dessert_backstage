import { ElMessage, ElMessageBox } from 'element-plus'

export const callApi = async (api, data, cb = () => void 0) => {
  const res = await api(data)
  if (res.data.Code === 200) {
    console.log('api:', res)
    cb(res)
  } else {
    ElMessage({
      type: 'error',
      message: 'API ERROR!'
    })
  }
}

export const deleteMessage = (cb = () => void 0) => {
  ElMessageBox.confirm('確定要刪除資料？', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then((res) => {
      cb(res)
      ElMessage({
        type: 'success',
        message: '已刪除資料'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消刪除'
      })
    })
}

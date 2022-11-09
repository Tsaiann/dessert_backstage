import { ElMessage, ElMessageBox } from 'element-plus'

export const deleteMessage = (detail, success, confirm, cb = () => void 0) => {
  ElMessageBox.confirm(detail, '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then((res) => {
      cb(res)
      ElMessage({
        type: 'success',
        message: success
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: confirm
      })
    })
}

export const confirmMessage = (cb = () => void 0) => {
  ElMessageBox.alert('商品規格數量有誤，請重新填寫！', '錯誤', {
    confirmButtonText: '確定',
    type: 'warning'
  }).then((res) => {
    cb(res)
  })
}

<template>
  <div class="guide_line row horizontal space_between">
    <p>{{ pageName }}</p>
    <div data-space-right="1rem">
      <el-button type="info" plain size="small">變更密碼</el-button>
      <el-button type="info" plain size="small" @click="logout">登出</el-button>
    </div>
  </div>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'GuideLine',
  props: {
    msg: String
  },
  setup(props) {
    const pageName = props.msg
    const store = useStore()
    const router = useRouter()
    const test = () => {
      console.log(userStore)
    }
    const logout = () => {
      ElMessageBox.confirm('確定要登出嗎？', '提示訊息', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          store.commit('userModules/LOGOUT', '')
          router.push({ name: 'Login' })
          ElMessage({
            type: 'success',
            message: '已成功登出！'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消'
          })
        })
    }
    return {
      pageName,
      logout,
      test
    }
  }
}
</script>

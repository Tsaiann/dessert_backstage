<template>
  <div class="guide row horizontal space_between">
    <p>{{ pageName }}</p>
    <div data-space-right="1rem">
      <el-button type="info" plain size="small" @click="logout">登出</el-button>
    </div>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { deleteMessage } from '@/utils/callApi'

export default {
  name: 'GuideLine',
  props: {
    msg: String
  },
  setup(props) {
    const pageName = props.msg
    const store = useStore()
    const router = useRouter()

    //登入
    const logout = () => {
      deleteMessage('確定要登出嗎？', '已成功登出！', '已取消', () => {
        store.commit('userModules/LOGOUT', '')
        router.push({ name: 'Login' })
      })
    }
    return {
      pageName,
      logout
    }
  }
}
</script>

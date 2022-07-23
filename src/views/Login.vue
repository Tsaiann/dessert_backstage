<template>
  <div class="login row vertical">
    <p>使用者帳號</p>
    <el-input v-model="loginForm.account" type="text" placeholder="請輸入帳號" data-space-bottom="0.5rem" />
    <p>密碼</p>
    <el-input v-model="loginForm.password" type="password" placeholder="請輸入密碼" data-space-bottom="0.5rem" />
    <p>驗證碼</p>
    <div class="row horizontal">
      <el-input v-model="loginForm.otp" type="text" data-space-bottom="1rem" />
      <div class="otp">{{ otp.OTP }}</div>
    </div>
    <div class="row horizontal center">
      <el-button type="primary" @click="hanleLogin()">登入</el-button>
      <el-button @click="removeLogin">清除</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOtp, login, getAdminPermissions } from '@/service/api'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { callApi } from '../utils/callApi'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    let otp = reactive({ OTP: '' })
    const loginForm = reactive({
      account: '',
      password: '',
      otp: ''
    })
    //取得otp
    const callOtp = onMounted(async () => {
      const data = ''
      const res = await getOtp(data)
      if (res.data.Code === 200) {
        otp.OTP = res.data.Data.OTP
      } else {
        ElMessage({
          message: 'OTP API ERROR!!',
          type: 'error'
        })
      }
    })

    // 取得當前管理員的權限列表並更新store裡的資訊
    const getPermission = async () => {
      const id = store.state.userModules.userStatus.id
      const data = { MemberID: id }
      await callApi(getAdminPermissions, data, (res) => {
        store.commit('userModules/SET_USERPERMISSIONS', res.data.Data.Permission)
      })
    }

    //先取得權限表後才轉換路由
    const hanleRouterChange = async () => {
      await getPermission()
      await router.push({ name: 'Home' })
    }

    const hanleLogin = async () => {
      if (loginForm.account !== '' && loginForm.password !== '' && loginForm.otp !== '' && loginForm.otp === otp.OTP) {
        await callApi(login, loginForm, async (res) => {
          store.commit('userModules/SET_USERSTATUS', res.data.Data)
          await hanleRouterChange()
        }).catch(() => {
          ElMessage({
            showClose: true,
            message: '輸入有誤！',
            type: 'error'
          })
          removeLogin()
          callOtp()
        })
      } else {
        ElMessage({
          showClose: true,
          message: '欄位不能為空，請重新輸入！',
          type: 'error'
        })
        removeLogin()
        callOtp()
      }
    }
    const removeLogin = () => {
      Object.keys(loginForm).forEach((item) => {
        loginForm[item] = ''
      })
    }
    return {
      loginForm,
      hanleLogin,
      removeLogin,
      callOtp,
      otp
    }
  }
}
</script>

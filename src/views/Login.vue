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
import { callApi } from '@/utils/callApi'
import { resetForm } from '@/utils/resetForm'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loginForm = reactive({
      account: '',
      password: '',
      otp: ''
    })
    let otp = reactive({ OTP: '' })
    // 初始化
    const init = () => {
      removeLogin()
      callOtp()
    }
    //取得otp
    const callOtp = onMounted(async () => {
      const data = ''
      callApi(getOtp, data, (res) => {
        otp.OTP = res.data.Data.OTP
      })
    })
    //取得當前管理員的權限列表並更新store裡的資訊
    const getPermission = async () => {
      const id = store.state.userModules.userStatus.id
      const data = { MemberID: id }
      await callApi(getAdminPermissions, data, (res) => {
        store.commit('userModules/SET_USERPERMISSIONS', res.data.Data.Permission)
      }).catch(() => {
        ElMessage({
          showClose: true,
          message: '沒有使用權限！',
          type: 'error'
        })
        init()
      })
    }
    //先取得權限表後才轉換路由
    const hanleRouterChange = async () => {
      await getPermission()
      await router.push({ name: 'Home' })
    }
    // 檢查登入條件是否符合
    const checkLogin = (options) => {
      const { account, password, otp, confirmOtp } = options
      const login = account !== '' && password !== '' && otp !== '' && otp === confirmOtp
      return login
    }
    // 登入
    const hanleLogin = () => {
      if (checkLogin({ account: loginForm.account, password: loginForm.password, otp: loginForm.otp, confirmOtp: otp.OTP })) {
        callApi(login, loginForm, (res) => {
          store.commit('userModules/SET_USERSTATUS', res.data.Data)
          hanleRouterChange()
        })
      } else {
        ElMessage({
          showClose: true,
          message: '欄位不可為空或輸入有誤！',
          type: 'error'
        })
        init()
      }
    }
    const removeLogin = () => {
      resetForm(loginForm)
    }
    return {
      callOtp,
      otp,
      loginForm,
      hanleLogin,
      removeLogin,
      init
    }
  }
}
</script>

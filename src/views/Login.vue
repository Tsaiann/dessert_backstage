<template>
  <div class="login row vertical" data-width="20%">
    <p>使用者帳號</p>
    <el-input v-model="loginForm.user" type="text" placeholder="請輸入帳號"  data-space-bottom="0.5rem"/>
    <p>密碼</p>
    <el-input v-model="loginForm.pwd" type="password" placeholder="請輸入密碼" data-space-bottom="0.5rem"/>
    <p>驗證碼</p>
    <div class="row horizontal">
      <el-input v-model="loginForm.otp" type="text"  data-space-bottom="1rem"/>
      <div class="otp">{{ otp.OTP }}</div>
    </div>
    <div class="row horizontal center">
      <el-button type="primary" @click="hanleLogin()" >登入</el-button>
      <el-button @click="removeLogin()">清除</el-button>
      <el-button @click="text()">text</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOtp, login } from '@/service/api'

export default {
  name:'Login',
  setup(){
    const router = useRouter()
    let otp = reactive({ OTP:'' })
    const loginForm = reactive({
      user:'',
      pwd:'',
      otp:''
    })
    const callOtp = onMounted( async () => {
      const data =''
      const res = await getOtp(data)
      if (res.data.Code === 200) {
        otp.OTP = res.data.Data.OTP
      } else {
        alert('API ERROR!!')
      }
    })
    const hanleLogin = async() =>{
      if ( loginForm.user !=='' && loginForm.pwd !== '' && loginForm.otp !=='' ){
        if( loginForm.otp !== otp.OTP){
          alert('驗證碼錯誤，請重新輸入！')
          loginForm.otp = ''
        }else{
          const res = await login(loginForm).then(
            () =>{
              localStorage.setItem( 'token' , res.data.token)
              if( localStaorage.getItme('token') !=='' ){
                router.push({ name: 'Dashboard' })
              }
            }
          ).catch(
            (error)=>{
              alert('error!!')
              console.log(error)
            }
          )
        }
      }else if( loginForm.user =='' ){
        alert('帳號不能為空')
      }else if( loginForm.pwd =='' ){
        alert('密碼不能為空')
      }else if( loginForm.otp =='' ){
        alert('驗證碼不能為空')
      }
    }
    const text = async() =>{
      const res = await login({
        "name": 'Admin',
        "pwd": 'Admin',
        "otp": otp
      })
        console.log(res) 
    }
    const removeLogin = () => {
      loginForm.user='',
      loginForm.pwd='',
      loginForm.otp=''
    }

    return{
      loginForm,
      hanleLogin,
      removeLogin,
      callOtp,
      otp,
      text
    }
  }
}
</script>
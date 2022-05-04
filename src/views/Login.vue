<template>
  <div class="login row vertical" data-width="20%">
    <p>使用者帳號</p>
    <el-input v-model="loginForm.account" type="text" placeholder="請輸入帳號"  data-space-bottom="0.5rem"/>
    <p>密碼</p>
    <el-input v-model="loginForm.password" type="password" placeholder="請輸入密碼" data-space-bottom="0.5rem"/>
    <p>驗證碼</p>
    <div class="row horizontal">
      <el-input v-model="loginForm.otp" type="text"  data-space-bottom="1rem"/>
      <div class="otp">{{ otp.OTP }}</div>
    </div>
    <div class="row horizontal center">
      <el-button type="primary" @click="hanleLogin()" >登入</el-button>
      <el-button @click="removeLogin()">清除</el-button>
      <el-button @click="test()">test</el-button>
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
      account:'',
      password:'',
      otp:''
    })
    const callOtp = onMounted( async () => {
      const data =''
      const res = await getOtp(data)
      if (res.data.Code === 200) {
        otp.OTP = res.data.Data.OTP
      } else {
        alert('Get OTP ERROR!!')
      }
    })
    const hanleLogin = async() =>{
      if ( loginForm.account !=='' && loginForm.password !== '' && loginForm.otp !=='' ){
        if( loginForm.otp !== otp.OTP){
          alert('驗證碼錯誤，請重新輸入！')
          callOtp()
          loginForm.otp = ''
        }else{
          const res = await login(JSON.stringify(loginForm)).then(
            () =>{
              console.log(res)
              /*localStorage.setItem( 'token' , res.Data.Token)
              if( localStaorage.getItme('token') !=='' ){
                router.push({ name: 'Dashboard' })
              }*/
            }
          ).catch(
            (error)=>{
              alert('error!!')
              console.log(error)
            }
          )
        }
      }else if( loginForm.account =='' ){
        alert('帳號不能為空')
      }else if( loginForm.password =='' ){
        alert('密碼不能為空')
      }else if( loginForm.otp =='' ){
        alert('驗證碼不能為空')
      }
    }
    const removeLogin = () => {
      loginForm.account='',
      loginForm.password='',
      loginForm.otp=''
    }
    const test = async() => {
      const data = {
        account: 'Admin',
        password: 'Admin',
        otp: otp.OTP
      }
      const res = await login(JSON.stringify(data))
      console.log(res)
    }
    return{
      loginForm,
      hanleLogin,
      removeLogin,
      callOtp,
      otp,
      test
    }
  }
}
</script>
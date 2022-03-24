<template>
  <div class="login row vertical" data-width="20%">
    <p>使用者帳號</p>
    <el-input v-model="loginForm.username" type="text" placeholder="請輸入帳號"  data-space-bottom="0.5rem"/>
    <p>密碼</p>
    <el-input v-model="loginForm.password" type="password" placeholder="請輸入密碼" data-space-bottom="0.5rem"/>
    <p>驗證碼</p>
    <div class="row horizontal">
      <el-input v-model="loginForm.otp" type="text"  data-space-bottom="1rem"/>
      <div class="otp">4768</div>
    </div>
    <div class="row horizontal center">
      <el-button type="primary" @click="hanleLogin()">登入</el-button>
      <el-button @click="removeLogin()">清除</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

export default {
  name:'Login',
  setup(){
    const router = useRouter()
    let loginForm = reactive({
      username:'',
      password:'',
      token:'3sfjsdlkfj3254jlkdslj',
      otp:''
    })
    const hanleLogin = () =>{
      const user = loginForm.username
      const pwd = loginForm.password
      const otp =loginForm.otp
      const token = loginForm.token
      if( user !=='' && pwd !=='' && otp !==''){
        Cookies.set('login', JSON.stringify(loginForm))
        if (Cookies.get('login') && loginForm.token){
          router.push({ name:'Dashboard' })
        }
      }else{
        alert('帳號密碼不能為空')
      }
    } 
    const removeLogin = () =>{
      loginForm.username='',
      loginForm.password=''
    }
    const removeCookie = onMounted( () =>{
      Cookies.remove('login')
    })
    
    return{
      loginForm,
      hanleLogin,
      removeLogin,
      removeCookie
    }
  }
}
</script>
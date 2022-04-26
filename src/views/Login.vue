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
      otp:''
    })
    const hanleLogin = async() =>{
      if( user !=='' && pwd !=='' && otp !==''){
          await api.post(service.baseURL, loginForm)
          let token = response.data.token
          Cookies.set('token', JSON.stringify(token))
          router.push({ name: 'Dashboard' }) 
      }else if( user =='' ){
        alert('帳號不能為空')
      }else if( pwd =='' ){
        alert('密碼不能為空')
      }else if( otp =='' ){
        alert('驗證碼不能為空')
      }      
    } 
    const removeLogin = () =>{
      loginForm.username='',
      loginForm.password=''
    }
    
    return{
      loginForm,
      hanleLogin,
      removeLogin
    }
  }
}
</script>